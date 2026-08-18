import fs from "node:fs";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url), wordlist=require("wordlist-english");
const source=[...(wordlist["english/20"]||[]),...(wordlist["english/35"]||[])];
const clean=[...new Set(source.map(w=>w.toLowerCase()).filter(w=>/^[a-z]+$/.test(w)&&w.length>=2&&w.length<=16))];
const data={beginner:clean.filter(w=>w.length<=5),intermediate:clean.filter(w=>w.length>=6&&w.length<=9),advanced:clean.filter(w=>w.length>=10)};
fs.mkdirSync("public/data",{recursive:true});fs.writeFileSync("public/data/english.json",JSON.stringify(data));
console.log(`English words: ${clean.length} (beginner ${data.beginner.length}, intermediate ${data.intermediate.length}, advanced ${data.advanced.length})`);
