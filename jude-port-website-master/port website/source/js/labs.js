// Interactive Labs Sandbox Module - Clean Editorial Edition
class LabsController {
  constructor() {
    this.activeLab = 'particles';
    this.animationIds = {};
  }

  init() {
    this.renderLabList();
    this.setupParticleLab();
    this.setupGlassLab();
    this.setupScramblerLab();
    this.setupSpringLab();
  }

  renderLabList() {
    const container = document.getElementById('labs-cards-container');
    if (!container) return;

    container.innerHTML = PORTFOLIO_DATA.labs.map(lab => `
      <div class="lab-card ${this.activeLab === lab.type ? 'active' : ''}" data-lab="${lab.type}">
        <div class="lab-card-header">
          <span class="lab-category-badge">${lab.category}</span>
          <span class="lab-status-badge">⚡ ${lab.status}</span>
        </div>
        <h3 class="lab-card-title">${lab.title}</h3>
        <p class="lab-card-desc">${lab.description}</p>
        <div class="lab-tags">
          ${lab.tags.map(t => `<span class="lab-tag">${t}</span>`).join('')}
        </div>
        <button class="lab-launch-btn" data-launch="${lab.type}">
          <span>Launch Experiment</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    `).join('');

    // Click anywhere on card or launch button
    container.querySelectorAll('.lab-card').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.getAttribute('data-lab');
        this.switchLab(type);
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });
  }

  switchLab(type) {
    this.activeLab = type;
    document.querySelectorAll('.lab-card').forEach(card => {
      card.classList.toggle('active', card.getAttribute('data-lab') === type);
    });

    document.querySelectorAll('.lab-viewport').forEach(vp => {
      vp.classList.toggle('hidden', vp.getAttribute('data-viewport') !== type);
    });

    // Re-trigger visualizer init if needed
    if (type === 'particles') this.resetParticleLab?.();
    if (type === 'spring') this.resetSpringLab?.();
    if (type === 'scrambler') this.runScramble?.();
  }

  // 1. Particle Wave Lab
  setupParticleLab() {
    const canvas = document.getElementById('lab-particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const freqInput = document.getElementById('param-frequency');
    const speedInput = document.getElementById('param-speed');
    const waveCountInput = document.getElementById('param-waves');

    const freqVal = document.getElementById('val-frequency');
    const speedVal = document.getElementById('val-speed');
    const wavesVal = document.getElementById('val-waves');

    let w, h;
    let step = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = canvas.width = parent.clientWidth;
      h = canvas.height = 340;
    };
    resize();
    window.addEventListener('resize', resize);

    const updateLabels = () => {
      if (freqVal && freqInput) freqVal.textContent = freqInput.value;
      if (speedVal && speedInput) speedVal.textContent = speedInput.value;
      if (wavesVal && waveCountInput) wavesVal.textContent = waveCountInput.value;
    };

    [freqInput, speedInput, waveCountInput].forEach(inp => {
      inp?.addEventListener('input', updateLabels);
    });
    updateLabels();

    const render = () => {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(13, 15, 20, 0.25)';
      ctx.fillRect(0, 0, w, h);

      const freq = parseFloat(freqInput?.value || 0.015);
      const speed = parseFloat(speedInput?.value || 0.03);
      const waveCount = parseInt(waveCountInput?.value || 6);

      step += speed;

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        const waveHue = (280 + i * 18) % 360;
        ctx.strokeStyle = `hsla(${waveHue}, 80%, 65%, ${0.35 + (i / waveCount) * 0.55})`;

        for (let x = 0; x < w; x += 4) {
          const y = h / 2 + Math.sin(x * freq + step + i * 0.6) * (30 + i * 12) * Math.cos(step * 0.5 + i);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      this.animationIds.particles = requestAnimationFrame(render);
    };

    render();
    this.resetParticleLab = resize;
  }

  // 2. Glassmorphism Studio Lab
  setupGlassLab() {
    const blurInput = document.getElementById('glass-blur');
    const opacityInput = document.getElementById('glass-opacity');
    const blurVal = document.getElementById('val-glass-blur');
    const opacityVal = document.getElementById('val-glass-opacity');

    const targetCard = document.getElementById('glass-preview-box');
    const codeBox = document.getElementById('glass-css-code');
    const copyBtn = document.getElementById('copy-glass-code');

    const updateGlass = () => {
      if (!targetCard || !codeBox) return;
      const blur = blurInput?.value || 16;
      const opacity = (opacityInput?.value || 25) / 100;

      if (blurVal && blurInput) blurVal.textContent = `${blur}px`;
      if (opacityVal && opacityInput) opacityVal.textContent = `${opacityInput.value}%`;

      targetCard.style.backdropFilter = `blur(${blur}px)`;
      targetCard.style.webkitBackdropFilter = `blur(${blur}px)`;
      targetCard.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
      targetCard.style.border = `1px solid rgba(255, 255, 255, 0.25)`;
      targetCard.style.boxShadow = `0 8px 32px 0 rgba(0, 0, 0, 0.35)`;

      const css = `background: rgba(255, 255, 255, ${opacity});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, 0.25);\nborder-radius: 16px;\nbox-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35);`;
      codeBox.textContent = css;
    };

    [blurInput, opacityInput].forEach(inp => {
      inp?.addEventListener('input', updateGlass);
    });

    updateGlass();

    copyBtn?.addEventListener('click', () => {
      if (!codeBox) return;
      navigator.clipboard.writeText(codeBox.textContent).then(() => {
        copyBtn.textContent = 'Copied to Clipboard!';
        if (window.soundEngine) window.soundEngine.playSuccess();
        setTimeout(() => { copyBtn.textContent = 'Copy CSS'; }, 2000);
      });
    });
  }

  // 3. Typography Text Scrambler Lab
  setupScramblerLab() {
    const textTarget = document.getElementById('scramble-output');
    const inputField = document.getElementById('scramble-input');
    const triggerBtn = document.getElementById('scramble-trigger');
    const chars = 'ABCDEF0123456789!<>-_\\/[]{}—=+*^?#';

    this.runScramble = () => {
      if (!textTarget) return;
      const originalText = inputField?.value.toUpperCase() || 'SWISS EDITORIAL INTERFACE';
      let iteration = 0;
      clearInterval(this.scrambleInterval);

      this.scrambleInterval = setInterval(() => {
        textTarget.innerText = originalText
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iteration >= originalText.length) {
          clearInterval(this.scrambleInterval);
        }
        iteration += 1 / 3;
      }, 30);

      if (window.soundEngine) window.soundEngine.playClick();
    };

    triggerBtn?.addEventListener('click', this.runScramble);
    inputField?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.runScramble();
    });
  }

  // 4. Spring Physics Nodes Lab
  setupSpringLab() {
    const canvas = document.getElementById('lab-spring-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h;
    let nodes = [];
    let draggedNode = null;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = canvas.width = parent.clientWidth;
      h = canvas.height = 340;
      initNodes();
    };

    class SpringNode {
      constructor(x, y, radius, color, label) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = radius;
        this.color = color;
        this.label = label;
      }

      update() {
        if (this === draggedNode) return;
        const k = 0.04;
        const damping = 0.88;

        const ax = (this.baseX - this.x) * k;
        const ay = (this.baseY - this.y) * k;

        this.vx = (this.vx + ax) * damping;
        this.vy = (this.vy + ay) * damping;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        // Line to origin
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.setLineDash([4, 4]);
        ctx.moveTo(this.baseX, this.baseY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glow
        ctx.save();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;

        // Circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.restore();

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.label, this.x, this.y + this.radius + 16);
      }
    }

    function initNodes() {
      nodes = [
        new SpringNode(w * 0.2, h * 0.5, 24, '#7c3aed', 'NODE_01'),
        new SpringNode(w * 0.4, h * 0.35, 28, '#06b6d4', 'TENSOR_A'),
        new SpringNode(w * 0.6, h * 0.65, 30, '#f43f5e', 'SPRING_B'),
        new SpringNode(w * 0.8, h * 0.45, 22, '#10b981', 'CORE_SYS')
      ];
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Connect nodes with lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      nodes.forEach(n => {
        n.update();
        n.draw();
      });

      this.animationIds.spring = requestAnimationFrame(render);
    };

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    canvas.addEventListener('mousedown', (e) => {
      const pos = getMousePos(e);
      nodes.forEach(node => {
        const d = Math.hypot(node.x - pos.x, node.y - pos.y);
        if (d < node.radius + 10) {
          draggedNode = node;
          if (window.soundEngine) window.soundEngine.playClick();
        }
      });
    });

    window.addEventListener('mousemove', (e) => {
      if (!draggedNode) return;
      const pos = getMousePos(e);
      draggedNode.x = pos.x;
      draggedNode.y = pos.y;
    });

    window.addEventListener('mouseup', () => {
      if (draggedNode) {
        draggedNode.vx = (Math.random() - 0.5) * 6;
        draggedNode.vy = (Math.random() - 0.5) * 6;
        draggedNode = null;
      }
    });

    resize();
    render();
    this.resetSpringLab = resize;
  }
}

window.labsController = new LabsController();
