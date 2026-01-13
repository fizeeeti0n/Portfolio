// === Initialize Three.js Particle Background ===
function initThreeJS() {
    const canvas = document.getElementById('global-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const particleSystems = [];

    const createParticles = (count, range, size, opacity, speed) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * range;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x00f5ff,
            size,
            transparent: true,
            opacity
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        particleSystems.push({ points, speed });
    };

    // Layers of particles
    createParticles(1500, 3000, 1, 0.3, { x: 0.0005, y: 0.001 });
    createParticles(800, 2000, 2.5, 0.6, { x: 0.001, y: 0.0015 });
    createParticles(400, 2500, 1.8, 0.4, { x: 0.0008, y: 0.0012 });

    camera.position.z = 1000;

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.0005;

        particleSystems.forEach((system, index) => {
            system.points.rotation.x += system.speed.x;
            system.points.rotation.y += system.speed.y;
            system.points.position.y = Math.sin(time + index) * 10;
            system.points.position.x = Math.cos(time + index * 0.5) * 5;
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

    const typingSpeed = 80;     // ms per character
    const deletingSpeed = 50;
    const pauseAfterTyping = 1200;

    const textElement = document.getElementById("typing-text");

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentText = texts[textIndex];

      if (!isDeleting) {
        // Typing
        textElement.textContent = currentText.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentText.length) {
          setTimeout(() => isDeleting = true, pauseAfterTyping);
        }
      } else {
        // Deleting
        textElement.textContent = currentText.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
        }
      }

      setTimeout(
        typeLoop,
        isDeleting ? deletingSpeed : typingSpeed
      );
    }

    typeLoop();

    // Resize handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Scroll handling
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset * 0.0005;
        particleSystems.forEach((system, index) => {
            system.points.rotation.z = scrolled * (index + 1) * 0.1;
        });
    });
}

// === Scroll animations (fade-in, skill bars) ===
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
  }, 1200); // Delay for smoothness
});

// === Notification Toast ===
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

// === EmailJS: Contact Form Submission ===
function initEmailJS() {
    // 1. Initialize EmailJS with your Public Key
    // It's best practice to ensure 'emailjs' is loaded before calling this.
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
        // Log an error if the form isn't found
        console.error("The contact form with ID 'contact-form' was not found.");
        return;
    }

    const button = form.querySelector("button[type='submit']"); // More specific selector
    if (!button) {
        console.error("No submit button found inside the contact form.");
        return;
    }
    
    // Use const for variables that won't be reassigned
    const originalText = button.innerHTML;
    const serviceID = 'service_578o5c8';
    const templateID = 'template_u6qazit';

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // 2. Disable button and show loading state
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        emailjs.sendForm(serviceID, templateID, form)
            .then((response) => {
                // 3. SUCCESS block
                console.log("Email sent successfully:", response);
                
                button.innerHTML = '<i class="fas fa-check"></i> Message Sent Successfully!';
                
                // Assuming showNotification is defined elsewhere
                if (typeof showNotification === 'function') {
                    showNotification("Message sent successfully! I’ll get back to you soon.", "success");
                }
                
                // Reset form and button after a delay
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    form.reset(); // Clear the form fields
                }, 3000);
            })
            .catch((error) => {
                // 4. ERROR block
                console.error("Email sending failed:", error);
                
                button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to Send';
                
                if (typeof showNotification === 'function') {
                    showNotification("Failed to send message. Try again later or email directly.", "error");
                }
                
                // Restore button state after a delay (without resetting the form on failure)
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 3000);
            });
    });
}

// === Navigation ===
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

// === Parallax for Hero Section ===
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// === Master Initializer ===
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    handleScrollAnimations();
    initNavigation();
    initEmailJS();
});
