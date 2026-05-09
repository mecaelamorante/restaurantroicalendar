import { useState, useEffect } from "react";

const C = {
  bg:"#fff", surface:"#faf5f5", surface2:"#f5eeee",
  border:"#e8d0d0", border2:"#d4b0b0",
  primary:"#c0392b", primaryD:"#96281b", primaryL:"#e74c3c",
  text:"#2d1515", textSub:"#8a5050", textMute:"#b88080",
  tag:"#fdecea",
};

const DEFAULT_PLATFORMS = [
  { id:"facebook",    label:"Facebook",    icon:"🟦" },
  { id:"instagram",   label:"Instagram",   icon:"📷" },
  { id:"tiktok",      label:"TikTok",      icon:"🎵" },
  { id:"gohighlevel", label:"GoHighLevel", icon:"🚀" },
  { id:"manychat",    label:"ManyChat",    icon:"💬" },
  { id:"others",      label:"Others",      icon:"📌" },
];
const DEFAULT_TYPES = [
  { id:"educational", label:"Educational",        color:"#c0392b" },
  { id:"promotional", label:"Promotional",         color:"#e74c3c" },
  { id:"engagement",  label:"Engagement",          color:"#96281b" },
  { id:"story",       label:"Story/Behind Scenes", color:"#d35400" },
  { id:"reel",        label:"Reel/Video",          color:"#e67e22" },
  { id:"ugc",         label:"UGC/Testimonial",     color:"#cb4335" },
  { id:"automation",  label:"Automation",          color:"#922b21" },
  { id:"follow_up",   label:"Follow-up",           color:"#f1948a" },
  { id:"task",        label:"Task/To-do",          color:"#8a5050" },
];
const DEFAULT_STATUSES = [
  { id:"ready",       label:"Ready",       color:"#c0392b" },
  { id:"draft",       label:"Draft",       color:"#b88080" },
  { id:"posted",      label:"Posted",      color:"#922b21" },
  { id:"done",        label:"Done",        color:"#27ae60" },
  { id:"in progress", label:"In Progress", color:"#e67e22" },
];

const DAYS   = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const COLOR_OPTIONS = ["#c0392b","#e74c3c","#96281b","#d35400","#e67e22","#922b21","#f1948a","#8a5050","#27ae60","#1877F2","#A78BFA","#F472B6","#9CA3AF","#FBBF24"];
const ICON_OPTIONS  = ["📌","🟦","📷","🎵","🚀","💬","📊","📝","🛠","📧","🗓","💡","🔔","🌐"];
const today = new Date();

function getDaysInMonth(y,m){ return new Date(y,m+1,0).getDate(); }
function getFirstDay(y,m){ return new Date(y,m,1).getDay(); }

const SAMPLE = [
  { id:1,  day:1,  platform:"instagram",   type:"educational", status:"ready",       notes:"", title:"3 menu pricing mistakes hurting your margins" },
  { id:2,  day:1,  platform:"facebook",    type:"promotional", status:"ready",       notes:"", title:"Flash Sale — 20% Off This Weekend" },
  { id:3,  day:3,  platform:"tiktok",      type:"story",       status:"ready",       notes:"", title:"Behind the scenes: morning prep" },
  { id:4,  day:5,  platform:"gohighlevel", type:"automation",  status:"ready",       notes:"", title:"Set up lead nurture sequence" },
  { id:5,  day:7,  platform:"manychat",    type:"follow_up",   status:"draft",       notes:"", title:"DM flow for new Instagram followers" },
  { id:6,  day:10, platform:"gohighlevel", type:"task",        status:"in progress", notes:"", title:"Update pipeline stages for restaurant leads" },
  { id:7,  day:14, platform:"facebook",    type:"educational", status:"ready",       notes:"", title:"Email marketing tips for restaurants" },
  { id:8,  day:21, platform:"gohighlevel", type:"follow_up",   status:"ready",       notes:"", title:"Send SMS follow-up to last week's leads" },
];

// Inline editable row for settings
function EditableRow({ item, onSave, onDelete, hasIcon, colorOptions, iconOptions }) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(item.label);
  const [color, setColor] = useState(item.color || "#c0392b");
  const [icon,  setIcon]  = useState(item.icon  || "📌");

  function handleSave() {
    if (!label.trim()) return;
    onSave({ ...item, label, ...(hasIcon ? { icon } : { color }) });
    setEditing(false);
  }

  const inp = { background:"#fff", border:`1px solid #d4b0b0`, borderRadius:6, color:"#2d1515", padding:"5px 8px", fontSize:13, boxSizing:"border-box" };

  if (!editing) return (
    <div style={{ display:"flex", alignItems:"center", gap:8, background:C.surface, borderRadius:8, padding:"8px 12px" }}>
      {hasIcon
        ? <span style={{ fontSize:18 }}>{item.icon}</span>
        : <span style={{ width:12, height:12, borderRadius:"50%", background:item.color, display:"inline-block", flexShrink:0 }}/>
      }
      <span style={{ flex:1, fontSize:13, color:C.text }}>{item.label}</span>
      <button onClick={()=>setEditing(true)} style={{ background:"none", border:`1px solid ${C.border2}`, borderRadius:6, padding:"2px 10px", color:C.textSub, cursor:"pointer", fontSize:11 }}>Edit</button>
      <button onClick={onDelete} style={{ background:"none", border:`1px solid #f1948a`, borderRadius:6, padding:"2px 10px", color:"#e74c3c", cursor:"pointer", fontSize:11 }}>✕</button>
    </div>
  );

  return (
    <div style={{ background:"#fff", border:`1px solid ${C.border2}`, borderRadius:8, padding:"10px 12px", display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        {hasIcon ? (
          <select value={icon} onChange={e=>setIcon(e.target.value)} style={{ ...inp, width:52, textAlign:"center" }}>
            {iconOptions.map(ic=><option key={ic}>{ic}</option>)}
          </select>
        ) : (
          <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{ width:36, height:36, border:`1px solid ${C.border2}`, borderRadius:6, cursor:"pointer", padding:2 }}/>
        )}
        <input value={label} onChange={e=>setLabel(e.target.value)} style={{ ...inp, flex:1 }}/>
      </div>
      {!hasIcon && (
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {colorOptions.map(c=>(
            <div key={c} onClick={()=>setColor(c)}
              style={{ width:18, height:18, borderRadius:"50%", background:c, cursor:"pointer", border:color===c?`2px solid #2d1515`:"2px solid transparent" }}/>
          ))}
        </div>
      )}
      <div style={{ display:"flex", gap:6 }}>
        <button onClick={handleSave} style={{ flex:1, padding:"6px", background:C.primary, color:"#fff", border:"none", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:500 }}>Save</button>
        <button onClick={()=>{ setLabel(item.label); setColor(item.color||"#c0392b"); setIcon(item.icon||"📌"); setEditing(false); }}
          style={{ padding:"6px 12px", background:"none", border:`1px solid ${C.border2}`, borderRadius:7, cursor:"pointer", color:C.textMute, fontSize:13 }}>Cancel</button>
      </div>
    </div>
  );
}

export default function App() {
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [posts, setPosts]       = useState({});
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);
  const [types, setTypes]         = useState(DEFAULT_TYPES);
  const [statuses, setStatuses]   = useState(DEFAULT_STATUSES);
  const [modal, setModal]   = useState(false);
  const [settingsTab, setSettingsTab] = useState("category");
  const [form, setForm]     = useState({ title:"", platform:"instagram", type:"task", status:"ready", notes:"" });
  const [newCat,  setNewCat]  = useState({ label:"", icon:"📌" });
  const [newType, setNewType] = useState({ label:"", color:"#c0392b" });
  const [newStat, setNewStat] = useState({ label:"", color:"#c0392b" });
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [editId, setEditId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [view, setView]     = useState("calendar");
  const [summaryDate, setSummaryDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`
  );

  useEffect(()=>{
    (async()=>{
      try {
        const r = await window.storage.get("rroi-v5-data");
        if(r){ const d=JSON.parse(r.value); if(d.posts) setPosts(d.posts); if(d.platforms) setPlatforms(d.platforms); if(d.types) setTypes(d.types); if(d.statuses) setStatuses(d.statuses); }
        else initSample();
      } catch { initSample(); }
      setLoaded(true);
    })();
  },[]);

  function initSample(){ const key=`${today.getFullYear()}-${today.getMonth()}`; const map={[key]:SAMPLE}; setPosts(map); save(map,DEFAULT_PLATFORMS,DEFAULT_TYPES,DEFAULT_STATUSES); }
  async function save(p=posts,pl=platforms,ty=types,st=statuses){ try{ await window.storage.set("rroi-v5-data",JSON.stringify({posts:p,platforms:pl,types:ty,statuses:st})); }catch{} }

  function platformMeta(id){ return platforms.find(x=>x.id===id)||{icon:"📌",label:id,color:"#8a5050"}; }
  function typeMeta(id){ return types.find(x=>x.id===id)||{label:id,color:"#8a5050"}; }
  function statusMeta(id){ return statuses.find(x=>x.id===id)||{label:id,color:"#8a5050"}; }

  function monthKey(y=year,m=month){ return `${y}-${m}`; }
  function getMonthPosts(){ return posts[monthKey()]||[]; }
  function filteredDay(d){ return getMonthPosts().filter(p=>p.day===d&&(filterPlatform==="all"||p.platform===filterPlatform)); }
  function getSummaryPosts(){ const [sy,sm,sd]=summaryDate.split("-").map(Number); return (posts[`${sy}-${sm-1}`]||[]).filter(p=>p.day===sd&&(filterPlatform==="all"||p.platform===filterPlatform)); }

  function stats(){ const all=getMonthPosts(); const counts={}; platforms.forEach(p=>{ counts[p.id]=all.filter(x=>x.platform===p.id).length; }); return { total:all.length, done:all.filter(p=>p.status==="posted"||p.status==="done").length, ready:all.filter(p=>p.status==="ready").length, ...counts }; }

  function openAdd(day){ setSelectedDay(day); setForm({title:"",platform:platforms[0]?.id||"others",type:types[0]?.id||"task",status:statuses[0]?.id||"ready",notes:""}); setEditId(null); setModal("task"); }
  function openEdit(post){ setSelectedDay(post.day); setForm({title:post.title,platform:post.platform,type:post.type,status:post.status,notes:post.notes||""}); setEditId(post.id); setModal("task"); }
  function savePost(){ if(!form.title.trim()) return; const key=monthKey(); const list=[...(posts[key]||[])]; if(editId!==null){ const i=list.findIndex(p=>p.id===editId); if(i>-1) list[i]={...list[i],...form}; } else list.push({id:Date.now(),day:selectedDay,...form}); const upd={...posts,[key]:list}; setPosts(upd); save(upd); setModal(false); }
  function deletePost(id){ const key=monthKey(); const list=(posts[key]||[]).filter(p=>p.id!==id); const upd={...posts,[key]:list}; setPosts(upd); save(upd); setModal(false); }
  function toggleStatus(post){ const ids=statuses.map(s=>s.id); const next=ids[(ids.indexOf(post.status)+1)%ids.length]; const [sy,sm]=summaryDate.split("-").map(Number); const key=`${sy}-${sm-1}`; const list=[...(posts[key]||[])]; const i=list.findIndex(p=>p.id===post.id); if(i>-1) list[i]={...list[i],status:next}; const upd={...posts,[key]:list}; setPosts(upd); save(upd); }

  // Categories
  function addCategory(){ if(!newCat.label.trim()) return; const id="cat_"+Date.now(); const upd=[...platforms,{id,label:newCat.label,icon:newCat.icon}]; setPlatforms(upd); save(posts,upd,types,statuses); setNewCat({label:"",icon:"📌"}); }
  function saveCategory(item){ const upd=platforms.map(p=>p.id===item.id?item:p); setPlatforms(upd); save(posts,upd,types,statuses); }
  function delCategory(id){ const upd=platforms.filter(p=>p.id!==id); setPlatforms(upd); save(posts,upd,types,statuses); }
  // Types
  function addType(){ if(!newType.label.trim()) return; const id="typ_"+Date.now(); const upd=[...types,{id,label:newType.label,color:newType.color}]; setTypes(upd); save(posts,platforms,upd,statuses); setNewType({label:"",color:"#c0392b"}); }
  function saveType(item){ const upd=types.map(t=>t.id===item.id?item:t); setTypes(upd); save(posts,platforms,upd,statuses); }
  function delType(id){ const upd=types.filter(t=>t.id!==id); setTypes(upd); save(posts,platforms,upd,statuses); }
  // Statuses
  function addStatus(){ if(!newStat.label.trim()) return; const id="sta_"+Date.now(); const upd=[...statuses,{id,label:newStat.label,color:newStat.color}]; setStatuses(upd); save(posts,platforms,types,upd); setNewStat({label:"",color:"#c0392b"}); }
  function saveStatus(item){ const upd=statuses.map(s=>s.id===item.id?item:s); setStatuses(upd); save(posts,platforms,types,upd); }
  function delStatus(id){ const upd=statuses.filter(s=>s.id!==id); setStatuses(upd); save(posts,platforms,types,upd); }

  function prevMonth(){ if(month===0){setYear(y=>y-1);setMonth(11);}else setMonth(m=>m-1); }
  function nextMonth(){ if(month===11){setYear(y=>y+1);setMonth(0);}else setMonth(m=>m+1); }

  const daysInMonth=getDaysInMonth(year,month); const firstDay=getFirstDay(year,month);
  const cells=[]; for(let i=0;i<firstDay;i++) cells.push(null); for(let d=1;d<=daysInMonth;d++) cells.push(d); while(cells.length%7!==0) cells.push(null);

  const s=stats();
  const isToday=d=>d&&year===today.getFullYear()&&month===today.getMonth()&&d===today.getDate();
  const summaryPosts=getSummaryPosts();
  const [sY,sM,sD]=summaryDate.split("-").map(Number);
  const summaryLabel=`${MONTHS[sM-1]} ${sD}, ${sY}`;
  const isDateToday=summaryDate===`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  const inp={ background:C.surface, border:`1px solid ${C.border2}`, borderRadius:6, color:C.text, padding:"7px 10px", width:"100%", boxSizing:"border-box", fontSize:14 };
  const btnFilter=(active)=>({ padding:"5px 13px", borderRadius:20, fontSize:12, cursor:"pointer", border:active?`1.5px solid ${C.primary}`:`1px solid ${C.border}`, background:active?C.tag:"transparent", color:active?C.primary:C.textMute });

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.text, fontFamily:"var(--font-sans)", padding:"1rem" }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.primary} 0%,${C.primaryD} 100%)`, borderRadius:12, padding:"1rem 1.25rem", marginBottom:"1.25rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontSize:22,fontWeight:500,color:"#fff" }}>Restaurant<span style={{color:"#ffcdd2"}}>ROI</span></div>
          <div style={{ fontSize:12,color:"#ffcdd2",marginTop:2 }}>Task & Content Calendar</div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap" }}>
          <span style={{ fontSize:12,color:"#ffcdd2",display:"flex",alignItems:"center",gap:5 }}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#a5d6a7",display:"inline-block"}}/>{loaded?"Loaded":"Loading..."}
          </span>
          <div style={{ display:"flex",border:"1px solid rgba(255,255,255,0.3)",borderRadius:8,overflow:"hidden" }}>
            <button onClick={()=>setView("calendar")} style={{ padding:"6px 14px",background:view==="calendar"?"rgba(255,255,255,0.2)":"transparent",border:"none",color:"#fff",cursor:"pointer",fontSize:12 }}>📅 Calendar</button>
            <button onClick={()=>setView("summary")}  style={{ padding:"6px 14px",background:view==="summary" ?"rgba(255,255,255,0.2)":"transparent",border:"none",color:"#fff",cursor:"pointer",fontSize:12 }}>📋 Summary</button>
          </div>
          <button onClick={prevMonth} style={{ background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:8,padding:"6px 12px",color:"#fff",cursor:"pointer" }}>‹</button>
          <span style={{ fontWeight:500,fontSize:16,color:"#fff",minWidth:140,textAlign:"center" }}>{MONTHS[month]} {year}</span>
          <button onClick={nextMonth} style={{ background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:8,padding:"6px 12px",color:"#fff",cursor:"pointer" }}>›</button>
          <button onClick={()=>{ setSettingsTab("category"); setModal("settings"); }} style={{ background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:8,padding:"7px 12px",color:"#fff",cursor:"pointer",fontSize:13 }}>⚙️</button>
          <button onClick={()=>openAdd(today.getDate())} style={{ background:"#fff",border:"none",borderRadius:8,padding:"7px 16px",color:C.primary,cursor:"pointer",fontWeight:500,fontSize:13 }}>+ Add Task</button>
        </div>
      </div>

      {/* Platform filter */}
      <div style={{ display:"flex",gap:6,marginBottom:"1rem",flexWrap:"wrap" }}>
        <button onClick={()=>setFilterPlatform("all")} style={btnFilter(filterPlatform==="all")}>All</button>
        {platforms.map(p=><button key={p.id} onClick={()=>setFilterPlatform(p.id)} style={btnFilter(filterPlatform===p.id)}>{p.icon} {p.label}</button>)}
      </div>

      {/* Legend */}
      <div style={{ display:"flex",gap:12,marginBottom:"1rem",flexWrap:"wrap" }}>
        {types.map(t=>(
          <div key={t.id} style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.textMute }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:t.color,display:"inline-block" }}/>{t.label}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display:"flex",gap:6,marginBottom:"1.25rem",flexWrap:"wrap" }}>
        {[{label:"Total",value:s.total},{label:"Done",value:s.done},{label:"Ready",value:s.ready},...platforms.map(p=>({label:`${p.icon} ${p.label}`,value:s[p.id]||0}))].map(st=>(
          <div key={st.label} style={{ background:C.tag,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px",fontSize:12,whiteSpace:"nowrap" }}>
            {st.label}: <span style={{color:C.primary,fontWeight:500}}>{st.value}</span>
          </div>
        ))}
      </div>

      {/* CALENDAR */}
      {view==="calendar"&&(
        <>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:C.primary,borderRadius:"8px 8px 0 0",overflow:"hidden",marginBottom:1 }}>
            {DAYS.map(d=><div key={d} style={{ textAlign:"center",fontSize:11,color:"#ffcdd2",padding:"8px 0",fontWeight:500,letterSpacing:1 }}>{d}</div>)}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,background:C.border,border:`1px solid ${C.border}`,borderRadius:"0 0 8px 8px",overflow:"hidden" }}>
            {cells.map((d,i)=>{
              const dayPosts=d?filteredDay(d):[];
              const tod=isToday(d);
              return (
                <div key={i} onClick={()=>{ if(!d)return; setSelectedDay(d); setSummaryDate(`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`); setView("summary"); }}
                  style={{ background:tod?C.tag:C.bg,border:tod?`2px solid ${C.primary}`:"none",minHeight:88,padding:"7px 7px 5px",cursor:d?"pointer":"default" }}>
                  {d&&(
                    <>
                      <div style={{ width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",fontSize:12,fontWeight:tod?500:400,background:tod?C.primary:"transparent",color:tod?"#fff":C.textSub,marginBottom:4 }}>{d}</div>
                      <div style={{ display:"flex",flexDirection:"column",gap:2 }}>
                        {dayPosts.slice(0,3).map(post=>{ const pm=platformMeta(post.platform); const ct=typeMeta(post.type); return (
                          <div key={post.id} onClick={e=>{e.stopPropagation();openEdit(post);}}
                            style={{ fontSize:10,padding:"2px 5px",borderRadius:3,background:ct.color+"18",color:ct.color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer",border:`1px solid ${ct.color}30` }}>
                            {pm.icon} {pm.label} {post.title}
                          </div>
                        );})}
                        {dayPosts.length>3&&<div style={{fontSize:10,color:C.textMute}}>+{dayPosts.length-3} more</div>}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <p style={{fontSize:12,color:C.textMute,marginTop:8,textAlign:"center"}}>Click any day to open its summary</p>
        </>
      )}

      {/* SUMMARY */}
      {view==="summary"&&(
        <div style={{marginTop:"0.25rem"}}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem",flexWrap:"wrap" }}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:13,color:C.textSub}}>Date:</span>
              <input type="date" value={summaryDate} onChange={e=>setSummaryDate(e.target.value)} style={{...inp,width:"auto",padding:"5px 10px",fontSize:13}}/>
            </div>
            <button onClick={()=>setSummaryDate(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`)}
              style={{fontSize:12,padding:"5px 12px",background:C.tag,border:`1px solid ${C.border}`,borderRadius:8,color:C.primary,cursor:"pointer"}}>Today</button>
            <span style={{fontSize:15,fontWeight:500,color:C.text}}>{isDateToday?"📅 Today — ":""}{summaryLabel}</span>
            <span style={{fontSize:12,color:C.textMute,marginLeft:"auto"}}>{summaryPosts.length} task{summaryPosts.length!==1?"s":""}</span>
          </div>
          {summaryPosts.length===0?(
            <div style={{textAlign:"center",padding:"3rem 0",color:C.textMute}}>
              <div style={{fontSize:32,marginBottom:8}}>📭</div>
              <div style={{fontSize:14}}>No tasks for this date.</div>
              <button onClick={()=>{ const[sy,sm,sd]=summaryDate.split("-").map(Number); setYear(sy);setMonth(sm-1);openAdd(sd); }}
                style={{marginTop:16,fontSize:13,padding:"7px 18px",background:C.tag,border:`1.5px solid ${C.primary}`,borderRadius:8,color:C.primary,cursor:"pointer"}}>+ Add a task</button>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.textSub,marginBottom:8}}>
                  <span style={{fontWeight:500}}>Progress</span>
                  <span>{summaryPosts.filter(p=>p.status==="done"||p.status==="posted").length} / {summaryPosts.length} done</span>
                </div>
                <div style={{background:C.border,borderRadius:99,height:8,overflow:"hidden"}}>
                  <div style={{width:`${Math.round(summaryPosts.filter(p=>p.status==="done"||p.status==="posted").length/summaryPosts.length*100)}%`,height:"100%",background:C.primary,borderRadius:99,transition:"width 0.3s"}}/>
                </div>
              </div>
              {statuses.map(st=>{ const group=summaryPosts.filter(p=>p.status===st.id); if(!group.length) return null; return (
                <div key={st.id}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:st.color,display:"inline-block"}}/>
                    <span style={{fontSize:12,color:st.color,fontWeight:500}}>{st.label}</span>
                    <span style={{fontSize:11,color:C.textMute}}>({group.length})</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {group.map(post=>{ const pm=platformMeta(post.platform); const ct=typeMeta(post.type); return (
                      <div key={post.id} style={{display:"flex",alignItems:"flex-start",gap:10,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
                        <div style={{width:3,borderRadius:99,alignSelf:"stretch",background:ct.color,flexShrink:0,minHeight:36}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:500,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{post.title}</div>
                          <div style={{fontSize:11,color:C.textSub,marginTop:2}}>{pm.icon} {pm.label} · {ct.label}</div>
                          {post.notes&&<div style={{fontSize:11,color:C.textMute,marginTop:4,fontStyle:"italic"}}>📝 {post.notes}</div>}
                        </div>
                        <button onClick={()=>toggleStatus(post)}
                          style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:st.color+"18",color:st.color,border:`1px solid ${st.color}`,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{st.label}</button>
                        <button onClick={()=>openEdit(post)} style={{background:"none",border:`1px solid ${C.border2}`,borderRadius:6,padding:"4px 10px",color:C.textSub,cursor:"pointer",fontSize:12,flexShrink:0}}>Edit</button>
                      </div>
                    );})}
                  </div>
                </div>
              );})}
              <button onClick={()=>{ const[sy,sm,sd]=summaryDate.split("-").map(Number); setYear(sy);setMonth(sm-1);openAdd(sd); }}
                style={{alignSelf:"flex-start",fontSize:13,padding:"7px 18px",background:C.tag,border:`1.5px solid ${C.primary}`,borderRadius:8,color:C.primary,cursor:"pointer"}}>+ Add task to this day</button>
            </div>
          )}
        </div>
      )}

      {/* TASK MODAL */}
      {modal==="task"&&(
        <div style={{position:"fixed",inset:0,background:"rgba(45,21,21,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setModal(false)}>
          <div style={{background:C.bg,border:`1px solid ${C.border2}`,borderRadius:12,padding:"1.5rem",width:360,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 8px 40px rgba(192,57,43,0.12)"}} onClick={e=>e.stopPropagation()}>
            <div style={{height:4,background:C.primary,borderRadius:"4px 4px 0 0",margin:"-1.5rem -1.5rem 1.25rem"}}/>
            <h3 style={{margin:"0 0 1rem",fontWeight:500,fontSize:15,color:C.text}}>{editId?"Edit Task":`Add Task — ${MONTHS[month]} ${selectedDay}`}</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div><label style={{fontSize:12,color:C.textSub,display:"block",marginBottom:4}}>Title</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Task or post title" style={inp}/></div>
              <div><label style={{fontSize:12,color:C.textSub,display:"block",marginBottom:4}}>Category</label>
                <select value={form.platform} onChange={e=>setForm(f=>({...f,platform:e.target.value}))} style={inp}>
                  {platforms.map(p=><option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
                </select>
              </div>
              <div><label style={{fontSize:12,color:C.textSub,display:"block",marginBottom:4}}>Type</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={inp}>
                  {types.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div><label style={{fontSize:12,color:C.textSub,display:"block",marginBottom:4}}>Status</label>
                <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} style={inp}>
                  {statuses.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div><label style={{fontSize:12,color:C.textSub,display:"block",marginBottom:4}}>Notes</label>
                <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Add any notes or details…" rows={3} style={{...inp,resize:"vertical",lineHeight:1.5}}/>
              </div>
              <div style={{display:"flex",gap:8,marginTop:4}}>
                <button onClick={savePost} style={{flex:1,padding:"9px",background:C.primary,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500,fontSize:14}}>{editId?"Save":"Add"}</button>
                {editId&&<button onClick={()=>deletePost(editId)} style={{padding:"9px 14px",background:"transparent",border:`1px solid ${C.primaryL}`,borderRadius:8,cursor:"pointer",color:C.primaryL,fontSize:14}}>Delete</button>}
                <button onClick={()=>setModal(false)} style={{padding:"9px 14px",background:"transparent",border:`1px solid ${C.border2}`,borderRadius:8,cursor:"pointer",color:C.textMute,fontSize:14}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {modal==="settings"&&(
        <div style={{position:"fixed",inset:0,background:"rgba(45,21,21,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setModal(false)}>
          <div style={{background:C.bg,border:`1px solid ${C.border2}`,borderRadius:12,width:420,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 8px 40px rgba(192,57,43,0.12)"}} onClick={e=>e.stopPropagation()}>
            <div style={{height:4,background:C.primary,borderRadius:"4px 4px 0 0",flexShrink:0}}/>
            <div style={{padding:"1.25rem 1.5rem",overflowY:"auto",flex:1}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
                <h3 style={{margin:0,fontWeight:500,fontSize:15,color:C.text}}>⚙️ Manage Options</h3>
                <button onClick={()=>setModal(false)} style={{background:"none",border:"none",color:C.textMute,cursor:"pointer",fontSize:18}}>✕</button>
              </div>
              {/* Tabs */}
              <div style={{display:"flex",gap:4,marginBottom:"1.25rem",background:C.surface,borderRadius:8,padding:4}}>
                {[{id:"category",label:"Categories"},{id:"type",label:"Types"},{id:"status",label:"Statuses"}].map(t=>(
                  <button key={t.id} onClick={()=>setSettingsTab(t.id)}
                    style={{flex:1,padding:"6px",borderRadius:6,border:"none",background:settingsTab===t.id?"#fff":"transparent",color:settingsTab===t.id?C.primary:C.textMute,cursor:"pointer",fontSize:12,fontWeight:settingsTab===t.id?500:400,boxShadow:settingsTab===t.id?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Categories */}
              {settingsTab==="category"&&(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {platforms.map(p=>(
                    <EditableRow key={p.id} item={p} hasIcon onSave={saveCategory} onDelete={()=>delCategory(p.id)} colorOptions={COLOR_OPTIONS} iconOptions={ICON_OPTIONS}/>
                  ))}
                  <div style={{display:"flex",gap:6,marginTop:6}}>
                    <select value={newCat.icon} onChange={e=>setNewCat(n=>({...n,icon:e.target.value}))} style={{...inp,width:54,padding:"7px 4px",textAlign:"center"}}>
                      {ICON_OPTIONS.map(ic=><option key={ic}>{ic}</option>)}
                    </select>
                    <input value={newCat.label} onChange={e=>setNewCat(n=>({...n,label:e.target.value}))} placeholder="New category name" style={{...inp,flex:1}}/>
                    <button onClick={addCategory} style={{padding:"7px 14px",background:C.primary,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500,fontSize:13}}>Add</button>
                  </div>
                </div>
              )}

              {/* Types */}
              {settingsTab==="type"&&(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {types.map(t=>(
                    <EditableRow key={t.id} item={t} hasIcon={false} onSave={saveType} onDelete={()=>delType(t.id)} colorOptions={COLOR_OPTIONS} iconOptions={ICON_OPTIONS}/>
                  ))}
                  <div style={{display:"flex",gap:6,marginTop:6}}>
                    <input type="color" value={newType.color} onChange={e=>setNewType(n=>({...n,color:e.target.value}))} style={{width:38,height:38,border:`1px solid ${C.border2}`,borderRadius:6,cursor:"pointer",padding:2}}/>
                    <input value={newType.label} onChange={e=>setNewType(n=>({...n,label:e.target.value}))} placeholder="New type name" style={{...inp,flex:1}}/>
                    <button onClick={addType} style={{padding:"7px 14px",background:C.primary,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500,fontSize:13}}>Add</button>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:2}}>
                    {COLOR_OPTIONS.map(c=><div key={c} onClick={()=>setNewType(n=>({...n,color:c}))} style={{width:18,height:18,borderRadius:"50%",background:c,cursor:"pointer",border:newType.color===c?`2px solid #2d1515`:"2px solid transparent"}}/>)}
                  </div>
                </div>
              )}

              {/* Statuses */}
              {settingsTab==="status"&&(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {statuses.map(st=>(
                    <EditableRow key={st.id} item={st} hasIcon={false} onSave={saveStatus} onDelete={()=>delStatus(st.id)} colorOptions={COLOR_OPTIONS} iconOptions={ICON_OPTIONS}/>
                  ))}
                  <div style={{display:"flex",gap:6,marginTop:6}}>
                    <input type="color" value={newStat.color} onChange={e=>setNewStat(n=>({...n,color:e.target.value}))} style={{width:38,height:38,border:`1px solid ${C.border2}`,borderRadius:6,cursor:"pointer",padding:2}}/>
                    <input value={newStat.label} onChange={e=>setNewStat(n=>({...n,label:e.target.value}))} placeholder="New status name" style={{...inp,flex:1}}/>
                    <button onClick={addStatus} style={{padding:"7px 14px",background:C.primary,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500,fontSize:13}}>Add</button>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:2}}>
                    {COLOR_OPTIONS.map(c=><div key={c} onClick={()=>setNewStat(n=>({...n,color:c}))} style={{width:18,height:18,borderRadius:"50%",background:c,cursor:"pointer",border:newStat.color===c?`2px solid #2d1515`:"2px solid transparent"}}/>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
