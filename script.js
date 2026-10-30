/* ============================================================
   PROJECTS DATA
   ============================================================ */
const PROJECTS = [
  {
    title: "Wish Calculator",
    description: "A fully customizable calculator where you can change the look based on your wish.",
    image: "/photo/Cal.webp",
    link: "https://calculator-beta-beige-74.vercel.app/",
    categories: ["web", "tools"]
  },
  {
    title: "TedX Clone",
    description: "This is a clone of the TedX program website, demonstrating proficiency in modern web layouts.",
    image: "/photo/tedX.webp",
    link: "https://ted-x-puce.vercel.app/",
    categories: ["web"]
  },
  {
    title: "UniStudy AI",
    description: "An AI-powered tool designed to assist students by streamlining their study process and research.",
    image: "/photo/UniAI.webp",
    link: "https://uni-ai-2q9g.onrender.com/",
    categories: ["ai", "web"]
  },
  {
    title: "SmartAid",
    description: "A Django web application powered by Gemini AI. Helps students excel academically while supporting mental wellbeing through dynamic, responsive features.",
    image: "/photo/SmartAid.webp",
    link: "https://github.com/fizeeeti0n/SmartAid",
    categories: ["ai", "web"]
  },
  {
    title: "ApexApply AI",
    description: "Smart Job Application Strategist powered by Google Gemini. Cover Letter Generator, ATS & Fit Analysis, and CV Optimization using advanced NLP.",
    image: "/photo/ApexApply AI.webp",
    link: "https://apex-apply-ai.vercel.app/",
    categories: ["ai"]
  },
  {
    title: "UAP CSE Iftar",
    description: "Official website for the UAP Department of CSE Ramadan Iftar Mahfil event — event details, RSVP, and community announcements.",
    image: "/photo/Uap CSE Iftar.webp",
    link: "https://uapcse-iftar.vercel.app",
    categories: ["web"]
  },
  {
    title: "Meaw Ghop",
    description: "A VS Code extension that plays a customizable sound whenever a terminal command fails (exits with a non-zero code or matches common error patterns).",
    image: "/photo/Meaw.webp",
    link: "https://marketplace.visualstudio.com/items?itemName=AhanafShahriarNafiz.meaw-ghop",
    categories: ["tools"]
  },
  {
    title: "Uni-Bus",
    description: "A bus management system for organizations to track and see the real-time location of buses and their routes.",
    image: "/photo/Uni-Bus.jpg",
    link: "https://github.com/fizeeeti0n/Uni-Bus",
    categories: ["fs"]
  }
];

const CATEGORY_LABELS = {
  all:   "All Projects",
  ai:    "AI & ML",
  web:   "Web Dev",
  tools: "Tools & Utils",
  fs:    "Full-Stack"
};

/* ============================================================
   SHARED STATE
   ============================================================ */
const mouse3D = { x: 0, y: 0, active: false };
const fx = {
  drawerOpen: false,   // heavy effects pause while true
  scrollY: 0,          // updated by the single scroll handler
  pause: null,         // set by Three.js init
  resume: null
};

const IS_TOUCH   = window.matchMedia('(pointer: coarse)').matches;
const REDUCED    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const LOW_END    = (navigator.hardwareConcurrency || 8) <= 4 ||
                   (navigator.deviceMemory || 8) <= 4 ||
                   (navigator.connection && navigator.connection.saveData);

/* ============================================================
   CUSTOM CURSOR — GPU transform, loop sleeps when idle
   Uses the individual `translate` property so your existing CSS
   `transform` (centering / hover scale) keeps working.
   ============================================================ */
function initCustomCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring || IS_TOUCH) return;

  dot.style.left = dot.style.top = '0px';
  ring.style.left = ring.style.top = '0px';

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  let running = false;

  function loop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.translate = ringX + 'px ' + ringY + 'px';

    if (Math.abs(mouseX - ringX) < 0.1 && Math.abs(mouseY - ringY) < 0.1) {
      running = false;       // settled: stop burning frames
      return;
    }
    requestAnimationFrame(loop);
  }

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.translate = mouseX + 'px ' + mouseY + 'px';

    mouse3D.x      =  (mouseX / window.innerWidth)  * 2 - 1;
    mouse3D.y      = -(mouseY / window.innerHeight) * 2 + 1;
    mouse3D.active = true;

    if (!running) { running = true; requestAnimationFrame(loop); }
  }, { passive: true });

  document.addEventListener('mouseleave', () => { mouse3D.active = false; });

  const hoverSel = 'a,button,input,textarea,.skill-card,.category-btn,.drawer-project-card,.cta-button,.submit-btn,.project-link,.proj-link,.cert-dot,.cert-card';
  let hovering = false;
  document.addEventListener('mouseover', e => {
    const hit = !!e.target.closest(hoverSel);
    if (hit !== hovering) {
      hovering = hit;
      document.body.classList.toggle('cursor-hover', hit);
    }
  }, { passive: true });
}

/* ============================================================
   THEME TOGGLE
   ============================================================ */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  try {
    if (localStorage.getItem('portfolio-theme') === 'light') {
      document.body.classList.add('light-mode');
    }
  } catch (_) {}

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    try {
      localStorage.setItem('portfolio-theme',
        document.body.classList.contains('light-mode') ? 'light' : 'dark');
    } catch (_) {}
  });
}

/* ============================================================
   PROJECT CATEGORY DRAWER
   - background effects pause while open
   - rendered HTML cached per category
   - open/close work deferred to next frame
   ============================================================ */
function initProjectDrawer() {
  const drawer   = document.getElementById('project-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close');
  const titleEl  = document.getElementById('drawer-title');
  const countEl  = document.getElementById('drawer-count');
  const bodyEl   = document.getElementById('drawer-body');
  const catBtns  = document.querySelectorAll('.category-btn');

  if (!drawer || !backdrop) return;

  const LINK_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14" style="vertical-align:-2px;margin-right:4px;fill:currentColor" aria-hidden="true"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg>';

  const htmlCache = {};

  function renderCard(p) {
    return '<div class="drawer-project-card">' +
      '<div class="proj-img"><img src="' + p.image + '" alt="' + p.title + '" loading="lazy" decoding="async" ' +
      'onerror="this.parentElement.style.display=\'none\'"></div>' +
      '<div class="proj-content">' +
      '<h3 class="proj-title">' + p.title + '</h3>' +
      '<p class="proj-desc">' + p.description + '</p>' +
      '<a href="' + p.link + '" class="proj-link" target="_blank" rel="noopener noreferrer">' +
      LINK_ICON + 'View Project</a></div></div>';
  }

  function buildHTML(category) {
    if (htmlCache[category]) return htmlCache[category];
    const filtered = category === 'all'
      ? PROJECTS
      : PROJECTS.filter(p => p.categories.includes(category));
    const html = filtered.length
      ? '<div class="drawer-projects-grid">' + filtered.map(renderCard).join('') + '</div>'
      : '<div class="drawer-empty"><p>No projects here yet.</p></div>';
    htmlCache[category] = { html, count: filtered.length };
    return htmlCache[category];
  }

  function openDrawer(category) {
    const { html, count } = buildHTML(category);

    // pause heavy background work BEFORE the animation starts
    fx.drawerOpen = true;
    if (fx.pause) fx.pause();

    titleEl.textContent = CATEGORY_LABELS[category] || 'Projects';
    countEl.textContent = count + ' project' + (count !== 1 ? 's' : '');
    bodyEl.innerHTML = html;
    bodyEl.scrollTop = 0;

    requestAnimationFrame(() => {
      drawer.classList.add('open');
      backdrop.classList.add('visible');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
    catBtns.forEach(b => b.classList.remove('active'));
    fx.drawerOpen = false;
    // resume after the slide-out finishes so it stays smooth
    setTimeout(() => { if (!fx.drawerOpen && fx.resume) fx.resume(); }, 400);
  }

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      openDrawer(btn.dataset.category);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });
}

/* ============================================================
   THREE.JS PARTICLES — lazy, lightweight, pausable
   - fewer particles, zero per-frame allocations
   - physics only runs while mouse is near / particles are settling
   - pauses when tab hidden or drawer open
   ============================================================ */
function initThreeJS() {
  if (window.innerWidth < 768 || REDUCED || typeof THREE === 'undefined') return;

  const canvas = document.getElementById('global-canvas');
  if (!canvas) return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  camera.position.z = 1000;

  const scale = LOW_END ? 0.5 : 1;
  const systems = [];

  function createParticles(count, range, size, opacity, speed) {
    count = Math.round(count * scale);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * range;
    const home = positions.slice();
    const vel  = new Float32Array(count * 3);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x00f5ff, size, transparent: true, opacity });
    const points   = new THREE.Points(geometry, material);
    scene.add(points);
    systems.push({ points, speed, positions, home, vel, count, attr: geometry.attributes.position });
  }

  createParticles(600, 3000, 1,   0.3, { x: 0.0005, y: 0.001  });
  createParticles(300, 2000, 2.5, 0.6, { x: 0.001,  y: 0.0015 });
  createParticles(150, 2500, 1.8, 0.4, { x: 0.0008, y: 0.0012 });

  const mouseWorld = new THREE.Vector3();
  const localMouse = new THREE.Vector3();
  const inv        = new THREE.Matrix4();
  const raycaster  = new THREE.Raycaster();
  const mouseNDC   = new THREE.Vector2();

  const REPEL_R = 200, REPEL_STR = 600, RETURN = 0.045, DAMP = 0.80;
  let settleFrames = 0;
  let rafId = null;

  function animate() {
    rafId = requestAnimationFrame(animate);
    const time = Date.now() * 0.0005;

    const physics = mouse3D.active || settleFrames > 0;
    if (mouse3D.active) {
      settleFrames = 90;
      mouseNDC.set(mouse3D.x, mouse3D.y);
      raycaster.setFromCamera(mouseNDC, camera);
      const t = -raycaster.ray.origin.z / raycaster.ray.direction.z;
      mouseWorld.copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, t);
    } else if (settleFrames > 0) {
      settleFrames--;
    }

    for (let s = 0; s < systems.length; s++) {
      const sys = systems[s];
      const pts = sys.points;

      pts.rotation.x += sys.speed.x;
      pts.rotation.y += sys.speed.y;
      pts.rotation.z  = fx.scrollY * 0.0005 * (s + 1) * 0.1;
      pts.position.y  = Math.sin(time + s) * 10;
      pts.position.x  = Math.cos(time + s * 0.5) * 5;

      if (!physics) continue;

      pts.updateMatrixWorld();
      inv.copy(pts.matrixWorld).invert();
      localMouse.copy(mouseWorld).applyMatrix4(inv);

      const pos = sys.positions, vel = sys.vel, home = sys.home, n = sys.count;
      const mx = localMouse.x, my = localMouse.y, active = mouse3D.active;

      for (let i = 0; i < n; i++) {
        const ix = i * 3, iy = ix + 1;
        const cx = pos[ix], cy = pos[iy];

        if (active) {
          const dx = cx - mx, dy = cy - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < REPEL_R * REPEL_R) {
            const dist = Math.sqrt(d2) || 0.001;
            const f = (REPEL_R - dist) / REPEL_R;
            const k = f * f * REPEL_STR * 0.016 / dist;
            vel[ix] += dx * k;
            vel[iy] += dy * k;
          }
        }

        vel[ix] = (vel[ix] + (home[ix] - cx) * RETURN) * DAMP;
        vel[iy] = (vel[iy] + (home[iy] - cy) * RETURN) * DAMP;
        pos[ix] = cx + vel[ix];
        pos[iy] = cy + vel[iy];
      }
      sys.attr.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  function pause()  { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
  function resume() { if (!rafId && !fx.drawerOpen && !document.hidden) animate(); }

  fx.pause  = pause;
  fx.resume = resume;

  document.addEventListener('visibilitychange', () => document.hidden ? pause() : resume());

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 150);
  }, { passive: true });

  animate();
}

/* ============================================================
   TYPING EFFECT
   ============================================================ */
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const texts = ['Creative Frontend Developer', 'AI Enthusiast', 'AI Automation', 'N8n Specialist'];
  const typingSpeed = 80, deletingSpeed = 50, pauseAfterTyping = 1200;

  let textIndex = 0, charIndex = 0, isDeleting = false;

  function typeLoop() {
    const current = texts[textIndex];

    if (!isDeleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        setTimeout(() => { isDeleting = true; typeLoop(); }, pauseAfterTyping);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    }
    setTimeout(typeLoop, isDeleting ? deletingSpeed : typingSpeed);
  }

  typeLoop();
}

/* ============================================================
   SCROLL ANIMATIONS — observe once, then stop observing
   ============================================================ */
function handleScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      target.classList.add('is-visible');
      observer.unobserve(target);

      if (target.id === 'skills') {
        const bars = target.querySelectorAll('.skill-progress-bar');
        setTimeout(() => {
          bars.forEach(bar => {
            if (!bar.classList.contains('filled')) {
              bar.style.width = bar.getAttribute('data-width');
              bar.classList.add('filled');
            }
          });
        }, 500);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ============================================================
   NOTIFICATION TOAST
   ============================================================ */
function showNotification(message, type) {
  const n = document.createElement('div');
  n.className = 'notification ' + type;
  const icon = type === 'success'
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" style="fill:currentColor" aria-hidden="true"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" style="fill:currentColor" aria-hidden="true"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zm-32 224a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>';
  n.innerHTML = icon + '<span>' + message + '</span>';

  document.body.appendChild(n);
  requestAnimationFrame(() => requestAnimationFrame(() => n.classList.add('show')));
  setTimeout(() => {
    n.classList.remove('show');
    setTimeout(() => n.remove(), 300);
  }, 5000);
}

/* ============================================================
   EMAILJS — lazy loaded on first form interaction
   ============================================================ */
let emailJSLoaded = false;
let emailJSLoading = false;
const emailJSQueue = [];

function loadEmailJS(cb) {
  if (emailJSLoaded) { cb && cb(); return; }
  if (cb) emailJSQueue.push(cb);
  if (emailJSLoading) return;
  emailJSLoading = true;

  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload = () => {
    emailJSLoaded = true;
    emailjs.init({ publicKey: '8swwpvfblWBcvJS-u' });
    emailJSQueue.splice(0).forEach(fn => fn());
  };
  s.onerror = () => { emailJSLoading = false; };
  document.head.appendChild(s);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const button       = form.querySelector("button[type='submit']");
  const serviceID    = 'service_578o5c8';
  const templateID   = 'template_u6qazit';
  const originalHTML = button ? button.innerHTML : '';

  form.addEventListener('focusin', () => loadEmailJS(), { once: true });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!button) return;

    button.disabled = true;
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" style="animation:spin .8s linear infinite;fill:currentColor" aria-hidden="true"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.8zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg> Sending...';

    const send = () => {
      emailjs.sendForm(serviceID, templateID, form)
        .then(() => {
          button.innerHTML = 'Message Sent!';
          showNotification("Message sent! I'll get back to you soon.", 'success');
          setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
            form.reset();
          }, 3000);
        })
        .catch(err => {
          console.error('EmailJS error:', err);
          button.innerHTML = 'Failed to Send';
          showNotification('Failed to send. Try again later.', 'error');
          setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
          }, 3000);
        });
    };

    loadEmailJS(send);
  });
}

/* ============================================================
   NAVIGATION + SINGLE SCROLL HANDLER
   - clean URLs (/about, /skills ...) via history.pushState
   - one rAF-throttled scroll listener for navbar, scroll spy,
     hero parallax and particle rotation
   - section offsets cached (no layout reads while scrolling)
   ============================================================ */
function initNavigation() {
  const navbar       = document.getElementById('navbar');
  const navLinks     = Array.from(document.querySelectorAll('.nav-link'));
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu      = document.getElementById('nav-menu');
  const sections     = Array.from(document.querySelectorAll('section[id]'));
  const hero         = document.querySelector('.hero-content');

  if (!mobileToggle || !navMenu) return;

  const BARS_SVG  = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>';
  const TIMES_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>';

  mobileToggle.innerHTML = BARS_SVG;

  function closeMenu() {
    navMenu.classList.remove('active');
    mobileToggle.innerHTML = BARS_SVG;
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  mobileToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    mobileToggle.innerHTML = isOpen ? TIMES_SVG : BARS_SVG;
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });

  /* ---------- cached geometry ---------- */
  let offsets = [];
  let vh = window.innerHeight;

  function measure() {
    vh = window.innerHeight;
    offsets = sections.map(s => ({ id: s.id, top: s.offsetTop }));
  }

  /* ---------- clean-URL routing ---------- */
  const SECTION_IDS = navLinks.map(l => l.dataset.section);

  function goTo(name, smooth) {
    const behavior = smooth ? 'smooth' : 'auto';
    if (!name || name === 'home') {
      window.scrollTo({ top: 0, behavior });
      return;
    }
    const el = document.getElementById(name);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior });
  }

  function pathName() {
    return location.pathname.replace(/^\/|\/$/g, '') || 'home';
  }

  document.querySelectorAll('a[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const name = link.dataset.section;
      const path = name === 'home' ? '/' : '/' + name;
      if (location.pathname !== path) history.pushState({ section: name }, '', path);
      goTo(name, true);
      closeMenu();
    });
  });

  window.addEventListener('popstate', () => goTo(pathName(), true));

  const initial = pathName();
  window.addEventListener('load', () => {
    measure();
    if (SECTION_IDS.includes(initial)) setTimeout(() => goTo(initial, false), 100);
    onScroll();
  }, { once: true });

  /* ---------- single scroll handler ---------- */
  let ticking = false;
  let scrolledState = false;
  let currentId = '';
  let lastTransform = '';

  function update() {
    ticking = false;
    const y = window.scrollY;
    fx.scrollY = y;

    const isScrolled = y > 100;
    if (isScrolled !== scrolledState) {
      scrolledState = isScrolled;
      navbar.classList.toggle('scrolled', isScrolled);
    }

    // scroll spy
    let current = '';
    for (let i = 0; i < offsets.length; i++) {
      if (y >= offsets[i].top - 200) current = offsets[i].id;
    }
    if (current !== currentId) {
      currentId = current;
      for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.toggle('active', navLinks[i].dataset.section === current);
      }
    }

    // hero parallax (only while hero is on screen)
    if (hero && !REDUCED) {
      const t = y < vh * 1.2 ? 'translate3d(0,' + (y * 0.3).toFixed(1) + 'px,0)' : '';
      if (t !== lastTransform) {
        hero.style.transform = t;
        lastTransform = t;
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { measure(); onScroll(); }, 150);
  }, { passive: true });

  measure();
  update();
}

/* ============================================================
   CERTIFICATE STACK — autoplay only while visible & not hovered
   ============================================================ */
function initCertStack() {
  const stack = document.getElementById('cert-stack');
  if (!stack) return;

  const wrapper  = document.querySelector('.cert-stack-wrapper');
  const cards    = Array.from(stack.querySelectorAll('.cert-card'));
  const counter  = document.getElementById('cert-counter');
  const dotsWrap = document.getElementById('cert-dots');
  const prevBtn  = document.getElementById('cert-prev');
  const nextBtn  = document.getElementById('cert-next');

  const AUTOPLAY_DELAY = 2500;
  let autoplayTimer = null;
  let order = cards.map((_, i) => i);
  let visible = false, hovering = false;

  const frag = document.createDocumentFragment();
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'cert-dot';
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', 'Show certificate ' + (i + 1));
    dot.setAttribute('tabindex', '0');
    dot.addEventListener('click', () => { bringToFront(i); syncAutoplay(true); });
    dot.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { bringToFront(i); syncAutoplay(true); }
    });
    frag.appendChild(dot);
  });
  dotsWrap.appendChild(frag);
  const dots = Array.from(dotsWrap.children);

  function render() {
    order.forEach((cardIndex, pos) => {
      const card = cards[cardIndex];
      card.classList.remove('pos-0', 'pos-1', 'pos-2', 'pos-3', 'pos-4', 'pos-5');
      card.classList.add('pos-' + Math.min(pos, 5));
    });
    const front = order[0];
    if (counter) counter.textContent = (front + 1) + ' / ' + cards.length;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === front));
  }

  function next() { order.push(order.shift()); render(); }
  function prev() { order.unshift(order.pop()); render(); }

  function bringToFront(cardIndex) {
    const pos = order.indexOf(cardIndex);
    if (pos <= 0) return;
    order = order.slice(pos).concat(order.slice(0, pos));
    render();
  }

  function stopAutoplay() {
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }

  function syncAutoplay(restart) {
    const shouldRun = visible && !hovering && !document.hidden && !fx.drawerOpen;
    if (restart) stopAutoplay();
    if (shouldRun && !autoplayTimer) autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
    if (!shouldRun) stopAutoplay();
  }

  cards.forEach((card, cardIndex) => {
    card.addEventListener('click', () => {
      if (order[0] !== cardIndex) { bringToFront(cardIndex); syncAutoplay(true); }
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); syncAutoplay(true); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); syncAutoplay(true); });

  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => { hovering = true;  syncAutoplay(); });
    wrapper.addEventListener('mouseleave', () => { hovering = false; syncAutoplay(); });

    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncAutoplay();
    }, { threshold: 0.1 }).observe(wrapper);
  }

  document.addEventListener('visibilitychange', () => syncAutoplay());

  render();
}

/* ============================================================
   PRELOADER
   ============================================================ */
function initPreloader() {
  const loader = document.getElementById('loader-wrapper');
  if (!loader) return;

  let done = false;
  function hideLoader() {
    if (done) return;
    done = true;
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 900);
  }

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 1200), { once: true });
    setTimeout(hideLoader, 3000);
  }
}

/* ============================================================
   MASTER INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initThemeToggle();
  initNavigation();
  initTyping();
  handleScrollAnimations();
  initProjectDrawer();
  initContactForm();
  initCertStack();

  // Three.js: after load + idle; skipped on mobile, reduced motion, and data saver
  window.addEventListener('load', () => {
    const loadThree = () => {
      if (window.innerWidth < 768 || REDUCED ||
          (navigator.connection && navigator.connection.saveData)) return;

      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      s.async = true;
      s.onload = initThreeJS;
      document.head.appendChild(s);
    };

    if ('requestIdleCallback' in window) requestIdleCallback(loadThree, { timeout: 2500 });
    else setTimeout(loadThree, 800);
  }, { once: true });
});

/* spinner keyframes */
(function () {
  const s = document.createElement('style');
  s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(s);
})();