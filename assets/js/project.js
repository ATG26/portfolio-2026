/* scroll reveal — blur/fade/translate-up, same treatment as the
   homepage's hero entrance and work-card reveal. Every element with
   class "reveal" starts hidden (see project.css); once it's far
   enough into the viewport this adds "is-visible" and leaves it, so
   nothing replays scrolling back up. Skipped entirely under
   reduced-motion, where project.css already renders everything in
   its resting state. */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var items = document.querySelectorAll('.reveal');
  if(!items.length) return;

  if(!('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }

  // The bottom rootMargin shrinks the effective viewport, so a tall
  // section (the True Detective cross title card, a full-bleed
  // photo) only counts as "intersecting" once it's crossed well
  // into view — not the instant a sliver of it pokes up from the
  // bottom edge. That was firing the reveal before it had scrolled
  // into focus, so by the time you actually reached it the
  // animation had already finished playing.
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.15, rootMargin:'0px 0px -25% 0px'});

  // Wait two animation frames before observing so the browser has
  // definitely painted the hidden (.reveal) state at least once —
  // otherwise anything already in the viewport at load (the page
  // title, the first section) gets "is-visible" added on the very
  // first callback with no prior paint to transition *from*, so it
  // just appears instantly instead of blurring/fading/sliding in.
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      items.forEach(function(el){ io.observe(el); });
    });
  });
})();
