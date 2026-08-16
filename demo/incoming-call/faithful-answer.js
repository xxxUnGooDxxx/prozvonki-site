(function () {
  const root = document.querySelector('[data-incoming-real]');
  if (!root) return;
  const phoneIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.56 3.57.56.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.19 2.45.56 3.57.11.35.03.74-.25 1.02l-2.19 2.2Z"/></svg>';
  const endIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3c0 .38-.22.73-.56.9l-3 1.5c-.48.24-1.07.08-1.36-.37L1.1 12.58c-.28-.45-.2-1.03.19-1.39C4.12 8.58 7.88 7 12 7s7.88 1.58 10.71 4.19c.39.36.47.94.19 1.39l-1.38 2.17c-.29.45-.88.61-1.36.37l-3-1.5a1 1 0 0 1-.56-.9v-3A14.9 14.9 0 0 0 12 9Z"/></svg>';
  const smsIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM9 11H7V9h2v2Zm4 0h-2V9h2v2Zm4 0h-2V9h2v2Z"/></svg>';
  const en = document.documentElement.lang === 'en';
  const label = { answer: en ? 'Answer' : 'Ответить', reject: en ? 'Reject' : 'Отклонить', message: en ? 'Message' : 'Сообщение', slide: en ? 'slide to answer' : 'сдвиньте, чтобы ответить' };
  const chev = (direction, kind) => `<span class="real-chevrons ${direction} ${kind}"><i></i><i></i><i></i></span>`;
  const button = (kind, extra = '') => `<button class="real-answer-button ${kind} ${extra}" aria-label="${label[kind]}">${kind === 'accept' ? phoneIcon : endIcon}</button>`;
  function render(style) {
    const answer = root.querySelector('.incoming-real-answer'); if (!answer) return;
    const quickMessage = root.querySelector('.incoming-real-message');
    if (quickMessage) quickMessage.hidden = style === 'slide_to_answer';
    answer.className = `incoming-real-answer real-style-${style}`;
    if (style === 'buttons') answer.innerHTML = `<div class="real-default"><div>${chev('up','reject')}${button('reject')}${chev('down','reject')}</div><div>${chev('up','accept')}${button('accept')}${chev('down','accept')}</div></div>`;
    else if (style === 'horizontal') answer.innerHTML = `<div class="real-ghost horizontal">${chev('left','reject')}${button('accept','neutral')}${chev('right','accept')}</div>`;
    else if (style === 'vertical') answer.innerHTML = `<div class="real-ghost vertical">${chev('up','accept')}${button('accept','neutral')}${chev('down','reject')}</div>`;
    else if (style === 'slide_to_answer') answer.innerHTML = `<div class="real-slide-actions"><button type="button" aria-label="${label.reject}">${endIcon}<small>${label.reject}</small></button><button type="button" aria-label="${label.message}">${smsIcon}<small>${label.message}</small></button></div><div class="real-slide"><span>${label.slide}</span>${button('accept','slide-handle')}</div>`;
    else if (style === 'central') answer.innerHTML = `<div class="real-central"><span class="real-dots reject"><i></i><i></i><i></i></span>${button('accept','neutral')}<span class="real-dots accept"><i></i><i></i><i></i></span></div>`;
    else if (style === 'color_track') answer.innerHTML = `<div class="real-color-track"><span class="track-end reject">${endIcon}</span><span class="track-end accept">${phoneIcon}</span>${button('accept','track-handle')}</div>`;
    else answer.innerHTML = `<div class="real-diagonal">${button('accept')}${button('reject')}</div>`;
    bind(answer, style);
  }
  function bind(answer, style) {
    answer.querySelectorAll('.real-answer-button').forEach(el => {
      let sx=0,sy=0,dx=0,dy=0,active=false;
      el.addEventListener('pointerdown',e=>{active=true;sx=e.clientX;sy=e.clientY;el.classList.add('dragging');el.setPointerCapture(e.pointerId)});
      el.addEventListener('pointermove',e=>{if(!active)return;dx=e.clientX-sx;dy=e.clientY-sy;let x=dx,y=dy;if(style==='buttons'){x=0;y=el.classList.contains('accept')?Math.max(-90,Math.min(22,dy)):Math.max(-22,Math.min(90,dy))}else if(style==='vertical'){x=0;y=Math.max(-90,Math.min(90,dy))}else if(style==='slide_to_answer'){x=Math.max(0,Math.min(answer.clientWidth-78,dx));y=0}else if(style==='diagonal_buttons'){x=el.classList.contains('accept')?Math.max(0,Math.min(95,dx)):Math.min(0,Math.max(-95,dx));y=Math.max(-95,Math.min(10,dy))}else{x=Math.max(-110,Math.min(110,dx));y=0}el.style.setProperty('--answer-x',x+'px');el.style.setProperty('--answer-y',y+'px')});
      const finish=()=>{if(!active)return;active=false;el.classList.remove('dragging');el.style.removeProperty('--answer-x');el.style.removeProperty('--answer-y')};el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',finish);
    });
  }
  const ready=setInterval(()=>{if(!root.querySelector('.incoming-real-answer'))return;clearInterval(ready);root.querySelector('.inc-toggle-card')?.closest('section')?.remove();if(en){const avatar=root.querySelector('.incoming-real-avatar');if(avatar)avatar.textContent='AM';const titles={horizontal:'Swipe ←→',vertical:'Swipe ↑↓'};Object.entries(titles).forEach(([value,title])=>{const text=root.querySelector(`input[name="inc-style"][value="${value}"]`)?.closest('.inc-radio-row')?.querySelector('strong');if(text)text.textContent=title})}const selected=()=>root.querySelector('input[name="inc-style"]:checked')?.value||'buttons';render(selected());root.querySelectorAll('input[name="inc-style"]').forEach(r=>r.addEventListener('change',()=>render(r.value)))},20);
  const edgePalette=setInterval(()=>{const dots=[...root.querySelectorAll('[data-edge-color]')];if(!dots.length)return;clearInterval(edgePalette);dots[0].classList.add('is-selected');dots.forEach(dot=>dot.addEventListener('click',()=>{dots.forEach(item=>item.classList.toggle('is-selected',item===dot))}))},30);
  const textPalettes=setInterval(()=>{const lists=[...root.querySelectorAll('[data-text-list]')];if(!lists.length)return;clearInterval(textPalettes);lists.forEach(list=>{const choices=[...list.querySelectorAll('[data-auto],[data-text-color]')];choices.forEach(choice=>choice.addEventListener('click',()=>{choices.forEach(item=>item.classList.toggle('is-selected',item===choice))}))})},30);
  document.addEventListener('click',event=>{const languageLink=event.target.closest('a[hreflang]');if(!languageLink)return;const theme=document.documentElement.dataset.theme;if(theme!=='light'&&theme!=='dark')return;const url=new URL(languageLink.href,location.href);url.searchParams.set('theme',theme);languageLink.href=url.href},true);
  root.addEventListener('click',event=>{if(!event.target.closest('[data-reset]'))return;const theme=document.documentElement.dataset.theme;if(theme==='light'||theme==='dark')localStorage.setItem('pz-theme',theme)},true);
  root.addEventListener('click',event=>{const choice=event.target.closest('[data-bg-color]');if(choice&&root.contains(choice)){const choices=[...choice.closest('.inc-color-list').querySelectorAll('[data-bg-color]')];choices.forEach(item=>item.classList.toggle('is-selected',item===choice));return}const imagesTab=event.target.closest('[data-bg="images"]');if(!imagesTab)return;const assetBase=en?'../../../demo/incoming-call/incoming-backgrounds/':'incoming-backgrounds/';const imageNames={incoming_bg_sunrise:'Sunrise',incoming_bg_sunset:'Sunset',incoming_bg_forest:'Forest',incoming_bg_bear:'Bear',incoming_bg_fox:'Fox'};root.querySelectorAll('.inc-image-tile[data-image]').forEach(tile=>{const file=tile.dataset.image.split('/').pop().replace(/\.png$/i,'.webp');tile.dataset.image=assetBase+file;const image=tile.querySelector('img');if(image)image.src=assetBase+file;if(en&&tile.lastChild?.nodeType===Node.TEXT_NODE)tile.lastChild.nodeValue=imageNames[file.replace(/\.webp$/i,'')]||tile.lastChild.nodeValue})});
})();
