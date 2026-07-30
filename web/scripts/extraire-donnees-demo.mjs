/**
 * Extrait les objets de données du prototype (docs/finlens-plateforme-v1.html)
 * vers src/lib/demo/data/*.json, plutôt que de les retranscrire à la main —
 * une retranscription finirait par diverger de la référence.
 *
 * Usage : npm run demo:extraire (depuis web/)
 */
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync("../docs/finlens-plateforme-v1.html", "utf8");
const lignes = html.split(/\r?\n/);

// Le bloc de données va de "var MAX_SLOTS" jusqu'à la fin de CUSTOM_GROUPS.
function bloc(depuisRegex, jusquaRegex) {
  const debut = lignes.findIndex((l) => depuisRegex.test(l));
  const fin = lignes.findIndex((l, i) => i > debut && jusquaRegex.test(l));
  return lignes.slice(debut, fin === -1 ? lignes.length : fin).join("\n");
}

const source = [
  bloc(/^var SOURCES=/, /^\s*function /),
  bloc(/^var MAX_SLOTS=/, /^function activeCount/),
  bloc(/^var ESSENTIAL_PROFILES=/, /^var currentPlan=/),
  bloc(/^var CUSTOM_GROUPS=/, /^\s*function /),
  bloc(/^var GRES=/, /^\s*function /),
].join("\n");

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { timeout: 5000 });

const sortie = "src/lib/demo/data";
fs.mkdirSync(sortie, { recursive: true });

const aExporter = {
  dossiers: sandbox.dossiers,
  signals: sandbox.SIGNALS,
  contra: sandbox.CONTRA,
  checklist: sandbox.CHECKLIST,
  statements: sandbox.STATEMENTS,
  qpacks: sandbox.QPACKS,
  gaps: sandbox.GAPS,
  kpiLib: sandbox.KPI_LIB,
  profiles: sandbox.PROFILES,
  customGroups: sandbox.CUSTOM_GROUPS,
  essentialProfiles: sandbox.ESSENTIAL_PROFILES,
  sources: sandbox.SOURCES,
  globalResults: sandbox.GRES,
  stages: sandbox.STAGES,
};

for (const [nom, valeur] of Object.entries(aExporter)) {
  if (valeur === undefined) {
    console.log(`  MANQUANT: ${nom}`);
    continue;
  }
  fs.writeFileSync(`${sortie}/${nom}.json`, JSON.stringify(valeur, null, 2), "utf8");
  const taille = Array.isArray(valeur) ? valeur.length : Object.keys(valeur).length;
  console.log(`  ok ${nom}.json (${taille} entrées)`);
}
