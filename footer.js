// Footer partagé (pages hors accueil) : horloge, apparition, effets et copie au clic
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Footer : horloge locale Dakar ----------
  var footerClockEl = document.getElementById('footerClockTime');
  if (footerClockEl) {
    var dakarFormatter = null;
    try {
      dakarFormatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Africa/Dakar',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    } catch (e) {}
    var tickClock = function () {
      footerClockEl.textContent = dakarFormatter ? dakarFormatter.format(new Date()) : new Date().toLocaleTimeString();
    };
    tickClock();
    setInterval(tickClock, 1000);
  }

  // ---------- Footer : apparition progressive des colonnes ----------
  var footerCols = document.querySelectorAll('.footer-lead, .footer-col, .footer-bottom');
  if (footerCols.length) {
    if (!reduceMotion && 'IntersectionObserver' in window) {
      document.documentElement.classList.add('footer-reveal');
      var footerObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            footerObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      footerCols.forEach(function (el) { footerObserver.observe(el); });
    } else {
      footerCols.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  // ---------- Footer : effet magnétique sur les icônes rondes ----------
  var footerEl = document.querySelector('footer');
  var hoverCapable = window.matchMedia('(hover: hover)').matches;
  if (!reduceMotion && hoverCapable) {
    var magneticEls = document.querySelectorAll('.social-links a, .footer-top');
    magneticEls.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.28) + 'px,' + (y * 0.28) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  // ---------- Footer : halo qui suit le curseur ----------
  if (footerEl && !reduceMotion && hoverCapable) {
    footerEl.addEventListener('mousemove', function (e) {
      var rect = footerEl.getBoundingClientRect();
      footerEl.style.setProperty('--fx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      footerEl.style.setProperty('--fy', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  }

  // ---------- Footer : anneau de progression sur le bouton retour en haut ----------
  var footerTopBtn = document.querySelector('.footer-top');
  if (footerTopBtn) {
    var updateFooterTopProgress = function () {
      var doc = document.documentElement;
      var docHeight = doc.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
      footerTopBtn.style.setProperty('--scroll-pct', pct);
    };
    updateFooterTopProgress();
    window.addEventListener('scroll', updateFooterTopProgress, { passive: true });
    window.addEventListener('resize', updateFooterTopProgress);
  }

  // ---------- Footer : copier au clic (email / téléphone) ----------
  var toastEl = null;
  var showToast = function (message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'copy-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastEl._hideTimer);
    toastEl._hideTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 1800);
  };
  var copyTargets = document.querySelectorAll('.footer-copy');
  copyTargets.forEach(function (el) {
    var doCopy = function () {
      var value = el.getAttribute('data-copy');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () {
          showToast('Copié : ' + value);
        }).catch(function () {
          showToast(value);
        });
      } else {
        showToast(value);
      }
    };
    el.addEventListener('click', doCopy);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doCopy(); }
    });
  });
})();
