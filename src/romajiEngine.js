const MAP = {
  "あ":["a"],"い":["i","yi"],"う":["u","wu"],"え":["e"],"お":["o"],
  "か":["ka","ca"],"き":["ki"],"く":["ku","cu","qu"],"け":["ke"],"こ":["ko","co"],
  "さ":["sa"],"し":["shi","si","ci"],"す":["su"],"せ":["se","ce"],"そ":["so"],
  "た":["ta"],"ち":["chi","ti"],"つ":["tsu","tu"],"て":["te"],"と":["to"],
  "な":["na"],"に":["ni"],"ぬ":["nu"],"ね":["ne"],"の":["no"],
  "は":["ha"],"ひ":["hi"],"ふ":["fu","hu"],"へ":["he"],"ほ":["ho"],
  "ま":["ma"],"み":["mi"],"む":["mu"],"め":["me"],"も":["mo"],
  "や":["ya"],"ゆ":["yu"],"よ":["yo"],
  "ら":["ra"],"り":["ri"],"る":["ru"],"れ":["re"],"ろ":["ro"],
  "わ":["wa"],"ゐ":["wi"],"ゑ":["we"],"を":["wo"],
  "が":["ga"],"ぎ":["gi"],"ぐ":["gu"],"げ":["ge"],"ご":["go"],
  "ざ":["za"],"じ":["ji","zi"],"ず":["zu"],"ぜ":["ze"],"ぞ":["zo"],
  "だ":["da"],"ぢ":["di","ji"],"づ":["du","zu"],"で":["de"],"ど":["do"],
  "ば":["ba"],"び":["bi"],"ぶ":["bu"],"べ":["be"],"ぼ":["bo"],
  "ぱ":["pa"],"ぴ":["pi"],"ぷ":["pu"],"ぺ":["pe"],"ぽ":["po"],
  "ゔ":["vu"],
  "きゃ":["kya"],"きぃ":["kyi"],"きゅ":["kyu"],"きぇ":["kye"],"きょ":["kyo"],
  "しゃ":["sha","sya"],"しぃ":["syi"],"しゅ":["shu","syu"],"しぇ":["she","sye"],"しょ":["sho","syo"],
  "ちゃ":["cha","tya","cya"],"ちぃ":["tyi","cyi"],"ちゅ":["chu","tyu","cyu"],"ちぇ":["che","tye","cye"],"ちょ":["cho","tyo","cyo"],
  "にゃ":["nya"],"にぃ":["nyi"],"にゅ":["nyu"],"にぇ":["nye"],"にょ":["nyo"],
  "ひゃ":["hya"],"ひぃ":["hyi"],"ひゅ":["hyu"],"ひぇ":["hye"],"ひょ":["hyo"],
  "みゃ":["mya"],"みぃ":["myi"],"みゅ":["myu"],"みぇ":["mye"],"みょ":["myo"],
  "りゃ":["rya"],"りぃ":["ryi"],"りゅ":["ryu"],"りぇ":["rye"],"りょ":["ryo"],
  "ぎゃ":["gya"],"ぎぃ":["gyi"],"ぎゅ":["gyu"],"ぎぇ":["gye"],"ぎょ":["gyo"],
  "じゃ":["ja","jya","zya"],"じぃ":["jyi","zyi"],"じゅ":["ju","jyu","zyu"],"じぇ":["je","jye","zye"],"じょ":["jo","jyo","zyo"],
  "ぢゃ":["dya"],"ぢぃ":["dyi"],"ぢゅ":["dyu"],"ぢぇ":["dye"],"ぢょ":["dyo"],
  "びゃ":["bya"],"びぃ":["byi"],"びゅ":["byu"],"びぇ":["bye"],"びょ":["byo"],
  "ぴゃ":["pya"],"ぴぃ":["pyi"],"ぴゅ":["pyu"],"ぴぇ":["pye"],"ぴょ":["pyo"],
  "いぇ":["ye"],"うぁ":["wha"],"うぃ":["wi","whi"],"うぇ":["we","whe"],"うぉ":["who"],
  "ゔぁ":["va"],"ゔぃ":["vi","vyi"],"ゔぇ":["ve","vye"],"ゔぉ":["vo"],"ゔゅ":["vyu"],
  "くぁ":["qa","qwa","kwa"],"くぃ":["qi","qwi","kwi"],"くぇ":["qe","qwe","kwe"],"くぉ":["qo","qwo","kwo"],"くゎ":["qa","kwa"],
  "ぐぁ":["gwa"],"ぐぃ":["gwi"],"ぐぇ":["gwe"],"ぐぉ":["gwo"],"ぐゎ":["gwa"],
  "すぃ":["swi"],"ずぃ":["zwi"],
  "つぁ":["tsa"],"つぃ":["tsi"],"つぇ":["tse"],"つぉ":["tso"],
  "てぃ":["thi","ti"],"てゅ":["thu"],"てぇ":["the"],"てょ":["tho"],
  "でぃ":["dhi","di"],"でゅ":["dhu"],"でぇ":["dhe"],"でょ":["dho"],
  "とぅ":["twu","tu"],"どぅ":["dwu","du"],
  "ふぁ":["fa","fwa"],"ふぃ":["fi","fwi"],"ふぇ":["fe","fwe"],"ふぉ":["fo","fwo"],"ふゅ":["fyu"],
  "ぁ":["xa","la"],"ぃ":["xi","li","xyi","lyi"],"ぅ":["xu","lu"],"ぇ":["xe","le","xye","lye"],"ぉ":["xo","lo"],
  "ゃ":["xya","lya"],"ゅ":["xyu","lyu"],"ょ":["xyo","lyo"],"ゎ":["xwa","lwa"],
  "ー":["-"]
};

function tokenize(reading) {
  const tokens=[];
  for (let i=0;i<reading.length;i++) {
    const two=reading.slice(i,i+2);
    if (MAP[two]) { tokens.push(two); i++; }
    else tokens.push(reading[i]);
  }
  return tokens;
}

function tokenOptions(tokens,index) {
  const token=tokens[index];
  if (token === "ん") {
    const next=(MAP[tokens[index+1]]||[])[0]||"";
    return /^[aiueoyn]/.test(next) ? ["nn","n'"] : ["n","nn","n'"];
  }
  if (token === "っ") {
    const next=MAP[tokens[index+1]]||[];
    const doubled=[...new Set(next.map(x=>x[0]).filter(c=>c&&!"aiueon".includes(c)))];
    return ["xtu","ltu","xtsu","ltsu",...doubled];
  }
  return MAP[token] || [];
}

function canMatch(tokens,input,index=0,pos=0,memo=new Map()) {
  const key=`${index}:${pos}`;
  if (memo.has(key)) return memo.get(key);
  if (pos === input.length) return true;
  if (index >= tokens.length) return false;
  let result=false;
  for (const option of tokenOptions(tokens,index)) {
    const remaining=input.slice(pos);
    const n=Math.min(remaining.length,option.length);
    if (remaining.slice(0,n) !== option.slice(0,n)) continue;
    if (remaining.length < option.length) { result=true; break; }
    if (canMatch(tokens,input,index+1,pos+option.length,memo)) { result=true; break; }
  }
  memo.set(key,result);
  return result;
}

function isComplete(tokens,input,index=0,pos=0,memo=new Map()) {
  const key=`${index}:${pos}`;
  if (memo.has(key)) return memo.get(key);
  if (index === tokens.length) return pos === input.length;
  let result=false;
  for (const option of tokenOptions(tokens,index)) {
    if (input.startsWith(option,pos) && isComplete(tokens,input,index+1,pos+option.length,memo)) { result=true; break; }
  }
  memo.set(key,result);
  return result;
}

export function createRomajiModel(reading) {
  const tokens=tokenize(reading);
  const prefixCache=new Map(),completeCache=new Map(),longerCache=new Map();
  return {
    isPrefix(input) {
      const key=input.toLowerCase();
      if(!prefixCache.has(key))prefixCache.set(key,canMatch(tokens,key));
      return prefixCache.get(key);
    },
    isComplete(input) {
      const key=input.toLowerCase();
      if(!completeCache.has(key))completeCache.set(key,isComplete(tokens,key));
      return completeCache.get(key);
    },
    hasLonger(input) {
      const key=input.toLowerCase();
      if(!longerCache.has(key))longerCache.set(key,"abcdefghijklmnopqrstuvwxyz'".split("").some(c=>canMatch(tokens,key+c)));
      return longerCache.get(key);
    }
  };
}
