<?php

namespace Drupal\isp_stripe\Plugin\WebformHandler;

use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Drupal\webform\Plugin\WebformHandlerBase;
use Drupal\webform\WebformSubmissionInterface;
use Drupal\Core\Render\Markup;

/**
 * Creates a new receipt node from a webform submission.
 *
 * @WebformHandler(
 *   id = "isp_create_receipt_node",
 *   label = @Translation("Create Receipt Node"),
 *   category = @Translation("Entity Creation"),
 *   description = @Translation("Creates a new receipt node from the submitted data."),
 *   cardinality = \Drupal\webform\Plugin\WebformHandlerInterface::CARDINALITY_SINGLE,
 *   results = \Drupal\webform\Plugin\WebformHandlerInterface::RESULTS_PROCESSED,
 * )
 */
class IspEventReceiptWebformHandler extends WebformHandlerBase {

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state, WebformSubmissionInterface $webform_submission) {
    $values = $webform_submission->getData();
    $reciept_details = !empty($values['payment_data']) ? json_decode($values['payment_data'], true) : [];
    $event_name = $this->getEventName($values['event']);
    // Create the receipt node.
    $node = Node::create([
      'type' => 'reciept',

      // 'field_reciept_for' => $reciept_details['transaction'], //reference
      'field_amount' => $reciept_details['amount'],
      'field_transaction_number' => $reciept_details['transaction'],
      'field_athlete_submission_id' => $webform_submission->id(),
      'field_date_paid' => $webform_submission->getCreatedTime(), // timestamp
      'field_event_id' => $values['event'], // reference
      'field_event_name' => $event_name,
      'body' => "{$values['first_name']} {$values['last_name']}",
      'title' => "{$this->getEventName($values['event'])} Reciept: {$values['first_name']} {$values['last_name']}"
    ]);
    $node->save();
    $this->sendReciept($node, $values['email'] ?? $values['e_mail']);
  }

  private function getEventName(string $nid): string {
    return $this->entityTypeManager->getStorage('node')->load($nid)->label() ?? 'Event name unavailable';
  }

  private function sendReciept(NodeInterface $receipt, string $to) {
    $params = [
      'receipt' => $this->renderReceipt($receipt),
      'event_name' => $receipt->field_event_name->value,
    ];
    $site_mail = '';
    $result = \Drupal::service('plugin.manager.mail')->mail(
      'island_strength_power',
      'receipt',
      $to,
      'en',
      $params,
      $site_mail,
      true
    );

    return $result;
  }

  private function renderReceipt(NodeInterface $receipt): Markup {
    $type = 'node';
    $b = $this->entityTypeManager->getViewBuilder($type);
    $view = $b->view($receipt, 'teaser');
    return \Drupal::service('renderer')->render($view);
  }

}
