(function(){
  function $(id){return document.getElementById(id)}
  function tenant(){var raw=($('tenant')&&$('tenant').value)||new URLSearchParams(location.search).get('tenant')||localStorage.getItem('titanTenantId')||'titan'; return (window.sanitizeTenantId?sanitizeTenantId(raw):String(raw||'titan').trim().replace(/[^A-Za-z0-9_-]/g,'')||'titan')}
  function val(id){return String(($(id)&&$(id).value)||'').trim()}
  function status(msg,type){var el=$('index-signup-status'); if(el){el.textContent=msg; el.style.color=type==='ok'?'#059669':(type==='err'?'#dc2626':'#2563eb');}}
  window.toggleIndexSignup=function(){var box=$('index-signup-box'); if(box) box.classList.toggle('active')}
  window.sendIndexAccountRequest=async function(){
    var name=val('index-signup-name');
    var code=val('index-signup-code').replace(/\s+/g,'').toLowerCase();
    var level=val('index-signup-level')||'1';
    var phone=val('index-signup-phone');
    var note=val('index-signup-note');
    if(!name||!code||!phone){status('اكتب الاسم والكود ورقم الهاتف أولاً.','err');return;}
    if(phone.length<6){status('رقم الهاتف يجب ألا يقل عن 6 أرقام لأنه سيكون كلمة المرور.','err');return;}
    try{
      if(!window.firebase || !firebase.database) throw new Error('Firebase غير جاهز');
      if(!firebase.apps.length && window.firebaseConfig) firebase.initializeApp(window.firebaseConfig);
      var t=tenant(); localStorage.setItem('titanTenantId', t);
      await firebase.database().ref('tenants/'+t+'/registration_requests').push({
        name:name, code:code, level:level, phone:phone, note:note,
        status:'pending', source:'home-page',
        createdAt:new Date().toISOString(), date:new Date().toLocaleString('ar-EG')
      });
      ['index-signup-name','index-signup-code','index-signup-phone','index-signup-note'].forEach(function(id){if($(id)) $(id).value=''});
      status('تم إرسال طلب الانضمام للإدارة. بعد الموافقة سجّل الدخول بالكود والهاتف.','ok');
    }catch(e){console.error(e); status('تعذر إرسال الطلب. تأكد من الاتصال أو إعدادات Firebase.','err');}
  }
})();
