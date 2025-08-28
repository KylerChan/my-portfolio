document.addEventListener('DOMContentLoaded', () => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  function sanitizeInput(str) { return String(str || '').replace(/[<>]/g, c => (c === '<' ? '&lt;' : '&gt;')).trim(); }
  function showStatus(el, msg, timeout = 3000) { if (!el) return; el.textContent = msg; if (timeout > 0) { setTimeout(() => { if (el) el.textContent = ''; }, timeout); } }

  (function setupCopyEmail() {
    const copyBtn = qs('#copyEmailBtn');
    const emailLink = qs('#emailLink');
    const statusEl = qs('#emailCopyStatus');
    const email = emailLink ? emailLink.textContent.trim() : '';
    if (!copyBtn || !email) return;
    copyBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const ta = document.createElement('textarea');
          ta.value = email;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        showStatus(statusEl, 'Copied!', 2500);
      } catch (err) {
        console.error('Copy failed', err);
        showStatus(statusEl, 'Copy failed — please copy manually.', 4000);
      }
    });
  })();

  (function setupContactForm() {
    const form = qs('#contactForm');
    if (!form) return;
    const nameInput = qs('#name', form);
    const emailInput = qs('#email', form);
    const messageInput = qs('#message', form);
    const nameError = qs('#nameError', form);
    const emailError = qs('#emailError', form);
    const messageError = qs('#messageError', form);
    const statusEl = qs('#formStatus', form);
    const submitBtn = qs('#submitBtn', form);
    const honeypot = qs('input[name="website"], input#website', form);
    const LAST_SUBMIT_KEY = 'kc_last_submit_ts';
    const MIN_INTERVAL_MS = 10 * 1000;
    function setFieldError(el, show) { if (!el) return; if (show) el.classList.remove('hidden'); else el.classList.add('hidden'); }
    function validateEmailFormat(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (honeypot && honeypot.value.trim() !== '') return;
      try {
        const last = Number(localStorage.getItem(LAST_SUBMIT_KEY) || 0);
        const now = Date.now();
        if (now - last < MIN_INTERVAL_MS) {
          const wait = Math.ceil((MIN_INTERVAL_MS - (now - last)) / 1000);
          showStatus(statusEl, `Please wait ${wait}s before sending again.`);
          return;
        }
        localStorage.setItem(LAST_SUBMIT_KEY, String(now));
      } catch (err) {}
      const name = sanitizeInput(nameInput ? nameInput.value : '');
      const email = sanitizeInput(emailInput ? emailInput.value : '');
      const message = sanitizeInput(messageInput ? messageInput.value : '');
      let valid = true;
      if (!name) { setFieldError(nameError, true); valid = false; } else { setFieldError(nameError, false); }
      if (!email || !validateEmailFormat(email)) { setFieldError(emailError, true); valid = false; } else { setFieldError(emailError, false); }
      if (!message) { setFieldError(messageError, true); valid = false; } else { setFieldError(messageError, false); }
      if (!valid) { showStatus(statusEl, 'Please fix the errors above.'); return; }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('opacity-70'); }
      const action = form.getAttribute('action') || '';
      if (action && /^https?:\/\//i.test(action)) {
        try {
          const payload = { name, email, message, page_url: window.location.href };
          const res = await fetch(action, {
            method: form.getAttribute('method') || 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'omit'
          });
          if (res.ok) {
            showStatus(statusEl, 'Thanks — message sent.');
            form.reset();
          } else {
            let text = '';
            try { text = await res.text(); } catch (_) {}
            console.error('Submission error', res.status, text);
            showStatus(statusEl, 'Submission failed; try the email fallback.');
          }
        } catch (err) {
          console.error('Network error sending form', err);
          showStatus(statusEl, 'Network error; try the email fallback.');
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('opacity-70'); }
        }
      } else {
        const subject = encodeURIComponent(`Portfolio contact from ${name}`);
        const bodyLines = [`Name: ${name}`, `Email: ${email}`, '', `Message:`, message, '', `Page: ${window.location.href}`];
        const body = encodeURIComponent(bodyLines.join('\n'));
        window.location.href = `mailto:kyler.chanpinhan@gmail.com?subject=${subject}&body=${body}`;
        showStatus(statusEl, 'Opening your email client...');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('opacity-70'); }
      }
    });
  })();

  (function fixExternalLinks() {
    const anchors = qsa('a[target="_blank"]');
    anchors.forEach(a => {
      const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
      if (!rel.includes('noopener')) rel.push('noopener');
      if (!rel.includes('noreferrer')) rel.push('noreferrer');
      a.setAttribute('rel', rel.join(' '));
    });
  })();
});
