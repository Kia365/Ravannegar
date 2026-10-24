const sections = [
["ID","مشخصات بیمار (ID)","سن، جنس، وضعیت تأهل و اطلاعات ضروری؛ از شناسهٔ مستقیم در نسخهٔ آزمایشی پرهیز کن."],
["CC","شکایت اصلی (CC)","علت مراجعه، ترجیحاً با عبارت خود بیمار."],
["ROR","منبع ارجاع و قابلیت اعتماد (ROR)","منبع اطلاعات و میزان قابلیت اعتماد؛ اگر ارزیابی نشده، مشخص کن."],
["PI","شرح حال بیماری فعلی (PI)","شروع، سیر، شدت، علائم همراه، عوامل تشدید/تخفیف و تأثیر عملکردی."],
["PPH","سابقهٔ روان‌پزشکی قبلی (PPH)","تشخیص‌ها، بستری‌ها، اقدام به خودکشی، درمان‌ها و پاسخ به درمان."],
["PMH","سابقهٔ پزشکی (PMH)","بیماری‌ها، جراحی‌ها، حساسیت‌ها و سابقهٔ عصبی مرتبط."],
["SH","شرح حال اجتماعی (SH)","تحصیل، شغل، روابط، مسکن، حمایت اجتماعی و مسائل حقوقی مرتبط."],
["DH","سابقهٔ دارویی و مواد (DH)","داروهای فعلی/قبلی، دوز، پایبندی، الکل و سایر مواد."],
["FH","سابقهٔ خانوادگی (FH)","اختلالات روان‌پزشکی، خودکشی و بیماری‌های مهم در خانواده."],
["PH","سابقهٔ شخصی و رشدی (PH)","بارداری/تولد در صورت ارتباط، رشد، کودکی، تحصیل و رویدادهای مهم زندگی."],
["MSE","معاینهٔ وضعیت روانی (MSE)","مشاهدهٔ مستقیم لازم است؛ از روی فایل صوتی به‌تنهایی مواردی مثل ظاهر، رفتار یا تماس چشمی را نتیجه‌گیری نکن."],
["Physical Examination","معاینهٔ فیزیکی","یافته‌های معاینهٔ واقعی؛ موارد انجام‌نشده را نامشخص/انجام‌نشده بنویس."],
["Differential diagnosis","تشخیص‌های افتراقی","فقط فرضیه‌های مستند و قابل بررسی؛ تشخیص نهایی نیازمند ارزیابی بالینی است."],
["Problem List","فهرست مشکلات","مشکلات فعال پزشکی، روان‌پزشکی، عملکردی و ایمنی."],
["Plan","برنامه","ارزیابی‌های بعدی، بررسی خطر، آزمایش‌ها و درمان پیشنهادی برای بازبینی پزشک."]
];
const fieldsEl = document.getElementById("fields");
const saved = (()=>{try{return JSON.parse(localStorage.getItem("ravannegar_form")||"{}")}catch{return {}}})();
const textFields = {};
sections.forEach(([key,title,help])=>{
 const wrap=document.createElement("div");wrap.className="field";
 const label=document.createElement("label");label.htmlFor="f_"+key;
 label.innerHTML=`<span class="code">${key}</span> ${title}`;
 const sub=document.createElement("div");sub.className="sub";sub.textContent=help;
 const ta=document.createElement("textarea");ta.id="f_"+key;ta.rows=3;ta.placeholder="اطلاعات ثبت‌شده یا «نامشخص»…";ta.value=saved[key]||"";
 ta.addEventListener("input",()=>{textFields[key]=ta.value;updateCount();});
 wrap.append(label,sub,ta);fieldsEl.append(wrap);textFields[key]=ta.value;
});
function updateCount(){const n=sections.filter(([k])=>(document.getElementById("f_"+k).value||"").trim()).length;document.getElementById("count").textContent=`${n} از ۱۵ تکمیل`;}
function allData(){const d={};sections.forEach(([k])=>d[k]=document.getElementById("f_"+k).value.trim());return {app:"روان‌نگار",version:1,createdAt:new Date().toISOString(),transcript:document.getElementById("transcript").value.trim(),sections:d};}
function saveLocal(){const d={};sections.forEach(([k])=>d[k]=document.getElementById("f_"+k).value);try{localStorage.setItem("ravannegar_form",JSON.stringify(d));localStorage.setItem("ravannegar_transcript",document.getElementById("transcript").value);setStatus("اطلاعات فرم در حافظهٔ مرورگر ذخیره شد.");}catch{setStatus("ذخیره انجام نشد؛ ممکن است فضای ذخیره‌سازی پر باشد.");}}
function setStatus(s){document.getElementById("status").textContent=s;}
function download(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function asText(){const d=allData();let out="روان‌نگار — پیش‌نویس شرح حال روان‌پزشکی\n";out+="تاریخ خروجی: "+new Date().toLocaleString("fa-IR")+"\n\nمتن مصاحبه:\n"+(d.transcript||"ثبت نشده")+"\n\n";sections.forEach(([k,title])=>out+=`${title} [${k}]\n${d.sections[k]||"نامشخص/ثبت نشده"}\n\n`);out+="یادآوری: تشخیص و برنامه باید توسط پزشک بررسی شوند.\n";return out;}
document.getElementById("transcript").value=localStorage.getItem("ravannegar_transcript")||"";
document.getElementById("saveTranscript").onclick=saveLocal;
document.getElementById("clearTranscript").onclick=()=>{document.getElementById("transcript").value="";saveLocal();};
document.getElementById("exportTxt").onclick=()=>download("ravannegar-report.txt",asText(),"text/plain;charset=utf-8");
document.getElementById("exportJson").onclick=()=>download("ravannegar-report.json",JSON.stringify(allData(),null,2),"application/json");
document.getElementById("clearAll").onclick=()=>{if(confirm("همهٔ متن و بخش‌های فرم پاک شوند؟")){localStorage.removeItem("ravannegar_form");localStorage.removeItem("ravannegar_transcript");document.getElementById("transcript").value="";sections.forEach(([k])=>document.getElementById("f_"+k).value="");updateCount();setStatus("اطلاعات این نسخه پاک شد.");}};
let recorder,stream,chunks=[];
const recordBtn=document.getElementById("recordBtn"),stopBtn=document.getElementById("stopBtn"),playback=document.getElementById("playback");
recordBtn.onclick=async()=>{try{if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){setStatus("ضبط صوت در این مرورگر پشتیبانی نمی‌شود؛ فایل صوتی انتخاب کن.");return;}stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=()=>{const blob=new Blob(chunks,{type:recorder.mimeType||"audio/webm"});playback.src=URL.createObjectURL(blob);playback.hidden=false;stream.getTracks().forEach(t=>t.stop());document.getElementById("recordStatus").textContent="ضبط تمام شد. فایل صوتی فقط در این نشست در دسترس است؛ برای نگهداری، آن را از مرورگر ذخیره کن یا ضبط جدیدی بگیر.";};recorder.start();recordBtn.disabled=true;stopBtn.disabled=false;document.getElementById("recordStatus").textContent="در حال ضبط…";}catch(e){setStatus("دسترسی به میکروفون داده نشد یا صفحه در بستر امن اجرا نمی‌شود.");}};
stopBtn.onclick=()=>{if(recorder&&recorder.state!=="inactive")recorder.stop();recordBtn.disabled=false;stopBtn.disabled=true;};
document.getElementById("audioFile").onchange=e=>{const f=e.target.files?.[0];if(f){playback.src=URL.createObjectURL(f);playback.hidden=false;document.getElementById("recordStatus").textContent=`فایل انتخاب شد: ${f.name}. در این نسخه پیاده‌سازی خودکار صوت فعال نیست.`;}};
updateCount();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
function online(){document.getElementById("offline").textContent=navigator.onLine?"رابط آماده":"حالت آفلاین";}
window.addEventListener("online",online);window.addEventListener("offline",online);online();