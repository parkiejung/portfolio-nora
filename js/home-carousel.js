/* ── Home page photo carousel: infinite auto-scroll at a steady speed,
   starts once it enters view. Images keep their natural aspect ratio (only
   height is constrained to the carousel's height). Independent copy of the
   fun-carousel used on lai.html, scoped to its own ids/classes. */
(function () {
  const wrapper = document.getElementById('home-carousel-wrapper');
  const track = document.getElementById('home-carousel-track');
  if (!wrapper || !track) return;

  const speed = 36; // px per second, constant

  // Duplicate the original items once so the track can loop seamlessly.
  const originalItems = Array.from(track.children);
  originalItems.forEach((item) => {
    track.appendChild(item.cloneNode(true));
  });
  const allItems = Array.from(track.children);
  const firstClone = allItems[originalItems.length];

  let setWidth = 0;

  function updateSetWidth() {
    // Distance from the start of the first set to the start of its clone —
    // measured from actual layout, so it's exact regardless of each image's
    // natural (auto) width.
    setWidth = firstClone.offsetLeft - allItems[0].offsetLeft;
  }

  // Recompute whenever the track's layout changes (images loading, resize).
  const resizeObserver = new ResizeObserver(updateSetWidth);
  resizeObserver.observe(track);
  updateSetWidth();

  let offset = 0;
  let running = false;
  let rafId = null;
  let lastTimestamp = null;

  function step(timestamp) {
    if (lastTimestamp === null) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    offset += speed * delta;
    if (setWidth > 0 && offset >= setWidth) offset -= setWidth;
    track.style.transform = `translateX(-${offset}px)`;

    if (running) rafId = requestAnimationFrame(step);
  }

  function start() {
    if (running) return;
    running = true;
    lastTimestamp = null;
    rafId = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) start();
        else stop();
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(wrapper);
})();
