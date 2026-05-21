(function(){
  'use strict';
  if(window.ProgrammersUX) return;
  function addLogo(){
    try{
      var logo='assets/img/logo-programmers.png';
      document.querySelectorAll('.login-card,.login-box').forEach(function(card){
        if(card.querySelector('.programmers-login-logo')) return;
        var img=document.createElement('img'); img.className='programmers-login-logo'; img.src=logo; img.alt='Programmers Academy'; img.loading='lazy';
        card.insertBefore(img, card.firstChild);
      });
      document.querySelectorAll('.sidebar-brand').forEach(function(brand){
        if(brand.querySelector('.programmers-mini-logo')) return;
        var img=document.createElement('img'); img.className='programmers-mini-logo'; img.src=logo; img.alt='Programmers Academy'; img.loading='lazy';
        brand.insertBefore(img, brand.firstChild);
      });

      var adminHead=document.querySelector('.sidebar.no-print > div:first-child');
      if(adminHead && !adminHead.querySelector('.programmers-admin-logo')){
        var aimg=document.createElement('img'); aimg.className='programmers-admin-logo'; aimg.src=logo; aimg.alt='Programmers Academy'; aimg.loading='lazy';
        adminHead.insertBefore(aimg, adminHead.firstChild);
        var oldIcon=adminHead.querySelector('div[style*="linear-gradient"]'); if(oldIcon) oldIcon.style.display='none';
      }
    }catch(_){ }
  }
  function addOnboarding(){
    try{
      var page=(document.body&&document.body.dataset.page)||'';
      if(localStorage.getItem('programmers_onboarding_dismissed_'+page)) return;
      var target=document.querySelector(page==='admin'?'main.main-content':'#stats-sec, main.main-content, #app');
      if(!target || document.getElementById('programmers-onboarding')) return;
      var html = page==='admin'
        ? '<b>ابدأ من هنا:</b> راجع الإحصائيات، ثم طلبات الحساب، ثم ارفع الدرس الأول أو تابع تقدم الطلاب.'
        : '<b>ابدأ من هنا:</b> افتح الدروس، أكمل درس اليوم، ثم راجع التقدم والإشعارات.';
      target.insertAdjacentHTML('afterbegin','<div id="programmers-onboarding" class="programmers-onboarding"><button aria-label="إخفاء" onclick="localStorage.setItem(\'programmers_onboarding_dismissed_'+page+'\',\'1\');this.parentElement.remove()">×</button><span>'+html+'</span></div>');
    }catch(_){ }
  }
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(addLogo, 100); setTimeout(addOnboarding, 1200); });
  window.ProgrammersUX={addLogo:addLogo,addOnboarding:addOnboarding};
})();
