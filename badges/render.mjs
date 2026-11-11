// Renders badges.html and rollup.html (with the data.js build.py wrote) to the PDFs in out/
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const HERE = path.dirname(fileURLToPath(import.meta.url));

// Format fini 4 × 6 po + 0,125 po de fond perdu de chaque côté
const BLEED_SIZE = { width: "4.25in", height: "6.25in" };

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
page.on("console", (message) => console.log("[page]", message.text()));
page.on("pageerror", (error) => console.error("[page error]", error.message));

await open("guides");
await page.locator("#sheet").screenshot({ path: out("maquette.png") });

// Les deux rectos avec QR, à taille réelle sur une feuille Lettre : pour tester le scan sur papier
await open("guides&only=0,1");
await page.pdf({
  path: out("test-scan-taille-reelle.pdf"),
  width: "11in",
  height: "8.5in",
  printBackground: true,
});

for (const set of ["participant", "speaker", "equipe", "commanditaires"]) {
  await open(`print&set=${set}`);
  await page.pdf({
    path: out(`cocarde-${set}.pdf`),
    ...BLEED_SIZE,
    printBackground: true,
  });
}

for (const set of ["conferenciers", "organisateurs", "participants"]) {
  await open(`print&set=${set}`);
  await page.pdf({
    path: out(`${set}-fusionnes.pdf`),
    ...BLEED_SIZE,
    printBackground: true,
  });
}

await open("print&set=exemples");
await page.pdf({
  path: out("exemples-fusionnes.pdf"),
  ...BLEED_SIZE,
  printBackground: true,
});

await open("guides&set=exemples&only=0");
console.log(JSON.stringify(await page.evaluate(measureTextZones)));

await open("zoom=0.2", "rollup.html");
for (const rows of ["actuel", "argent-2-1"]) {
  await open(`zoom=0.2&gold=bloc&rows=${rows}`, "rollup.html");
  console.log(
    rows,
    JSON.stringify(await page.evaluate(measureRollupText)),
    JSON.stringify(
      await page
        .evaluate(measureLogoResolution)
        .then((logos) =>
          logos.map(({ logo, largeurCm }) => `${logo} ${largeurCm}`),
        ),
    ),
  );
}
await open("zoom=0.2", "rollup.html");
await page.locator("#stage").screenshot({ path: out("rollup-maquette.png") });

// Aux cotes exactes du gabarit imprimeur « template roll up mars.pdf »
await open("print&gold=bloc&rows=argent-2-1", "rollup.html");
await page.pdf({
  path: out("roll-up.pdf"),
  width: "33.875in",
  height: "81.25in",
  printBackground: true,
});
console.log(JSON.stringify(await page.evaluate(measureLogoResolution)));
console.log(JSON.stringify(await page.evaluate(measureRollupText)));
console.log(JSON.stringify(await page.evaluate(measureGoldBlock)));

await browser.close();

async function open(query, file = "badges.html") {
  await page.goto(`${pathToFileURL(path.join(HERE, file))}?${query}`);
  await page.waitForSelector("body[data-ready]");
}

function out(name) {
  return path.join(HERE, "out", name);
}

// Hauteur imprimée des capitales de chaque texte, et débordement éventuel de la zone visible
function measureRollupText() {
  const PT_TO_CM = 2.54 / 72;
  const INTER_CAP_HEIGHT = 0.727;
  const size = (selector) =>
    parseFloat(getComputedStyle(document.querySelector(selector)).fontSize) *
    0.75;
  const cm = (value) => Math.round(value * PT_TO_CM * 10) / 10;
  const zoom =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--zoom"),
    ) || 1;
  const floor = document
    .querySelector(".visible")
    .getBoundingClientRect().bottom;
  const fromFloorCm = (selector) => {
    const box = document.querySelector(selector).getBoundingClientRect();
    const toCm = (px) => Math.round(((floor - px) / zoom) * 0.75 * PT_TO_CM);
    return `${toCm(box.bottom)}–${toCm(box.top)} cm du sol`;
  };
  const sponsors = document.querySelector(".sponsors");
  const toCmLength = (px) =>
    Math.round((px / zoom) * 0.75 * PT_TO_CM * 10) / 10;
  // Écart entre chaque bloc de la colonne des commanditaires (titres, logos Or, rangées)
  const verticalGaps = () => {
    // Empilés, les Or sont « display: contents » : ce sont alors leurs logos qui comptent comme blocs
    const blocks = [...sponsors.children]
      .flatMap((element) =>
        getComputedStyle(element).display === "contents"
          ? [...element.children]
          : [element],
      )
      .map((element) => element.getBoundingClientRect())
      .sort((a, b) => a.top - b.top);
    return blocks
      .slice(1)
      .map((box, index) => toCmLength(box.top - blocks[index].bottom));
  };
  const rowGaps = (tier) => {
    const boxes = [
      ...document.querySelectorAll(`.tier[data-tier=${tier}] > *`),
    ].map((element) => element.getBoundingClientRect());
    return boxes
      .slice(1)
      .map((box, index) => toCmLength(box.left - boxes[index].right));
  };
  return {
    logo: fromFloorCm(".logo"),
    merci: {
      capitalesCm: cm(size(".thanks") * INTER_CAP_HEIGHT),
      position: fromFloorCm(".thanks"),
    },
    argent: fromFloorCm(".tier[data-tier=argent]"),
    bronze: fromFloorCm(".tier[data-tier=bronze]"),
    ecartsVerticauxCm: verticalGaps(),
    ecartsRangeesCm: { argent: rowGaps("argent"), bronze: rowGaps("bronze") },
    url: {
      capitalesCm: cm(size(".url") * INTER_CAP_HEIGHT),
      position: fromFloorCm(".url"),
    },
    contenuDeborde: sponsors.scrollHeight > sponsors.clientHeight,
  };
}

// Équilibre du bloc des Or : marges gauche et droite, et alignement d'ALTEN sur la colonne voisine
function measureGoldBlock() {
  const cm = (px) => Math.round(((px * 0.75) / (72 / 2.54)) * 10) / 10;
  const column = document.querySelector(".sponsors").getBoundingClientRect();
  const visible = document.querySelector(".visible").getBoundingClientRect();
  const [osedea, alten, extia] = [
    ...document.querySelectorAll(".tier[data-tier=or] > img"),
  ].map((image) => image.getBoundingClientRect());
  const blockLeft = Math.min(osedea.left, extia.left);
  const blockRight = alten.right;
  return {
    margesBlocDansRollUpCm: {
      gauche: cm(blockLeft - visible.left),
      droite: cm(visible.right - blockRight),
    },
    ecartColonnesCm: cm(alten.left - Math.max(osedea.right, extia.right)),
    ecartOsedeaExtiaCm: cm(extia.top - osedea.bottom),
    centrageExtiaSousOsedeaCm: cm(
      (extia.left + extia.right) / 2 - (osedea.left + osedea.right) / 2,
    ),
    hautAltenMoinsHautOsedeaCm: cm(alten.top - osedea.top),
    basAltenMoinsBasExtiaCm: cm(alten.bottom - extia.bottom),
    largeurColonneSponsorsCm: cm(column.width),
  };
}

// Résolution réelle de chaque logo à sa taille d'impression sur le roll-up
function measureLogoResolution() {
  const zoom =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--zoom"),
    ) || 1;
  return [...document.querySelectorAll(".rollup .tier img")].map((image) => {
    const printedInches = image.getBoundingClientRect().width / zoom / 96;
    const source = image.getAttribute("src").split("/").pop();
    return {
      logo: source,
      largeurCm: Math.round(printedInches * 2.54 * 10) / 10,
      ppp: source.endsWith(".svg")
        ? "vectoriel"
        : Math.round(image.naturalWidth / printedInches),
    };
  });
}

// Positions en points depuis le coin haut-gauche du format fini, pour un gabarit + CSV
function measureTextZones() {
  const PT_PER_PX = 72 / 96;
  const trim = document
    .querySelector(".badge > .trim:not(:has(.ground-label, .hole))")
    .getBoundingClientRect();
  const zone = (selector) => {
    const box = document.querySelector(selector).getBoundingClientRect();
    const round = (px) => Math.round(px * PT_PER_PX * 10) / 10;
    return {
      x: round(box.left - trim.left),
      y: round(box.top - trim.top),
      w: round(box.width),
      h: round(box.height),
    };
  };
  const fontSize = (selector) =>
    parseFloat(getComputedStyle(document.querySelector(selector)).fontSize) *
    PT_PER_PX;
  return {
    carte: zone(".card"),
    prenom: { ...zone(".first-name"), corpsMax: fontSize(".first-name") },
    nom: { ...zone(".last-name"), corpsMax: fontSize(".last-name") },
    entreprise: { ...zone(".company"), corps: fontSize(".company") },
    qr: zone(".qr"),
  };
}
