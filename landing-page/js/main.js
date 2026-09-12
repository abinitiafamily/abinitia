/**
 * ABINITIA — main.js
 * Interações principais: navbar, scroll reveal, partículas, chat demo, árvore demo
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
   * NAVBAR — scroll effect & hamburger menu
   * ─────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navbar-links');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function toggleMobileMenu() {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    navLinks.classList.toggle('open');
    navLinks.classList.toggle('nav-open', !isOpen);
    mobileOverlay.classList.toggle('active', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMobileMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('nav-open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Add mobile actions to nav panel on first open
  let mobileActionsAdded = false;
  function ensureMobileActions() {
    if (mobileActionsAdded || !navLinks.classList.contains('open')) return;
    mobileActionsAdded = true;
    const div = document.createElement('div');
    div.className = 'navbar__actions-mobile';
    div.innerHTML = `
      <a href="#entrar" class="btn btn--ghost" style="justify-content:center">Entrar</a>
      <a href="#comecar" class="btn btn--primary" style="justify-content:center">Começar grátis</a>
    `;
    navLinks.appendChild(div);
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  hamburger.addEventListener('click', () => {
    toggleMobileMenu();
    ensureMobileActions();
  });
  mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close menu on nav link click
  navLinks.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.navbar__link');

  function updateActiveNavLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinkEls.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });


  /* ─────────────────────────────────────────────────
   * SCROLL REVEAL — IntersectionObserver
   * ─────────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ─────────────────────────────────────────────────
   * PARTICLES — Canvas hero particles
   * ─────────────────────────────────────────────── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function randomRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createParticle() {
      return {
        x:        randomRange(0, canvas.width),
        y:        randomRange(0, canvas.height),
        size:     randomRange(1.5, 4),
        speedX:   randomRange(-0.3, 0.3),
        speedY:   randomRange(-0.8, -0.2),
        opacity:  randomRange(0.2, 0.8),
        color:    Math.random() > 0.5 ? '#C68B2E' : '#F5C842',
        twinkle:  randomRange(0.005, 0.02),
        twinkleDir: 1,
      };
    }

    function initParticles(count = 55) {
      particles = Array.from({ length: count }, createParticle);
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        // Twinkle
        p.opacity += p.twinkle * p.twinkleDir;
        if (p.opacity > 0.9 || p.opacity < 0.1) p.twinkleDir *= -1;

        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Reset at top
        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = randomRange(0, canvas.width);
        }

        // Draw leaf/particle shape
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.size > 2.5) {
          // Leaf shape
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size, p.size * 1.6, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animFrame = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    initParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    }, { passive: true });

    // Pause when not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrame);
      } else {
        drawParticles();
      }
    });
  }


  /* ─────────────────────────────────────────────────
   * MANIFESTO — Highlight on scroll
   * ─────────────────────────────────────────────── */
  const manifestoLines = document.querySelectorAll('.manifesto__line');
  let manifestoActive = 0;

  function highlightManifestoLines() {
    const manifestoSection = document.getElementById('manifesto');
    if (!manifestoSection) return;

    const rect = manifestoSection.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1,
      (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
    ));

    const activeIdx = Math.floor(progress * manifestoLines.length);
    if (activeIdx !== manifestoActive) {
      manifestoLines.forEach((line, i) => {
        line.classList.toggle('active', i <= activeIdx);
      });
      manifestoActive = activeIdx;
    }
  }

  window.addEventListener('scroll', highlightManifestoLines, { passive: true });


  /* ─────────────────────────────────────────────────
   * SEARCH BOX — Suggestions click
   * ─────────────────────────────────────────────── */
  const searchInput = document.getElementById('family-search');
  const suggestions = document.querySelectorAll('.search-suggestion');

  suggestions.forEach(suggestion => {
    suggestion.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = suggestion.textContent;
        searchInput.focus();
        animateSearchResults();
      }
    });
    suggestion.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        suggestion.click();
      }
    });
  });

  function animateSearchResults() {
    const results = document.querySelectorAll('.family-card');
    results.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      setTimeout(() => {
        card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80);
    });
  }

  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', animateSearchResults);
  }


  /* ─────────────────────────────────────────────────
   * CHAT DEMO — Simulated interaction
   * ─────────────────────────────────────────────── */
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatAudioBtn = document.getElementById('chat-audio-btn');
  const chatMessages = document.querySelector('.agent-chat__messages');

  const demoResponses = [
    "Fascinante! E você sabe onde exatamente em Nápoles sua família morava? Ou qual era a profissão dele no Brasil?",
    "Interessante! Isso nos ajuda a contextualizar a chegada da família. Há alguma história que seus pais ou avós contavam sobre esse período?",
    "Que memória preciosa! Vou registrar isso na linha do tempo familiar. Você tem alguma fotografia ou documento desse período?",
    "Perfeito! Já identifiquei 3 novas informações para a árvore. Você consegue se lembrar do nome completo de algum filho ou filha da primeira geração?",
  ];

  let demoResponseIdx = 0;
  let isRecording = false;

  function addUserMessage(text) {
    const typingEl = chatMessages.querySelector('.chat-msg--typing');
    if (typingEl) typingEl.remove();

    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg--user';
    msg.innerHTML = `<p>${escapeHtml(text)}</p>`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Show typing indicator
    setTimeout(showTyping, 300);

    // Show agent response
    setTimeout(() => {
      const typing = chatMessages.querySelector('.chat-msg--typing');
      if (typing) typing.remove();
      addAgentMessage(demoResponses[demoResponseIdx % demoResponses.length]);
      demoResponseIdx++;
    }, 2200);
  }

  function addAgentMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg--agent';
    msg.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-msg chat-msg--agent chat-msg--typing';
    typing.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function handleChatSend() {
    if (!chatInput || !chatInput.value.trim()) return;
    addUserMessage(chatInput.value.trim());
    chatInput.value = '';
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', handleChatSend);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChatSend();
      }
    });
  }

  // Audio button toggle animation
  if (chatAudioBtn) {
    chatAudioBtn.addEventListener('click', () => {
      isRecording = !isRecording;
      chatAudioBtn.style.color = isRecording ? '#ff6b6b' : '';
      chatAudioBtn.style.borderColor = isRecording ? '#ff6b6b' : '';
      chatAudioBtn.setAttribute('aria-label', isRecording ? 'Parar gravação' : 'Gravar áudio');

      if (isRecording) {
        chatAudioBtn.style.animation = 'statusPulse 1s ease-in-out infinite';
        // Simulate stopping after 3s
        setTimeout(() => {
          if (isRecording) {
            isRecording = false;
            chatAudioBtn.style.color = '';
            chatAudioBtn.style.borderColor = '';
            chatAudioBtn.style.animation = '';
            chatAudioBtn.setAttribute('aria-label', 'Gravar áudio');
            addUserMessage('🎙️ [Áudio gravado — 3 segundos] "Ele veio do sul da Itália, creio que por volta de 1920..."');
          }
        }, 3000);
      } else {
        chatAudioBtn.style.animation = '';
      }
    });
  }


  /* ─────────────────────────────────────────────────
   * TREE DEMO CONTROLS
   * ─────────────────────────────────────────────── */
  const demoCanvas = document.getElementById('demo-canvas');
  const zoomInBtn  = document.getElementById('demo-zoom-in');
  const zoomOutBtn = document.getElementById('demo-zoom-out');
  const fitBtn     = document.getElementById('demo-fit');
  const demoSvg    = demoCanvas?.querySelector('.demo-tree');

  let scale = 1;
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 1.8;

  function applyScale(newScale) {
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    if (demoSvg) {
      demoSvg.style.transform = `scale(${scale})`;
      demoSvg.style.transformOrigin = 'center center';
      demoSvg.style.transition = 'transform 0.3s cubic-bezier(0.16,1,0.3,1)';
    }
  }

  if (zoomInBtn)  zoomInBtn.addEventListener('click',  () => applyScale(scale + 0.15));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => applyScale(scale - 0.15));
  if (fitBtn)     fitBtn.addEventListener('click',     () => applyScale(1));


  /* ─────────────────────────────────────────────────
   * SMOOTH SCROLL for anchor links
   * ─────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-height'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─────────────────────────────────────────────────
   * STAT COUNTER ANIMATION
   * ─────────────────────────────────────────────── */
  const statNumbers = document.querySelectorAll('[data-count]');

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCount(el, target);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  function animateCount(el, target) {
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  statNumbers.forEach(el => statObserver.observe(el));


  /* ─────────────────────────────────────────────────
   * INIT
   * ─────────────────────────────────────────────── */
  handleNavbarScroll();
  updateActiveNavLink();

})();
