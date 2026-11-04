const shapes = {
  kubus: {
    title: 'Kubus',
    desc: 'Enam sisi kotak sama besar, contohnya dadu!',
    tint: '#fda4af',
    pi: false,
    fields: ['Panjang sisi (s)'],
    svg: '<svg viewBox="0 0 40 40" fill="#ffe4e6" stroke="#262936" stroke-width="2.2" stroke-linejoin="round"><polygon points="20,6 33,13 20,20 7,13"/><polygon points="7,13 20,20 20,34 7,27" fill="#fecdd3"/><polygon points="20,20 33,13 33,27 20,34" fill="#fda4af"/></svg>'
  },
  bola: {
    title: 'Bola',
    desc: 'Bulat sempurna ke segala arah, seperti bola sepak!',
    tint: '#7dd3fc',
    pi: true,
    fields: ['Jari-jari (r)'],
    svg: '<svg viewBox="0 0 40 40" fill="#e0f2fe" stroke="#262936" stroke-width="2.2"><circle cx="20" cy="20" r="13"/><ellipse cx="20" cy="20" rx="13" ry="5" fill="none" stroke-dasharray="3 3"/></svg>'
  },
  kerucut: {
    title: 'Kerucut',
    desc: 'Alas bundar lancip ke atas, mirip topi ulang tahun!',
    tint: '#fdba74',
    pi: true,
    fields: ['Jari-jari (r)', 'Tinggi (t)'],
    svg: '<svg viewBox="0 0 40 40" fill="#ffedd5" stroke="#262936" stroke-width="2.2" stroke-linejoin="round"><path d="M20 6 L32 29 A12 4.5 0 0 1 8 29 Z"/><path d="M8 29 A12 4.5 0 0 1 32 29" fill="none" stroke-dasharray="3 3"/></svg>'
  },
  tabung: {
    title: 'Tabung',
    desc: 'Alas dan tutupnya lingkaran kembar, seperti kaleng!',
    tint: '#86efac',
    pi: true,
    fields: ['Jari-jari (r)', 'Tinggi (t)'],
    svg: '<svg viewBox="0 0 40 40" fill="#bbf7d0" stroke="#262936" stroke-width="2.2"><path d="M9 12v16a11 4 0 0 0 22 0V12"/><ellipse cx="20" cy="12" rx="11" ry="4" fill="#dcfce7"/></svg>'
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
avatar.innerHTML = shapes.bola.svg;

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

    avatar.innerHTML = s.svg;
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