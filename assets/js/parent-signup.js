(function(){
  function $(id){return document.getElementById(id)}
  function tenant(){
    var raw=(window.TitanSaaS&&TitanSaaS.tenantId)||new URLSearchParams(location.search).get('tenant')||localStorage.getItem('titanTenantId')||'titan';
    return String(raw||'titan').trim().replace(/[^A-Za-z0-9_-]/g,'')||'titan';
  }
  function safe(v){return String(v||'').trim()}
  function setStatus(msg,type){var el=$('parent-signup-status'); if(el){el.textContent=msg; el.style.color=type==='ok'?'#059669':(type==='err'?'#dc2626':'var(--primary,#2563eb)');}}
  window.toggleParentSignup=function(){var box=$('parent-signup-box'); if(box) box.classList.toggle('active')}
  window.sendParentAccountRequest=async function(){
    var name=safe($('parent-signup-name')&&$('parent-signup-name').value);
    var code=safe($('parent-signup-code')&&$('parent-signup-code').value).replace(/\s+/g,'').toLowerCase();
    var level=safe($('parent-signup-level')&&$('parent-signup-level').value)||'1';
    var phone=safe($('parent-signup-phone')&&$('parent-signup-phone').value);
    var note=safe($('parent-signup-note')&&$('parent-signup-note').value);
    if(!name||!code||!phone){setStatus('اكتب الاسم والكود ورقم الهاتف أولاً.','err'); return;}
    if(phone.length<6){setStatus('رقم الهاتف يجب ألا يقل عن 6 أرقام لأنه سيكون كلمة المرور.','err'); return;}
    try{
      if(!window.firebase || !firebase.database) throw new Error('Firebase غير جاهز');
      await firebase.database().ref('tenants/'+tenant()+'/registration_requests').push({
        name:name, code:code, level:level, phone:phone, note:note,
        status:'pending', source:'parent-login-page',
        createdAt:new Date().toISOString(), date:new Date().toLocaleString('ar-EG')
      });
      ['parent-signup-name','parent-signup-code','parent-signup-phone','parent-signup-note'].forEach(function(id){if($(id)) $(id).value=''});
      setStatus('تم إرسال طلب إنشاء الحساب. انتظر موافقة الإدارة ثم سجّل الدخول بالكود والهاتف.','ok');
    }catch(e){console.error(e); setStatus('تعذر إرسال الطلب. تأكد من الاتصال أو قواعد Firebase.','err');}
  }
})();
