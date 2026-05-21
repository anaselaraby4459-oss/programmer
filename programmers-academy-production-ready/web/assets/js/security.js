(function(){
  'use strict';
  if(window.ProgrammersSecurity) return;
  function db(){return window.ProgrammersUtils && ProgrammersUtils.db ? ProgrammersUtils.db() : null;}
  function auth(){return window.ProgrammersUtils && ProgrammersUtils.auth ? ProgrammersUtils.auth() : null;}
  function tenant(){return window.ProgrammersTenant ? window.ProgrammersTenant.id() : (localStorage.getItem('titanTenantId') || 'titan');}
  async function get(path){var d=db(); if(!d) return null; var snap=await d.ref(path).once('value'); return snap.val();}
  async function isAdmin(uid){
    if(!uid) return false;
    var t = tenant();
    var superAdmin = await get('super_admins/' + uid).catch(function(){return false;});
    if(superAdmin === true) return true;
    var admin = await get('tenants/' + t + '/admins/' + uid).catch(function(){return false;});
    return admin === true || admin === 'owner' || admin === 'admin';
  }
  async function isStudent(uid){
    if(!uid) return false;
    var st = await get('tenants/' + tenant() + '/students/' + uid).catch(function(){return null;});
    return !!st;
  }
  function lockPage(message){
    try{
      document.body.classList.add('security-locked');
      var app=document.getElementById('app'); if(app) app.style.display='none';
      var box=document.getElementById('security-lock-box');
      if(!box){box=document.createElement('div'); box.id='security-lock-box'; box.className='security-lock-box'; document.body.appendChild(box);}
      box.innerHTML='<strong>صلاحيات غير كافية</strong><br>' + (window.ProgrammersUtils ? ProgrammersUtils.esc(message) : message);
    }catch(_){ }
  }
  function guard(page){
    var a=auth(); if(!a || !a.onAuthStateChanged) return;
    a.onAuthStateChanged(async function(user){
      try{
        if(!user) return;
        if(page === 'admin' && !(await isAdmin(user.uid))){
          lockPage('لا يمكن لهذا الحساب فتح لوحة الإدارة.');
          try{ await a.signOut(); }catch(_){}
          setTimeout(function(){ location.replace('index.html?tenant=' + encodeURIComponent(tenant())); }, 900);
        }
        if((page === 'student' || page === 'parent') && !(await isStudent(user.uid)) && !(await isAdmin(user.uid))){
          lockPage('هذا الحساب غير مرتبط بطالب داخل هذه الأكاديمية.');
          try{ await a.signOut(); }catch(_){}
        }
      }catch(err){
        if(window.ProgrammersErrorHandling) ProgrammersErrorHandling.notify('تعذر التحقق من الصلاحيات. تحقق من الاتصال ثم أعد المحاولة.', 'error');
      }
    });
  }
  window.ProgrammersSecurity = { guard:guard, isAdmin:isAdmin, isStudent:isStudent };
  document.addEventListener('DOMContentLoaded', function(){
    var p=(document.body && document.body.getAttribute('data-page')) || '';
    setTimeout(function(){ if(p) guard(p); }, 600);
  });
})();
