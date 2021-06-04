<?php
use Restserver\Libraries\REST_Controller;
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';
/**
 * Class responsible for all the operations involving Orders
 */
class Orders extends REST_Controller {

    function __construct()
    {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
        
        // Construct the parent class
        parent::__construct();
        // Load the model
        $this->load->model("account_model");
        $this->load->model("product_model");
        $this->load->model("order_model");
    }

    /**
     * creates a new order
     *
     * @return void
     */
    public function index_post()
    {
        $token = $this->input->get_request_header('Authorization', TRUE);
        $account_id = $this->account_model->validate_token_and_get_account_id($token);

        $request = $this->request->body;

        $items = $request['items'];
        $points_redeemed = $request['points'];

        $order_items_without_order_Id = array();

        $order_total = 0;

        // calculate the order total using the latest prices of each item
        foreach ($items as $item){
            $price = $this->product_model->get_price($item['ItemId']);
            $order_total += $price * $item['qty'];
            $item['price'] = $price;
            array_push($order_items_without_order_Id,$item);
        }

        //die(json_encode($order_items_without_order_Id));

        //create an order and get the order id to insert items to the sub table
        $order_id = $this->order_model->create_and_get_id($account_id,$order_total,$points_redeemed);

        //store order items with quantity..etc
        foreach ($order_items_without_order_Id as $item){
            $item['orderId'] = $order_id;
            $this->order_model->store_order_item($item);
        }

        //die(json_encode($order_items_with_order_id));
        
        $this->set_response([
            'status' => TRUE,
            'order_id' => $order_id,
            'remaining' => $order_total - $points_redeemed,
        ], REST_Controller::HTTP_OK);
    }

    /**
     * returns all the orders for logged in user
     *
     * @return void
     */
    public function index_get(){
        $token = $this->input->get_request_header('Authorization', TRUE);
        $account_id = $this->account_model->validate_token_and_get_account_id($token);
        $this->set_response([
            'status' => TRUE,
            'data' => $this->order_model->get_orders_for_user($account_id),
        ], REST_Controller::HTTP_OK);
    }

    /**
     * pay a given order
     *
     * @param  in $order_id
     *
     * @return void
     */
    public function pay_post($order_id){
        $token = $this->input->get_request_header('Authorization', TRUE);
        $account_id = $this->account_model->validate_token_and_get_account_id($token);

        $request = $this->request->body;
        //pays the order with the given method
        $this->order_model->pay_order($order_id,$request['method'],$request['amount']);

        //retrieve contact details to send the sms and email
        $contacts = $this->account_model->get_account_details($account_id);

        $message_text = "Dear $contacts->name, Your order #$order_id will be ready in 15 minutes. Thank you!";

        $this->load->library('twilio');

        //send the sms
        $sms_result = $this->twilio->sms($contacts->phone, $message_text);

        //send the email
        $this->load->library('email');
        $this->email->from('noreply@pharmacy', 'Pharmacy');
        $this->email->to($contacts->email);
        $this->email->subject('Order Confirmation');
        $this->email->message($message_text);  
        $mail_result = $this->email->send();

        $this->set_response([
            'status' => TRUE,
            'data' => array(
                'mail' => $mail_result,
                'sms' => $sms_result
            ),
        ], REST_Controller::HTTP_OK);
    }

    /**
     * This POST endpoint will be called using the WSO2 EI depending on which payment method they chosed
     * if they chosed SAMPATH, then yourdomain.com/index.php/api/orders/dummy/sampath OR
     * yourdomain.com/index.php/api/orders/dummy/dialog will be called.
     * 
     * The order payment will be done
     * 
     * @param  mixed $payment_source
     *
     * @return void
     */
    public function dummy_post($payment_source){

        $order_id = 0;
        $amount = 0;

        if($payment_source=='sampath'){
            $jsonObj = json_encode($this->request->body);
            $order_id = (json_decode($jsonObj)->paymentId);
            $amount = (json_decode($jsonObj)->amount);
        }else{
            $jsonObj = $this->request->body;
            $order_id = $jsonObj['paymentId'];
            $amount = $jsonObj['amount'];
        }

        $this->order_model->pay_order($order_id,$payment_source,$amount);

        $creator_id = $this->order_model->get_order_created_user($order_id);
        $contacts = $this->account_model->get_account_details($creator_id);

        $message_text = "Dear $contacts->name, Your order #$order_id will be ready in 15 minutes. Thank you!";
        $this->load->library('twilio');

        $sms_result = $this->twilio->sms($contacts->phone, $message_text);

        $this->load->library('email');
        $this->email->from('noreply@pharmacy', 'Pharmacy');
        $this->email->to($contacts->email);
        $this->email->subject('Order Confirmation');
        $this->email->message($message_text);  
        $mail_result = $this->email->send();

        $this->set_response([
            'status' => TRUE,
            'data' => array(
                'mail' => $mail_result,
                'sms' => $sms_result
            ),
        ], REST_Controller::HTTP_OK);
    }
}
