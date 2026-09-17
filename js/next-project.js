/* ── Auto "Next Project" cards ──
   Renders 2 randomly picked "Next Project" cards from the shared
   project registry in js/projects-data.js (excluding the current
   page), so titles/thumbnails only ever need to be edited in one
   place — not in every other page's next-project markup. Order (and
   which 2 projects show, once there are more than 2 others to pick
   from) is re-randomized on every page load.
*/
(function () {
  const slot = document.getElementById('next-project-slot');
  if (!slot) return;

  const projects = window.SITE_PROJECTS || [];
  if (!projects.length) return;

  const currentFile = location.pathname.split('/').pop() || 'index.html';
  const others = projects.filter((p) => p.file !== currentFile);
  if (!others.length) return;

  // Fisher–Yates shuffle, then take up to 2.
  const shuffled = others.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const picks = shuffled.slice(0, 2);

  slot.innerHTML = '';
  picks.forEach((project) => {
    const card = document.createElement('a');
    card.href = project.file;
    card.className = 'next-project-card';
    card.innerHTML = `
      <div class="next-project-img">
        <img src="${project.thumbnail}" alt="${project.title}" loading="lazy" />
      </div>
      <div class="next-project-name">${project.title}</div>
    `;
    slot.appendChild(card);
  });
})();
