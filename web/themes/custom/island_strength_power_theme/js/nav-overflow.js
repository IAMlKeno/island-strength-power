/**
 * @file
 * Island Strength & Power — Priority navigation ("More" overflow).
 *
 * Keeps the main menu to a single tidy row. Only a limited number of
 * top-level links are shown; any that don't fit (or exceed the max)
 * are moved into a "More ⌄" dropdown at the end of the menu.
 *
 * - Width-aware: recalculates on load and on resize, so it adapts to
 *   the viewport instead of using fixed breakpoints.
 * - Capped: never shows more than `maxVisible` top-level links.
 * - Accessible: More toggle is a real <button> with aria-expanded;
 *   closes on outside click and Escape.
 * - Mobile-safe: disables itself below 768px (the stacked/hamburger
 *   menu shows every link).
 *
 * Tune the cap with:  <ul class="main-menu" data-max-visible="4"> …
 */
(function (Drupal) {
  'use strict';

  var MOBILE_BREAKPOINT = 768;
  var DEFAULT_MAX = 2;

  Drupal.behaviors.ispNavOverflow = {
    attach: function (context) {
      var menus = (context.querySelectorAll
        ? context.querySelectorAll('.main-menu')
        : []);

      menus.forEach(function (menu) {
        if (menu.dataset.overflowReady === '1') {
          return;
        }
        menu.dataset.overflowReady = '1';
        setup(menu);
      });
    }
  };

  function setup(menu) {
    var maxVisible = parseInt(menu.dataset.maxVisible, 10) || DEFAULT_MAX;

    // Remember the original top-level items in their authored order.
    var originalItems = Array.prototype.filter.call(
      menu.children,
      function (li) { return li.classList.contains('menu-item'); }
    );

    // Build the "More" item once.
    var moreItem = document.createElement('li');
    moreItem.className = 'menu-item menu-item--more menu-item--align-right';
    moreItem.style.display = 'none';

    var moreToggle = document.createElement('button');
    moreToggle.type = 'button';
    moreToggle.className = 'more-toggle';
    moreToggle.setAttribute('aria-haspopup', 'true');
    moreToggle.setAttribute('aria-expanded', 'false');
    moreToggle.innerHTML = 'More <span class="caret" aria-hidden="true"></span>';

    var moreList = document.createElement('ul');
    moreList.className = 'submenu more-menu';

    moreItem.appendChild(moreToggle);
    moreItem.appendChild(moreList);
    menu.appendChild(moreItem);

    // Toggle open/close.
    // Commenting out for now as the menu expands on hover and collapses when mouse leaves
    /*
    moreToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = moreItem.classList.toggle('is-open');
      moreToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close on outside click / Escape.
    document.addEventListener('click', function (e) {
      if (!moreItem.contains(e.target)) { close(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); }
    });
    */

    function close() {
      moreItem.classList.remove('is-open');
      moreToggle.setAttribute('aria-expanded', 'false');
    }

    function restoreAll() {
      originalItems.forEach(function (li) {
        menu.insertBefore(li, moreItem);
      });
    }

    function fit() {
      close();

      // Mobile: show everything, hide More, let the stacked menu handle it.
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        restoreAll();
        moreItem.style.display = 'none';
        return;
      }

      // 1. Reset to the full set so we measure from a known state.
      restoreAll();
      moreItem.style.display = '';

      // 2. Move items into "More" until the row fits AND we're within
      //    the max-visible cap. Always move from the end to preserve order.
      //    The menu is shrink-wrapped to its content, so we measure its
      //    required width against the available space in its container.
      var guard = 0;
      while (guard++ < 60) {
        var visible = Array.prototype.filter.call(menu.children, function (li) {
          return li.classList.contains('menu-item') &&
                 (!li.classList.contains('menu-item--more') && !li.classList.contains('overflow-exclude'));
        });

        var available = (menu.parentElement || menu).clientWidth;
        var overflowing = menu.scrollWidth > available + 1;
        var tooMany = visible.length > maxVisible;

        if ((!overflowing && !tooMany) || visible.length <= 1) {
          break;
        }

        // Move the last visible item to the FRONT of More (keeps order).
        var last = visible[visible.length - 1];
        moreList.insertBefore(last, moreList.firstChild);
      }

      // 3. Hide "More" if nothing ended up in it.
      moreItem.style.display = moreList.children.length ? '' : 'none';
    }

    // Run now and on resize (debounced).
    var raf;
    function schedule() {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(fit);
    }

    fit();
    window.addEventListener('resize', schedule);

    // Re-fit once web fonts settle (their metrics change item widths).
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit);
    }
  }

})(Drupal);
