# Atelier Dashboard Excel

Formation web autonome pour construire des tableaux de bord Excel dynamiques :
10 modules, un projet fil rouge, un volet VBA orienté assurance et finance,
31 schémas dessinés en SVG et un catalogue de 135 raccourcis clavier filtrable.

Une seule page, aucune dépendance à installer, aucun script externe :
le seul appel réseau est la feuille de styles Google Fonts.

## Contenu

| Feuille | Sujet |
|---|---|
| Parcours | Anatomie d'un dashboard, chaîne de production, jeu de données fil rouge |
| M1 · Données | Format long, tableaux structurés, Power Query, nettoyage |
| M2 · Formules | RECHERCHEX, SOMME.SI.ENS, FILTRE / UNIQUE / TRIER, LET, lexique FR-EN |
| M3 · TCD | Les quatre zones, modèle en étoile, mesures DAX |
| M4 · Graphiques | Matrice de choix, dépouillement, combiné / cascade / sparklines |
| M5 · Interactivité | Segments connectés, chronologies, listes dynamiques, titres vivants |
| M6 · Design | Trame de colonnes, parcours de l'œil, mise en forme conditionnelle, formats |
| M7 · Automatisation | Chaîne d'actualisation, bouton VBA, protection, livraison |
| Projet | Dashboard commercial en douze étapes |
| M8 · Scénarios | Valeur cible, tables de sensibilité, scénarios, Solveur, prévision |
| M9 · Performance | Causes de lenteur, audit de formules, cellules de contrôle |
| M10 · Métiers | Arrondis et dates, VAN/TRI et trésorerie, balance et états, S/P et ratio combiné |
| VBA | Chain-Ladder, tarification vie, échéancier, Monte-Carlo, piste d'audit |
| Raccourcis | 135 raccourcis, recherche plein texte et filtres par catégorie |

## Développement local

Aucun outillage requis. Servir le dossier suffit :

```bash
python -m http.server 4173
```

Puis ouvrir <http://localhost:4173>.

Ouvrir `index.html` directement par `file://` fonctionne aussi, mais certains
navigateurs restreignent `localStorage` sur ce protocole : la progression et le
thème choisi ne seront alors pas mémorisés.

## Déploiement

Site statique, publié à la racine, sans étape de build. `netlify.toml` porte la
configuration : `publish = "."` et quelques en-têtes de sécurité.

## Notes techniques

- **Thème** clair / sombre : tokens CSS redéfinis pour `prefers-color-scheme`
  et pour un `data-theme` explicite, avec un bouton de bascule.
- **Stockage** : `localStorage` pour le thème, la feuille active et la
  progression. Données locales au navigateur du lecteur, jamais transmises.
- **Illustrations** : SVG inline, colorés par les mêmes tokens que la page,
  donc lisibles dans les deux thèmes. Aucune image binaire.
- **Accessibilité** : navigation par onglets ARIA, focus visible,
  `prefers-reduced-motion` respecté.

## Avertissement sur le volet VBA

Le code d'assurance et de finance est un ensemble de **squelettes
pédagogiques** : méthodes classiques, écrites pour être lisibles. Un calcul
servant à provisionner, tarifer ou publier doit être validé par la fonction
actuarielle ou le contrôle des risques et testé contre une référence avant tout
usage réel. Les hypothèses (tables, chargements, taux) sont des valeurs
d'illustration.
