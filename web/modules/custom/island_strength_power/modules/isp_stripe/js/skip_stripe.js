(function ($, Drupal, once) {
  Drupal.behaviors.ispStripePayments = {
    attach: function (context, settings) {
      $.fn.skipStripePayment = function (argument) {
        const registrationForm = document.getElementsByClassName('isp-registration-form').item(0);
        if (argument.hasErrors) {
          alert('Please verify that the form is complete.');
          markDirtyOrClean(registrationForm, true);
          return;
        }
        // markDirtyOrClean(registrationForm, false);
        adminSubmitWebform();

        function adminSubmitWebform() {
          const payButton = document.querySelector("[data-stripe-submit='stripe-webform-submit-button']");

          payButton.disabled = false;
          payButton.click();
          payButton.disabled = true;
        }
      };
    }
  };

  function markDirtyOrClean(elem, isDirty) {
    if (elem != null) {
      if (isDirty) {
        elem.classList.add('is-dirty');
      } else {
        elem.classList.remove('is-dirty');
      }
    }
  }
})(jQuery, Drupal, once);
