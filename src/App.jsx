import {useEffect,useMemo,useRef,useState} from "react";
import {toHiragana} from "wanakana";
import {Activity,Award,Clock3,Keyboard,Languages,RotateCcw,Sparkles,Target,Trophy,UserRound,Zap} from "lucide-react";

const DURATIONS=[30,60,120];
const LEVELS={beginner:{label:"初級",desc:"短く基本的な単語"},intermediate:{label:"中級",desc:"標準的な長さの単語"},advanced:{label:"上級",desc:"長く難しい単語"}};
const MODES={english:"英単語",japanese:"日本語"};
const STORE="typelab-v8-username";
const LETTERS="abcdefghijklmnopqrstuvwxyz";
const shuffle=a=>[...a].sort(()=>Math.random()-.5);

const ROMAJI={
 "あ":["a"],"い":["i","yi"],"う":["u","wu"],"え":["e"],"お":["o"],
 "か":["ka"],"き":["ki"],"く":["ku","cu","qu"],"け":["ke"],"こ":["ko"],
 "さ":["sa"],"し":["shi","si"],"す":["su"],"せ":["se"],"そ":["so"],
 "た":["ta"],"ち":["chi","ti"],"つ":["tsu","tu"],"て":["te"],"と":["to"],
 "な":["na"],"に":["ni"],"ぬ":["nu"],"ね":["ne"],"の":["no"],
 "は":["ha"],"ひ":["hi"],"ふ":["fu","hu"],"へ":["he"],"ほ":["ho"],
 "ま":["ma"],"み":["mi"],"む":["mu"],"め":["me"],"も":["mo"],
 "や":["ya"],"ゆ":["yu"],"よ":["yo"],
 "ら":["ra"],"り":["ri"],"る":["ru"],"れ":["re"],"ろ":["ro"],
 "わ":["wa"],"を":["wo"],"ん":["n","nn","n'"],
 "が":["ga"],"ぎ":["gi"],"ぐ":["gu"],"げ":["ge"],"ご":["go"],
 "ざ":["za"],"じ":["ji","zi"],"ず":["zu"],"ぜ":["ze"],"ぞ":["zo"],
 "だ":["da"],"ぢ":["di","ji"],"づ":["du","zu"],"で":["de"],"ど":["do"],
 "ば":["ba"],"び":["bi"],"ぶ":["bu"],"べ":["be"],"ぼ":["bo"],
 "ぱ":["pa"],"ぴ":["pi"],"ぷ":["pu"],"ぺ":["pe"],"ぽ":["po"],
 "きゃ":["kya"],"きゅ":["kyu"],"きょ":["kyo"],
 "しゃ":["sha","sya"],"しゅ":["shu","syu"],"しょ":["sho","syo"],
 "ちゃ":["cha","tya"],"ちゅ":["chu","tyu"],"ちょ":["cho","tyo"],
 "にゃ":["nya"],"にゅ":["nyu"],"にょ":["nyo"],
 "ひゃ":["hya"],"ひゅ":["hyu"],"ひょ":["hyo"],
 "みゃ":["mya"],"みゅ":["myu"],"みょ":["myo"],
 "りゃ":["rya"],"りゅ":["ryu"],"りょ":["ryo"],
 "ぎゃ":["gya"],"ぎゅ":["gyu"],"ぎょ":["gyo"],
 "じゃ":["ja","jya","zya"],"じゅ":["ju","jyu","zyu"],"じょ":["jo","jyo","zyo"],
 "びゃ":["bya"],"びゅ":["byu"],"びょ":["byo"],
 "ぴゃ":["pya"],"ぴゅ":["pyu"],"ぴょ":["pyo"]
};

function tokenizeKana(reading){
 const tokens=[];
 for(let i=0;i<reading.length;i++){
  if(reading[i]==="っ"){tokens.push("っ");continue}
  const pair=reading.slice(i,i+2);
  if(ROMAJI[pair]){tokens.push(pair);i++}else tokens.push(reading[i]);
 }
 return tokens;
}

// 読みから許容するローマ字列を列挙する。候補数は安全のため上限を設ける。
function romajiCandidates(reading){
 const tokens=tokenizeKana(reading);let results=[""];
 for(let i=0;i<tokens.length;i++){
  const token=tokens[i];
  if(token==="っ"){
   const next=ROMAJI[tokens[i+1]]||[];
   const consonants=[...new Set(next.map(x=>x[0]).filter(x=>x&&!"aeioun".includes(x)))];
   results=results.flatMap(base=>consonants.map(c=>base+c)).slice(0,12000);
   continue;
  }
  const choices=ROMAJI[token]||[toHiragana(token)];
  results=results.flatMap(base=>choices.map(choice=>base+choice)).slice(0,12000);
 }
 return [...new Set(results)];
}
function Stat({icon:Icon,label,value,suffix=""}){return <div className="stat"><span><Icon size={14}/>{label}</span><strong>{value}<small>{suffix}</small></strong></div>}

function Ranking({records,mode,level,duration}){
 const list=records[`${mode}-${level}-${duration}`]||[];
 return <div className="ranking"><div className="rank-head"><Trophy size={18}/><b>{MODES[mode]}・{LEVELS[level].label}・{duration}秒ランキング</b></div><div className="rank-columns"><div><h4>KEY/S</h4>{[...list].sort((a,b)=>b.kps-a.kps).slice(0,5).map((r,i)=><p key={r.id}><i>{i+1}</i><span>{r.username}</span><b>{r.kps.toFixed(2)}</b><small>{r.words}語</small></p>)}</div><div><h4>入力単語数</h4>{[...list].sort((a,b)=>b.words-a.words||b.kps-a.kps).slice(0,5).map((r,i)=><p key={r.id}><i>{i+1}</i><span>{r.username}</span><b>{r.words}語</b><small>{r.kps.toFixed(2)}</small></p>)}</div></div>{!list.length&&<div className="empty">まだ記録がありません</div>}</div>
}

export default function App(){
 const [screen,setScreen]=useState("home"),[mode,setMode]=useState("english"),[level,setLevel]=useState("beginner"),[duration,setDuration]=useState(60),[data,setData]=useState({english:{},japanese:{}}),[queue,setQueue]=useState([]),[idx,setIdx]=useState(0),[typed,setTyped]=useState(""),[time,setTime]=useState(60),[correct,setCorrect]=useState(0),[keys,setKeys]=useState(0),[mistakes,setMistakes]=useState(0),[completed,setCompleted]=useState(0),[records,setRecords]=useState({}),[rankingLoading,setRankingLoading]=useState(false),[saveError,setSaveError]=useState(""),[joinRanking,setJoinRanking]=useState(false),[username,setUsername]=useState(""),[resultSaved,setResultSaved]=useState(false);
 const inputRef=useRef(),completeTimerRef=useRef(null),typedRef=useRef("");
 useEffect(()=>{Promise.all([fetch("/data/english.json").then(r=>r.json()),fetch("/data/japanese.json").then(r=>r.json())]).then(([english,japanese])=>setData({english,japanese}));try{setUsername(localStorage.getItem(STORE)||"")}catch{}},[]);
 useEffect(()=>{if(screen!=="playing")return;inputRef.current?.focus();const id=setInterval(()=>setTime(t=>{if(t<=1){clearInterval(id);setScreen("result");return 0}return t-1}),1000);return()=>clearInterval(id)},[screen]);
 useEffect(()=>{let active=true;setRankingLoading(true);fetch(`/api/rankings?mode=${mode}&level=${level}&duration=${duration}`).then(r=>{if(!r.ok)throw new Error("ランキングを取得できません");return r.json()}).then(x=>{if(active)setRecords(v=>({...v,[`${mode}-${level}-${duration}`]:x.results||[]}))}).catch(()=>{if(active)setRecords(v=>({...v,[`${mode}-${level}-${duration}`]:[]}))}).finally(()=>{if(active)setRankingLoading(false)});return()=>{active=false}},[mode,level,duration]);
 const elapsed=Math.max(1,duration-time),kps=correct/elapsed,accuracy=keys?Math.round(correct/keys*100):100,item=queue[idx],target=mode==="english"?(item||""):(item?.reading||""),pool=data[mode]?.[level]||[],total=Object.values(data.english||{}).flat().length+Object.values(data.japanese||{}).flat().length;
 const acceptedRomaji=useMemo(()=>mode==="japanese"&&target?romajiCandidates(target):[],[mode,target]);
 function start(){if(!pool.length)return;setJoinRanking(false);setResultSaved(false);setQueue(shuffle(pool));setIdx(0);typedRef.current="";setTyped("");setTime(duration);setCorrect(0);setKeys(0);setMistakes(0);setCompleted(0);setScreen("playing")}
 function saveRanking(){
  if(!joinRanking||!username.trim()||resultSaved)return;
  setSaveError("");
  fetch("/api/rankings",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({username:username.trim().slice(0,20),mode,level,duration,kps,words:completed,accuracy})})
   .then(async r=>{if(!r.ok)throw new Error((await r.json().catch(()=>({}))).error||"保存に失敗しました");localStorage.setItem(STORE,username.trim());setResultSaved(true);const q=await fetch(`/api/rankings?mode=${mode}&level=${level}&duration=${duration}`);const x=await q.json();setRecords(v=>({...v,[`${mode}-${level}-${duration}`]:x.results||[]}))})
   .catch(e=>setSaveError(e.message||"保存に失敗しました"));
 }
 function next(){clearTimeout(completeTimerRef.current);typedRef.current="";setCompleted(n=>n+1);setTyped("");if(idx+1>=queue.length){setQueue(shuffle(pool));setIdx(0)}else setIdx(n=>n+1);setTimeout(()=>inputRef.current?.focus(),0)}
 function keydown(e){
  if(e.key==="Backspace"){e.preventDefault();clearTimeout(completeTimerRef.current);typedRef.current=typedRef.current.slice(0,-1);setTyped(typedRef.current);return}
  if(e.ctrlKey||e.altKey||e.metaKey||e.key.length!==1)return;
  e.preventDefault();const c=e.key.toLowerCase();
  if(mode==="english"){
   if(!/^[a-z]$/.test(c))return;
   setKeys(n=>n+1);
   if(c!==target[typedRef.current.length]){setMistakes(n=>n+1);return}
   const n=typedRef.current+c;typedRef.current=n;setTyped(n);setCorrect(x=>x+1);if(n===target)setTimeout(next,70);return;
  }
  if(!/^[a-z'-]$/.test(c))return;
  clearTimeout(completeTimerRef.current);
  setKeys(n=>n+1);
  const candidate=typedRef.current+c;
  // 正解候補の先頭と一致する場合だけ入力状態へ反映する。例: kotoba に対して k/ko/kot は可、kx は不可。
  const valid=acceptedRomaji.some(answer=>answer.startsWith(candidate));
  if(!valid){setMistakes(n=>n+1);return}
  typedRef.current=candidate;setTyped(candidate);setCorrect(n=>n+1);
  const exact=acceptedRomaji.includes(candidate);
  if(exact){
   const hasLonger=acceptedRomaji.some(answer=>answer.length>candidate.length&&answer.startsWith(candidate));
   // 語尾の n が完成形でも、nn を入力できるよう少しだけ確定を待つ。
   completeTimerRef.current=setTimeout(next,hasLonger?260:70);
  }
 }
 const converted=mode==="japanese"?toHiragana(typed,{IMEMode:true}):typed,done=[...(mode==="japanese"?converted.replace(/[a-z' -]+$/i,""):typed)].length;
 return <main><div className="glow a"/><div className="glow b"/><div className="shell"><header><button className="brand" onClick={()=>setScreen("home")}><i><Keyboard/></i><span><b>TYPE//LAB</b><small>Typing Studio v9</small></span></button><div className="status"><i/>Cloudflare Ready</div></header>
 {screen==="home"&&<section className="home"><div className="hero"><div className="badge"><Sparkles size={14}/>{total.toLocaleString()}語をレベル別に収録</div><h1>指先のスピードを、<br/><em>次のレベルへ。</em></h1><p>英単語と日本語を初級・中級・上級から選択。ランキングへ参加するかは、練習ごとに選択できます。</p></div><div className="setup-v3"><div><div className="modes">{[["english",Languages,"英単語"],["japanese",Keyboard,"日本語"]].map(([id,Icon,label])=><button key={id} className={mode===id?"mode selected":"mode"} onClick={()=>setMode(id)}><i><Icon/></i><span><b>{label}</b><small>{(data[id]?.[level]||[]).length.toLocaleString()}語</small></span></button>)}</div><div className="levels">{Object.entries(LEVELS).map(([id,x])=><button key={id} className={level===id?"selected":""} onClick={()=>setLevel(id)}><b>{x.label}</b><small>{x.desc}</small></button>)}</div></div><aside><h2>TIME LIMIT</h2><div className="times">{DURATIONS.map(s=><button key={s} className={duration===s?"selected":""} onClick={()=>setDuration(s)}>{s}s</button>)}</div><hr/><div className="best"><span>問題数</span><b>{pool.length.toLocaleString()}語</b></div><button className="primary" onClick={start} disabled={!pool.length}>練習をスタート</button></aside></div>{rankingLoading?<div className="ranking empty">ランキングを読み込み中...</div>:<Ranking records={records} mode={mode} level={level} duration={duration}/>}</section>}
 {screen==="playing"&&item&&<section className="play" onClick={()=>inputRef.current?.focus()}><div className="stats"><Stat icon={Clock3} label="残り時間" value={time} suffix="sec"/><Stat icon={Zap} label="入力速度" value={kps.toFixed(2)} suffix="key/s"/><Stat icon={Target} label="正答率" value={accuracy} suffix="%"/><Stat icon={Activity} label="完了" value={completed} suffix="語"/></div><div className="progress"><i style={{width:`${(duration-time)/duration*100}%`}}/></div><div className="typing-card"><small>{LEVELS[level].label} / {MODES[mode]}</small>{mode==="japanese"&&<h3>{item.display}</h3>}<div className="target">{[...target].map((c,i)=><span key={i} className={i<done?"done":i===done?"current":""}>{c}</span>)}</div>{mode==="japanese"&&<div className="raw">{typed||"..."}<span> → {converted||"..."}</span></div>}<input ref={inputRef} value="" onKeyDown={keydown} onChange={()=>{}} autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck={false}/><p>間違ったキーは入力欄へ反映されません</p></div><div className="under"><span>ミス: {mistakes}</span><button onClick={e=>{e.stopPropagation();setScreen("home")}}>終了</button></div></section>}
 {screen==="result"&&<section className="result"><div className="award"><Award size={42}/></div><small>SESSION COMPLETE</small><h2>トレーニング完了！</h2><div className="result-card"><strong>{kps.toFixed(2)}</strong><small>KEYS PER SECOND</small><div className="stats"><Stat icon={Target} label="正答率" value={accuracy} suffix="%"/><Stat icon={Activity} label="ミス" value={mistakes}/><Stat icon={Keyboard} label="入力単語" value={completed} suffix="語"/></div><div className="result-register"><label className="rank-option"><input type="checkbox" checked={joinRanking} disabled={resultSaved} onChange={e=>setJoinRanking(e.target.checked)}/><span>この結果をランキングに記録する</span></label>{joinRanking&&<><label className="username"><UserRound size={16}/><input value={username} disabled={resultSaved} onChange={e=>setUsername(e.target.value.slice(0,20))} placeholder="ユーザーネーム" maxLength={20}/></label><button className="save-score" disabled={!username.trim()||resultSaved} onClick={saveRanking}>{resultSaved?"記録しました":"ランキングへ記録"}</button></>}{saveError&&<div className="save-error">{saveError}</div>}{!joinRanking&&<div className="not-saved">記録せずに終了できます</div>}</div></div>{rankingLoading?<div className="ranking empty">ランキングを読み込み中...</div>:<Ranking records={records} mode={mode} level={level} duration={duration}/>}<div className="actions"><button className="primary" onClick={start}><RotateCcw size={16}/>もう一度</button><button onClick={()=>setScreen("home")}>ホームへ</button></div></section>}
 <footer><span>TYPE LAB / 2026</span><span>{total.toLocaleString()} WORDS</span></footer></div></main>
}
