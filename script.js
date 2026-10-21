/* ============================================================
   PROJECTS DATA
   ============================================================ */
const PROJECTS = [
  {
    title: "Wish Calculator",
    description: "A fully customizable calculator where you can change the look based on your wish.",
    image: "./photo/Cal.webp",
    link: "https://calculator-beta-beige-74.vercel.app/",
    categories: ["web", "tools"]
  },
  {
    title: "TedX Clone",
    description: "This is a clone of the TedX program website, demonstrating proficiency in modern web layouts.",
    image: "./photo/tedX.webp",
    link: "https://ted-x-puce.vercel.app/",
    categories: ["web"]
  },
  {
    title: "UniStudy AI",
    description: "An AI-powered tool designed to assist students by streamlining their study process and research.",
    image: "./photo/UniAI.webp",
    link: "https://uni-ai-2q9g.onrender.com/",
    categories: ["ai", "web"]
  },
  {
    title: "SmartAid",
    description: "A Django web application powered by Gemini AI. Helps students excel academically while supporting mental wellbeing through dynamic, responsive features.",
    image: "./photo/SmartAid.webp",
    link: "https://github.com/fizeeeti0n/SmartAid",
    categories: ["ai", "web"]
  },
  {
    title: "ApexApply AI",
    description: "Smart Job Application Strategist powered by Google Gemini. Cover Letter Generator, ATS & Fit Analysis, and CV Optimization using advanced NLP.",
    image: "./photo/ApexApply AI.webp",
    link: "https://apex-apply-ai.vercel.app/",
    categories: ["ai"]
  },
  {
    title: "UAP CSE Iftar",
    description: "Official website for the UAP Department of CSE Ramadan Iftar Mahfil event — event details, RSVP, and community announcements.",
    image: "./photo/Uap CSE Iftar.webp",
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
   MOUSE POSITION — shared with Three.js repulsion
   ============================================================ */
const mouse3D = { x: 0, y: 0, active: false };

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCustomCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    mouse3D.x      =  (mouseX / window.innerWidth)  * 2 - 1;
    mouse3D.y      = -(mouseY / window.innerHeight) * 2 + 1;
    mouse3D.active = true;
  }, { passive: true });

  document.addEventListener('mouseleave', () => { mouse3D.active = false; });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.10;
    ringY += (mouseY - ringY) * 0.10;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  const hoverSel = 'a,button,input,textarea,.skill-card,.category-btn,.drawer-project-card,.cta-button,.submit-btn,.project-link,.proj-link,.cert-dot,.cert-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover');
  }, { passive: true });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover');
  }, { passive: true });
}

/* ============================================================
   THEME TOGGLE
   ============================================================ */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  if (localStorage.getItem('portfolio-theme') === 'light') {
    document.body.classList.add('light-mode');
  }

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('portfolio-theme',
      document.body.classList.contains('light-mode') ? 'light' : 'dark');
  });
}

/* ============================================================
   PROJECT CATEGORY DRAWER
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

  function renderCard(p) {
    return `
      <div class="drawer-project-card">
        <div class="proj-img">
          <img src="${p.image}" alt="${p.title}" loading="lazy" decoding="async"
               onerror="this.parentElement.style.display='none'">
        </div>
        <div class="proj-content">
          <h3 class="proj-title">${p.title}</h3>
          <p class="proj-desc">${p.description}</p>
          <a href="${p.link}" class="proj-link" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14" style="vertical-align:-2px;margin-right:4px;fill:currentColor" aria-hidden="true"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg>
            View Project
          </a>
        </div>
      </div>`;
  }

  function openDrawer(category) {
    const filtered = category === 'all'
      ? PROJECTS
      : PROJECTS.filter(p => p.categories.includes(category));

    titleEl.textContent = CATEGORY_LABELS[category] || 'Projects';
    countEl.textContent = `${filtered.length} project${filtered.length !== 1 ? 's' : ''}`;

    bodyEl.innerHTML = filtered.length
      ? `<div class="drawer-projects-grid">${filtered.map(renderCard).join('')}</div>`
      : `<div class="drawer-empty"><p>No projects here yet.</p></div>`;

    drawer.classList.add('open');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
    catBtns.forEach(b => b.classList.remove('active'));
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
   THREE.JS — loaded lazily after window load
   Skip on mobile (<768px) and prefers-reduced-motion
   ============================================================ */
function initThreeJS() {
  if (window.innerWidth < 768) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof THREE === 'undefined') return;

  const canvas   = document.getElementById('global-canvas');
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, powerPreference: 'low-power' });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  camera.position.z = 1000;

  const particleSystems = [];

  function createParticles(count, range, size, opacity, speed) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * range;
    }
    const home = positions.slice();
    const vel  = new Float32Array(count * 3);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({ color: 0x00f5ff, size, transparent: true, opacity });
    const points   = new THREE.Points(geometry, material);
    scene.add(points);
    particleSystems.push({ points, speed, positions, home, vel, count });
  }

  createParticles(1500, 3000, 1,   0.3, { x: 0.0005, y: 0.001  });
  createParticles(800,  2000, 2.5, 0.6, { x: 0.001,  y: 0.0015 });
  createParticles(400,  2500, 1.8, 0.4, { x: 0.0008, y: 0.0012 });

  const mouseWorld = new THREE.Vector3();
  const raycaster  = new THREE.Raycaster();
  const mouseNDC   = new THREE.Vector2();

  const REPEL_R   = 200;
  const REPEL_STR = 600;
  const RETURN    = 0.045;
  const DAMP      = 0.80;

  function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.0005;

    if (mouse3D.active) {
      mouseNDC.set(mouse3D.x, mouse3D.y);
      raycaster.setFromCamera(mouseNDC, camera);
      const t = -raycaster.ray.origin.z / raycaster.ray.direction.z;
      mouseWorld.copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, t);
    }

    particleSystems.forEach((sys, index) => {
      sys.points.rotation.x += sys.speed.x;
      sys.points.rotation.y += sys.speed.y;
      sys.points.position.y  = Math.sin(time + index) * 10;
      sys.points.position.x  = Math.cos(time + index * 0.5) * 5;

      const inv        = new THREE.Matrix4().copy(sys.points.matrixWorld).invert();
      const localMouse = mouseWorld.clone().applyMatrix4(inv);
      const pos        = sys.positions;
      const vel        = sys.vel;
      const home       = sys.home;

      for (let i = 0; i < sys.count; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;
        const cx = pos[ix], cy = pos[iy];

        if (mouse3D.active) {
          const dx   = cx - localMouse.x;
          const dy   = cy - localMouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist < REPEL_R) {
            const f = (REPEL_R - dist) / REPEL_R;
            vel[ix] += (dx / dist) * f * f * REPEL_STR * 0.016;
            vel[iy] += (dy / dist) * f * f * REPEL_STR * 0.016;
          }
        }

        vel[ix] += (home[ix] - cx) * RETURN;
        vel[iy] += (home[iy] - cy) * RETURN;
        vel[ix] *= DAMP;
        vel[iy] *= DAMP;
        pos[ix]  += vel[ix];
        pos[iy]  += vel[iy];
        pos[iz]   = home[iz];
      }

      sys.points.geometry.attributes.position.needsUpdate = true;
    });

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset * 0.0005;
    particleSystems.forEach((sys, i) => {
      sys.points.rotation.z = scrolled * (i + 1) * 0.1;
    });
  }, { passive: true });
}

/* ============================================================
   TYPING EFFECT — runs independently from Three.js
   ============================================================ */
function initTyping() {
  const textElement = document.getElementById('typing-text');
  if (!textElement) return;

  const texts = [
    'Creative Frontend Developer',
    'AI Enthusiast',
    'AI Automation',
    'N8n Specialist'
  ];

  const typingSpeed  = 80;
  const deletingSpeed = 50;
  const pauseAfterTyping = 1200;

  let textIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentText = texts[textIndex];

    if (!isDeleting) {
      textElement.textContent = currentText.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentText.length) {
        setTimeout(() => { isDeleting = true; typeLoop(); }, pauseAfterTyping);
        return;
      }
    } else {
      textElement.textContent = currentText.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        textIndex  = (textIndex + 1) % texts.length;
      }
    }

    setTimeout(typeLoop, isDeleting ? deletingSpeed : typingSpeed);
  }

  typeLoop();
}

/* ============================================================
   SCROLL ANIMATIONS — IntersectionObserver, opacity+transform
   ============================================================ */
function handleScrollAnimations() {
  // Batch: collect all reads first, then write
  const observer = new IntersectionObserver((entries) => {
    // All DOM reads happen inside callback (already batched by browser)
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        if (entry.target.id === 'skills') {
          const bars = entry.target.querySelectorAll('.skill-progress-bar');
          // Schedule writes after all reads done
          requestAnimationFrame(() => {
            bars.forEach(bar => {
              if (!bar.classList.contains('filled')) {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                  bar.style.width = width;
                  bar.classList.add('filled');
                }, 500);
              }
            });
          });
        }
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ============================================================
   NOTIFICATION TOAST
   ============================================================ */
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  const icon = type === 'success'
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" style="fill:currentColor" aria-hidden="true"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" style="fill:currentColor" aria-hidden="true"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zm-32 224a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>';
  notification.innerHTML = `${icon}<span>${message}</span>`;

  document.body.appendChild(notification);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => notification.classList.add('show'));
  });
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/* ============================================================
   EMAILJS — loaded lazily on first contact form interaction
   ============================================================ */
let emailJSLoaded = false;
let emailJSLoading = false;

function loadEmailJS(cb) {
  if (emailJSLoaded) { cb && cb(); return; }
  if (emailJSLoading) { return; }
  emailJSLoading = true;

  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload = () => {
    emailJSLoaded = true;
    emailjs.init({ publicKey: '8swwpvfblWBcvJS-u' });
    cb && cb();
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

  // Lazy load EmailJS on first focus/input
  const triggerLoad = () => {
    loadEmailJS();
    form.removeEventListener('focusin', triggerLoad);
  };
  form.addEventListener('focusin', triggerLoad, { once: true });

  form.addEventListener('submit', function(e) {
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
            button.disabled  = false;
            form.reset();
          }, 3000);
        })
        .catch(err => {
          console.error('EmailJS error:', err);
          button.innerHTML = 'Failed to Send';
          showNotification('Failed to send. Try again later.', 'error');
          setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled  = false;
          }, 3000);
        });
    };

    if (emailJSLoaded) { send(); }
    else { loadEmailJS(send); }
  });
}

/* ============================================================
   NAVIGATION — scroll spy + mobile toggle
   ============================================================ */
function initNavigation() {
  const navbar      = document.getElementById('navbar');
  const navLinks    = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu     = document.getElementById('nav-menu');
  const sections    = document.querySelectorAll('section[id]');

  if (!mobileToggle || !navMenu) return;

  // Mobile menu icons via JS (no FA dependency)
  const BARS_SVG  = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>';
  const TIMES_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>';

  mobileToggle.innerHTML = BARS_SVG;

  mobileToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    mobileToggle.innerHTML = isOpen ? TIMES_SVG : BARS_SVG;
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const targetId = href && href.startsWith('#') ? href.slice(1) : href;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
      if (targetId) {
        const newPath = `/${targetId}`;
        history.pushState(null, '', newPath);
      }
      navMenu.classList.remove('active');
      mobileToggle.innerHTML = BARS_SVG;
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Batch scroll reads
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        // All reads
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 100);

        let current = '';
        sections.forEach(section => {
          if (scrollY >= section.offsetTop - 200) {
            current = section.getAttribute('id');
          }
        });

        // All writes
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href) {
            link.classList.toggle('active', href.substring(1) === current);
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id     = link.getAttribute('href').substring(1);
      const target = document.getElementById(id);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   HERO PARALLAX — deferred, no forced reflow
   ============================================================ */
function initParallax() {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        if (hero) {
          hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   CERTIFICATE STACK
   ============================================================ */
function initCertStack() {
  const stack   = document.getElementById('cert-stack');
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

  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'cert-dot';
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', `Show certificate ${i + 1}`);
    dot.setAttribute('tabindex', '0');
    dot.addEventListener('click', () => { bringToFront(i); restartAutoplay(); });
    dot.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { bringToFront(i); restartAutoplay(); }
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    order.forEach((cardIndex, pos) => {
      const card = cards[cardIndex];
      card.classList.remove('pos-0', 'pos-1', 'pos-2', 'pos-3', 'pos-4', 'pos-5');
      card.classList.add(`pos-${Math.min(pos, 5)}`);
    });
    const frontIndex = order[0];
    if (counter) counter.textContent = `${frontIndex + 1} / ${cards.length}`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === frontIndex));
  }

  function next()  { order.push(order.shift()); render(); }
  function prev()  { order.unshift(order.pop()); render(); }

  function bringToFront(cardIndex) {
    const pos = order.indexOf(cardIndex);
    if (pos <= 0) return;
    order = order.slice(pos).concat(order.slice(0, pos));
    render();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
  }
  function stopAutoplay() {
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }
  function restartAutoplay() { startAutoplay(); }

  cards.forEach((card, cardIndex) => {
    card.addEventListener('click', () => {
      if (order[0] !== cardIndex) { bringToFront(cardIndex); restartAutoplay(); }
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });

  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
  }

  render();
  startAutoplay();
}

/* ============================================================
   PRELOADER — caps at 1.2s, never blocks hero h1
   ============================================================ */
function initPreloader() {
  const loaderWrapper = document.getElementById('loader-wrapper');
  if (!loaderWrapper) return;

  function hideLoader() {
    loaderWrapper.classList.add('hidden');
    // Remove from DOM after fade completes
    setTimeout(() => { loaderWrapper.remove(); }, 900);
  }

  // Hide after max 1.2s, or immediately when page is already loaded
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 1200), { once: true });
    // Safety fallback
    setTimeout(hideLoader, 3000);
  }
}

/* ============================================================
   MASTER INIT — DOMContentLoaded (deferred script)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Critical UI init first
  initPreloader();
  initCustomCursor();
  initThemeToggle();
  initNavigation();
  initTyping();
  handleScrollAnimations();
  initProjectDrawer();
  initContactForm();
  initCertStack();
  initParallax();

  // Three.js — after window load + idle, skip on mobile
  window.addEventListener('load', () => {
    const loadThree = () => {
      if (window.innerWidth < 768 ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      s.defer = true;
      s.onload = initThreeJS;
      document.head.appendChild(s);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadThree, { timeout: 2000 });
    } else {
      setTimeout(loadThree, 500);
    }
  }, { once: true });
});

/* CSS for spinner animation (injected once) */
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(spinStyle);