/* scroll reveal — blur/fade/translate-up, same treatment as the
   homepage's hero entrance and work-card reveal. Every element with
   class "reveal" starts hidden (see project.css); once it's far
   enough into the viewport this adds "is-visible" and leaves it, so
   nothing replays scrolling back up. Skipped entirely under
   reduced-motion, where project.css already renders everything in
   its resting state. */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var all = document.querySelectorAll('.reveal');
  if(!all.length) return;

  if(!('IntersectionObserver' in window)){
    all.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }

  // Ordinary elements (headings, paragraphs, the title/facts band)
  // are shorter than the viewport, so "15% of the element visible"
  // already means it's genuinely in view — this is what lets the
  // page title and facts animate in right away since they're
  // sitting in the lower half of the very first viewport on load.
  var normal = [];
  // Tall, full-bleed elements (the cross title card, the composite
  // photo grids) are themselves close to or taller than the
  // viewport, so that same 15%-of-its-own-area math is satisfied by
  // a bare sliver poking up from the bottom edge — the reveal fired
  // before the section had actually scrolled into focus. These use
  // a threshold:0 trigger instead, gated purely by rootMargin, so
  // they fire once their top edge crosses well into the viewport
  // rather than by how much of their (large) area is showing.
  var tall = [];
  all.forEach(function(el){
    (el.classList.contains('reveal-tall') ? tall : normal).push(el);
  });

  var normalIo = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        normalIo.unobserve(entry.target);
      }
    });
  }, {threshold:.15, rootMargin:'0px 0px -8% 0px'});

  var tallIo = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        tallIo.unobserve(entry.target);
      }
    });
  }, {threshold:0, rootMargin:'0px 0px -35% 0px'});

  // Wait two animation frames before observing so the browser has
  // definitely painted the hidden (.reveal) state at least once —
  // otherwise anything already in the viewport at load (the page
  // title, the first section) gets "is-visible" added on the very
  // first callback with no prior paint to transition *from*, so it
  // just appears instantly instead of blurring/fading/sliding in.
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      normal.forEach(function(el){ normalIo.observe(el); });
      tall.forEach(function(el){ tallIo.observe(el); });
    });
  });
})();
