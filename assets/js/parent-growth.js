(function(){
'use strict';
if(window.TitanV21Parent) return;
function $(id){return document.getElementById(id)}
function db(){try{return window.firebase&&firebase.database&&firebase.database()}catch(e){return null}}
function auth(){try{return window.firebase&&firebase.auth&&firebase.auth()}catch(e){return null}}
function user(){try{return auth()&&auth().currentUser}catch(e){return null}}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function now(){return Date.now()} function ar(){try{return new Date().toLocaleString('ar-EG')}catch(e){return new Date().toISOString()}}
async function once(path){const d=db(); if(!d) return null; const s=await d.ref(path).once('value'); return s.val()}
async function push(path,data){const d=db(); if(!d) throw new Error('db not ready'); return d.ref(path).push(data)}
async function set(path,data){const d=db(); if(!d) throw new Error('db not ready'); return d.ref(path).set(data)}
function inject(){if($('v21-parent-box')) return; const app=$('app')||document.body; app.insertAdjacentHTML('beforeend','<div id="v21-parent-box"><div class="card"><h3><i class="fas fa-calendar-days"></i> التقويم والإعلانات</h3><div id="v21-parent-events" class="v21-muted">جاري التحميل...</div><div id="v21-parent-ann"></div></div><div class="card"><h3><i class="fas fa-message"></i> رسالة للإدارة</h3><div id="v21-parent-chat" class="v21-chat"></div><div class="v21-tools"><input id="v21-parent-msg" placeholder="اكتب رسالة للإدارة"><button class="v21-btn" onclick="TitanV21Parent.send()"><i class="fas fa-paper-plane"></i> إرسال</button></div></div></div>'); setTimeout(load,500)}
async function load(){await Promise.all([loadEvents(),loadAnn(),loadChat()])}
async function loadEvents(){const data=await once('growth_calendar')||{}; if($('v21-parent-events')) $('v21-parent-events').innerHTML=Object.values(data).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))).slice(0,8).map(e=>'<div class="v21-event"><div class="v21-event-date">'+esc(e.date||'-')+'</div><div><b>'+esc(e.title)+'</b><div class="v21-muted">'+esc(e.type||'event')+'</div></div></div>').join('')||'<div class="v21-empty">لا توجد أحداث.</div>'}
async function loadAnn(){const data=await once('growth_announcements')||{}; if($('v21-parent-ann')) $('v21-parent-ann').innerHTML=Object.values(data).filter(a=>a.active!==false).slice(-3).reverse().map(a=>'<div class="v21-file-card"><div><b>'+esc(a.title)+'</b><div class="v21-muted">'+esc(a.body||'')+'</div></div></div>').join('')}
function chatId(){const u=user(); return u?'parent_'+u.uid:'parent_guest'}
async function loadChat(){const id=chatId(); const c=await once('private_chats/'+id)||{}; const msgs=c.messages||{}; if($('v21-parent-chat')) {$('v21-parent-chat').innerHTML=Object.values(msgs).sort((a,b)=>(a.at||0)-(b.at||0)).map(m=>'<div class="v21-msg '+(m.fromRole==='parent'?'mine':'other')+'"><b>'+esc(m.fromRole==='parent'?'أنت':'الإدارة')+'</b><br>'+esc(m.text)+'<small>'+esc(m.when||'')+'</small></div>').join('')||'<div class="v21-empty">ابدأ محادثة مع الإدارة.</div>'; $('v21-parent-chat').scrollTop=$('v21-parent-chat').scrollHeight}}
async function send(){const u=user(); if(!u) return alert('سجل الدخول أولاً'); const text=($('v21-parent-msg')&&$('v21-parent-msg').value||'').trim(); if(!text) return; const id=chatId(); await set('private_chats/'+id+'/participants/'+u.uid,true); await set('private_chats/'+id+'/studentName','ولي أمر'); await push('private_chats/'+id+'/messages',{text,from:u.uid,fromRole:'parent',at:now(),when:ar()}); await set('private_chats/'+id+'/lastMessage',text); await set('private_chats/'+id+'/updatedAt',now()); $('v21-parent-msg').value=''; loadChat()}
window.TitanV21Parent={load,send};
document.addEventListener('DOMContentLoaded',function(){setTimeout(inject,1200);setTimeout(inject,3000)});
})();
