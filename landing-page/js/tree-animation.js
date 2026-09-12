/**
 * ABINITIA — tree-animation.js
 * Animação avançada da árvore SVG no hero e demo canvas
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
   * HERO TREE — SVG branch grow animation
   * ─────────────────────────────────────────────── */
  function initHeroTree() {
    const svg = document.getElementById('hero-tree');
    if (!svg) return;

    // Set stroke-dasharray dynamically for each path
    const paths = svg.querySelectorAll('path[class*="tree-"]');
    paths.forEach(path => {
      try {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      } catch (e) {
        // Some paths may not support getTotalLength
      }
    });
  }

  /* ─────────────────────────────────────────────────
   * DEMO TREE — Interactive drag simulation
   * ─────────────────────────────────────────────── */
  function initDemoTree() {
    const demoCanvas = document.getElementById('demo-canvas');
    if (!demoCanvas) return;

    const demoSvg = demoCanvas.querySelector('.demo-tree');
    if (!demoSvg) return;

    // Make nodes "draggable" with visual feedback (simulated)
    const nodes = demoSvg.querySelectorAll('.demo-node');

    nodes.forEach(node => {
      let isDragging = false;
      let startX, startY, origTransform;

      const circle = node.querySelector('circle');

      node.style.cursor = 'grab';

      // Mouse events
      node.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origTransform = node.getAttribute('transform') || '';
        node.style.cursor = 'grabbing';
        node.style.filter = 'brightness(1.3) drop-shadow(0 0 10px rgba(198,139,46,0.7))';
        if (circle) {
          circle.style.transform = 'scale(1.1)';
        }
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        // Get SVG coordinate system scale factor
        const svgRect = demoSvg.getBoundingClientRect();
        const svgViewBox = demoSvg.viewBox.baseVal;
        const scaleX = svgViewBox.width / svgRect.width;
        const scaleY = svgViewBox.height / svgRect.height;
        node.setAttribute('transform', `${origTransform} translate(${dx * scaleX}, ${dy * scaleY})`);
      });

      document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        node.style.cursor = 'grab';
        node.style.filter = '';
        if (circle) circle.style.transform = '';
        // Spring back after 1.5s
        setTimeout(() => {
          if (!isDragging) {
            node.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            node.setAttribute('transform', origTransform);
            setTimeout(() => { node.style.transition = ''; }, 700);
          }
        }, 1500);
      });

      // Touch events
      node.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        isDragging = true;
        startX = touch.clientX;
        startY = touch.clientY;
        origTransform = node.getAttribute('transform') || '';
        node.style.filter = 'brightness(1.3) drop-shadow(0 0 10px rgba(198,139,46,0.7))';
        e.preventDefault();
      }, { passive: false });

      node.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        const svgRect = demoSvg.getBoundingClientRect();
        const svgViewBox = demoSvg.viewBox.baseVal;
        const scaleX = svgViewBox.width / svgRect.width;
        const scaleY = svgViewBox.height / svgRect.height;
        node.setAttribute('transform', `${origTransform} translate(${dx * scaleX}, ${dy * scaleY})`);
        e.preventDefault();
      }, { passive: false });

      node.addEventListener('touchend', () => {
        isDragging = false;
        node.style.filter = '';
        setTimeout(() => {
          node.setAttribute('transform', origTransform);
        }, 1500);
      });

      // Click to show tooltip
      node.addEventListener('click', () => {
        const tooltip = demoSvg.querySelector('#demo-tooltip');
        if (tooltip) {
          tooltip.style.opacity = '0';
          tooltip.style.transition = 'opacity 0.3s';
          setTimeout(() => {
            tooltip.style.opacity = '1';
            setTimeout(() => {
              tooltip.style.opacity = '';
              tooltip.style.transition = '';
            }, 2500);
          }, 100);
        }
      });
    });

    // Demo "add node" button animation
    const addNode = demoSvg.querySelector('#demo-n6');
    if (addNode) {
      addNode.addEventListener('click', () => {
        addNode.querySelector('circle').style.fill = 'rgba(198,139,46,0.2)';
        addNode.querySelector('text').textContent = '✓';
        setTimeout(() => {
          addNode.querySelector('circle').style.fill = '';
          addNode.querySelector('text').textContent = '+';
        }, 2000);
      });
    }
  }

  /* ─────────────────────────────────────────────────
   * TREE PARALLAX — subtle parallax on hero tree
   * ─────────────────────────────────────────────── */
  function initTreeParallax() {
    const treeContainer = document.querySelector('.hero__tree-container');
    if (!treeContainer) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const translateY = scrolled * 0.15;
          treeContainer.style.transform = `translateY(calc(-50% + ${translateY}px))`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────
   * HERO MOUSE PARALLAX
   * ─────────────────────────────────────────────── */
  function initMouseParallax() {
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero__bg-image');
    const treeContainer = document.querySelector('.hero__tree-container');

    if (!hero || !heroBg) return;

    let mx = 0, my = 0;
    let ticking = false;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mx = (e.clientX - rect.left - rect.width / 2)  / rect.width;
      my = (e.clientY - rect.top  - rect.height / 2) / rect.height;

      if (!ticking) {
        requestAnimationFrame(() => {
          heroBg.style.transform = `scale(1.05) translate(${mx * 8}px, ${my * 8}px)`;
          if (treeContainer) {
            treeContainer.style.transform = `translateY(-50%) translate(${mx * -12}px, ${my * -8}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    hero.addEventListener('mouseleave', () => {
      heroBg.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
      heroBg.style.transform = 'scale(1.05) translate(0, 0)';
      if (treeContainer) {
        treeContainer.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
        treeContainer.style.transform = 'translateY(-50%) translate(0, 0)';
      }
      setTimeout(() => {
        heroBg.style.transition = '';
        if (treeContainer) treeContainer.style.transition = '';
      }, 1000);
    });
  }


  /* ─────────────────────────────────────────────────
   * ANIMATED FAMILY TREE — Line drawing on view
   * ─────────────────────────────────────────────── */
  function initTreeLineAnimation() {
    const heroTreeSvg = document.getElementById('hero-tree');
    if (!heroTreeSvg) return;

    // Observe hero visibility and reset/restart animation
    const treeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const branches = entry.target.querySelectorAll('.tree-branch, .tree-trunk, .tree-root');
        const nodes = entry.target.querySelectorAll('.tree-node');
        const glows = entry.target.querySelectorAll('.tree-glow');

        if (entry.isIntersecting) {
          branches.forEach(b => {
            b.style.animationPlayState = 'running';
          });
          nodes.forEach(n => {
            n.style.animationPlayState = 'running';
          });
          glows.forEach(g => {
            g.style.animationPlayState = 'running';
          });
        }
      });
    }, { threshold: 0.1 });

    treeObserver.observe(heroTreeSvg);
  }


  /* ─────────────────────────────────────────────────
   * VAULT VISUAL — Orbiting items
   * ─────────────────────────────────────────────── */
  function initVaultAnimation() {
    const vault = document.querySelector('.vault-visual');
    if (!vault) return;

    const items = vault.querySelectorAll('.vault-item');
    const radius = 110;

    function positionItems(time) {
      items.forEach((item, i) => {
        const angle = (time * 0.0005 + i * (Math.PI * 2 / items.length));
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.6;
        item.style.position = 'absolute';
        item.style.left = `calc(50% + ${x}px)`;
        item.style.top  = `calc(50% + ${y}px)`;
        item.style.transform = 'translate(-50%, -50%)';
        item.style.fontSize = `${1.2 + Math.sin(angle) * 0.3}rem`;
        item.style.opacity  = `${0.5 + (Math.sin(angle) + 1) * 0.25}`;
      });

      requestAnimationFrame(positionItems);
    }

    requestAnimationFrame(positionItems);
  }


  /* ─────────────────────────────────────────────────
   * INIT
   * ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initHeroTree();
    initDemoTree();
    initTreeParallax();
    initMouseParallax();
    initTreeLineAnimation();
    initVaultAnimation();
  });

  // Also run if DOM already loaded
  if (document.readyState !== 'loading') {
    initHeroTree();
    initDemoTree();
    initTreeParallax();
    initMouseParallax();
    initTreeLineAnimation();
    initVaultAnimation();
  }

})();
