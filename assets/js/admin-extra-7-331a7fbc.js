(function(){
  function msg(){ alert('إنشاء حسابات الإدارة من الصفحة العامة مقفول في نسخة الإنتاج. استخدم Firebase Console أو حساب super_admin فقط.'); }
  window.toggleAdminSignup = msg;
  window.createPublicAdminAccountDirect = msg;
  window.sendAdminPublicAccountRequest = msg;
})();
