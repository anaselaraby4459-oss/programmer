(function(){
  'use strict';
  if(window.ProgrammersErrorHandling) return;
  function notify(message, type){
    if(window.ProgrammersUtils && ProgrammersUtils.showMessage) return ProgrammersUtils.showMessage(message, type || 'error');
    try{ console.warn(message); }catch(_){}
  }
  function friendly(reason){
    if(window.ProgrammersUtils && ProgrammersUtils.normalizeFirebaseError) return ProgrammersUtils.normalizeFirebaseError(reason);
    return 'تعذر تحميل البيانات، حاول مرة أخرى.';
  }
  window.addEventListener('unhandledrejection', function(e){
    var msg = friendly(e.reason);
    if(!String(e.reason || '').match(/permission|auth|network|firebase/i)) return;
    notify(msg, 'error');
  });
  window.addEventListener('error', function(e){
    if(!e || !e.message) return;
    if(String(e.message).match(/script error/i)) return;
    notify('حدث خطأ غير متوقع، لكن الصفحة ستظل تعمل. أعد المحاولة.', 'error');
  });
  window.addEventListener('offline', function(){ notify('أنت غير متصل الآن. سيتم عرض آخر بيانات محفوظة قدر الإمكان.', 'warning'); });
  window.addEventListener('online', function(){ notify('عاد الاتصال بالإنترنت.', 'success'); });
  window.ProgrammersErrorHandling = { friendly:friendly, notify:notify };
})();
