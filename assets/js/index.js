/* Inlined from assets/js/index.js */
// ===== index.html :: inline-script-01 =====
function sanitizeTenantId(v){return String(v||'titan').trim().replace(/[^A-Za-z0-9_-]/g,'')||'titan'}
function currentTenant(){return sanitizeTenantId((document.getElementById('tenant')&&document.getElementById('tenant').value)||new URLSearchParams(location.search).get('tenant')||localStorage.getItem('titanTenantId')||'titan')}
function initTenantInput(){var el=document.getElementById('tenant'); if(el) el.value=sanitizeTenantId(new URLSearchParams(location.search).get('tenant')||localStorage.getItem('titanTenantId')||'titan')}
function go(type){
  const t=currentTenant();
  localStorage.setItem('titanTenantId', t);
  const files={admin:'admin.html',student:'student.html',parent:'parent.html'};
  location.href=files[type]+'?tenant='+encodeURIComponent(t);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initTenantInput); else initTenantInput();


// ===== index.html :: inline-script-02 =====
if('serviceWorker' in navigator){navigator.serviceWorker.register('./service-worker.js').catch(()=>{});}
