<?php

declare(strict_types=1);

namespace Drupal\isp_stripe\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a Island Strength and Power Stripe Webform form.
 */
final class IspStripeForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'isp_stripe_isp_stripe';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, float $amount = 0, $options = []): array {
    // $stripe_wrapper = \Drupal::service('stripe_webform_payment.stripe');
    // $client_secret = $stripe_wrapper->getClientSecret($amount, 'CAD');

    $form['message'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Message'),
      '#required' => false,
      '#default_value' => $amount,
    ];

    $form['message2'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Message'),
      '#required' => false,
      '#default_value' => !empty($options)
          ? implode(', ', $options)
          : '',
    ];
    $form['#attached']['library'][] = 'isp_stripe/isp_stripe';
    // $form['#attached']['library'][] = 'stripe_webform_payment/stripe_elements';

    $form['actions'] = [
      '#type' => 'actions',
      'submit' => [
        '#type' => 'submit',
        '#value' => $this->t('Send'),
      ],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state): void {
    // @todo Validate the form here.
    // Example:
    // @code
    //   if (mb_strlen($form_state->getValue('message')) < 10) {
    //     $form_state->setErrorByName(
    //       'message',
    //       $this->t('Message should be at least 10 characters.'),
    //     );
    //   }
    // @endcode
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $this->messenger()->addStatus($this->t('The message has been sent.'));
    $form_state->setRedirect('<front>');
  }

}
