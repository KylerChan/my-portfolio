(function(){
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xanbgzgy';
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('formStatus');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyStatus = document.getElementById('emailCopyStatus');
  const emailText = 'kyler.chanpinhan@gmail.com';

  copyBtn && copyBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(emailText);
        copyStatus.textContent = 'Copied!';
      } catch (err) {
        copyStatus.textContent = 'Copy failed';
      }
    } else {
      const ta = document.createElement('textarea');
      ta.value = emailText;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); copyStatus.textContent = 'Copied!'; } catch(e) { copyStatus.textContent = 'Copy failed'; }
      document.body.removeChild(ta);
    }
    setTimeout(()=> copyStatus.textContent = '', 2000);
  });

  function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function clearErrors(){
    [nameError, emailError, messageError].forEach(el => el && el.classList.add('hidden'));
  }

  form && form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    statusEl.textContent = '';
    let ok = true;
    if (!nameInput.value.trim()) { nameError.classList.remove('hidden'); ok = false; }
    if (!validEmail(emailInput.value.trim())) { emailError.classList.remove('hidden'); ok = false; }
    if (!messageInput.value.trim()) { messageError.classList.remove('hidden'); ok = false; }
    if (!ok) return;
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-70');
    statusEl.textContent = 'Sending...';
    try {
      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
      };
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        statusEl.textContent = 'Thanks — message sent.';
        form.reset();
      } else {
        const text = await res.text().catch(()=> '');
        statusEl.innerHTML = 'Submission failed — please <a href="mailto:kyler.chanpinhan@gmail.com" class="text-emerald-600 underline">email me directly</a>.';
        console.error('Formspree error:', res.status, text);
      }
    } catch (err) {
      statusEl.innerHTML = 'Network error — please <a href="mailto:kyler.chanpinhan@gmail.com" class="text-emerald-600 underline">email me directly</a>.';
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-70');
      setTimeout(()=> { }, 4000);
    }
  });

  document.querySelectorAll('.btn-demo, .btn-code').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const url = btn.dataset.url || btn.getAttribute('href');
      if(!url || url === '#') return;
      if(url.startsWith('/')) location.href = url;
      else window.open(url, '_blank', 'noopener');
    });
  });

  document.querySelectorAll('aside [data-scroll]').forEach(el=>{
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      const sel = el.getAttribute('data-scroll') || el.getAttribute('href');
      if (!sel) return;
      const target = document.querySelector(sel);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();