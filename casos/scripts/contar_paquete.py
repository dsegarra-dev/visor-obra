# [BORRADOR IA — EN REVISIÓN]
# Cuenta lo publicado en la carpeta del visor de un proyecto, sin usar el código del visor.
#
# Entradas (fuera de git, en .scratchpad/casos-raw/):
#   - listados de Drive del árbol de la carpeta (conector de Google Drive, search_files
#     con "'<carpeta>' in ancestors", partido por tipo y fecha para no paginar)
#   - control/<id>.json: marcas de publicación, índices, manifiestos y una muestra de _LOC.json
#     por carpeta sin índice, descargados tal cual de Drive
#
# Reglas (contrato de publicación, docs/como-se-hace-hoy.md apartado 3):
#   - publicación = subcarpeta «*_VisorObra»
#   - completa: tiene marca *_VisorObra_PUBLICACION.json y están todos los archivos que lista,
#     con el mismo tamaño
#   - incompleta: tiene marca y falta algún archivo o cambia algún tamaño
#   - en curso: tiene señal *_EN_CURSO.json y no tiene marca
#   - antigua: no tiene ni marca ni señal
#   - válidas = completas + antiguas
#   - versión de lámina = un PDF en una publicación válida
#   - lámina = par (modelo de origen, número)
#   - origen: el de la marca; si no, el del índice; si no, el de la muestra de _LOC.json
#   - modelo publicado = el manifiesto *_MODELO.json más reciente de cada origen
#
# Uso: python -I contar_paquete.py <carpeta casos-raw> <código> <listado1.json> [listado2.json …]
import collections, json, os, re, sys

raw, code, listados = sys.argv[1], sys.argv[2], sys.argv[3:]
fs = {}
for p in listados:
    for f in json.load(open(os.path.join(raw, p), encoding="utf-8"))["files"]:
        fs[f["id"]] = f
fold = {i: f["title"] for i, f in fs.items() if f["mimeType"].endswith("folder")}
pubs = {i: t for i, t in fold.items() if re.search(r"_VisorObra$", t)}


def ctl(fid):
    p = os.path.join(raw, "control", fid + ".json")
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else None


def low(f):
    return f["title"].lower()


por_pub = collections.defaultdict(list)
for f in fs.values():
    if f["parentId"] in pubs:
        por_pub[f["parentId"]].append(f)

estado, origen_pub, detalle = {}, {}, {}
for pid, files in por_pub.items():
    marca = [f for f in files if low(f).endswith("_visorobra_publicacion.json")]
    senal = [f for f in files if low(f).endswith("_visorobra_en_curso.json")]
    indice = [f for f in files if low(f).endswith("_visorobra_indice.json")]
    locs = [f for f in files if low(f).endswith("_loc.json")]
    origen = None
    if marca:
        m = ctl(marca[0]["id"])
        tam = {f["title"]: int(f.get("fileSize", 0)) for f in files}
        faltan = [e["name"] for e in m.get("files", []) if e["name"] not in tam or (e.get("size") and int(e["size"]) != tam[e["name"]])]
        estado[pid] = "incompleta" if faltan else "completa"
        detalle[pid] = {"lista_marca": len(m.get("files", [])), "faltan": faltan}
        origen = (m.get("source") or {}).get("key")
    elif senal:
        estado[pid] = "en curso"
    else:
        estado[pid] = "antigua"
    if not origen and indice:
        origen = ((ctl(indice[0]["id"]) or {}).get("source") or {}).get("key")
    if not origen:
        muestra = [ctl(f["id"]) for f in locs if ctl(f["id"])]
        if muestra:
            origen = (muestra[0].get("source") or {}).get("key")
    if not origen:
        # publicaciones sin «source»: el campo «file» es <archivo de Revit>_<usuario de Windows>
        docs = [ctl(f["id"]) for f in indice + locs + [f for f in files if low(f).endswith("_modelo.json")] if ctl(f["id"])]
        fichero = next((d.get("file") for d in docs if d.get("file")), "")
        if fichero:
            origen = fichero.rsplit("_", 1)[0] + " (deducido del nombre)"
    origen_pub[pid] = origen or "(sin origen)"

validas = [p for p in pubs if estado.get(p, "antigua") in ("completa", "antigua")]

# número de lámina de cada PDF: el del índice de su publicación; si no, el nombre del PDF
versiones = []
for pid in validas:
    files = por_pub[pid]
    num_de_pdf = {}
    for f in files:
        if low(f).endswith("_visorobra_indice.json"):
            for s in (ctl(f["id"]) or {}).get("sheets", []):
                num_de_pdf[(s.get("pdf_file") or "").lower()] = s["sheet"]["number"]
    nombres = {low(f) for f in files}
    for f in files:
        if low(f).endswith(".pdf"):
            num = num_de_pdf.get(low(f), re.sub(r"\.pdf$", "", f["title"], flags=re.I))
            con_loc = low(f).replace(".pdf", "_loc.json") in nombres
            versiones.append({"pub": pubs[pid], "origen": origen_pub[pid], "numero": num, "loc": con_loc,
                              "en_indice": low(f) in num_de_pdf})

laminas = collections.Counter((v["origen"], v["numero"]) for v in versiones)

# en el índice pero sin PDF en la carpeta (p. ej. eliminadas por el JP: el índice no se toca)
en_indice_sin_pdf = 0
for pid in validas:
    nombres = {low(f) for f in por_pub[pid]}
    for f in por_pub[pid]:
        if low(f).endswith("_visorobra_indice.json"):
            en_indice_sin_pdf += sum(1 for s in (ctl(f["id"]) or {}).get("sheets", []) if (s.get("pdf_file") or "").lower() not in nombres)

# modelos: manifiesto más reciente por origen, en publicaciones válidas
mans = []
for pid in validas:
    for f in por_pub[pid]:
        if low(f).endswith("_modelo.json"):
            m = ctl(f["id"])
            if m:
                mans.append((pid, f, m))
ultimo = {}
for pid, f, m in mans:
    o = (m.get("source") or {}).get("key") or (m.get("file", "").rsplit("_", 1)[0] + " (deducido del nombre)" if m.get("file") else origen_pub[pid])
    if o not in ultimo or (m.get("generated") or "") >= (ultimo[o][2].get("generated") or ""):
        ultimo[o] = (pid, f, m)
modelos = []
for o, (pid, f, m) in sorted(ultimo.items()):
    fed = m.get("federation") or {}
    vinc = fed.get("models") or []
    ifcs = {low(x) for x in por_pub[pid] if low(x).endswith(".ifc")}
    nombres_ifc = ([fed["host"]["ifc_file"]] if fed.get("host") else []) + [v["ifc_file"] for v in vinc]
    if not fed.get("host") and not vinc:
        nombres_ifc = [m.get("ifc_file")]
    modelos.append({"origen": o, "publicacion": pubs[pid], "generado": m.get("generated"),
                    "proyecto_en_manifiesto": (m.get("project") or {}).get("number"),
                    "anfitrion": bool(fed.get("host")), "vinculos": len(vinc),
                    "copias_de_vinculos": sum(len(v.get("instances") or []) for v in vinc),
                    "ifc_en_manifiesto": len([n for n in nombres_ifc if n]),
                    "ifc_que_faltan": [n for n in nombres_ifc if n and n.lower() not in ifcs]})

todos_ifc = [f for f in fs.values() if low(f).endswith(".ifc")]
crgeo = [f for f in fs.values() if low(f).endswith(".crgeo")]
proyectos_ajenos = sorted({x["proyecto_en_manifiesto"] for x in modelos if x["proyecto_en_manifiesto"] and x["proyecto_en_manifiesto"] != code})

res = {
    "proyecto": code,
    "archivos_en_drive": len(fs),
    "publicaciones": dict(collections.Counter(estado.get(p, "antigua") for p in pubs)),
    "publicaciones_validas": len(validas),
    "detalle_incompletas": {pubs[p]: detalle[p] for p in pubs if estado.get(p) == "incompleta"},
    "origenes": dict(collections.Counter(origen_pub[p] for p in validas)),
    "laminas": len(laminas),
    "versiones": len(versiones),
    "laminas_con_varias_versiones": sum(1 for n in laminas.values() if n > 1),
    "versiones_sin_loc": sum(1 for v in versiones if not v["loc"]),
    "pdf_fuera_del_indice": sum(1 for v in versiones if not v["en_indice"]),
    "en_indice_sin_pdf": en_indice_sin_pdf,
    "laminas_por_origen": dict(collections.Counter(o for (o, n) in laminas)),
    "modelos_publicados": len(modelos),
    "modelos": modelos,
    "manifiestos_de_otro_proyecto": proyectos_ajenos,
    "ifc_en_drive": len(todos_ifc),
    "ifc_gb": round(sum(int(f.get("fileSize", 0)) for f in todos_ifc) / 1e9, 2),
    "crgeo_en_drive": len(crgeo),
}
print(json.dumps(res, ensure_ascii=False, indent=1))
