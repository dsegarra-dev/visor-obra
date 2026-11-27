# [BORRADOR IA — EN REVISIÓN]
# El repositorio es público: ningún dato de obra, persona o cliente se sube a git (AGENTS.md).
# Este script cambia los datos reales por alias y comprueba que no queda ninguno.
# No contiene datos: la tabla de alias está fuera de git, en .scratchpad/privado/alias.json
# (copia en la carpeta de pruebas de Drive).
#
# Uso:
#   python -I anonimizar.py aplicar   <alias.json> <archivo> [archivo …]   cambia los archivos en su sitio
#   python -I anonimizar.py comprobar <alias.json> <rango git>              p. ej. main..v2
#     «comprobar» busca cada valor real de la tabla, más la lista «comprobar_tambien» y
#     correos, IDs de Drive y rutas de Windows, en todas las versiones de todos los archivos
#     y en los mensajes de los commits del rango. Sale con 1 si encuentra algo.
import json, re, subprocess, sys

modo, tabla = sys.argv[1], json.load(open(sys.argv[2], encoding="utf-8"))
SUST = tabla["sustituciones"]


def anonimizar(texto):
    for s in SUST:
        texto = re.sub(s["real"], s["alias"], texto) if s.get("regex") else texto.replace(s["real"], s["alias"])
    return texto


if modo == "aplicar":
    for p in sys.argv[3:]:
        t = open(p, encoding="utf-8", newline="").read()
        n = anonimizar(t)
        if n != t:
            open(p, "w", encoding="utf-8", newline="").write(n)
            print("cambiado:", p)
    sys.exit(0)

# comprobar
rango = sys.argv[3]
literales = [s["real"] for s in SUST if not s.get("regex")] + tabla.get("comprobar_tambien", [])
ID_DRIVE = re.compile(r"\b[0-9A-Za-z_-]{28,44}\b(?<![a-z_]{28})")
patrones = [re.compile(re.escape(x), re.I) for x in literales] + [
    re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}"),          # correos
    ID_DRIVE,                                                              # IDs de Drive / claves
    re.compile(r"\b[A-Za-z]:\\(?!Program Files)"),                        # rutas de Windows
    re.compile(r"apps\.googleusercontent\.com|script\.google\.com/macros/s/|AIza[0-9A-Za-z_-]{20,}"),
]
# Un ID dentro de la URL de una web pública (fuentes citadas) no es un dato del despacho.
# Sí cuenta dentro de URL de Google (Drive, Docs, Apps Script).
URL_PUBLICA = re.compile(r"https?://(?!(?:drive|docs|script)\.google\.com)[^\s)\]>\"']+")


def git(*a):
    return subprocess.run(["git", *a], capture_output=True, check=True).stdout.decode("utf-8", "replace")


def permitido(t):
    # direcciones sin datos personales: la «noreply» de GitHub y la firma de coautoría de Claude
    return "users.noreply.github.com" in t or t == "noreply@anthropic.com"


hallazgos = 0
commits = git("rev-list", rango).split()
blobs = {}
for c in commits:
    for linea in git("ls-tree", "-r", c).splitlines():
        meta, ruta = linea.split("\t", 1)
        modo_, tipo, sha = meta.split()
        blobs.setdefault(sha, (c[:7], ruta))
    for p in patrones:
        for m in p.finditer(git("log", "-1", "--format=%an %ae%n%cn %ce%n%B", c)):
            if permitido(m.group(0)):
                continue
            print(f"MENSAJE {c[:7]}: {m.group(0)}"); hallazgos += 1
base = set()
if ".." in rango:   # lo heredado de la base (p. ej. main) se informa aparte, no aquí
    for linea in git("ls-tree", "-r", rango.split("..")[0]).splitlines():
        base.add(linea.split()[2])
print(f"{len(commits)} commits, {len(blobs)} versiones de archivo distintas ({len(set(blobs) & base)} heredadas sin cambio de la base, no revisadas aquí)")
for sha, (c, ruta) in blobs.items():
    if sha in base:
        continue
    try:
        texto = git("cat-file", "-p", sha)
    except Exception:
        continue
    urls = [u.span() for u in URL_PUBLICA.finditer(texto)]
    for p in patrones:
        for m in p.finditer(texto):
            if permitido(m.group(0)):
                continue
            if p is ID_DRIVE and any(a <= m.start() < b for a, b in urls):
                continue
            linea = texto.count("\n", 0, m.start()) + 1
            print(f"{c} {ruta}:{linea}: {m.group(0)[:80]}"); hallazgos += 1
print("hallazgos:", hallazgos)
sys.exit(1 if hallazgos else 0)
