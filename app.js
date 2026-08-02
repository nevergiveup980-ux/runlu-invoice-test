(() => {
  'use strict';

  const STORAGE_KEY = 'runlu_invoice_alpha_business_v2';
  const LEGACY_KEY = 'runlu_invoice_alpha_business_v1';
  const app = document.getElementById('app');
  let step = 0;
  let mode = 'setup';

  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const DEFAULTS = {
    companyName: '', legalName: '', businessNumber: '', email: '', phone: '', address: '', website: '',
    logo: '', primaryColor: '#2563eb', country: 'Canada', currency: 'CAD', language: 'English', dateFormat: 'MMMM D, YYYY',
    billingPeriod: defaultMonth,
    invoiceDate: '',
    sendDate: '',
    reminderTime: '07:00',
    followUpTime: '10:00',
    weekendRule: 'previous-friday',
    holidayRule: 'previous-business-day',
    previousInvoiceNumber: '0',
    invoicePrefix: '',
    createdAt: '', updatedAt: ''
  };

  let draft = loadBusiness() || {...DEFAULTS};
  normalizeDraft();

  function loadBusiness() {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      if (current) return JSON.parse(current);
      const legacy = localStorage.getItem(LEGACY_KEY);
      return legacy ? {...DEFAULTS, ...JSON.parse(legacy)} : null;
    } catch { return null; }
  }

  function normalizeDraft() {
    draft = {...DEFAULTS, ...draft};
    if (!draft.billingPeriod) draft.billingPeriod = defaultMonth;
    if (!draft.invoiceDate || !draft.sendDate) recalculateDates(false);
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

  function esc(v='') {
    return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function parseLocalDate(value) {
    if (!value) return null;
    const [y,m,d] = value.split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
  }

  function toDateInput(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2,'0');
    const d = String(date.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  }

  function monthEnd(period) {
    const [y,m] = period.split('-').map(Number);
    return new Date(y, m, 0, 12, 0, 0);
  }

  function applyWeekendRule(date, rule) {
    const d = new Date(date);
    const day = d.getDay();
    if (rule === 'exact-date') return d;
    if (rule === 'previous-friday') {
      if (day === 6) d.setDate(d.getDate() - 1);
      if (day === 0) d.setDate(d.getDate() - 2);
    } else if (rule === 'next-monday') {
      if (day === 6) d.setDate(d.getDate() + 2);
      if (day === 0) d.setDate(d.getDate() + 1);
    }
    return d;
  }

  function recalculateDates(overwrite = true) {
    const natural = monthEnd(draft.billingPeriod || defaultMonth);
    const adjusted = applyWeekendRule(natural, draft.weekendRule || 'previous-friday');
    if (overwrite || !draft.invoiceDate) draft.invoiceDate = toDateInput(adjusted);
    if (overwrite || !draft.sendDate) draft.sendDate = toDateInput(adjusted);
  }

  function formatDate(value) {
    const date = parseLocalDate(value);
    if (!date) return 'Not set';
    const locale = draft.language === 'French' ? 'fr-CA' : draft.language === 'Chinese' ? 'zh-CN' : 'en-CA';
    const options = draft.dateFormat === 'YYYY-MM-DD'
      ? {year:'numeric', month:'2-digit', day:'2-digit'}
      : draft.dateFormat === 'MM/DD/YYYY'
      ? {year:'numeric', month:'2-digit', day:'2-digit'}
      : {year:'numeric', month:'long', day:'numeric', weekday:'long'};
    if (draft.dateFormat === 'YYYY-MM-DD') return value;
    if (draft.dateFormat === 'MM/DD/YYYY') {
      const [y,m,d] = value.split('-'); return `${m}/${d}/${y}`;
    }
    if (draft.dateFormat === 'DD/MM/YYYY') {
      const [y,m,d] = value.split('-'); return `${d}/${m}/${y}`;
    }
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  function formatMonth(period) {
    const [y,m] = period.split('-').map(Number);
    return new Intl.DateTimeFormat(draft.language === 'Chinese' ? 'zh-CN' : 'en-CA', {month:'long', year:'numeric'}).format(new Date(y,m-1,1));
  }

  function progress(active) {
    return `<div class="progress" aria-label="Setup progress">${[1,2,3,4,5].map(i=>`<span class="${i<=active?'active':''}"></span>`).join('')}</div>`;
  }

  function shell(content) {
    app.innerHTML = `<section class="center-page"><div class="panel">${content}</div></section>`;
  }

  function setStep(next) {
    step = next;
    render();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function readForm() {
    document.querySelectorAll('[data-field]').forEach(el => {
      draft[el.dataset.field] = (el.value ?? '').trim();
    });
  }

  function requireCompany() {
    const input = document.querySelector('[data-field="companyName"]');
    if (!input.value.trim()) {
      input.focus();
      input.setCustomValidity('Company name is required.');
      input.reportValidity();
      input.setCustomValidity('');
      return false;
    }
    return true;
  }

  function renderWelcome() {
    shell(`<div class="brand-mark">RL</div><div class="eyebrow">RUNLU</div><h1>Invoice Automation</h1><p>Set up your business once. Prepare recurring invoices with less typing and fewer repeated steps.</p><div class="actions"><button class="primary" id="startBtn">Get Started</button></div><p class="small">Alpha Build 002 · Your data stays on this device.</p>`);
    document.getElementById('startBtn').onclick = () => setStep(1);
  }

  function renderBusiness() {
    shell(`${progress(1)}<div class="eyebrow">Step 1 of 5</div><h2>Business information</h2><p>Start with the details needed to identify your business. You can edit them later.</p><div class="form-grid"><div class="field"><label>Company name *</label><input data-field="companyName" value="${esc(draft.companyName)}" autocomplete="organization" /></div><div class="field"><label>Legal name <span class="small">(optional)</span></label><input data-field="legalName" value="${esc(draft.legalName)}" /></div><div class="field"><label>Business number <span class="small">(optional)</span></label><input data-field="businessNumber" value="${esc(draft.businessNumber)}" /></div></div><div class="actions"><button class="primary" id="nextBtn">Next</button><button class="ghost" id="backBtn">Back</button></div>`);
    document.getElementById('nextBtn').onclick = () => { if (!requireCompany()) return; readForm(); setStep(2); };
    document.getElementById('backBtn').onclick = () => setStep(0);
  }

  function renderBranding() {
    const logo = draft.logo ? `<img src="${draft.logo}" alt="Business logo preview" />` : 'Logo preview';
    shell(`${progress(2)}<div class="eyebrow">Step 2 of 5</div><h2>Branding</h2><p>Add a logo and choose a primary color. Both can be changed later.</p><div class="form-grid"><div class="field"><label>Business logo</label><div class="logo-preview" id="logoPreview">${logo}</div><input type="file" id="logoInput" accept="image/*" /></div><div class="field"><label>Primary color</label><div class="color-row">${['#2563eb','#0f766e','#7c3aed','#111827'].map(c=>`<button type="button" class="color-swatch ${draft.primaryColor===c?'selected':''}" data-color="${c}" style="background:${c}" aria-label="Choose ${c}"></button>`).join('')}</div></div></div><div class="actions"><button class="primary" id="nextBtn">Next</button><button class="ghost" id="backBtn">Back</button></div>`);
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
    shell(`${progress(3)}<div class="eyebrow">Step 3 of 5</div><h2>Regional settings</h2><p>Choose the defaults used for dates and currency.</p><div class="form-grid"><div class="grid-2"><div class="field"><label>Country</label><select data-field="country"><option>Canada</option><option>United States</option><option>United Kingdom</option><option>Australia</option><option>Other</option></select></div><div class="field"><label>Currency</label><select data-field="currency"><option>CAD</option><option>USD</option><option>GBP</option><option>AUD</option><option>EUR</option></select></div></div><div class="grid-2"><div class="field"><label>Language</label><select data-field="language"><option>English</option><option>French</option><option>Chinese</option></select></div><div class="field"><label>Date format</label><select data-field="dateFormat"><option>MMMM D, YYYY</option><option>YYYY-MM-DD</option><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option></select></div></div></div><div class="actions"><button class="primary" id="nextBtn">Next</button><button class="ghost" id="backBtn">Back</button></div>`);
    ['country','currency','language','dateFormat'].forEach(k => document.querySelector(`[data-field="${k}"]`).value = draft[k]);
    document.getElementById('nextBtn').onclick = () => { readForm(); setStep(4); };
    document.getElementById('backBtn').onclick = () => setStep(2);
  }

  function renderBilling() {
    shell(`${progress(4)}<div class="eyebrow">Step 4 of 5</div><h2>Billing preferences</h2><p>Set the billing period, dates, reminder times and invoice numbering. Every value can be changed later.</p>
      <div class="form-grid">
        <div class="grid-2">
          <div class="field"><label>Billing period</label><input type="month" data-field="billingPeriod" value="${esc(draft.billingPeriod)}" /></div>
          <div class="field"><label>Weekend rule</label><select data-field="weekendRule"><option value="previous-friday">Move to previous Friday</option><option value="next-monday">Move to next Monday</option><option value="exact-date">Keep exact date</option></select></div>
        </div>
        <div class="grid-2">
          <div class="field"><label>Invoice date</label><input type="date" data-field="invoiceDate" value="${esc(draft.invoiceDate)}" /></div>
          <div class="field"><label>Send date</label><input type="date" data-field="sendDate" value="${esc(draft.sendDate)}" /></div>
        </div>
        <button type="button" class="secondary compact" id="calcDatesBtn">Recalculate from month end</button>
        <div class="grid-2">
          <div class="field"><label>First reminder</label><input type="time" data-field="reminderTime" value="${esc(draft.reminderTime)}" /></div>
          <div class="field"><label>Follow-up reminder</label><input type="time" data-field="followUpTime" value="${esc(draft.followUpTime)}" /></div>
        </div>
        <div class="grid-2">
          <div class="field"><label>Previous invoice number</label><input inputmode="numeric" pattern="[0-9]*" data-field="previousInvoiceNumber" value="${esc(draft.previousInvoiceNumber)}" /></div>
          <div class="field"><label>Invoice prefix <span class="small">(optional)</span></label><input data-field="invoicePrefix" value="${esc(draft.invoicePrefix)}" placeholder="INV-" /></div>
        </div>
        <div class="preview-strip" id="numberPreview"></div>
      </div>
      <div class="actions"><button class="primary" id="finishBtn">Finish Setup</button><button class="ghost" id="backBtn">Back</button></div>`);

    document.querySelector('[data-field="weekendRule"]').value = draft.weekendRule;
    const fields = [...document.querySelectorAll('[data-field]')];
    const updatePreview = () => {
      readForm();
      const n = Math.max(0, parseInt(draft.previousInvoiceNumber || '0',10) || 0);
      const p = draft.invoicePrefix || '';
      document.getElementById('numberPreview').innerHTML = `<strong>Next numbers:</strong> ${esc(p + (n+1))} · ${esc(p + (n+2))}`;
    };
    fields.forEach(el => el.addEventListener('input', updatePreview));
    updatePreview();
    document.getElementById('calcDatesBtn').onclick = () => {
      readForm(); recalculateDates(true); renderBilling();
    };
    document.getElementById('finishBtn').onclick = () => { readForm(); saveBusiness(); setStep(5); };
    document.getElementById('backBtn').onclick = () => setStep(3);
  }

  function renderSuccess() {
    shell(`${progress(5)}<div class="brand-mark">✓</div><div class="eyebrow">Setup complete</div><h2>Your business is ready.</h2><p><strong>${esc(draft.companyName)}</strong> is now active. Billing dates and invoice numbering can be edited at any time.</p><div class="actions"><button class="primary" id="continueBtn">Open Dashboard</button></div>`);
    document.getElementById('continueBtn').onclick = renderDashboard;
  }

  function billingSummaryCard() {
    const natural = monthEnd(draft.billingPeriod);
    const naturalText = formatDate(toDateInput(natural));
    const next = Math.max(0, parseInt(draft.previousInvoiceNumber || '0',10) || 0) + 1;
    return `<article class="card billing-card">
      <div class="card-row"><div><div class="eyebrow">Current billing period</div><h2>${esc(formatMonth(draft.billingPeriod))}</h2></div><span class="status">Preparing</span></div>
      <div class="summary-grid">
        <div><span>Natural month end</span><strong>${esc(naturalText)}</strong></div>
        <div><span>Invoice date</span><strong>${esc(formatDate(draft.invoiceDate))}</strong></div>
        <div><span>Send date</span><strong>${esc(formatDate(draft.sendDate))}</strong></div>
        <div><span>Reminder</span><strong>${esc(draft.reminderTime)}</strong></div>
      </div>
      <div class="notice success-note">Send day: <strong>${esc(formatDate(draft.sendDate))}</strong>. Prepare the package before then.</div>
      <div class="number-line"><span>Next invoice number</span><strong>${esc((draft.invoicePrefix || '') + next)}</strong></div>
      <button class="secondary" id="editBillingBtn">Edit billing preferences</button>
    </article>`;
  }

  function renderDashboard() {
    applyBrand();
    const logo = draft.logo ? `<img src="${draft.logo}" alt="${esc(draft.companyName)} logo" />` : esc((draft.companyName || 'R').slice(0,2).toUpperCase());
    app.innerHTML = `<header class="topbar"><div class="company"><div class="company-logo">${logo}</div><div><strong>${esc(draft.companyName)}</strong><div class="small">Invoice Automation</div></div></div><button class="icon-btn" id="settingsBtn" aria-label="Business settings">⚙</button></header>
      <section class="hero"><div class="eyebrow" style="color:rgba(255,255,255,.85)">Alpha Build 002</div><h2>Business setup complete</h2><p>Your business and billing preferences are ready. Customer Manager arrives in the next build.</p></section>
      <section class="cards">
        ${billingSummaryCard()}
        <article class="card"><div class="card-row"><div><strong>Business profile</strong><p class="small">${esc(draft.country)} · ${esc(draft.currency)} · ${esc(draft.dateFormat)}</p></div><span class="status">Ready</span></div></article>
        <article class="card"><div class="empty"><h2>No customers yet</h2><p>Build 003 will add customer profiles and recurring billing schedules.</p><button class="secondary" id="previewBtn">Preview next step</button></div></article>
        <article class="card"><div class="card-row"><div><strong>Local data</strong><p class="small">Saved on this device only.</p></div><button class="ghost" id="exportBtn" style="width:auto">Export</button></div></article>
      </section>`;
    document.getElementById('settingsBtn').onclick = () => { mode='edit'; step = 1; render(); };
    document.getElementById('editBillingBtn').onclick = () => { mode='edit'; step = 4; render(); };
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
    else if (step === 4) renderBilling();
    else renderSuccess();
  }

  if (loadBusiness()?.companyName) renderDashboard(); else render();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('service-worker.js').catch(()=>{});
})();
