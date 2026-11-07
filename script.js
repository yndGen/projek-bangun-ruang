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
    image: 'bola.png'  },

  kerucut: {
    title: 'Kerucut',
    desc: 'Alas bundar lancip ke atas, mirip topi ulang tahun!',
    tint: '#fdba74',
    pi: true,
    fields: ['Jari-jari (r)', 'Tinggi (t)'],
    image: 'kerucut.png' 
  },
  tabung: {
    title: 'Tabung',
    desc: 'Alas dan tutupnya lingkaran kembar, seperti kaleng!',
    tint: '#86efac',
    pi: true,
    fields: ['Jari-jari (r)', 'Tinggi (t)'],
    image: 'tabung.png'  }
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

// Fungsi helper untuk merender avatar (mendukung SVG maupun Gambar PNG)
function renderAvatar(s) {
  if (s.image) {
    avatar.innerHTML = `<img src="${s.image}" alt="${s.title}">`;
  } else {
    avatar.innerHTML = s.svg;
  }
}

// Inisialisasi awal
renderAvatar(shapes[active]);

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

    // Panggil fungsi render avatar
    renderAvatar(s);

    title.textContent = s.title;
    desc.textContent = s.desc;

    inputs.classList.toggle('two', s.fields.length > 1);
    inputs.innerHTML = s.fields
      .map((f) => `<label>${f}<input type="number" placeholder="Isi angka" min="0"></label>`)
      .join('');

    piBox.hidden = !s.pi;
    opts.classList.toggle('two', s.pi);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let empty = false;

  inputs.querySelectorAll('input').forEach((el) => {
    if (!el.value.trim()) {
      empty = true;
      el.classList.add('err');
    } else {
      el.classList.remove('err');
    }
  });

  if (empty) return (msg.hidden = true);

  msg.textContent = `Siap! Input ${shapes[active].title} sudah masuk (UI tanpa hitungan).`;
  msg.hidden = false;
});

modeBtn.addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark');
  modeBtn.textContent = dark ? '☀️' : '🌙';
});