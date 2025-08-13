<script>
async function getJSON(path){ const r = await fetch(path, {cache: 'no-store'}); if(!r.ok) throw new Error(path); return r.json(); }

function cardHTML({title,meta,content,href,action="Open"}) {
  return `
    <div style="border:1px solid #e7e7ea;border-radius:12px;padding:12px;margin:8px 0;background:#fff">
      <h4 style="margin:0 0 4px 0">${title}</h4>
      ${meta ? `<div style="color:#355266;font-size:.9rem;margin:0 0 8px 0">${meta}</div>` : ""}
      ${content ? `<div style="margin:0 0 8px 0">${content}</div>` : ""}
      ${href ? `<a href="${href}" style="background:#103B64;color:#fff;padding:8px 12px;border-radius:6px;text-decoration:none;display:inline-block">${action}</a>` : ""}
    </div>`;
}

async function renderPromos() {
  const el = document.getElementById('promos');
  if(!el) return;
  try {
    const data = await getJSON('data/promos.json');
    const today = new Date().toISOString().slice(0,10);
    const active = data.filter(p => (!p.start || p.start <= today) && (!p.end || p.end >= today));
    const upcoming = data.filter(p => p.start && p.start > today);
    let html = '<h3 style="color:#103B64">Promos</h3>';
    html += active.length ? '<h4>Live now</h4>' + active.map(p => cardHTML({
      title: p.title,
      meta: [p.brand, [p.start||'', p.end||''].filter(Boolean).join(' → ')].filter(Boolean).join(' • '),
      content: (p.note||'') + (p.tags?.length ? `<div style="margin-top:6px;color:#355266">${p.tags.join(' • ')}</div>` : ''),
      href: p.link, action: 'Get it'
    })).join('') : '<p>No live promos right now.</p>';
    if (upcoming.length) {
      html += '<h4 style="margin-top:10px">Upcoming</h4>' + upcoming.map(p => cardHTML({
        title: p.title,
        meta: [p.brand, [p.start||'', p.end||''].filter(Boolean).join(' → ')].filter(Boolean).join(' • '),
        content: p.note || '',
        href: p.link, action: 'Details'
      })).join('');
    }
    el.innerHTML = html;
  } catch(e) {
    el.innerHTML = '<p>Could not load promos.</p>';
  }
}

async function renderProducts() {
  const el = document.getElementById('products');
  if(!el) return;
  try {
    const data = await getJSON('data/products.json');
    el.innerHTML = '<h3 style="color:#103B64">Products</h3>' + data.map(p => cardHTML({
      title: p.name,
      meta: `${p.category}${p.code ? ' • Code: ' + p.code : ''}`,
      content: (p.note||'') + (p.tags?.length ? `<div style="margin-top:6px;color:#355266">${p.tags.join(' • ')}</div>` : ''),
      href: p.link, action: 'Open'
    })).join('');
  } catch(e) {
    el.innerHTML = '<p>Could not load products.</p>';
  }
}

async function renderTipOfDay() {
  const el = document.getElementById('coach-tip');
  if(!el) return;
  try {
    const tips = await getJSON('data/coaching.json');
    const tip = tips.length ? tips[new Date().getDate() % tips.length] : 'Small steps today create big wins tomorrow.';
    el.innerText = tip;
  } catch(e) {
    el.innerText = 'Stay consistent. Small steps add up.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderPromos();
  renderProducts();
  renderTipOfDay();
});
</script>
