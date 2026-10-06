/* custom cursor dot — fine pointers only */
(function(){
  if(!window.matchMedia('(pointer:fine)').matches) return;
  var dot = document.getElementById('cursorDot');
  if(!dot){
    dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.id = 'cursorDot';
    dot.setAttribute('aria-hidden','true');
    document.body.appendChild(dot);
  }
  var CLICKABLE = 'a, button, [role="button"], input, textarea, select, label, [onclick]';
  var uninkTimer = null;

  /* is-clickable and is-uninking are two ends of the same ink-morph —
     entering plays the shape forward to a square and holds it there
     (is-clickable); leaving plays the exact same kind of shape change
     back down to a circle (is-uninking) instead of just snapping the
     class off, so the un-morph looks as deliberate as the morph in.
     is-uninking removes itself once its animation has actually had time
     to finish, handing the dot back to its plain, unanimated resting
     circle. */
  function setClickable(active){
    if(active){
      clearTimeout(uninkTimer);
      dot.classList.remove('is-uninking');
      dot.classList.add('is-clickable');
    }else if(dot.classList.contains('is-clickable')){
      dot.classList.remove('is-clickable');
      dot.classList.add('is-uninking');
      clearTimeout(uninkTimer);
      uninkTimer = setTimeout(function(){ dot.classList.remove('is-uninking'); }, 160);
    }
  }

  window.addEventListener('mousemove', function(e){
    dot.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
    if(!dot.classList.contains('is-visible')) dot.classList.add('is-visible');
    /* closest() walks up from whatever's directly under the cursor (an
       icon inside a link, a span inside a button) so hovering any part
       of a clickable element morphs the dot, not just its exact edges. */
    setClickable(!!(e.target && e.target.closest && e.target.closest(CLICKABLE)));
  }, {passive:true});
  document.addEventListener('mouseleave', function(){
    dot.classList.remove('is-visible');
    setClickable(false);
  });
})();
