// ===== PARTICLE BACKGROUND =====
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6, 214, 160, ${this.alpha})`;
      ctx.fill();
    }
  }

  const count = Math.min(80, Math.floor((w * h) / 12000));
  for (let i = 0; i < count; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 214, 160, ${0.08 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger?.querySelectorAll('span');
      spans?.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
    });
  });

  // Active section highlighting
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.target, 10);
        const suffix = entry.target.dataset.suffix || '';
        let current = 0;
        const duration = 1200; // ms
        const steps = 40;
        const stepTime = duration / steps;
        const increment = target / steps;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.textContent = Math.floor(current) + suffix;
        }, stepTime);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ===== TYPING EFFECT =====
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const texts = [
    'Geospatial Analyst',
    'GIS Specialist (AMC, GMC, SMC, GUDM)',
    'Remote Sensing & SAR Expert',
    'PyQGIS Tool Developer',
    'Catchment & Flood GIS Specialist'
  ];
  let textIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = texts[textIdx];
    el.textContent = current.substring(0, charIdx);

    if (!deleting) {
      charIdx++;
      if (charIdx > current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        textIdx = (textIdx + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? 35 : 70);
  }
  type();
}

// ===== PROJECT FILTERING =====
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

// ===== INTERACTIVE CV MODAL =====
function initCvModal() {
  const openBtn = document.getElementById('btn-open-cv-modal');
  const modal = document.getElementById('cv-modal');
  const closeBtn = document.getElementById('cv-modal-close');
  const overlay = document.getElementById('cv-modal-overlay');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ===== CLIPBOARD COPY & TOAST =====
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function initCopyButtons() {
  const copyEmail = document.getElementById('copy-email-btn');

  copyEmail?.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('rakeshsolanki001160@gmail.com').then(() => {
      showToast('Email address copied to clipboard!');
    }).catch(() => {
      showToast('Email: rakeshsolanki001160@gmail.com');
    });
  });
}

// ===== TILT EFFECT =====
function initTilt() {
  document.querySelectorAll('.skill-card, .project-card, .tool-item, .achieve-card, .contact-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) perspective(800px) rotateX(0) rotateY(0)';
    });
  });
}

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initReveal();
  initCounters();
  initTyping();
  initProjectFilters();
  initCvModal();
  initCopyButtons();
  initTilt();
});
