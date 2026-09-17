/* ── Shared project registry ──
   Single source of truth for each project's title + thumbnail, used by
   js/next-project.js to render the "Next Project" card. Kept as plain
   data (not fetched from each page) so it works whether the site is
   opened directly as a file:// page or served over http(s) — a
   cross-page fetch() is blocked by the browser in the file:// case,
   which is why the "Next Project" card was showing empty.

   To add a project: add one entry here (in the order you want the
   "next project" cycle to follow). Keep `title` in sync with that
   page's own <h1 class="hero-title"> and `thumbnail` with its
   <meta name="project-thumbnail"> tag.
*/
window.SITE_PROJECTS = [
  {
    file: 'lai.html',
    title: 'Increase Completion Rate and Satisfaction by Fixing Usability Problems',
    thumbnail: 'Elements/lai-main.png',
  },
  {
    file: 'ck-club.html',
    title: "Redesigning Circle K's Loyalty App Fixing Accessibility and Usability",
    thumbnail: 'Elements/ck-club-main.png',
  },
  {
    file: 'gogreen.html',
    title: 'Create an app for internal activity Trash sorting',
    thumbnail: 'Elements/gogreen.jpg',
  },
];
