// ============================================================
// MASUKKAN URL WEB APP ANDA DI SINI
// ============================================================
const GAS_FALLBACK = "https://script.google.com/macros/s/AKfycbwrnb5mtNHbA5GRbIQmjeCI_oJPkMT4uCX68j_4Lu3hMEfa8XVooto8aueNBZUXwvbjiA/exec"; 
// contoh: https://script.google.com/macros/s/AKxxxxxxxxxxxxxxxxxxxx/exec


const previewArea = document.getElementById("previewArea");

document.getElementById("btnLoad").onclick = async () => {

  const inputUrl = document.getElementById("gasUrl").value.trim();
  const kelas = document.getElementById("selectKelas").value;

  // Jika input kosong → pakai fallback GAS
  const baseUrl = inputUrl || GAS_FALLBACK;

  if(!baseUrl){
    alert("Masukkan URL GAS Web App atau isi GAS_FALLBACK.");
    return;
  }

  const fullUrl = baseUrl + "?action=getKartu" + (kelas ? "&kelas=" + kelas : "");

  const data = await fetch(fullUrl).then(r => r.json());

  renderPages(data);
};

document.getElementById("btnPrint").onclick = () => {
  window.print();
};

/* ============================================================
   CARD BUILDER
============================================================ */
function buildCard(d){
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <div class="header">
      <img src="https://i.imgur.com/fP90o6P.png">
      <div class="header-text">
        <div>KARTU LOGIN PAS GANJIL 2025</div>
        <div>SMAN 1 WARUNGGUNUNG</div>
      </div>
      <img src="https://i.imgur.com/pckiPOg.png">
    </div>

    <div class="header-line"></div>

    <div class="biodata">
      <div class="row"><div class="label">Nama Peserta</div><div class="value">${d.nama}</div></div>
      <div class="row"><div class="label">Kelas</div><div class="value">${d.kelas}</div></div>
      <div class="row"><div class="label">Nomor Peserta</div><div class="value">${d.nomor}</div></div>
      <div class="row"><div class="label">Ruang</div><div class="value">${d.ruang}</div></div>
      <div class="row"><div class="label">Username</div><div class="value">${d.username}</div></div>
      <div class="row"><div class="label">Password</div><div class="value">${d.password}</div></div>
    </div>

    <div class="footer">
      <div class="foto">${d.foto ? `<img src="${d.foto}">` : "FOTO"}</div>
      <div class="ttd">
        <div>Warunggunung, 28 Nopember 2025</div>
        <div class="spacer"></div>
        <div class="nama-kepsek">Drs. H. Bambang Wiratmo, M.Pd</div>
        <div class="nip">NIP. 196511201991111001</div>
      </div>
    </div>

    <div class="bottom-line"></div>
  `;

  return div;
}

/* ============================================================
   PAGE RENDER (2×3)
============================================================ */
function renderPages(items) {
  previewArea.innerHTML = '';

  const wrap = document.createElement("div");
  wrap.className = "print-area";

  for (let i = 0; i < items.length; i += 6) {

    const page = document.createElement("div");
    page.className = "page";

    const chunk = items.slice(i, i + 6);

    for (let j = 0; j < 6; j++) {
      const cell = document.createElement("div");
      if (chunk[j]) cell.appendChild(buildCard(chunk[j]));
      page.appendChild(cell);
    }

    wrap.appendChild(page);
  }

  previewArea.appendChild(wrap);
}

