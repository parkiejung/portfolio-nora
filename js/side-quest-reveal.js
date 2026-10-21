// Design-project cards and case study cards: fade in from below when they reach the lower third
// of the viewport, and only then start their video. Videos pause while their
// card is out of view.
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.side-quest-card, .work-card'));
  if (!cards.length) return;

  function play(video) {
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  // No IntersectionObserver: show everything, let videos play.
  if (!('IntersectionObserver' in window)) {
    cards.forEach(function (c) {
      c.classList.add('is-visible');
      var v = c.querySelector('video');
      if (v) play(v);
    });
    return;
  }

  // 1) Reveal once, when the card's top has risen 80px above the
  //    viewport's bottom edge.
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var card = entry.target;
      card.classList.add('is-visible');
      revealObserver.unobserve(card);
      var v = card.querySelector('video');
      if (v) { card._revealed = true; play(v); }
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0 });

  // 2) After reveal, keep video playing only while the card is on screen.
  var playObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var card = entry.target;
      var v = card.querySelector('video');
      if (!v || !card._revealed) return;
      if (entry.isIntersecting) play(v); else v.pause();
    });
  }, { threshold: 0 });

  cards.forEach(function (card) {
    revealObserver.observe(card);
    if (card.querySelector('video')) playObserver.observe(card);
  });
})();
