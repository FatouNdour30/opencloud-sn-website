// Pages article du blog : en-tête, progression de lecture, sommaire actif, partage
(function () {
  var siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    var toggleHeader = function () { siteHeader.classList.toggle('is-scrolled', window.scrollY > 40); };
    toggleHeader();
    window.addEventListener('scroll', toggleHeader, { passive: true });
  }

  // Barre de progression en haut de page + jauge du sommaire (progression dans l'article)
  var pageBar = document.getElementById('scrollProgress');
  var tocBar = document.getElementById('artProgress');
  var prose = document.getElementById('artProse');
  var updateProgress = function () {
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (pageBar) { pageBar.style.width = (docHeight > 0 ? window.scrollY / docHeight * 100 : 0) + '%'; }
    if (tocBar && prose) {
      var rect = prose.getBoundingClientRect();
      var total = rect.height - window.innerHeight * 0.6;
      var done = Math.min(Math.max(-rect.top + window.innerHeight * 0.3, 0), total);
      tocBar.style.height = (total > 0 ? done / total * 100 : 0) + '%';
    }
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  // Sommaire : section en cours de lecture
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('#artToc a'));
  var sections = tocLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var setActiveToc = function () {
    var current = 0;
    sections.forEach(function (sec, i) {
      if (sec && sec.getBoundingClientRect().top < window.innerHeight * 0.35) { current = i; }
    });
    tocLinks.forEach(function (a, i) { a.classList.toggle('is-active', i === current); });
  };
  if (tocLinks.length) {
    setActiveToc();
    window.addEventListener('scroll', setActiveToc, { passive: true });
  }

  // Partage
  var url = window.location.href.split('#')[0];
  var title = document.title;
  var li = document.getElementById('artShareLinkedin');
  var wa = document.getElementById('artShareWhatsapp');
  if (li) { li.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url); }
  if (wa) { wa.href = 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url); }
  var copyBtn = document.getElementById('artCopyLink');
  if (copyBtn) {
    var label = copyBtn.querySelector('span');
    copyBtn.addEventListener('click', function () {
      var done = function () {
        copyBtn.classList.add('is-copied');
        label.textContent = 'Lien copié';
        setTimeout(function () { copyBtn.classList.remove('is-copied'); label.textContent = 'Copier le lien'; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(function () { window.prompt('Copiez le lien :', url); });
      } else {
        window.prompt('Copiez le lien :', url);
      }
    });
  }
})();
