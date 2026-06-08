<?php

namespace Drupal\isp_stripe\Plugin\WebformElement;

use Drupal\Core\Serialization\Yaml;
use Drupal\stripe_webform_payment\Plugin\WebformElement\StripeWebformPayment;
use Drupal\webform\WebformSubmissionInterface;

/**
 * Provides a 'stripe_payment' element.
 *
 * @WebformElement(
 *   id = "isp_stripe_payment",
 *   label = @Translation("ISP Stripe Payment"),
 *   description = @Translation("Provides a Stripe payment element."),
 *   category = @Translation("Advanced elements"),
 * )
 */
class IspStripeWebformPayment extends StripeWebformPayment {

  /**
   * {@inheritdoc}
   */
  public function prepare(array &$element, WebformSubmissionInterface $webform_submission = NULL) {
    parent::prepare($element, $webform_submission);

    // $element['payment_intent_id'] = [
    //   '#type' => 'hidden',
    //   '#title' => $this->t('Payment ID'),
    //   '#default_value' => '',
    //   '#required' => TRUE,
    // ];

    // // Get the webform object from the webform submission.
    $webform = $webform_submission->getWebform();

    // Get the AJAX setting from the webform object.
    $ajaxEnabled = $webform->getSetting('ajax');

    // $library = [];
    // if ($ajaxEnabled) {
    //   $library = ['stripe_webform_payment/stripe_elements_ajax'];
    // }
    // else {
    //   $library = ['stripe_webform_payment/stripe_elements'];
    // }
    $library = ['isp_stripe/isp_stripe'];

    $markup = '
        <div class="stripe-webform-payment-container">
            <div id="payment-message" class="hidden">
              <div class="messages__content"></div>
            </div>
            <div id="payment-element"></div>
          </div>';

    if (!empty($element['#stripe_address'])) {
      $markup .= '<div id="address-element"></div>';
    }

    $element['stripe_placeholder'] = [
      '#type' => 'markup',
      '#markup' => $markup,
      '#attached' => [
        'library' => $library,
        'drupalSettings' => [
          'stripeWebformPayment' => [
            'publishableKey' => $this->stripeService->getPublishableKey(),
            'clientName' => $element['#stripe_name'] ?? '',
            'clientEmail' => $element['#stripe_email'] ?? '',
            'collectAddress' => $element['#stripe_address'] ?? NULL,
            'addressType' => $element['#stripe_address_type'] ?? NULL,
            'appearanceEnabled' => $element['#stripe_enable_appearance'] ?? NULL,
            'paymentAppearance' => $element['#stripe_appearance'] ? self::sanitizeArray(Yaml::decode($element['#stripe_appearance'])) : [],
            'clientSecret' => '',
            'webformId' => $element['#webform_id'],
            'returnUrl' => '/',
          ],
        ],
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  protected function createPaymentIntent(array $element) {
    $source = $element['#stripe_source'];

    // Get the amount and currency from element settings.
    if ('custom' === $source) {
      $amount = floatval(25.00) * 100;
      $currency = $element['#stripe_currency'];
    }
    elseif ('product') {
      $price = $this->stripeService
        ->getProductPrice($element['#stripe_product']);
      $amount = $price['amount'];
      $currency = $price['currency'];
    }
    if (!$amount || !$currency) {
      $this->messenger()->addError($this->t("The price amount or currency is not defined, please correct this and try again."));
      return;
    }

    $options = Yaml::decode($element['#stripe_payment_intent_config']);
    // Sanitize the options as they are inserted by the user.
    $options = $options ? self::sanitizeArrayV2($options) : [];

    $linkCustomer = $element['#stripe_customer'] ?? NULL;

    if ($linkCustomer) {
      $stripeCustomer = $this->getCustomer($element);
      if (empty($stripeCustomer)) {
        $stripeCustomer = $this->createCustomer($element);
      }

      $stripeCustomerId = $stripeCustomer?->id;

      $stripeCustomerId ?
        $options['customer'] = $stripeCustomerId : NULL;
    }

    // Make payment intent.
    return $this->stripeService
      ->createPaymentIntent($amount, $currency, $options);
  }

  /**
   * Sanitize array values.
   *
   * @param array $array
   *   The array to sanitize.
   *
   * @return array
   *   The sanatized array.
   */
  private static function sanitizeArrayV2(array $array) {
    return array_map(function ($value) {
      if (is_array($value)) {
        return self::sanitizeArrayV2($value);
      }
      return self::sanitizeV2($value);
    }, $array);
  }

  /**
   * Sanitize a string value, let mixed as the parent array may send mixed data.
   *
   * @param mixed $value
   *   The value to sanitize.
   *
   * @return mixed|string
   *   Sanitized value.
   */
  private static function sanitizeV2(mixed $value): mixed {
    if (is_string($value)) {
      return strip_tags($value);
    }
    return $value;
  }


}
