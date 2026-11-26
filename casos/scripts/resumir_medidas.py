# [BORRADOR IA — EN REVISIÓN]
# Resume en tablas Markdown las medidas de medir_v1.js (un JSON por línea).
# Uso: python -I resumir_medidas.py <resultados.jsonl>
import json, statistics, sys

filas = [json.loads(l) for l in open(sys.argv[1], encoding="utf-8") if l.strip()]
ACC = [("proyecto_ms", "Abrir proyecto"), ("plano_ms", "Abrir plano"), ("modelo_ms", "Cargar modelo"), ("incidencia_ms", "Abrir incidencia")]


def s(ms):
    return "—" if ms is None else f"{ms / 1000:.1f}".replace(".", ",")


print("| Tanda | Rep. | Hora de inicio | Sesión | " + " | ".join(n for _, n in ACC) + " | Notas |")
print("|---|---|---|---|" + "---|" * len(ACC) + "---|")
for f in filas:
    notas = []
    if f.get("error"):
        notas.append("ERROR: " + f["error"])
    if f.get("subida_procesadas_ms") is not None:
        notas.append("subida de versiones procesadas terminada a los " + s(f["subida_procesadas_ms"]) + " s")
    if f.get("modelo_texto"):
        notas.append("modelo: " + f["modelo_texto"])
    print(f"| {f.get('etiqueta') or f['modo']} | {f['repeticion']} | {f['hora_inicio']} | {s(f.get('sesion_ms'))} | "
          + " | ".join(s(f.get(k)) for k, _ in ACC) + " | " + "; ".join(notas) + " |")

print()
print("| Acción | Frío: mediana (mín–máx) | Caliente: mediana (mín–máx) |")
print("|---|---|---|")
for k, n in ACC:
    cols = []
    for et in ("frio", "caliente"):
        v = [f[k] for f in filas if f.get("etiqueta") == et and f.get(k) is not None]
        cols.append(f"{s(statistics.median(v))} s ({s(min(v))}–{s(max(v))}), n={len(v)}" if v else "—")
    print(f"| {n} | {cols[0]} | {cols[1]} |")

e = next((f.get("entorno") for f in filas if f.get("entorno")), None)
if e:
    print()
    print("Entorno (navigator, primera fila con datos):", json.dumps(e, ensure_ascii=False))
