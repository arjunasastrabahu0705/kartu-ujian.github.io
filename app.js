// app.js — frontend logic
// IMPORTANT: set GAS_WEB_APP_URL below to your deployed Apps Script URL
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwrnb5mtNHbA5GRbIQmjeCI_oJPkMT4uCX68j_4Lu3hMEfa8XVooto8aueNBZUXwvbjiA/exec'; // <-- Paste your Web App URL here (e.g. https://script.google.com/macros/s/AK.../exec)

const btnLoad = document.getElementById('btnLoad');
const btnPrint = document.getElementById('btnPrint');
const previewArea = document.getElementById('previewArea');
const inputGas = document.getElementById('gasUrl');

inputGas.addEventListener('input', e => {
  btnLoad.disabled = !e.target.value.trim();
});

btnLoad.addEventListener('click', async () => {
  const url = inputGas.value.trim() || GAS_WEB_APP_URL;
  const kelas = document.getElementById("selectKelas").value;

  btnLoad.disabled = true;
  btnLoad.textContent = 'Memuat...';

  try {
    const data = await fetchKartu(url, kelas);
    renderPages(data);
  } catch (err) {
    alert('Gagal memuat: ' + err.message);
  } finally {
    btnLoad.disabled = false;
    btnLoad.textContent = 'Muat Data';
  }
});


btnPrint.addEventListener('click', () => {
  window.print();
});

// fetch helper: tries JSON, falls back to JSONP
async function fetchKartu(url, kelas) {
  try {
    const u = new URL(url);
    u.searchParams.set('action', 'getKartu');
    if (kelas) u.searchParams.set('kelas', kelas);

    const res = await fetch(u.toString(), { method: 'GET', cache: 'no-store' });

    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return await res.json();

    const txt = await res.text();
    try { return JSON.parse(txt); } catch(e){}
  } catch(e){}

  // fallback JSONP
  return new Promise((resolve, reject) => {
    const cbName = 'cb_' + Math.random().toString(36).slice(2);
    window[cbName] = (data) => {
      resolve(data);
      delete window[cbName];
      script.remove();
    };
    const script = document.createElement('script');
    let sUrl = url + (url.indexOf('?') === -1 ? '?' : '&') + 'action=getKartu&callback=' + cbName;
    if (kelas) sUrl += '&kelas=' + encodeURIComponent(kelas);
    script.src = sUrl;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}


/* RENDERING PAGES (2 cols x 3 rows) - reuses safe layout from earlier */
function buildCard(d) {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <div class="header">
      <img src="https://i.imgur.com/fP90o6P.png" alt="logo1">
      <div class="header-text">
        <div>KARTU LOGIN PAS GANJIL 2025</div>
        <div>SMAN 1 WARUNGGUNUNG</div>
      </div>
      <img src="https://i.imgur.com/pckiPOg.png" alt="logo2">
    </div>

    <div class="header-line"></div>

    <div class="biodata">
      <div class="row"><div class="label">Nama Peserta</div><div class="value">${escapeHtml(d.nama)}</div></div>
      <div class="row"><div class="label">Kelas</div><div class="value">${escapeHtml(d.kelas)}</div></div>
      <div class="row"><div class="label">Nomor Peserta</div><div class="value">${escapeHtml(d.nomor)}</div></div>
      <div class="row"><div class="label">Ruang</div><div class="value">${escapeHtml(d.ruang)}</div></div>
      <div class="row"><div class="label">Username</div><div class="value">${escapeHtml(d.username)}</div></div>
      <div class="row"><div class="label">Password</div><div class="value">${escapeHtml(d.password)}</div></div>
    </div>

    <div class="footer">
      <div class="foto">${d.foto ? `<img src="${escapeAttr(d.foto)}">` : 'FOTO'}</div>
      <div class="ttd">
        <div>Warunggunung, 1 Desember 2025</div>
        <div class="spacer"></div>
        <div class="nama-kepsek">Drs. H. Bambang Wiratmo, M.Pd</div>
        <div class="nip">NIP. 196511201991111001</div>
      </div>
    </div>

    <div class="bottom-line"></div>
  `;
  return card;
}

function renderPages(items) {
  previewArea.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'print-area';

  for (let i = 0; i < items.length; i += 6) {
    const page = document.createElement('div');
    page.className = 'page';
    const chunk = items.slice(i, i + 6);
    for (let j = 0; j < 6; j++) {
      const cell = document.createElement('div');
      if (chunk[j]) cell.appendChild(buildCard(chunk[j]));
      page.appendChild(cell);
    }
    wrapper.appendChild(page);
  }

  previewArea.appendChild(wrapper);
}

/* helper to avoid XSS in text content */
function escapeHtml(s){ if(s==null) return ''; return String(s).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }
function escapeAttr(s){ return escapeHtml(s).replace(/"/g,'&quot;'); }
