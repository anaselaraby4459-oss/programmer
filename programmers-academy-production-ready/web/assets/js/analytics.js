(function(){
  'use strict';
  if(window.ProgrammersAnalytics) return;
  var sid = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8);
  var started = Date.now();
  var queue = [];
  function db(){return window.ProgrammersUtils && ProgrammersUtils.db ? ProgrammersUtils.db() : null;}
  function auth(){return window.ProgrammersUtils && ProgrammersUtils.auth ? ProgrammersUtils.auth() : null;}
  function tenantPath(child){return window.ProgrammersUtils && ProgrammersUtils.tenantPath ? ProgrammersUtils.tenantPath(child) : child;}
  function payload(type, data){
    var a = auth(); var u = a && a.currentUser;
    return Object.assign({type:type, page:(document.body&&document.body.dataset.page)||location.pathname.split('/').pop(), sessionId:sid, uid:u&&u.uid||null, at:Date.now(), path:location.pathname, online:navigator.onLine}, data||{});
  }
  function push(type, data){
    var d=db(); var item=payload(type,data);
    if(!d){ queue.push(item); return; }
    d.ref(tenantPath('analytics_events')).push(item).catch(function(){ queue.push(item); });
  }
  function flush(){
    var d=db(); if(!d || !queue.length) return;
    var copy=queue.splice(0,10);
    copy.forEach(function(item){ d.ref(tenantPath('analytics_events')).push(item).catch(function(){ queue.push(item); }); });
  }
  function heartbeat(){
    var d=db(), a=auth(), u=a&&a.currentUser; if(!d || !u) return;
    d.ref(tenantPath('analytics_sessions/'+sid)).update({uid:u.uid,page:(document.body&&document.body.dataset.page)||'',lastSeen:Date.now(),startedAt:started,online:navigator.onLine}).catch(function(){});
    d.ref(tenantPath('active_sessions/'+u.uid)).update({sessionId:sid,lastSeen:Date.now(),page:(document.body&&document.body.dataset.page)||'',online:navigator.onLine}).catch(function(){});
    flush();
  }
  document.addEventListener('click', function(e){
    var btn=e.target.closest && e.target.closest('button,a,.nav-link,[onclick]');
    if(!btn) return;
    var label=(btn.innerText||btn.getAttribute('aria-label')||btn.id||btn.className||'action').trim().slice(0,80);
    push('ui_action', {label:label});
  }, {passive:true});
  document.addEventListener('visibilitychange', function(){ push(document.hidden?'session_hidden':'session_visible', {durationMs:Date.now()-started}); heartbeat(); });
  window.addEventListener('beforeunload', function(){ try{ push('session_end',{durationMs:Date.now()-started}); heartbeat(); }catch(_){} });
  setInterval(heartbeat, 30000);
  setTimeout(function(){ push('session_start'); heartbeat(); }, 1800);
  window.ProgrammersAnalytics={track:push, heartbeat:heartbeat, sessionId:sid};
})();
