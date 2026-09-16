// ============================================================
// <site-footer> — shared footer used on every page.
// Edit the markup/text below and it updates on ALL pages at once,
// since every page loads this same file.
// ============================================================

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer" aria-labelledby="contact-heading">
        <div class="footer-inner">
          <h2 class="footer-heading" id="contact-heading">Contact for
            <span class="footer-type" aria-live="polite">
              <span class="footer-type-text"></span><span class="footer-type-cursor" aria-hidden="true"></span>
            </span>
          </h2>
          <p class="footer-desc">Available for full-time roles, collaborations, and friendly connection.</p>

          <div class="footer-divider" aria-hidden="true"></div>

          <div class="footer-contact-row">
            <div class="footer-email-group">
              <span class="footer-label">My email</span>
              <div class="footer-email">
                <a href="mailto:ntnga2112@gmail.com" class="footer-email-link">ntnga2112@gmail.com</a>
                <button type="button" class="footer-copy-btn" data-copy="ntnga2112@gmail.com" aria-label="Copy email address">
                  <span class="footer-copy-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.6" />
                      <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    </svg>
                  </span>
                  <span class="footer-copy-done" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Copied
                  </span>
                </button>
              </div>
            </div>

            <div class="footer-explore">
              <span class="footer-label">Explore more</span>
              <nav class="footer-links" aria-label="Social links">
                <a href="https://www.linkedin.com/in/parkjungnga/" target="_blank" rel="noopener">LinkedIn</a>
                <a href="https://www.behance.net/parkjungnga" target="_blank" rel="noopener">Behance</a>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    `;

    this._initCopyButton();
    this._initTypeEffect();
  }

  _initTypeEffect() {
    const textEl = this.querySelector('.footer-type-text');
    if (!textEl) return;

    const words = ['opportunity', 'design chat', 'hangout', 'hello'];
    let index = 0;

    const TYPE_SPEED = 80;    // ms per character, typing in
    const CLEAR_SPEED = 35;   // ms per character, clearing out
    const HOLD_TIME = 1400;   // ms to sit fully typed before clearing
    const PAUSE_TIME = 300;   // ms to sit empty before typing the next word

    // Respect users who've asked for reduced motion — just swap the
    // word instantly instead of typing/clearing it out.
    const prefersReducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function typeWord(word, i, done) {
      if (i > word.length) {
        done();
        return;
      }
      textEl.textContent = word.slice(0, i);
      setTimeout(() => typeWord(word, i + 1, done), TYPE_SPEED);
    }

    function clearWord(word, i, done) {
      if (i < 0) {
        done();
        return;
      }
      textEl.textContent = word.slice(0, i);
      setTimeout(() => clearWord(word, i - 1, done), CLEAR_SPEED);
    }

    function cycle() {
      const word = words[index];

      if (prefersReducedMotion) {
        textEl.textContent = word;
        setTimeout(() => {
          index = (index + 1) % words.length;
          cycle();
        }, HOLD_TIME);
        return;
      }

      typeWord(word, 0, () => {
        setTimeout(() => {
          clearWord(word, word.length, () => {
            index = (index + 1) % words.length;
            setTimeout(cycle, PAUSE_TIME);
          });
        }, HOLD_TIME);
      });
    }

    cycle();
  }

  _initCopyButton() {
    const copyBtn = this.querySelector('.footer-copy-btn');
    if (!copyBtn) return;

    function fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        // ignore — nothing more we can do
      }
      document.body.removeChild(textarea);
    }

    function showCopied() {
      const original = copyBtn.getAttribute('aria-label');
      copyBtn.classList.add('is-copied');
      copyBtn.setAttribute('aria-label', 'Copied!');
      setTimeout(() => {
        copyBtn.classList.remove('is-copied');
        copyBtn.setAttribute('aria-label', original);
      }, 1800);
    }

    copyBtn.addEventListener('click', () => {
      const email = copyBtn.dataset.copy;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(showCopied).catch(() => {
          fallbackCopy(email);
          showCopied();
        });
      } else {
        fallbackCopy(email);
        showCopied();
      }
    });
  }
}

customElements.define('site-footer', SiteFooter);
