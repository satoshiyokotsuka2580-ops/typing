import fs from "node:fs";

const source = process.argv[2];

if (!source) {
  console.error("JMdictのJSONファイルを指定してください。");
  console.error("使用例: npm run japanese:import -- C:\\path\\to\\jmdict.json");
  process.exit(1);
}

let stat;
try {
  stat = fs.statSync(source);
} catch (error) {
  console.error(`ファイルを確認できません: ${source}`);
  console.error(error.message);
  process.exit(1);
}

if (!stat.isFile()) {
  console.error(`指定したパスはファイルではありません: ${source}`);
  process.exit(1);
}

console.log("JMdictを読み込んでいます...");
console.log(`ファイルサイズ: ${(stat.size / 1024 / 1024).toFixed(1)} MB`);

let dictionary;
try {
  dictionary = JSON.parse(fs.readFileSync(source, "utf8"));
} catch (error) {
  console.error("JMdict JSONの読み込みまたは解析に失敗しました。");
  console.error(error.message);
  process.exit(1);
}

const words = Array.isArray(dictionary.words) ? dictionary.words : [];

if (words.length === 0) {
  console.error("words配列が見つからないか、空です。");
  console.log("ルートの項目:", Object.keys(dictionary));
  process.exit(1);
}

console.log(`辞書項目数: ${words.length}`);

const output = {
  beginner: [],
  intermediate: [],
  advanced: [],
};

const seen = new Set();
const limitPerLevel = 5000;

function getText(item) {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return "";

  for (const candidate of [
    item.text,
    item.value,
    item.reading,
    item.word,
    item.expression,
  ]) {
    if (typeof candidate === "string") return candidate;
  }

  return "";
}

function validReading(value) {
  return (
    typeof value === "string" &&
    value.length >= 2 &&
    value.length <= 24 &&
    /^[ぁ-んゔー]+$/.test(value)
  );
}

function validDisplay(value) {
  return (
    typeof value === "string" &&
    value.length >= 1 &&
    value.length <= 24 &&
    /^[一-龯々〆ヵヶぁ-んゔァ-ヶヴー]+$/.test(value)
  );
}

function chooseLevel(reading) {
  if (reading.length <= 4) return "beginner";
  if (reading.length <= 8) return "intermediate";
  return "advanced";
}

for (const entry of words) {
  const kanjiItems = Array.isArray(entry.kanji) ? entry.kanji : [];
  const kanaItems = Array.isArray(entry.kana) ? entry.kana : [];

  const displays = kanjiItems.map(getText).filter(validDisplay);
  const readings = kanaItems.map(getText).filter(validReading);

  if (readings.length === 0) continue;

  const reading = readings[0];
  const display = displays[0] || reading;
  const duplicateKey = `${display}\t${reading}`;

  if (seen.has(duplicateKey)) continue;
  seen.add(duplicateKey);

  const level = chooseLevel(reading);
  if (output[level].length >= limitPerLevel) continue;

  output[level].push({ display, reading });
}

const total =
  output.beginner.length +
  output.intermediate.length +
  output.advanced.length;

if (total === 0) {
  console.error("日本語項目を抽出できませんでした。");
  console.log("最初の辞書項目:");
  console.dir(words[0], { depth: 6, maxArrayLength: 5 });
  process.exit(1);
}

fs.mkdirSync("public/data", { recursive: true });
fs.writeFileSync(
  "public/data/japanese.json",
  JSON.stringify(output, null, 2),
  "utf8"
);

console.log("");
console.log("日本語辞書を生成しました。");
console.log(`初級: ${output.beginner.length}語`);
console.log(`中級: ${output.intermediate.length}語`);
console.log(`上級: ${output.advanced.length}語`);
console.log(`合計: ${total}語`);
console.log("出力先: public/data/japanese.json");
