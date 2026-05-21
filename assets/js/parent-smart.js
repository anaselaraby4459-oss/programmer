(function(){
'use strict';
if(window.TitanSmartParent) return;
function $(id){return document.getElementById(id)}
function db(){try{return window.db || (window.firebase&&firebase.database&&firebase.database())}catch(e){return null}}
function auth(){try{return window.auth || (window.firebase&&firebase.auth&&firebase.auth())}catch(e){return null}}
function user(){try{return auth()&&auth().currentUser}catch(e){return null}}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function now(){return Date.now()} function ar(){try{return new Date().toLocaleString('ar-EG')}catch(e){return new Date().toISOString()}}
async function once(path){var d=db(); if(!d) return null; var s=await d.ref(path).once('value'); return s.val()}
async function set(path,data){var d=db(); if(!d) return; return d.ref(path).set(data)}
async function push(path,data){var d=db(); if(!d) return; return d.ref(path).push(data)}
function inject(){var app=$('app'); if(!app||$('smart-parent-chat')) return; app.insertAdjacentHTML('beforeend','<div id="smart-parent-chat" class="card"><h3><i class="fas fa-comments"></i> تواصل خاص مع الإدارة</h3><div id="smart-parent-chat-messages" class="titan-chat-messages"><div class="titan-smart-empty">لا توجد رسائل بعد.</div></div><textarea id="smart-parent-chat-text" placeholder="اكتب رسالة للإدارة..."></textarea><button class="titan-smart-btn" onclick="TitanSmartParent.sendChat()">إرسال</button></div>'); setTimeout(loadChat,700)}
async function loadChat(){var u=user(); if(!u||!$('smart-parent-chat-messages')) return; var id='student_'+u.uid; var data=await once('private_chats/'+id+'/messages')||{}; var msgs=Object.values(data).sort(function(a,b){return (a.at||0)-(b.at||0)}); $('smart-parent-chat-messages').innerHTML=msgs.length?msgs.map(function(m){var me=m.from===u.uid; return '<div class="titan-chat-msg '+(me?'me':'')+'">'+esc(m.text||'')+'<small>'+esc(m.when||'')+'</small></div>'}).join(''):'<div class="titan-smart-empty">يمكنك إرسال رسالة للإدارة من هنا.</div>'; $('smart-parent-chat-messages').scrollTop=$('smart-parent-chat-messages').scrollHeight}
async function sendChat(){var u=user(); if(!u) return alert('سجل الدخول أولاً'); var text=($('smart-parent-chat-text')&&$('smart-parent-chat-text').value||'').trim(); if(!text) return; var id='student_'+u.uid; await set('private_chats/'+id+'/participants/'+u.uid,true); await set('private_chats/'+id+'/updatedAt',now()); await set('private_chats/'+id+'/lastMessage',text); await push('private_chats/'+id+'/messages',{text:text,from:u.uid,fromRole:'parent',at:now(),when:ar()}); $('smart-parent-chat-text').value=''; loadChat()}
window.TitanSmartParent={sendChat:sendChat,loadChat:loadChat}; document.addEventListener('DOMContentLoaded',function(){setTimeout(inject,1000);setTimeout(inject,2500)});
})();
