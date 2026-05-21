(function(){
  'use strict';
  if(window.ProgrammersOffline) return;
  var KEY='programmers_last_student_lessons_html';
  function saveLessons(){
    try{ var el=document.getElementById('lessons-list'); if(el && el.innerHTML.trim().length>20) localStorage.setItem(KEY, el.innerHTML); }catch(_){ }
  }
  function restoreLessons(){
    try{
      if(navigator.onLine) return;
      var el=document.getElementById('lessons-list'); var html=localStorage.getItem(KEY);
      if(el && html && !el.dataset.offlineRestored){
        el.dataset.offlineRestored='1';
        el.innerHTML='<div class="offline-cache-note">أنت تشاهد آخر نسخة محفوظة من الدروس. قد لا تعمل الفيديوهات الخارجية بدون إنترنت.</div>' + html;
      }
    }catch(_){ }
  }
  document.addEventListener('DOMContentLoaded', function(){
    var el=document.getElementById('lessons-list');
    if(el && window.MutationObserver){ new MutationObserver(saveLessons).observe(el,{childList:true,subtree:true}); }
    setTimeout(saveLessons, 2500); setTimeout(restoreLessons, 3000);
  });
  window.addEventListener('offline', restoreLessons);
  window.ProgrammersOffline={saveLessons:saveLessons,restoreLessons:restoreLessons};
})();
