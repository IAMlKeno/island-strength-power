console.log('ISP_STRIPE JS LOADED');

function ajaxTest() {
  console.log('ISP_STRIPE JS AJAX CALLED');
}
(function (Drupal) {

  let initStripeHasRun = false;

  Drupal.behaviors.ispStripeWebformPayment = {
    attach: function (context, settings) {
      // var stripe = initStripe(context, settings);
      // console.log(stripe);
      // let t =document.getElementsByName('wrpf').item(0);
      // t.addEventListener('change', async () => {
      //   // console.log(stripe);
      //   stripe.fetchUpdates().then((result) => {
      //     console.log(`THE PAYMENT INTENT RESULTS: ${JSON.stringify(result)}`);
      //   });
      // })
      $.fn.myAjaxCallback = function(argument) {
        console.log('myAjaxCallback is called.');
        // Set textfield's value to the passed arguments.
        // $('input#edit-output').attr('value', argument);
      };
    },
  };

  // function initStripe(context, settings) {

  //   const paymentStep = context.querySelector('.stripe-webform-payment-container');
  //   if (!paymentStep) return;

  //   if (initStripeHasRun) return;
  //   initStripeHasRun = true;

  //   const {
  //     publishableKey, clientSecret, webformId, clientEmail,
  //     clientName, collectAddress, addressType, appearanceEnabled, paymentAppearance,
  //   } = drupalSettings.stripeWebformPayment;

  //   const stripe = Stripe(publishableKey);
  //   const webform = document.querySelector(`[data-stripe-form-id="${webformId}"]`);
  //   const payButton = context.querySelector("[data-stripe-submit='stripe-webform-submit-button']");

  //   let buttonClicked = false;
  //   if (!webform || !payButton) return;

  //   // Create paymentElementOptions and set appearance if appearanceEnabled is true
  //   const paymentElementOptions = { clientSecret };
  //   if (appearanceEnabled) {
  //     paymentElementOptions.appearance = paymentAppearance;
  //   }

  //   const elements = stripe.elements(paymentElementOptions);

  //   const paymentElement = elements.create('payment');
  //   paymentElement.mount('#payment-element');

  //   if (collectAddress !== null) {
  //     const addressElement = elements.create("address", { mode: addressType });
  //     addressElement.mount("#address-element");
  //   }

  //   paymentElement.on('change', event => payButton.disabled = event.empty || event.error);
  //   payButton.addEventListener('click', handlePayButtonClick);
  //   let paymentHandled = false;

  //   async function handlePayButtonClick(event) {
  //     if (paymentHandled) return;
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setLoading(true);

  //     handlePayment()
  //       .then(submitWebform)
  //       .catch((error) => {
  //         showMessage(error.message, 'error');
  //         setLoading(false);

  //         // Reset button status.
  //         payButton.disabled = false;
  //       });
  //   }

  //   async function handlePayment() {
  //     const { error, paymentIntent } = await stripe.confirmPayment({
  //       elements,
  //       confirmParams: { receipt_email: clientEmail },
  //       metadata: { customer_name: clientName },
  //       redirect: 'if_required',
  //     });

  //     if (error) {
  //       throw new Error(error.message);
  //     } else {
  //       await handlePaymentIntentStatus(paymentIntent, submitWebform);
  //       paymentHandled = true;
  //     }
  //   }

  //   async function handlePaymentIntentStatus(paymentIntent, submitWebform) {
  //     if (paymentIntent.status === "succeeded") {
  //       submitWebform();
  //     } else if (paymentIntent.status === "requires_action") {
  //       let paymentComplete = false;
  //       do {
  //         const updatedPaymentIntent = await stripe.retrievePaymentIntent(paymentIntent.id);
  //         if (updatedPaymentIntent.status === 'succeeded') {
  //           paymentComplete = true;
  //           submitWebform();
  //         } else {
  //           await new Promise(resolve => setTimeout(resolve, 500));
  //         }
  //       } while (!paymentComplete);
  //     }
  //   }

  //   function submitWebform() {
  //     payButton.disabled = false;
  //     paymentHandled = true;
  //     payButton.click();
  //     payButton.disabled = true;
  //   }

  //   function showMessage(messageText, messageType) {
  //     const messageContainer = document.querySelector('#payment-message');
  //     const messageContent = messageContainer.querySelector('.messages__content');

  //     messageContainer.classList.remove('hidden');
  //     messageContent.textContent = messageText;
  //     messageContainer.classList.add('messages', `messages--${messageType}`);
  //   }

  //   function setLoading(isLoading) {
  //     payButton.disabled = isLoading;
  //     payButton[payButton.tagName.toLowerCase() === 'input' ? 'value' : 'textContent'] = isLoading ? 'Processing payment...' : 'Submit';
  //   }

  //   return elements;
  // }
})(Drupal);
