
// Dark mode toggle + remember
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const stored = localStorage.getItem('theme');
if (stored === 'light') document.documentElement.classList.add('light');
if (stored === 'dark') document.documentElement.classList.remove('light');
if (!stored && !prefersDark) document.documentElement.classList.add('light');

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Fetch and render projects
async function loadProjects(targetId, filter = 'all'){
  try{
    const res = await fetch('/data/projects.json');
    const data = await res.json();
    const container = document.getElementById(targetId);
    if(!container) return;
    container.innerHTML = '';
    data.projects
      .filter(p => filter === 'all' ? true : p.tags.includes(filter))
      .forEach(p => {
        const el = document.createElement('article');
        el.className = 'card';
        el.innerHTML = `
          <h3><a href="${p.link}" target="_blank" rel="noopener">${p.title}</a></h3>
          <p class="meta">${p.year} • ${p.tags.join(', ')}</p>
          <p>${p.summary}</p>
          <a class="btn" href="${p.link}" target="_blank" rel="noopener">View →</a>
        `;
        container.appendChild(el);
      });
  }catch(e){ console.error(e); }
}

if(document.getElementById('featured-projects')) loadProjects('featured-projects');
if(document.getElementById('projects')){
  loadProjects('projects');
  document.querySelectorAll('.chip').forEach(btn=>{
    btn.addEventListener('click', ()=> loadProjects('projects', btn.dataset.filter));
  });
}
