(function(){
  'use strict';
  if(window.ProgrammersUtils) return;
  function esc(v){return String(v == null ? '' : v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function showMessage(message, type){
    try{
      var el=document.getElementById('programmers-toast');
      if(!el){ el=document.createElement('div'); el.id='programmers-toast'; el.setAttribute('role','status'); document.body.appendChild(el); }
      el.className='programmers-toast show ' + (type || 'info');
      el.innerHTML=esc(message || 'تم تنفيذ العملية');
      clearTimeout(el._timer); el._timer=setTimeout(function(){el.classList.remove('show');}, type === 'error' ? 7000 : 3500);
    }catch(e){ try{ alert(message); }catch(_){} }
  }
  function db(){ try{return window.db || (window.firebase && firebase.database && firebase.database());}catch(e){return null;} }
  function auth(){ try{return window.auth || (window.firebase && firebase.auth && firebase.auth());}catch(e){return null;} }
  function tenantPath(child){ return window.ProgrammersTenant ? window.ProgrammersTenant.path(child) : child; }
  function normalizeFirebaseError(err){
    var code = String((err && (err.code || err.message)) || err || '');
    if(code.indexOf('permission-denied') !== -1) return 'ليست لديك صلاحية لتنفيذ هذه العملية.';
    if(code.indexOf('network-request-failed') !== -1 || code.indexOf('offline') !== -1) return 'تعذر الاتصال بالإنترنت. سيتم المحاولة عند عودة الاتصال.';
    if(code.indexOf('wrong-password') !== -1 || code.indexOf('invalid-credential') !== -1 || code.indexOf('user-not-found') !== -1) return 'بيانات الدخول غير صحيحة.';
    if(code.indexOf('too-many-requests') !== -1) return 'محاولات كثيرة. انتظر قليلاً ثم حاول مرة أخرى.';
    return 'تعذر تنفيذ العملية الآن. حاول مرة أخرى.';
  }
  window.ProgrammersUtils = { esc:esc, showMessage:showMessage, db:db, auth:auth, tenantPath:tenantPath, normalizeFirebaseError:normalizeFirebaseError };
})();
