/* CEL-RAS · Visor obra · lector IFC en segundo plano
   Lee el IFC con web-ifc, fusiona la geometría por material y devuelve
   búferes transferibles. También responde a consultas de propiedades. */
var api = null, modelID = null;

function post(m, transfer){ self.postMessage(m, transfer || []); }
function val(x){ return x && typeof x === "object" && "value" in x ? x.value : x; }

function Grow(Type, cap){ this.T = Type; this.a = new Type(cap || 65536); this.n = 0; }
Grow.prototype.ensure = function(extra){
  if (this.n + extra <= this.a.length) return;
  var cap = this.a.length * 2; while (cap < this.n + extra) cap *= 2;
  var b = new this.T(cap); b.set(this.a.subarray(0, this.n)); this.a = b;
};
Grow.prototype.trim = function(){ return this.a.slice(0, this.n); };

var handlers = {
  init: function(m){
    var url = URL.createObjectURL(new Blob([m.wasm], {type:"application/wasm"}));
    api = new WebIFC.IfcAPI();
    api.Init(function(p){ return p.indexOf(".wasm") >= 0 ? url : p; }, true)
      .then(function(){ post({cmd:"ready"}); }, function(err){ post({cmd:"error", message:String(err && err.message || err)}); });
  },

  load: function(m){
    if (modelID !== null){ try { api.CloseModel(modelID); } catch(e){} modelID = null; }
    modelID = api.OpenModel(new Uint8Array(m.buffer), {COORDINATE_TO_ORIGIN:false});
    var buckets = new Map(), list = [];
    var index = new Map(), ids = [], box = new Grow(Float64Array, 6 * 4096);
    var off = null;

    function bucket(c){
      var key = c.x.toFixed(3) + "," + c.y.toFixed(3) + "," + c.z.toFixed(3) + "," + c.w.toFixed(3);
      var b = buckets.get(key);
      if (!b){
        b = {color:[c.x, c.y, c.z, c.w], pos:new Grow(Float32Array), nor:new Grow(Float32Array),
             idx:new Grow(Uint32Array), vcount:0, rE:new Grow(Uint32Array, 1024), rS:new Grow(Uint32Array, 1024), rC:new Grow(Uint32Array, 1024)};
        buckets.set(key, b); list.push(b);
      }
      return b;
    }

    api.StreamAllMeshes(modelID, function(mesh, i, total){
      var id = mesh.expressID, ei = index.get(id);
      if (ei === undefined){
        ei = ids.length; index.set(id, ei); ids.push(id);
        box.ensure(6); box.a.set([Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity], box.n); box.n += 6;
      }
      var bb = ei * 6, B = box.a;
      var g = mesh.geometries;
      for (var k = 0; k < g.size(); k++){
        var pg = g.get(k);
        var geom = api.GetGeometry(modelID, pg.geometryExpressID);
        var v = api.GetVertexArray(geom.GetVertexData(), geom.GetVertexDataSize());
        var ix = api.GetIndexArray(geom.GetIndexData(), geom.GetIndexDataSize());
        var T = pg.flatTransformation;
        if (!off) off = [Math.round(T[12]), Math.round(T[13]), Math.round(T[14])];
        var b = bucket(pg.color), nv = v.length / 6, base = b.vcount;
        b.pos.ensure(nv * 3); b.nor.ensure(nv * 3);
        var P = b.pos.a, N = b.nor.a, pn = b.pos.n;
        for (var j = 0; j < v.length; j += 6){
          var x = v[j], y = v[j+1], z = v[j+2];
          var X = T[0]*x + T[4]*y + T[8]*z + T[12];
          var Y = T[1]*x + T[5]*y + T[9]*z + T[13];
          var Z = T[2]*x + T[6]*y + T[10]*z + T[14];
          if (X < B[bb]) B[bb] = X; if (Y < B[bb+1]) B[bb+1] = Y; if (Z < B[bb+2]) B[bb+2] = Z;
          if (X > B[bb+3]) B[bb+3] = X; if (Y > B[bb+4]) B[bb+4] = Y; if (Z > B[bb+5]) B[bb+5] = Z;
          P[pn] = X - off[0]; P[pn+1] = Y - off[1]; P[pn+2] = Z - off[2];
          var nx = v[j+3], ny = v[j+4], nz = v[j+5];
          var NX = T[0]*nx + T[4]*ny + T[8]*nz, NY = T[1]*nx + T[5]*ny + T[9]*nz, NZ = T[2]*nx + T[6]*ny + T[10]*nz;
          var L = Math.sqrt(NX*NX + NY*NY + NZ*NZ) || 1;
          N[pn] = NX / L; N[pn+1] = NY / L; N[pn+2] = NZ / L;
          pn += 3;
        }
        b.pos.n = pn; b.nor.n = pn; b.vcount += nv;
        var start = b.idx.n; b.idx.ensure(ix.length);
        var I = b.idx.a;
        for (var q = 0; q < ix.length; q++) I[start + q] = ix[q] + base;
        b.idx.n += ix.length;
        var R = b.rE.n;
        if (R && b.rE.a[R-1] === ei && b.rS.a[R-1] + b.rC.a[R-1] === start) b.rC.a[R-1] += ix.length;
        else { b.rE.ensure(1); b.rS.ensure(1); b.rC.ensure(1); b.rE.a[R] = ei; b.rS.a[R] = start; b.rC.a[R] = ix.length; b.rE.n++; b.rS.n++; b.rC.n++; }
        if (geom.delete) geom.delete();
      }
      if (i % 250 === 0) post({cmd:"progress", phase:"geometry", i:i, total:total});
    }, true);

    post({cmd:"progress", phase:"props", i:0, total:ids.length});
    var types = new Array(ids.length), tags = new Array(ids.length);
    for (var e = 0; e < ids.length; e++){
      try { types[e] = String(api.GetNameFromTypeCode(api.GetLineType(modelID, ids[e]))).toUpperCase(); } catch(err){ types[e] = "OTRO"; }
      try { var line = api.GetLine(modelID, ids[e], false); var tg = val(line.Tag); tags[e] = tg === null || tg === undefined ? "" : String(tg); } catch(err){ tags[e] = ""; }
    }

    var finish = function(storeys, order){
      var parts = [], transfer = [];
      list.forEach(function(b){
        if (!b.idx.n) return;
        var p = {color:b.color, pos:b.pos.trim(), nor:b.nor.trim(), idx:b.idx.trim(), rE:b.rE.trim(), rS:b.rS.trim(), rC:b.rC.trim()};
        parts.push(p); transfer.push(p.pos.buffer, p.nor.buffer, p.idx.buffer, p.rE.buffer, p.rS.buffer, p.rC.buffer);
      });
      var idArr = new Uint32Array(ids), bbox = box.trim();
      transfer.push(idArr.buffer, bbox.buffer);
      post({cmd:"loaded", rid:m.rid, offset:off || [0,0,0], parts:parts, ids:idArr, bbox:bbox,
            types:types, tags:tags, storeys:storeys, storeyOrder:order}, transfer);
    };

    api.properties.getSpatialStructure(modelID, false).then(function(tree){
      var storeys = new Array(ids.length), order = [];
      (function walk(node, st){
        if (!node) return;
        var cur = st;
        if (String(node.type).toUpperCase() === "IFCBUILDINGSTOREY"){
          var name = "Planta " + node.expressID;
          try { name = val(api.GetLine(modelID, node.expressID, false).Name) || name; } catch(e){}
          cur = name; if (order.indexOf(name) < 0) order.push(name);
        }
        var ei = index.get(node.expressID);
        if (ei !== undefined && cur) storeys[ei] = cur;
        (node.children || []).forEach(function(c){ walk(c, cur); });
      })(tree, null);
      finish(storeys, order);
    }, function(){ finish(new Array(ids.length), []); });
  },

  // abre el IFC solo para consultar propiedades (la geometría ya está en caché)
  open: function(m){
    if (modelID !== null){ try { api.CloseModel(modelID); } catch(e){} modelID = null; }
    modelID = api.OpenModel(new Uint8Array(m.buffer), {COORDINATE_TO_ORIGIN:false});
    post({cmd:"opened", rid:m.rid});
  },

  props: function(m){
    if (modelID === null){ post({cmd:"error", rid:m.rid, message:"sin_modelo"}); return; }
    var line = api.GetLine(modelID, m.id, false);
    var summary = [["Tipo IFC", String(api.GetNameFromTypeCode(line.type))], ["Nombre", val(line.Name)],
                   ["Tipo", val(line.ObjectType)], ["Marca", val(line.Tag)], ["GlobalId", val(line.GlobalId)]]
      .filter(function(r){ return r[1] !== undefined && r[1] !== null && r[1] !== ""; })
      .map(function(r){ return [r[0], String(r[1])]; });
    api.properties.getPropertySets(modelID, m.id, true, true).catch(function(){ return []; })
      .then(function(ps){ return ps && ps.length ? ps : api.properties.getPropertySets(modelID, m.id, true); })
      .then(function(ps){
        var out = (ps || []).map(function(p){
          return {name:String(val(p.Name) || "Propiedades"), props:(p.HasProperties || []).map(function(q){
            var v = q.NominalValue !== undefined && q.NominalValue !== null ? val(q.NominalValue)
              : (q.EnumerationValues ? q.EnumerationValues.map(val).join(", ") : "");
            return [String(val(q.Name)), v === null || v === undefined ? "" : String(v)];
          })};
        }).filter(function(p){ return p.props.length; });
        post({cmd:"props", rid:m.rid, summary:summary, psets:out});
      }).catch(function(err){ post({cmd:"error", rid:m.rid, message:String(err && err.message || err)}); });
  }
};

self.onmessage = function(e){
  var m = e.data;
  try { handlers[m.cmd](m); }
  catch(err){ post({cmd:"error", rid:m.rid, message:String(err && err.message || err)}); }
};
