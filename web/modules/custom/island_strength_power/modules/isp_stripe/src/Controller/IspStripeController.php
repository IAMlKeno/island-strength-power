<?php

namespace Drupal\isp_stripe\Controller;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\InvokeCommand;
use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;

/**
 * Returns responses for Island Strength and Power Stripe Webform routes.
 */
final class IspStripeController extends ControllerBase {

  /**
   * Builds the response.
   */
  public function __invoke() {
    $build = [
      '#theme' => 'simple_square_portal',
      '#output' => $this->t("Register for @evt", [
        '@evt' => $evtName,
      ]),
      '#registration_price' => $event,
      '#attached' => [
        'library' => [
          'simple_square_plugin/simple_square_lib',
        ],
      ],
    ];

    return $build;
  }

  public function getStripeForm() {
    $params = \Drupal::request()->toArray();
    $amount = !empty($params) ? $this->calculateTotal($params) : 0;
    // $stripe_wrapper = \Drupal::service('stripe_webform_payment.stripe');
    // $client_secret = $stripe_wrapper->getClientSecret($amount, 'CAD');

    // $build = [
    //   '#theme' => 'simple_square_portal',
    //   '#output' => $this->t("Register for @evt", [
    //     '@evt' => $evtName,
    //   ]),
    //   '#registration_price' => $event,
    //   '#attached' => [
    //     'library' => [
    //       'simple_square_plugin/simple_square_lib',
    //     ],
    //   ],
    // ];

    $form = \Drupal::formBuilder()
        ->getForm('Drupal\isp_stripe\Form\IspStripeForm', !empty($params) ? $this->calculateTotal($params) : 'DEBUGGING');
    // $form['#attached']['library'][] = 'isp_stripe/isp_stripe';

    $response['form'] = \Drupal::service('renderer')->renderRoot($form);

    // $ajax = new AjaxResponse($response);
    $ajax = new AjaxResponse();
    $ajax->addCommand(new InvokeCommand(NULL, 'myAjaxCallback', ['This is the new text!']));
    $ajax->addCommand(new InvokeCommand(NULL, 'ajaxTest'));

    return $ajax;
  }

  /**
   * Gets the registration price from a node.
   *
   * @param int $nid
   *   The node ID to load.
   *
   * @return mixed
   *   Returns the field value if found, NULL if not found.
   */
  protected function getEventRegistrationPrice($nid, bool $isTested): string|null {
    $node = Node::load($nid);

    if ($node) {
      if ($isTested && $node->hasField('field_tested_price')) {
        return $node->get('field_tested_price')->value;
      }
      else {
        return $node->get('field_untested_price')->value;
      }
    }

    return NULL;
  }

  /**
   * @param array $params
   *   containing event: nid, ages: int, competitions: int, isTested: bool
   *
   * @return float
   *   Cost to register
   */
  protected function calculateTotal(array $params): float {
    $total = 0;

    $total += $this->getEventRegistrationPrice($params['event'], $params['isTested']);
    $total += ($params['ages'] - 1) * 30;
    $total += ($params['competitions'] - 1) * 30;

    return $total;
  }

}
