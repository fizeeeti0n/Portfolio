// ============================================================
// PROJECT DATA — edit categories here to sort your projects
// categories can include: "ai", "web", "tools"
// ============================================================
const PROJECTS = [
  {
    title: "Wish Calculator",
    description: "A fully customizable calculator where you can change the look based on your wish.",
    image: "./photo/Cal.png",
    link: "https://calculator-beta-beige-74.vercel.app/",
    categories: ["web", "tools"]
  },
  {
    title: "TedX Clone",
    description: "This is a clone of the TedX program website, demonstrating proficiency in modern web layouts.",
    image: "./photo/tedX.png",
    link: "https://ted-x-puce.vercel.app/",
    categories: ["web"]
  },
  {
    title: "UniStudy AI",
    description: "An AI-powered tool designed to assist students by streamlining their study process and research.",
    image: "./photo/UniAI.png",
    link: "https://uni-ai-2q9g.onrender.com/",
    categories: ["ai", "web"]
  },
  {
    title: "SmartAid",
    description: "A Django web application powered by Gemini AI. Helps students excel academically while supporting mental wellbeing through dynamic, responsive features.",
    image: "./photo/SmartAid.png",
    link: "https://github.com/fizeeeti0n/SmartAid",
    categories: ["ai", "web"]
  },
  {
    title: "ApexApply AI",
    description: "Smart Job Application Strategist powered by Google Gemini. Cover Letter Generator, ATS & Fit Analysis, and CV Optimization using advanced NLP.",
    image: "./photo/ApexApply AI.png",
    link: "https://apex-apply-ai.vercel.app/",
    categories: ["ai","web"]
  },
  {
    title: "UAP CSE Iftar",
    description: "Official website for the UAP Department of CSE Ramadan Iftar Mahfil event — event details, RSVP, and community announcements.",
    image: "./photo/Uap CSE Iftar.png",
    link: "https://uapcse-iftar.vercel.app",
    categories: ["web"]
  },
    {
    title: "Meaw Ghop",
    description: "A VS Code extension that plays a customizable sound whenever a terminal command fails.",
    image: "/photo/Meaw.png",
    link: "https://marketplace.visualstudio.com/items?itemName=AhanafShahriarNafiz.meaw-ghop",
    categories: ["tools"]
  }
];

const CATEGORY_LABELS = {
  all:   "All Projects",
  ai:    "AI & ML",
  web:   "Web Dev",
  tools: "Tools & Utils"
};


// ============================================================
// Mouse position — shared with Three.js repulsion
// ============================================================
const mouse3D = { x: 0, y: 0, active: false };

// ============================================================
// ★ Custom Cursor — visible dot + trailing ring
//   Also feeds mouse3D so Three.js particles react
// ============================================================
function initCustomCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Move dot instantly
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';

        // Feed Three.js — normalised device coords
        mouse3D.x      =  (mouseX / window.innerWidth)  * 2 - 1;
        mouse3D.y      = -(mouseY / window.innerHeight) * 2 + 1;
        mouse3D.active = true;
    });

    document.addEventListener('mouseleave', () => {
        mouse3D.active = false;
    });

    // Ring follows with smooth lag
    (function animateRing() {
        ringX += (mouseX - ringX) * 0.10;
        ringY += (mouseY - ringY) * 0.10;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    })();

    // Expand ring on interactive elements
    const hoverSel = 'a, button, input, textarea, .skill-card, .category-btn, .drawer-project-card, .cta-button, .submit-btn, .project-link, .proj-link';
    document.addEventListener('mouseover', e => {
        if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover');
    });
}


// ============================================================
// ★ NEW: Dark / Light Mode Toggle
// ============================================================
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


// ============================================================
// ★ NEW: Project Category Drawer
// ============================================================
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
        // Normalise image path — support both "./photo/x.png" and "/photo/x.png"
        const imgSrc = p.image ? p.image.replace(/^\//, './') : '';
        const imgHTML = imgSrc
            ? `<img src="${imgSrc}" alt="${p.title}" loading="lazy"
                    onerror="this.style.display='none';this.parentElement.classList.add('no-img')">`
            : '';

        return `
        <div class="drawer-project-card">
            <div class="proj-img${imgSrc ? '' : ' no-img'}">
                ${imgHTML}
                <div class="proj-img-placeholder">
                    <i class="fas fa-code"></i>
                    <span>${p.title}</span>
                </div>
            </div>
            <div class="proj-content">
                <h3 class="proj-title">${p.title}</h3>
                <p class="proj-desc">${p.description}</p>
                <a href="${p.link}" class="proj-link" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i> View Project
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
            : `<div class="drawer-empty"><i class="fas fa-folder-open"></i><p>No projects here yet.</p></div>`;

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


// ============================================================
// Three.js — original 3 floating layers + cursor repulsion
// ============================================================
function initThreeJS() {
    const canvas   = document.getElementById('global-canvas');
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    camera.position.z = 1000;

    // ── ORIGINAL 3 floating / rotating layers ──────────────────
    // Each layer stores home positions so repulsion can spring back
    const particleSystems = [];

    const createParticles = (count, range, size, opacity, speed) => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * range;
        }
        // home = copy of original random positions
        const home = positions.slice();
        const vel  = new Float32Array(count * 3);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x00f5ff, size, transparent: true, opacity
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        particleSystems.push({ points, speed, positions, home, vel, count });
    };

    // Exact original counts / sizes / opacities / speeds
    createParticles(1500, 3000, 1,   0.3, { x: 0.0005, y: 0.001  });
    createParticles(800,  2000, 2.5, 0.6, { x: 0.001,  y: 0.0015 });
    createParticles(400,  2500, 1.8, 0.4, { x: 0.0008, y: 0.0012 });

    // ── Mouse → world helpers ───────────────────────────────────
    const mouseWorld = new THREE.Vector3();
    const raycaster  = new THREE.Raycaster();
    const mouseNDC   = new THREE.Vector2();

    // Repulsion constants
    const REPEL_R   = 200;    // world-unit radius of influence
    const REPEL_STR = 600;    // push force strength
    const RETURN    = 0.045;  // spring-back speed
    const DAMP      = 0.80;   // velocity damping

    // ── Animate ─────────────────────────────────────────────────
    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.0005;

        // Project mouse into world space (z=0 plane)
        if (mouse3D.active) {
            mouseNDC.set(mouse3D.x, mouse3D.y);
            raycaster.setFromCamera(mouseNDC, camera);
            const t = -raycaster.ray.origin.z / raycaster.ray.direction.z;
            mouseWorld.copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, t);
        }

        particleSystems.forEach((sys, index) => {
            // ── Original floating behaviour (rotation + float) ──
            sys.points.rotation.x += sys.speed.x;
            sys.points.rotation.y += sys.speed.y;
            sys.points.position.y  = Math.sin(time + index) * 10;
            sys.points.position.x  = Math.cos(time + index * 0.5) * 5;

            // ── Cursor repulsion on each particle ──────────────
            // We work in LOCAL space to account for the object's
            // own rotation/translation by inverting it back.
            const inv = new THREE.Matrix4().copy(sys.points.matrixWorld).invert();
            const localMouse = mouseWorld.clone().applyMatrix4(inv);

            const pos = sys.positions;
            const vel = sys.vel;
            const home = sys.home;

            for (let i = 0; i < sys.count; i++) {
                const ix = i * 3, iy = ix + 1, iz = ix + 2;
                const cx = pos[ix], cy = pos[iy];

                if (mouse3D.active) {
                    const dx   = cx - localMouse.x;
                    const dy   = cy - localMouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
                    if (dist < REPEL_R) {
                        const f = ((REPEL_R - dist) / REPEL_R);
                        vel[ix] += (dx / dist) * f * f * REPEL_STR * 0.016;
                        vel[iy] += (dy / dist) * f * f * REPEL_STR * 0.016;
                    }
                }

                // Spring back to home
                vel[ix] += (home[ix] - cx) * RETURN;
                vel[iy] += (home[iy] - cy) * RETURN;

                // Damp + integrate
                vel[ix] *= DAMP;
                vel[iy] *= DAMP;
                pos[ix]  += vel[ix];
                pos[iy]  += vel[iy];
                pos[iz]   = home[iz]; // z unchanged
            }

            sys.points.geometry.attributes.position.needsUpdate = true;
        });

        renderer.render(scene, camera);
    }

    animate();

     const texts = [
      "Creative Frontend Developer",
      "AI Enthusiast",
      "AI Automation",
      "N8n Specialist"
    ];

    const typingSpeed = 80;
    const deletingSpeed = 50;
    const pauseAfterTyping = 1200;

    const textElement = document.getElementById("typing-text");

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentText = texts[textIndex];

      if (!isDeleting) {
        textElement.textContent = currentText.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentText.length) {
          setTimeout(() => isDeleting = true, pauseAfterTyping);
        }
      } else {
        textElement.textContent = currentText.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
        }
      }

      setTimeout(typeLoop, isDeleting ? deletingSpeed : typingSpeed);
    }

    typeLoop();

    // Resize handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Scroll — tilt all layers gently
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset * 0.0005;
        particleSystems.forEach((sys, i) => {
            sys.points.rotation.z = scrolled * (i + 1) * 0.1;
        });
    });
}

// === Scroll animations (fade-in, skill bars) (ORIGINAL) ===
function handleScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.id === 'skills') {
                    const bars = entry.target.querySelectorAll('.skill-progress-bar');
                    bars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        if (!bar.classList.contains('filled')) {
                            setTimeout(() => {
                                bar.style.width = width;
                                bar.classList.add('filled');
                            }, 500);
                        }
                    });
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

window.addEventListener("load", () => {
  const loaderWrapper = document.getElementById("loader-wrapper");
  const mainContent = document.getElementById("main-content");

  setTimeout(() => {
    loaderWrapper.classList.add("hidden");
    mainContent.style.visibility = "visible";
  }, 1200);
});

// === Notification Toast (ORIGINAL) ===
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// === EmailJS: Contact Form Submission (ORIGINAL) ===
function initEmailJS() {
    if (typeof emailjs === 'undefined') {
        console.error("EmailJS SDK not loaded.");
        return; 
    }
    
    try {
        emailjs.init("8swwpvfblWBcvJS-u");
    } catch (e) {
        console.error("EmailJS initialization failed:", e);
        return;
    }

    const form = document.getElementById("contact-form");
    if (!form) {
        console.error("The contact form with ID 'contact-form' was not found.");
        return;
    }

    const button = form.querySelector("button[type='submit']");
    if (!button) {
        console.error("No submit button found inside the contact form.");
        return;
    }
    
    const originalText = button.innerHTML;
    const serviceID = 'service_578o5c8';
    const templateID = 'template_u6qazit';

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        emailjs.sendForm(serviceID, templateID, form)
            .then((response) => {
                console.log("Email sent successfully:", response);
                button.innerHTML = '<i class="fas fa-check"></i> Message Sent Successfully!';
                
                if (typeof showNotification === 'function') {
                    showNotification("Message sent successfully! I'll get back to you soon.", "success");
                }
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    form.reset();
                }, 3000);
            })
            .catch((error) => {
                console.error("Email sending failed:", error);
                button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to Send';
                
                if (typeof showNotification === 'function') {
                    showNotification("Failed to send message. Try again later or email directly.", "error");
                }
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 3000);
            });
    });
}

// === Navigation (ORIGINAL) ===
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const sections = document.querySelectorAll('section[id]');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 100);

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').substring(1);
            const target = document.getElementById(id);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

// === Parallax for Hero Section (ORIGINAL) ===
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// === Master Initializer ===
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();   // ★ new
    initThemeToggle();    // ★ new
    initThreeJS();
    handleScrollAnimations();
    initNavigation();
    initProjectDrawer();  // ★ new
    initEmailJS();
});