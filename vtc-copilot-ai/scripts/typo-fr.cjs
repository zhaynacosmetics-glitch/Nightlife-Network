// Applique les espaces insécables de la typographie française (avant : ; ? ! et après « ) dans les textes du code source.
// Ne touche qu'aux chaînes de caractères et au texte JSX (pas aux opérateurs ternaires). Usage : node scripts/typo-fr.cjs <fichiers…>
const ts = require("typescript");
const fs = require("fs");
const NB = " ";
let changed = 0;
for (const file of process.argv.slice(2)) {
  const src = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const edits = [];
  const visit = (n) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isJsxText(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) {
      const start = n.getStart(sf);
      const text = src.slice(start, n.getEnd());
      // ignore les chaînes techniques (classes CSS, imports, sélecteurs)
      if (!/[a-zà-ÿ]/i.test(text) || ts.isImportDeclaration(n.parent) || (ts.isJsxAttribute(n.parent) && /^(className|href|id|type|name|autoComplete|inputMode|role)$/.test(n.parent.name.getText(sf)))) return;
      const fixed = text.replace(/([^\s ]) ([:;?!»])/g, `$1${NB}$2`).replace(/« /g, `«${NB}`); // eslint-disable-line no-irregular-whitespace
      if (fixed !== text) edits.push([start, n.getEnd(), fixed]);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  if (!edits.length) continue;
  let out = src;
  for (const [s, e, t] of edits.sort((a, b) => b[0] - a[0])) out = out.slice(0, s) + t + out.slice(e);
  fs.writeFileSync(file, out);
  changed += edits.length;
  console.log(file, edits.length);
}
console.log("remplacements :", changed);
