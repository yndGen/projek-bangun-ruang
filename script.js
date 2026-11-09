const shapes = {
  kubus: {
    title: 'Kubus',
    desc: 'Enam sisi kotak sama besar, contohnya dadu!',
    tint: '#fda4af',
    pi: false,
    fields: ['Panjang sisi (s)'],
    image: 'kubus.png'
  },
  bola: {
    title: 'Bola',
    desc: 'Bulat sempurna ke segala arah, seperti bola sepak!',
    tint: '#7dd3fc',
    pi: true,
    fields: ['Jari-jari (r)'],
    image: 'bola.png'
  },
  kerucut: {
    title: 'Kerucut',
    desc: 'Alas bundar lancip ke atas, mirip topi ulang tahun!',
    tint: '#fdba74',
    pi: true,
    fields: ['Jari-jari (r)', 'Garis Pelukis (s)', 'Tinggi (t)'],
    image: 'kerucut.png'
  },
  tabung: {
    title: 'Tabung',
    desc: 'Alas dan tutupnya lingkaran kembar, seperti kaleng!',
    tint: '#86efac',
    pi: true,
    fields: ['Jari-jari (r)', 'Tinggi (t)'],
    image: 'tabung.png'
  }
};

const tabs = document.querySelectorAll('.tab');
const avatar = document.getElementById('avatar');
const title = document.getElementById('title');
const desc = document.getElementById('desc');
const inputs = document.getElementById('inputs');
const opts = document.getElementById('opts');
const piBox = document.getElementById('piBox');
const form = document.getElementById('form');
const msg = document.getElementById('msg');
const modeBtn = document.getElementById('modeBtn');

let active = 'bola';

function renderAvatar(s) {
  if (s.image) {
    avatar.innerHTML = `<img src="${s.image}" alt="${s.title}">`;
  } else {
    avatar.innerHTML = s.svg || '';
  }
}

// Filter input: hanya angka + satu koma desimal
function attachInputFilter() {
  const inputElements = inputs.querySelectorAll('input');
  inputElements.forEach((el) => {
    el.addEventListener('input', () => {
      let filtered = el.value.replace(/[^0-9.,]/g, '');
      filtered = filtered.replace(/\./g, ','); // titik → koma
      const parts = filtered.split(',');
      if (parts.length > 2) {
        filtered = parts[0] + ',' + parts.slice(1).join('');
      }
      if (el.value !== filtered) el.value = filtered;
    });
  });
}

// Helper parsing & format angka
function parseNum(val) {
  if (!val) return 0;
  return parseFloat(val.trim().replace(',', '.')) || 0;
}

function formatNum(num) {
  return num.toFixed(2).replace('.', ',');
}

// Inisialisasi awal
renderAvatar(shapes[active]);
inputs.innerHTML = shapes[active].fields
  .map((f) => `<label>${f}<input type="text" inputmode="decimal" placeholder="Isi angka"></label>`)
  .join('');
attachInputFilter();

// Navigasi Tab
tabs.forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.key;
    if (key === active) return;
    active = key;
    const s = shapes[key];

    tabs.forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');
    document.documentElement.style.setProperty('--tint', s.tint);
    msg.hidden = true;

    renderAvatar(s);
    title.textContent = s.title;
    desc.textContent = s.desc;

    inputs.classList.toggle('two', s.fields.length > 1);
    inputs.innerHTML = s.fields
      .map((f) => `<label>${f}<input type="text" inputmode="decimal" placeholder="Isi angka"></label>`)
      .join('');

    attachInputFilter();
    piBox.hidden = !s.pi;
    opts.classList.toggle('two', s.pi);
  });
});

// Ambil satuan dari dropdown
function getSatuan(selects) {
  return selects[0] ? selects[0].value.split(' ')[0] : 'cm';
}

// 1. KUBUS
function hitungKubus(inputElements, selects) {
  const s = parseNum(inputElements[0].value);
  const satuan = getSatuan(selects);

  const volume = s * s * s;
  const luas = 6 * s * s;

  return {
    volume: formatNum(volume),
    luas: formatNum(luas),
    satuanVol: satuan + '³',
    satuanLuas: satuan + '²',
    rumusVol: 'Rumus: s × s × s',
    langkahVol: `V = ${s} × ${s} × ${s}`,
    rumusLuas: 'Rumus: 6 × s × s',
    langkahLuas: `L = 6 × ${s} × ${s}`
  };
}

// 2. BOLA
function hitungBola(inputElements, selects, piVal, piText) {
  const r = parseNum(inputElements[0].value);
  const satuan = getSatuan(selects);

  const volume = (4 / 3) * piVal * r * r * r;
  const luas = 4 * piVal * r * r;

  return {
    volume: formatNum(volume),
    luas: formatNum(luas),
    satuanVol: satuan + '³',
    satuanLuas: satuan + '²',
    rumusVol: 'Rumus: 4/3 × π × r × r × r',
    langkahVol: `V = 4/3 × ${piText} × ${r} × ${r} × ${r}`,
    rumusLuas: 'Rumus: 4 × π × r × r',
    langkahLuas: `L = 4 × ${piText} × ${r} × ${r}`
  };
}

// 3. KERUCUT
function hitungKerucut(inputElements, selects, phi, piText) {
  const r = parseNum(inputElements[0].value);
  const s_pelukis = parseNum(inputElements[1].value);
  const t = parseNum(inputElements[2].value);
  const satuan = getSatuan(selects);

  // Validasi panjang Garis Pelukis
  if (s_pelukis <= t || s_pelukis <= r) {
    return { error: 'Garis pelukis (s) harus lebih panjang dari tinggi (t) dan jari-jari (r)!' };
  }
  // Validasi Pythagoras: 
  const sExpected = Math.sqrt(r * r + t * t);
  if (Math.abs(s_pelukis - sExpected) > 0.1) {
    return { error: `Nilai tidak konsisten. Jika r = ${r} dan t = ${t}, maka s seharusnya sekitar ${formatNum(sExpected)}.` };
  }

  const volume = (1 / 3) * phi * r * r * t;
  const luas = phi * r * (r + s_pelukis);

  return {
    volume: formatNum(volume),
    luas: formatNum(luas),
    satuanVol: satuan + '³',
    satuanLuas: satuan + '²',
    rumusVol: 'Rumus: 1/3 × π × r² × t',
    langkahVol: `V = 1/3 × ${piText} × ${r}² × ${t}`,
    rumusLuas: 'Rumus: π × r × (r + s)',
    langkahLuas: `L = ${piText} × ${r} × (${r} + ${s_pelukis})`
  };
}

// 4. TABUNG
function hitungTabung(inputElements, selects, phi, piText) {
  const r = parseNum(inputElements[0].value);
  const t = parseNum(inputElements[1].value);
  const satuan = getSatuan(selects);

  const volume = phi * r * r * t;
  const luas = 2 * phi * r * (r + t);

  return {
    volume: formatNum(volume),
    luas: formatNum(luas),
    satuanVol: satuan + '³',
    satuanLuas: satuan + '²',
    rumusVol: 'Rumus: π × r² × t',
    langkahVol: `V = ${piText} × ${r}² × ${t}`,
    rumusLuas: 'Rumus: 2 × π × r × (r + t)',
    langkahLuas: `L = 2 × ${piText} × ${r} × (${r} + ${t})`
  };
}

// PENGHUBUNG UTAMA
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let empty = false;
  const inputElements = inputs.querySelectorAll('input');

  inputElements.forEach((el) => {
    if (!el.value.trim()) {
      empty = true;
      el.classList.add('err');
    } else {
      el.classList.remove('err');
    }
  });

  if (empty) {
    msg.hidden = true;
    return;
  }

  const selects = opts.querySelectorAll('select');
  let piVal = 3.14;
  let piText = '3,14';
  if (shapes[active].pi) {
    const piSelect = selects[selects.length - 1];
    if (piSelect) {
      piVal = piSelect.value === '22/7' ? 22 / 7 : 3.14;
      piText = piSelect.value === '22/7' ? '22/7' : '3,14';
    }
  }

  let hasilData;

  if (active === 'kubus') {
    hasilData = hitungKubus(inputElements, selects);
  } else if (active === 'bola') {
    hasilData = hitungBola(inputElements, selects, piVal, piText);
  } else if (active === 'kerucut') {
    hasilData = hitungKerucut(inputElements, selects, piVal, piText);
  } else if (active === 'tabung') {
    hasilData = hitungTabung(inputElements, selects, piVal, piText);
  }

  if (hasilData.error) {
    msg.innerHTML = `
      <div style="background: #f43f5e; color: white; padding: 16px; border-radius: 14px; border: 2px solid var(--ink); text-align: center; font-weight: bold;">
        ⚠️ ${hasilData.error}
      </div>
    `;
    msg.hidden = false;
    return;
  }

  msg.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr; gap: 14px; text-align: left;">
      <div style="background: var(--card); padding: 16px; border-radius: 14px; border: 2px solid var(--ink); color: var(--ink);">
        <b style="font-size: 1.05rem;">📦 Volume (isi)</b><br>
        <div style="font-size: 0.9rem; color: var(--sub); margin-top: 6px; line-height: 1.5;">
          <div>${hasilData.rumusVol}</div>
          <div style="font-family: monospace; font-weight: bold; font-size: 0.95rem; color: var(--ink);">${hasilData.langkahVol}</div>
        </div>
        <div style="margin-top: 10px; font-size: 1.25rem; font-weight: 900; background: var(--tint); color: #1e2230; padding: 10px; border-radius: 12px; border: 2px solid var(--ink); text-align: center;">
          ${hasilData.volume} ${hasilData.satuanVol}
        </div>
      </div>

      <div style="background: var(--card); padding: 16px; border-radius: 14px; border: 2px solid var(--ink); color: var(--ink);">
        <b style="font-size: 1.05rem;">🎨 Luas permukaan (kulit)</b><br>
        <div style="font-size: 0.9rem; color: var(--sub); margin-top: 6px; line-height: 1.5;">
          <div>${hasilData.rumusLuas}</div>
          <div style="font-family: monospace; font-weight: bold; font-size: 0.95rem; color: var(--ink);">${hasilData.langkahLuas}</div>
        </div>
        <div style="margin-top: 10px; font-size: 1.25rem; font-weight: 900; background: var(--tint); color: #1e2230; padding: 10px; border-radius: 12px; border: 2px solid var(--ink); text-align: center;">
          ${hasilData.luas} ${hasilData.satuanLuas}
        </div>
      </div>
    </div>
  `;
  msg.hidden = false;
});

// Toggle Dark Mode
modeBtn.addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark');
  modeBtn.textContent = dark ? '☀️' : '🌙';
});