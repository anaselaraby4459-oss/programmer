(function(){
'use strict';
function enhance(){if(document.getElementById('smart-index-note')) return; var hero=document.querySelector('.hero .wrap')||document.body; var box=document.createElement('div'); box.id='smart-index-note'; box.className='card'; box.style.marginTop='18px'; box.innerHTML='<h3><i class="fas fa-sparkles"></i> نظام أكاديمية متكامل</h3><p>إدارة الطلاب، الدروس، الحصص، التسجيلات، المدفوعات، التقارير، المحادثات الخاصة، والمتابعة الذكية من مكان واحد.</p>'; hero.appendChild(box)}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',enhance); else enhance();
})();
