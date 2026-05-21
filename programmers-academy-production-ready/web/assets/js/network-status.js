(function(){
'use strict';
if(window.TitanNetworkStatus) return;
function show(state){var el=document.getElementById('titan-network-status'); if(!el){el=document.createElement('div'); el.id='titan-network-status'; el.className='titan-network-status'; document.body.appendChild(el)} el.className='titan-network-status show '+state; el.innerHTML=(state==='offline'?'⚠️ الاتصال غير مستقر. سيتم حفظ العمل الحالي قدر الإمكان.':'✅ عاد الاتصال بالإنترنت.'); if(state==='online') setTimeout(function(){el.classList.remove('show')},2600)}
window.addEventListener('offline',function(){show('offline')}); window.addEventListener('online',function(){show('online')});
window.TitanNetworkStatus={show:show};
})();
