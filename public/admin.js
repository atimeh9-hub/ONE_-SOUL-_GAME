(() => {
  const $ = (id) => document.getElementById(id);
  const loginView = $('loginView'), dashboardView = $('dashboardView');
  let token = sessionStorage.getItem('onesoul_admin_token') || '';
  let selectedType = 'all', allMessages = [];

  async function api(path, options = {}) {
    const response = await fetch(path, { ...options, headers: { 'Content-Type':'application/json', ...(token ? { Authorization:`Bearer ${token}` } : {}), ...(options.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    return data;
  }
  function showDashboard() { loginView.hidden = true; dashboardView.hidden = false; }
  function showLogin() { dashboardView.hidden = true; loginView.hidden = false; }
  function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function niceDate(value) { const d = new Date(String(value).replace(' ', 'T') + (String(value).includes('Z') ? '' : 'Z')); return Number.isNaN(d.getTime()) ? value : d.toLocaleString(); }

  $('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); $('loginError').textContent = '';
    try {
      const result = await api('/api/auth/login', { method:'POST', body:JSON.stringify({ email:$('email').value.trim(), password:$('password').value }) });
      if (result.user?.role !== 'admin') throw new Error('This account does not have admin permissions.');
      token = result.token; sessionStorage.setItem('onesoul_admin_token', token); showDashboard(); await loadAll();
    } catch (error) { token = ''; sessionStorage.removeItem('onesoul_admin_token'); $('loginError').textContent = error.message; }
  });
  $('logoutBtn').addEventListener('click', () => { token=''; sessionStorage.removeItem('onesoul_admin_token'); allMessages=[]; $('messages').innerHTML=''; showLogin(); });
  document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => {
    selectedType = button.dataset.type; document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b===button)); loadMessages();
  }));
  $('refreshBtn').addEventListener('click', loadMessages);
  $('auditBtn').addEventListener('click', loadAudit);
  $('searchInput').addEventListener('input', renderMessages);

  async function loadAll() { await Promise.all([loadMessages(), loadAudit()]); }
  async function loadMessages() {
    $('status').textContent = 'Loading chat messages…';
    try {
      const params = new URLSearchParams({ limit:'200' });
      if (selectedType !== 'all') params.set('type', selectedType);
      const result = await api(`/api/admin/chats?${params.toString()}`);
      allMessages = result.messages || []; renderMessages(); $('status').textContent = `Loaded ${allMessages.length} most recent messages. This view is not a live feed.`;
    } catch (error) { $('status').textContent = error.message; if (/login|required|admin/i.test(error.message)) signOutToLogin(); }
  }
  function renderMessages() {
    const term = $('searchInput').value.trim().toLowerCase();
    const rows = allMessages.filter(m => [m.body,m.sender,m.recipient,m.room_code,m.conversation_key].some(v=>String(v||'').toLowerCase().includes(term)));
    $('countLabel').textContent = `${rows.length} shown`;
    $('messages').innerHTML = rows.length ? rows.map(m => `<article class="message"><div class="message-top"><span class="kind">${escapeHtml(m.conversation_type)} chat</span><span>${escapeHtml(niceDate(m.created_at))}</span></div><div class="message-top"><span>From: <strong>${escapeHtml(m.sender)}</strong>${m.conversation_type==='private' ? ` · To: <strong>${escapeHtml(m.recipient || 'Unknown')}</strong>` : ` · Room: <strong>${escapeHtml(m.room_code || m.conversation_key)}</strong>`}</span><span>Message #${escapeHtml(m.id)}</span></div><div class="message-body">${escapeHtml(m.body)}</div></article>`).join('') : '<div class="message muted">No messages match this view.</div>';
  }
  async function loadAudit() {
    $('auditLog').innerHTML = '<p class="muted">Loading audit history…</p>';
    try {
      const result = await api('/api/admin/audit-log'); const rows = result.events || [];
      $('auditLog').innerHTML = rows.length ? rows.map(e=>`<div class="audit-item"><span><strong>${escapeHtml(e.admin)}</strong> · ${escapeHtml(e.action)} · ${escapeHtml(e.target)}</span><span>${escapeHtml(niceDate(e.created_at))}</span></div>`).join('') : '<p class="muted">No admin review events yet.</p>';
    } catch(error) { $('auditLog').innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`; }
  }
  function signOutToLogin() { token=''; sessionStorage.removeItem('onesoul_admin_token'); showLogin(); }
  if (token) { showDashboard(); loadAll().catch(()=>signOutToLogin()); } else showLogin();
})();
