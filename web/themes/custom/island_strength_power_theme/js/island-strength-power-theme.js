/**
 * @file
 * Island Strength and Power Theme behaviors.
 */
(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.islandStrengthPowerTheme = {
    attach (context, settings) {
      const registrationForm = document.getElementsByClassName('isp-registration-form').item(0);
      const stripeContainer = document.querySelector('.stripe-webform-payment-container');
      const btn = $('#registration-btn');

      if (registrationForm != null) {
        const path = window.location.pathname;
        if (path.match(/\/event\/\w+/) != null
          && stripeContainer.children.length == 0
          && !registrationForm.classList.contains('is-dirty')
        ) {
          registrationForm.classList.add('hidden');

          btn.click((e) => {
            $( registrationForm ).slideDown(600);
            registrationForm.classList.remove('hidden');
            $( e.target ).fadeOut();
          });
        }

        $( registrationForm ).change((e) => {
          const amount = $('#charge-amount-content');
          let calculatedAmount = calculateDisplayAmount();

          amount.text(calculatedAmount);
          return;
        });
      }

      function calculateDisplayAmount() {
        let calculatedAmount = getEventPrice();
        calculatedAmount += getAgeAdditions();
        calculatedAmount += getCategoryAdditions();

        return calculatedAmount;
      }

      function getEventPrice() {
        if (document.querySelector('input[name="tested_or_untested"]') == null) {
          return registrationAmount;
        }

        let checked = document.querySelector('input[name="tested_or_untested"]:checked');
        let tested = checked != null && checked.value != null ? checked.value.match(/Tested/) : false;

        if (tested != null) {
          return testedAmount;
        } else {
          return unTestedAmount;
        }
      };

      function getAgeAdditions() {
        let ages = $('input[name^="age_category"]:checked').length;
        return ages != 0 ? (ages - 1) * 30 : 0;
      }
      function getCategoryAdditions() {
        let competitions = $('input[name^="competition"]:checked').length;
        return competitions != 0 ? (competitions - 1) * 30 : 0;
      }

      /**
       * This only runs when the window is first loaded. So test screen responsiveness by actively
       * resizing the screen will not lead to appropriate testing.
       */
      function adjustViewGrid() {
        const grid = $('.views-view-responsive-grid.views-view-responsive-grid--horizontal');
        var screen = window.matchMedia("(max-width: 600px)")
        if (grid && screen.matches) {
          var r = grid.css('--views-responsive-grid--column-count', 1)
        }
      }
      adjustViewGrid();

    }
  };


} (jQuery, Drupal));
