(() => {
  'use strict';

  const STORAGE_KEY = 'runlu_invoice_alpha_business_v1';
  const app = document.getElementById('app');
  let step = 0;
  let draft = loadBusiness() || {
    companyName: '', legalName: '', businessNumber: '', email: '', phone: '', address: '', website: '',
    logo: '', primaryColor: '#2563eb', country: 'Canada', currency: 'CAD', language: 'English', dateFormat: 'YYYY-MM-DD',
    createdAt: '', updatedAt: ''
  };

  function loadBusiness() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
    catch { return null; }
  }
  function saveBusiness() {
    const now = new Date().toISOString();
    draft.createdAt ||= now;
    draft.updatedAt = now;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    applyBrand();
  }
  function applyBrand() {
    document.documentElement.style.setProperty('--brand', draft.primaryColor || '#2563eb');
  }
  function esc(v='') { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function progress(active) {
    return `<div class="progress" aria-label="Setup progress">${[1,2,3,4].map(i=>`<span class="${i<=active?'active':''}"></span>`).join('')}</div>`;
  }
  function shell(content) { app.innerHTML = `<section class="center-page"><div class="panel">${content}</div></section>`; }
  function setStep(next) { step = next; render(); window.scrollTo({top:0, behavior:'smooth'}); }
  function readForm() {
    document.querySelectorAll('[data-field]').forEach(el => { draft[el.dataset.field] = el.value.trim(); });
  }
  function requireCompany() {
    const input = document.querySelector('[data-field="companyName"]');
    if (!input.value.trim()) { input.focus(); input.setCustomValidity('Company name is required.'); input.reportValidity(); input.setCustomValidity(''); return false; }
    return true;
  }

  function renderWelcome() {
    shell(`<div class="brand-mark">RL</div><div class="eyebrow">RUNLU</div><h1>Invoice Automation</h1><p>Set up your business once. Prepare recurring invoices with less typing and fewer repeated steps.</p><div class="actions"><button class="primary" id="startBtn">Get Started</button></div><p class="small">Alpha Build 001 · Your data stays on this device.</p>`);
    document.getElementById('startBtn').onclick = () => setStep(1);
  }
  function renderBusiness() {
    shell(`${progress(1)}<div class="eyebrow">Step 1 of 4</div><h2>Business information</h2><p>Start with the details needed to identify your business. You can edit them later.</p><div class="form-grid"><div class="field"><label>Company name *</label><input data-field="companyName" value="${esc(draft.companyName)}" autocomplete="organization" /></div><div class="field"><label>Legal name <span class="small">(optional)</span></label><input data-field="legalName" value="${esc(draft.legalName)}" /></div><div class="field"><label>Business number <span class="small">(optional)</span></label><input data-field="businessNumber" value="${esc(draft.businessNumber)}" /></div></div><div class="actions"><button class="primary" id="nextBtn">Next</button><button class="ghost" id="backBtn">Back</button></div>`);
    document.getElementById('nextBtn').onclick = () => { if (!requireCompany()) return; readForm(); setStep(2); };
    document.getElementById('backBtn').onclick = () => setStep(0);
  }
  function renderBranding() {
    const logo = draft.logo ? `<img src="${draft.logo}" alt="Business logo preview" />` : 'Logo preview';
    shell(`${progress(2)}<div class="eyebrow">Step 2 of 4</div><h2>Branding</h2><p>Add a logo and choose a primary color. Both can be changed later.</p><div class="form-grid"><div class="field"><label>Business logo</label><div class="logo-preview" id="logoPreview">${logo}</div><input type="file" id="logoInput" accept="image/*" /></div><div class="field"><label>Primary color</label><div class="color-row">${['#2563eb','#0f766e','#7c3aed','#111827'].map(c=>`<button type="button" class="color-swatch ${draft.primaryColor===c?'selected':''}" data-color="${c}" style="background:${c}" aria-label="Choose ${c}"></button>`).join('')}</div></div></div><div class="actions"><button class="primary" id="nextBtn">Next</button><button class="ghost" id="backBtn">Back</button></div>`);
    document.querySelectorAll('[data-color]').forEach(btn => btn.onclick = () => { draft.primaryColor = btn.dataset.color; applyBrand(); renderBranding(); });
    document.getElementById('logoInput').onchange = e => {
      const file = e.target.files?.[0]; if (!file) return;
      if (file.size > 2_000_000) { alert('Please choose an image smaller than 2 MB.'); return; }
      const reader = new FileReader(); reader.onload = () => { draft.logo = reader.result; renderBranding(); }; reader.readAsDataURL(file);
    };
    document.getElementById('nextBtn').onclick = () => setStep(3);
    document.getElementById('backBtn').onclick = () => setStep(1);
  }
  function renderRegional() {
    shell(`${progress(3)}<div class="eyebrow">Step 3 of 4</div><h2>Regional settings</h2><p>Choose the defaults used for dates and currency.</p><div class="form-grid"><div class="grid-2"><div class="field"><label>Country</label><select data-field="country"><option>Canada</option><option>United States</option><option>United Kingdom</option><option>Australia</option><option>Other</option></select></div><div class="field"><label>Currency</label><select data-field="currency"><option>CAD</option><option>USD</option><option>GBP</option><option>AUD</option><option>EUR</option></select></div></div><div class="grid-2"><div class="field"><label>Language</label><select data-field="language"><option>English</option><option>French</option><option>Chinese</option></select></div><div class="field"><label>Date format</label><select data-field="dateFormat"><option>YYYY-MM-DD</option><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option></select></div></div></div><div class="actions"><button class="primary" id="finishBtn">Finish Setup</button><button class="ghost" id="backBtn">Back</button></div>`);
    document.querySelector('[data-field="country"]').value = draft.country;
    document.querySelector('[data-field="currency"]').value = draft.currency;
    document.querySelector('[data-field="language"]').value = draft.language;
    document.querySelector('[data-field="dateFormat"]').value = draft.dateFormat;
    document.getElementById('finishBtn').onclick = () => { readForm(); saveBusiness(); setStep(4); };
    document.getElementById('backBtn').onclick = () => setStep(2);
  }
  function renderSuccess() {
    shell(`${progress(4)}<div class="brand-mark">✓</div><div class="eyebrow">Setup complete</div><h2>Your business is ready.</h2><p><strong>${esc(draft.companyName)}</strong> is now the active business profile. The next step will be adding customers and recurring billing.</p><div class="actions"><button class="primary" id="continueBtn">Open Dashboard</button></div>`);
    document.getElementById('continueBtn').onclick = renderDashboard;
  }
  function renderDashboard() {
    applyBrand();
    const logo = draft.logo ? `<img src="${draft.logo}" alt="${esc(draft.companyName)} logo" />` : esc((draft.companyName || 'R').slice(0,2).toUpperCase());
    app.innerHTML = `<header class="topbar"><div class="company"><div class="company-logo">${logo}</div><div><strong>${esc(draft.companyName)}</strong><div class="small">Invoice Automation</div></div></div><button class="icon-btn" id="settingsBtn" aria-label="Business settings">⚙</button></header><section class="hero"><div class="eyebrow" style="color:rgba(255,255,255,.85)">Alpha Build 001</div><h2>Business setup complete</h2><p>Your reusable business profile is ready. Customer Manager and Recurring Billing arrive in the next build.</p></section><section class="cards"><article class="card"><div class="card-row"><div><strong>Business profile</strong><p class="small">${esc(draft.country)} · ${esc(draft.currency)} · ${esc(draft.dateFormat)}</p></div><span class="status">Ready</span></div></article><article class="card"><div class="empty"><h2>No customers yet</h2><p>Build 002 will add customer profiles and recurring billing schedules.</p><button class="secondary" id="previewBtn">Preview next step</button></div></article><article class="card"><div class="card-row"><div><strong>Local data</strong><p class="small">Saved on this device only.</p></div><button class="ghost" id="exportBtn" style="width:auto">Export</button></div></article></section>`;
    document.getElementById('settingsBtn').onclick = () => { step = 1; render(); };
    document.getElementById('previewBtn').onclick = () => alert('Next build: Customer Manager + Recurring Billing.');
    document.getElementById('exportBtn').onclick = exportProfile;
  }
  function exportProfile() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'runlu-business-profile.json'; a.click(); URL.revokeObjectURL(a.href);
  }
  function render() {
    applyBrand();
    if (step === 0) renderWelcome();
    else if (step === 1) renderBusiness();
    else if (step === 2) renderBranding();
    else if (step === 3) renderRegional();
    else renderSuccess();
  }

  if (loadBusiness()?.companyName) renderDashboard(); else render();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('service-worker.js').catch(()=>{});
})();
