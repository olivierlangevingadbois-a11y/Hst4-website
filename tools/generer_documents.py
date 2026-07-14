#!/usr/bin/env python3
import json, html, re, os, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "data", "repertoire_images.json")

data = json.load(open(SRC, encoding="utf-8"))

PERIODS = [
    ("Période 1", "1", "La formation du régime fédéral canadien", "1840 – 1896"),
    ("Période 2", "2", "Les nationalismes et l'autonomie du Canada", "1896 – 1945"),
    ("Période 3", "3", "La modernisation du Québec et la Révolution tranquille", "1945 – 1980"),
    ("Période 4", "4", "Les choix de société dans le Québec contemporain", "1980 à aujourd'hui"),
]

def esc(s):
    return html.escape(s or "", quote=True)

def clean(s):
    if not s:
        return ""
    return re.sub(r"\s+", " ", s).strip()

def menu(active):
    # active in {accueil,1,2,3,4,documents,methode,revision}
    def cls(k):
        return ' class="actif"' if k == active else ""
    return f"""      <ul class="menu">
        <li><a href="../index.html"{cls('accueil')}>Accueil</a></li>
        <li><a href="periode-1.html"{cls('1')}>1840–1896</a></li>
        <li><a href="periode-2.html"{cls('2')}>1896–1945</a></li>
        <li><a href="periode-3.html"{cls('3')}>1945–1980</a></li>
        <li><a href="periode-4.html"{cls('4')}>1980 à aujourd'hui</a></li>
        <li><a href="documents.html"{cls('documents')}>Documents</a></li>
        <li><a href="methode.html"{cls('methode')}>Méthode</a></li>
        <li><a href="revision.html"{cls('revision')}>Révision</a></li>
      </ul>"""

def header(title, desc, active):
    return f"""<!DOCTYPE html>
<html lang="fr-CA">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(desc)}" />
  <link rel="icon" type="image/svg+xml" href="../images/favicon.svg" />
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body>
  <a class="evitement" href="#contenu-principal">Aller au contenu</a>
  <header class="site-header">
    <nav class="barre-nav" aria-label="Navigation principale">
      <a href="../index.html" class="logo">
        <span class="ecusson">HQC</span>
        <span>Histoire du Québec et du Canada · Sec. 4</span>
      </a>
      <button class="btn-menu" aria-label="Ouvrir le menu" aria-expanded="false">☰</button>
{menu(active)}
    </nav>
  </header>
"""

FOOTER = """  <footer class="site-footer">
    <p class="copyright">© <span class="annee-courante">2026</span> courshistoire.com — Histoire du Québec et du Canada, 4<sup>e</sup> secondaire.</p>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
"""

def doc_card(e):
    is_video = e.get("type") == "video"
    target = e.get("video_url") if is_video else e.get("image_url")
    thumb = e.get("preview_url") or e.get("image_url")
    # éviter le contenu mixte : forcer HTTPS (vignettes YouTube en http://)
    if thumb:
        thumb = thumb.replace("http://", "https://")
    if target:
        target = target.replace("http://", "https://")
    title = clean(e.get("title"))
    source = clean(e.get("image_source"))
    excerpt = clean(e.get("excerpt"))
    # éviter de répéter le titre au début de l'extrait
    if excerpt and title and excerpt.startswith(title):
        excerpt = excerpt[len(title):].strip(" :–-")
    alt = esc(e.get("alt") or title)
    cls = "doc-carte video" if is_video else "doc-carte"
    parts = [f'      <article class="{cls}">']
    parts.append(f'        <a class="vignette" href="{esc(target)}" target="_blank" rel="noopener">')
    parts.append(f'          <img loading="lazy" src="{esc(thumb)}" alt="{alt}" />')
    parts.append('        </a>')
    parts.append('        <div class="doc-corps">')
    parts.append(f'          <h4>{esc(title)}</h4>')
    if source:
        parts.append(f'          <p class="doc-source">{esc(source)}</p>')
    if excerpt:
        parts.append(f'          <p class="doc-extrait">{esc(excerpt)}</p>')
    parts.append('        </div>')
    parts.append('      </article>')
    return "\n".join(parts)

def slug(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower())
    return s.strip("-")

# ---- générer les pages de période ----
counts = {}
for pname, pnum, ptitle, pyears in PERIODS:
    entries = [e for e in data if e.get("period") == pname]
    counts[pnum] = len(entries)
    # regrouper par dossier en conservant l'ordre d'apparition
    order = []
    groups = collections.OrderedDict()
    for e in entries:
        dos = clean(e.get("dossier")) or "Autres documents"
        if dos not in groups:
            groups[dos] = []
            order.append(dos)
        groups[dos].append(e)

    dossier_options = "\n".join(
        f'        <option value="{slug(dos)}">{esc(dos)}</option>' for dos in order
    )
    out = [header(f"Dossiers documentaires — Période {pnum} ({pyears})",
                  f"Banque de documents (images, gravures, caricatures, vidéos) de la période {pyears} pour l'analyse en classe.",
                  "documents")]
    out.append(f"""  <div class="entete-periode">
    <div class="contenu">
      <p class="fil-ariane"><a href="../index.html">Accueil</a> › <a href="documents.html">Documents</a> › Période {pnum}</p>
      <span class="annees">{pyears}</span>
      <h1>Dossiers documentaires — {esc(ptitle)}</h1>
    </div>
  </div>

  <main id="contenu-principal" class="contenu" style="padding-top:2rem; padding-bottom:3rem;">
    <p>{len(entries)} documents répartis en {len(order)} dossiers. Clique sur une image pour l'afficher en grand format (source d'origine&nbsp;: RÉCITUS, Service national du RÉCIT de l'univers social, et partenaires). Tu peux aussi consulter les <a href="periode-{pnum}.html">notes de cours de cette période</a>.</p>

    <div class="barre-recherche" role="search">
      <input type="search" id="recherche-docs" placeholder="Rechercher un document (mots-clés)…"
             aria-label="Rechercher un document par mots-clés" />
      <select id="filtre-dossier" aria-label="Filtrer par dossier">
        <option value="">Tous les dossiers</option>
{dossier_options}
      </select>
      <span class="compte-resultats" role="status"></span>
    </div>

    <nav class="encadre" aria-label="Liste des dossiers">
      <span class="titre-encadre">Dossiers de cette période</span>
      <ul class="liste-dossiers">""")
    for dos in order:
        out.append(f'        <li><a href="#{slug(dos)}">{esc(dos)}</a> ({len(groups[dos])})</li>')
    out.append("      </ul>\n    </nav>\n")

    for dos in order:
        items = groups[dos]
        out.append(f'    <section class="dossier" id="{slug(dos)}">')
        out.append(f'      <h3>{esc(dos)} <span class="compte-docs">— {len(items)} document(s)</span></h3>')
        out.append('      <div class="doc-grid">')
        for e in items:
            out.append(doc_card(e))
        out.append('      </div>')
        out.append('    </section>')

    # navigation entre périodes
    prev_link = f'<a href="documents-periode-{int(pnum)-1}.html"><span class="sens">← Période précédente</span> Documents</a>' if pnum != "1" else '<a href="documents.html"><span class="sens">← Retour</span> Tous les dossiers</a>'
    next_link = f'<a class="suivant" href="documents-periode-{int(pnum)+1}.html"><span class="sens">Période suivante →</span> Documents</a>' if pnum != "4" else '<a class="suivant" href="periode-4.html"><span class="sens">Notes de cours →</span> Période 4</a>'
    out.append(f'''
    <nav class="nav-periodes" aria-label="Navigation entre les périodes">
      {prev_link}
      {next_link}
    </nav>
  </main>
''')
    out.append(FOOTER)
    path = os.path.join(ROOT, "pages", f"documents-periode-{pnum}.html")
    open(path, "w", encoding="utf-8").write("\n".join(out))
    print("écrit", path, "-", len(entries), "documents")

# ---- générer la page hub ----
hub = [header("Dossiers documentaires — Histoire du Québec et du Canada, Sec. 4",
              "Banque de documents historiques (images, gravures, caricatures, vidéos) organisée par période pour l'analyse en classe.",
              "documents")]
hub.append("""  <div class="entete-periode">
    <div class="contenu">
      <p class="fil-ariane"><a href="../index.html">Accueil</a> › Documents</p>
      <h1>Dossiers documentaires</h1>
    </div>
  </div>

  <main id="contenu-principal" class="contenu" style="padding-top:2.5rem; padding-bottom:3rem;">
    <p>Une banque de documents historiques (photos, gravures, caricatures, cartes et vidéos) organisée par période, pour pratiquer l'analyse de documents. Les images proviennent de RÉCITUS (Service national du RÉCIT de l'univers social) et de ses partenaires; clique sur une image pour l'afficher en grand format.</p>

    <div class="grille-periodes">""")
for pname, pnum, ptitle, pyears in PERIODS:
    hub.append(f"""      <article class="carte-periode">
        <div class="corps">
          <span class="numero">Période {pnum}</span>
          <h3>{esc(ptitle)}</h3>
          <span class="annees">{pyears}</span>
          <p>{counts[pnum]} documents à analyser.</p>
          <a class="lien-carte" href="documents-periode-{pnum}.html">Voir les dossiers →</a>
        </div>
      </article>""")
hub.append("""    </div>
  </main>
""")
hub.append(FOOTER)
open(os.path.join(ROOT, "pages", "documents.html"), "w", encoding="utf-8").write("\n".join(hub))
print("écrit hub documents.html ; total", sum(counts.values()), "documents")
