(function(){
  'use strict';
  window.ProgrammersConfig = Object.freeze({
    brandName: 'Programmers Academy',
    brandNameAr: 'أكاديمية Programmers',
    brandShortName: 'Programmers',
    logo: 'assets/img/logo-programmers.png',
    favicon: 'assets/img/favicon.ico',
    // Keep the legacy tenant fallback to avoid breaking existing production data.
    defaultTenant: 'titan'
  });
  window.firebaseConfig = window.firebaseConfig || {
    apiKey: "AIzaSyDgMV79LTyiQerEOZvtuszH6ONaOAset5c",
    authDomain: "programming-cc297.firebaseapp.com",
    databaseURL: "https://programming-cc297-default-rtdb.firebaseio.com",
    projectId: "programming-cc297",
    storageBucket: "programming-cc297.firebasestorage.app",
    messagingSenderId: "131761323515",
    appId: "1:131761323515:web:9a0b1f3fcb7e49ec9b91c4"
  };
  window.ProgrammersTenant = window.ProgrammersTenant || (function(){
    function sanitize(value){ return String(value || '').trim().replace(/[^A-Za-z0-9_-]/g,'') || window.ProgrammersConfig.defaultTenant; }
    function id(){
      var params = new URLSearchParams(location.search);
      var value = params.get('tenant') || localStorage.getItem('titanTenantId') || window.ProgrammersConfig.defaultTenant;
      value = sanitize(value);
      try { localStorage.setItem('titanTenantId', value); } catch(_) {}
      return value;
    }
    function path(child){ return 'tenants/' + id() + (child ? '/' + child : ''); }
    return { id:id, path:path, sanitize:sanitize };
  })();
  document.addEventListener('DOMContentLoaded', function(){
    try{
      document.querySelectorAll('[data-brand-name]').forEach(function(el){ el.textContent = window.ProgrammersConfig.brandName; });
      if(!document.querySelector('meta[name="theme-color"]')){
        var meta=document.createElement('meta'); meta.name='theme-color'; meta.content='#0057C8'; document.head.appendChild(meta);
      }
    }catch(_){ }
  });
})();
