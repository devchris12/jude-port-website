document.addEventListener('DOMContentLoaded', () => {
  const VIEWS = ['home', 'about', 'projects', 'labs', 'certificates', 'contact'];
  const FEEDBACK_KEY = 'mv-portfolio-feedback';
  const LIKES_KEY = 'mv-portfolio-likes';
  const COMMENTS_KEY = 'mv-portfolio-comments';
  const STAR_LABELS = ['', 'Needs work', 'Okay', 'Good', 'Great', 'Outstanding'];

  const state = {
    currentView: 'home',
    projectFilter: 'all',
    projectSearch: '',
    rating: 0
  };

  initNavToggle();
  initNavigation();
  initHomeView();
  initAboutView();
  initProjectsView();
  initCertificatesView();
  initEngagement();
  initSocials();
  initContact();
  initFeedback();
  initModals();
  initAudioToggle();
  initCopyButtons();

  if (window.labsController) window.labsController.init();

  // Guarantee direct landing on 'home' when opening the link
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  navigateTo('home', false);

  function initNavToggle() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    toggle?.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  function closeMobileNav() {
    document.getElementById('nav-menu')?.classList.remove('is-open');
    document.getElementById('nav-toggle')?.setAttribute('aria-expanded', 'false');
  }

  function initAudioToggle() {
    const soundBtn = document.getElementById('sound-toggle-btn');
    soundBtn?.addEventListener('click', () => {
      if (!window.soundEngine) return;
      const enabled = window.soundEngine.toggle();
      soundBtn.textContent = enabled ? '🔊' : '🔇';
      showToast(enabled ? 'Sound on' : 'Sound muted');
    });
  }

  function initNavigation() {
    document.querySelectorAll('.nav-link-clean').forEach(link => {
      link.addEventListener('click', () => {
        navigateTo(link.getAttribute('data-view'));
        window.soundEngine?.playClick();
        closeMobileNav();
      });
    });

    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      if (VIEWS.includes(h)) navigateTo(h, false);
    });

    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigateTo(btn.getAttribute('data-goto'));
        window.soundEngine?.playClick();
        closeMobileNav();
      });
    });

    const heroScrollBtn = document.getElementById('hero-scroll-btn');
    heroScrollBtn?.addEventListener('click', () => {
      document.getElementById('home-content')?.scrollIntoView({ behavior: 'smooth' });
      window.soundEngine?.playClick();
    });
  }

  function navigateTo(viewName, updateHash = true) {
    if (!VIEWS.includes(viewName)) viewName = 'home';
    state.currentView = viewName;
    if (updateHash) window.location.hash = viewName;

    document.querySelectorAll('.nav-link-clean').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-view') === viewName);
    });

    document.querySelectorAll('.view-section').forEach(sec => {
      const match = sec.id === `view-${viewName}`;
      sec.classList.toggle('active', match);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'labs') window.labsController?.resetParticleLab?.();
  }

  function initHomeView() {
    const stats = document.getElementById('home-stats');
    if (stats) {
      stats.innerHTML = PORTFOLIO_DATA.profile.stats.map(s => `
        <div class="bento-card">
          <div class="bento-num">${s.value}</div>
          <div class="bento-label">${s.label}</div>
        </div>
      `).join('');
    }

    const featuredBlock = document.getElementById('home-featured-block');
    const featuredContainer = document.getElementById('featured-projects-container');
    const featured = PORTFOLIO_DATA.projects.filter(p => p.featured).slice(0, 2);
    if (featuredBlock && featuredContainer && featured.length) {
      featuredBlock.hidden = false;
      featuredContainer.innerHTML = featured.map(p => `
        <article class="featured-card" data-id="${p.id}">
          <div class="featured-meta">
            <div class="featured-top-row">
              <span class="featured-cat">${escapeHtml(p.categoryLabel || 'Cybersecurity')}</span>
            </div>
            <h3 class="featured-title">${escapeHtml(p.title)}</h3>
            <p class="featured-desc">${escapeHtml(p.question || p.tagline || '')}</p>
          </div>
        </article>
      `).join('');
      featuredContainer.querySelectorAll('.featured-card').forEach(card => {
        card.addEventListener('click', () => {
          navigateTo('projects');
          requestAnimationFrame(() => {
            document.querySelector(`.qa-card[data-id="${card.getAttribute('data-id')}"]`)
              ?.querySelector('.qa-toggle')
              ?.click();
          });
        });
      });
    } else if (featuredBlock) {
      featuredBlock.hidden = true;
    }

    const testimonialsContainer = document.getElementById('testimonials-container');
    if (testimonialsContainer) {
      testimonialsContainer.innerHTML = PORTFOLIO_DATA.testimonials.map(t => `
        <blockquote class="quote-card">
          <p class="quote-text">“${t.quote}”</p>
          <footer>
            <div class="quote-author">${t.author}</div>
            <div class="quote-role">${t.role}</div>
          </footer>
        </blockquote>
      `).join('');
    }
  }

  function socialIcon(id) {
    const map = { github: 'GH', linkedin: 'in', x: 'X', instagram: 'Ig' };
    return map[id] || '↗';
  }

  function socialBoxesHtml() {
    return PORTFOLIO_DATA.profile.socials.map(s => `
      <a href="${s.href}" target="_blank" rel="noopener noreferrer" class="social-box">
        <div class="social-box-left">
          <span class="social-icon-text">${socialIcon(s.id)}</span>
          <span class="social-title">${s.label}</span>
        </div>
        <span class="social-arrow">↗</span>
      </a>
    `).join('');
  }

  function socialPillsHtml() {
    return PORTFOLIO_DATA.profile.socials.map(s => `
      <a class="social-pill" href="${s.href}" target="_blank" rel="noopener noreferrer">${s.label} ↗</a>
    `).join('');
  }

  function initSocials() {
    const footer = document.getElementById('footer-socials');
    if (footer) footer.innerHTML = socialBoxesHtml();
    const about = document.getElementById('about-socials');
    if (about) about.innerHTML = socialPillsHtml();
    const contact = document.getElementById('contact-socials');
    if (contact) contact.innerHTML = socialPillsHtml();
  }

  function initAboutView() {
    const paras = document.getElementById('about-paragraphs');
    if (paras) {
      paras.innerHTML = PORTFOLIO_DATA.profile.aboutLong.map(p => `<p class="about-p">${p}</p>`).join('');
    }

    const skills = document.getElementById('skills-grid');
    if (skills) {
      skills.innerHTML = PORTFOLIO_DATA.profile.skills.map(g => `
        <div class="skill-card">
          <h3>${g.group}</h3>
          <ul>${g.items.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
      `).join('');
    }

    const tl = document.getElementById('about-timeline');
    if (tl) {
      tl.innerHTML = PORTFOLIO_DATA.profile.timeline.map(item => `
        <li>
          <span class="tl-year">${item.year}</span>
          <div>
            <strong>${item.title}</strong>
            <p>${item.detail}</p>
          </div>
        </li>
      `).join('');
    }
  }

  function awaitingFilesHtml(title, detail) {
    return `
      <div class="empty-state awaiting-files">
        <h3>${title}</h3>
        <p>${detail}</p>
      </div>
    `;
  }

  function initProjectsView() {
    const grid = document.getElementById('projects-grid');
    const filterBar = document.getElementById('projects-filter-bar');
    const filterBtns = document.querySelectorAll('.clean-pill-btn');
    const searchInput = document.getElementById('project-search-input');

    const updateProjects = () => {
      if (!grid) return;
      const list = PORTFOLIO_DATA.projects || [];
      if (filterBar) filterBar.hidden = list.length === 0;

      if (list.length === 0) {
        grid.innerHTML = awaitingFilesHtml(
          'Projects coming soon',
          'Placeholder work has been cleared. Cybersecurity write-ups will show here as click-to-reveal questions and answers — not PDFs — after the files are uploaded.'
        );
        return;
      }

      let filtered = list;
      if (state.projectFilter !== 'all') {
        filtered = filtered.filter(p => p.category === state.projectFilter);
      }
      if (state.projectSearch.trim()) {
        const q = state.projectSearch.toLowerCase();
        filtered = filtered.filter(p =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.question || '').toLowerCase().includes(q) ||
          (p.answer || '').toLowerCase().includes(q) ||
          (p.summary || '').toLowerCase().includes(q)
        );
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="empty-state">
            <h3>No write-ups match that filter</h3>
            <p>Try another category or search term.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(p => `
        <article class="qa-card" data-id="${p.id}">
          <button class="qa-toggle" type="button" aria-expanded="false">
            <span class="qa-toggle-copy">
              <span class="featured-cat">${escapeHtml(p.categoryLabel || 'Cybersecurity')}</span>
              <span class="qa-title">${escapeHtml(p.title)}</span>
              <span class="qa-hint">Click to reveal question &amp; answer</span>
            </span>
            <span class="qa-chevron" aria-hidden="true">↓</span>
          </button>
          <div class="qa-body" hidden>
            <div class="qa-block">
              <h3>Question</h3>
              <p>${escapeHtml(p.question || 'Question will be added with this write-up.')}</p>
            </div>
            <div class="qa-block qa-block-answer">
              <h3>Answer</h3>
              <p>${escapeHtml(p.answer || 'Answer will be added with this write-up.')}</p>
            </div>
            ${engageHtml(`project-${p.id}`)}
          </div>
        </article>
      `).join('');

      grid.querySelectorAll('.qa-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const card = btn.closest('.qa-card');
          const body = card.querySelector('.qa-body');
          const open = body.hasAttribute('hidden');
          body.hidden = !open;
          btn.setAttribute('aria-expanded', String(open));
          card.classList.toggle('is-open', open);
          window.soundEngine?.playClick();
        });
      });
      bindEngageForms(grid);
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.projectFilter = btn.getAttribute('data-filter');
        updateProjects();
        window.soundEngine?.playClick();
      });
    });

    searchInput?.addEventListener('input', e => {
      state.projectSearch = e.target.value;
      updateProjects();
    });

    updateProjects();
  }

  function initCertificatesView() {
    const certsGrid = document.getElementById('certs-grid');
    if (!certsGrid) return;
    const list = PORTFOLIO_DATA.certificates || [];

    if (list.length === 0) {
      certsGrid.innerHTML = awaitingFilesHtml(
        'Certificates coming soon',
        'Placeholder credentials have been removed. Official files and verification links will be added when they are uploaded.'
      );
      return;
    }

    certsGrid.innerHTML = list.map(c => `
      <article class="cert-card-clean">
        <div>
          <div class="cert-header-clean">
            <div class="cert-icon-box">${c.badgeIcon || '▣'}</div>
            <div>
              <div class="cert-issuer">${escapeHtml(c.issuer || '')}</div>
              <h3 class="cert-title">${escapeHtml(c.title)}</h3>
            </div>
          </div>
          <p class="cert-desc">${escapeHtml(c.description || '')}</p>
          ${c.credentialId ? `<p class="cert-id">ID · ${escapeHtml(c.credentialId)}</p>` : ''}
        </div>
        ${c.verifyUrl ? `<a class="btn-hire-me cert-verify" href="${c.verifyUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(c.verifyLabel || 'Verify')} ↗</a>` : ''}
        ${engageHtml(`cert-${c.id}`)}
      </article>
    `).join('');
    bindEngageForms(certsGrid);
  }

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function loadLikes() {
    return loadJson(LIKES_KEY, {});
  }

  function loadCommentsMap() {
    return loadJson(COMMENTS_KEY, {});
  }

  function engageHtml(id) {
    const likes = loadLikes();
    const comments = loadCommentsMap()[id] || [];
    const liked = Boolean(likes[id]?.liked);
    const count = likes[id]?.count || 0;
    return `
      <div class="engage-wrap" data-engage-id="${id}">
        <div class="engage-bar">
          <button type="button" class="engage-btn like-btn${liked ? ' is-liked' : ''}" data-like="${id}" aria-pressed="${liked}">
            <span aria-hidden="true">${liked ? '♥' : '♡'}</span>
            Like
            <span class="like-count">${count}</span>
          </button>
          <button type="button" class="engage-btn comment-toggle" data-comment-toggle="${id}" aria-expanded="false">
            <span aria-hidden="true">💬</span>
            Comment
            <span class="comment-count">${comments.length}</span>
          </button>
        </div>
        <div class="comment-panel" data-comment-panel="${id}" hidden>
          <form class="comment-form" data-comment-form="${id}">
            <input name="name" type="text" class="clean-input" placeholder="Your name" maxlength="80" required>
            <textarea name="message" class="clean-textarea" rows="3" placeholder="Write a comment…" maxlength="400" required></textarea>
            <button type="submit" class="btn-submit-clean comment-submit">Post comment</button>
          </form>
          <div class="comment-list" data-comment-list="${id}">${commentListHtml(comments)}</div>
        </div>
      </div>
    `;
  }

  function commentListHtml(comments) {
    if (!comments.length) {
      return '<p class="comment-empty">No comments yet.</p>';
    }
    return comments.slice().reverse().map(c => `
      <article class="comment-item">
        <div class="comment-meta">
          <strong>${escapeHtml(c.name)}</strong>
          <time>${escapeHtml(c.when)}</time>
        </div>
        <p>${escapeHtml(c.message)}</p>
      </article>
    `).join('');
  }

  function refreshEngage(id) {
    document.querySelectorAll(`[data-engage-id="${id}"]`).forEach(wrap => {
      wrap.outerHTML = engageHtml(id);
    });
    document.querySelectorAll(`[data-engage-id="${id}"]`).forEach(wrap => bindEngageForms(wrap));
  }

  function bindEngageForms(root) {
    root.querySelectorAll('[data-comment-form]').forEach(form => {
      if (form.dataset.bound === 'true') return;
      form.dataset.bound = 'true';
      form.addEventListener('submit', e => {
        e.preventDefault();
        const id = form.getAttribute('data-comment-form');
        const name = form.querySelector('[name="name"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();
        if (!name || !message) {
          showToast('Add a name and comment.');
          return;
        }
        const map = loadCommentsMap();
        if (!map[id]) map[id] = [];
        map[id].push({
          name,
          message,
          when: new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
        });
        saveJson(COMMENTS_KEY, map);
        form.reset();
        window.soundEngine?.playSuccess();
        showToast('Comment posted.');
        refreshEngage(id);
        const panel = document.querySelector(`[data-comment-panel="${id}"]`);
        const toggle = document.querySelector(`[data-comment-toggle="${id}"]`);
        if (panel) panel.hidden = false;
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
      });
    });
  }

  function initEngagement() {
    document.querySelectorAll('[data-engage-host]').forEach(host => {
      host.innerHTML = engageHtml(host.getAttribute('data-engage-host'));
      bindEngageForms(host);
    });

    document.addEventListener('click', e => {
      const likeBtn = e.target.closest('[data-like]');
      if (likeBtn) {
        e.stopPropagation();
        const id = likeBtn.getAttribute('data-like');
        const likes = loadLikes();
        const current = likes[id] || { count: 0, liked: false };
        if (current.liked) {
          current.liked = false;
          current.count = Math.max(0, current.count - 1);
        } else {
          current.liked = true;
          current.count += 1;
        }
        likes[id] = current;
        saveJson(LIKES_KEY, likes);
        window.soundEngine?.playClick();
        const wasOpen = !document.querySelector(`[data-comment-panel="${id}"]`)?.hidden;
        refreshEngage(id);
        if (wasOpen) {
          const panel = document.querySelector(`[data-comment-panel="${id}"]`);
          const toggle = document.querySelector(`[data-comment-toggle="${id}"]`);
          if (panel) panel.hidden = false;
          if (toggle) toggle.setAttribute('aria-expanded', 'true');
        }
        return;
      }

      const toggle = e.target.closest('[data-comment-toggle]');
      if (toggle) {
        e.stopPropagation();
        const id = toggle.getAttribute('data-comment-toggle');
        const panel = document.querySelector(`[data-comment-panel="${id}"]`);
        if (!panel) return;
        const open = panel.hidden;
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        window.soundEngine?.playClick();
      }
    });
  }

  function initContact() {
    const form = document.getElementById('portfolio-contact-form');
    form?.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const brief = document.getElementById('contact-brief').value.trim();
      if (!name || !email || !brief) {
        showToast('Please complete name, email, and brief.');
        return;
      }
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${brief}`
      );
      window.location.href = `mailto:${PORTFOLIO_DATA.profile.email}?subject=${subject}&body=${body}`;
      showToast('Opening your email client…');
      window.soundEngine?.playSuccess();
      form.reset();
    });
  }

  function loadFeedback() {
    try {
      return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function saveFeedback(list) {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
  }

  function renderFeedback() {
    const list = loadFeedback();
    const wall = document.getElementById('feedback-wall');
    const summary = document.getElementById('feedback-summary');
    if (!wall || !summary) return;

    if (list.length === 0) {
      summary.innerHTML = '<p class="card-sub">No notes yet — be the first.</p>';
      wall.innerHTML = '';
      return;
    }

    const avg = list.reduce((s, f) => s + f.rating, 0) / list.length;
    summary.innerHTML = `
      <div class="avg-box">
        <span class="avg-num">${avg.toFixed(1)}</span>
        <span class="avg-stars">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5 - Math.round(avg))}</span>
        <span class="avg-count">${list.length} note${list.length === 1 ? '' : 's'}</span>
      </div>
    `;

    wall.innerHTML = list.slice().reverse().map(f => `
      <article class="fb-card">
        <div class="fb-top">
          <strong>${escapeHtml(f.name)}</strong>
          <span class="fb-stars">${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)}</span>
        </div>
        <p>${escapeHtml(f.message)}</p>
        <time>${f.when}</time>
      </article>
    `).join('');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function paintStars(value) {
    document.querySelectorAll('.star-btn').forEach(btn => {
      const v = Number(btn.getAttribute('data-value'));
      btn.classList.toggle('is-on', v <= value);
    });
    const hint = document.getElementById('star-hint');
    if (hint) hint.textContent = value ? STAR_LABELS[value] : 'Tap a star';
  }

  function initFeedback() {
    const stars = document.querySelectorAll('.star-btn');
    stars.forEach(btn => {
      btn.addEventListener('mouseenter', () => paintStars(Number(btn.getAttribute('data-value'))));
      btn.addEventListener('click', () => {
        state.rating = Number(btn.getAttribute('data-value'));
        paintStars(state.rating);
        window.soundEngine?.playClick();
      });
    });
    document.getElementById('star-rating')?.addEventListener('mouseleave', () => paintStars(state.rating));

    const form = document.getElementById('feedback-form');
    form?.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('fb-name').value.trim();
      const message = document.getElementById('fb-message').value.trim();
      if (!state.rating) {
        showToast('Please choose a star rating.');
        return;
      }
      if (!name || !message) {
        showToast('Add your name and a short message.');
        return;
      }
      const list = loadFeedback();
      list.push({
        name,
        message,
        rating: state.rating,
        when: new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
      });
      saveFeedback(list);
      form.reset();
      state.rating = 0;
      paintStars(0);
      renderFeedback();
      window.soundEngine?.playSuccess();
      showToast('Thanks — feedback posted.');
    });

    renderFeedback();
  }

  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.getAttribute('data-copy'));
          showToast('Email copied');
        } catch {
          showToast('Could not copy — use the mailto link');
        }
      });
    });
  }

  function initModals() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) closeModal(modal);
      });
      modal.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => closeModal(modal));
      });
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(closeModal);
      }
    });
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    window.soundEngine?.playModalOpen();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.showToast = function (msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-clean';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };
});
