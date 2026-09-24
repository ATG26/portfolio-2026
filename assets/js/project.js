/* scroll reveal — blur/fade/translate-up, same treatment as the
   homepage's hero entrance and work-card reveal. Every element with
   class "reveal" starts hidden (see project.css); once it's ~15%
   into the viewport this adds "is-visible" and leaves it, so nothing
   replays scrolling back up. Skipped entirely under reduced-motion,
   where project.css already renders everything in its resting state. */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var items = document.querySelectorAll('.reveal');
  if(!items.length) return;

  if(!('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.15, rootMargin:'0px 0px -8% 0px'});

  items.forEach(function(el){ io.observe(el); });
})();
