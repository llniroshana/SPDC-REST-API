<?php
use Restserver\Libraries\REST_Controller;
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';

class Products extends REST_Controller {

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
    }

    /**
     * returns all products
     *
     * @return void
     */
    public function index_get()
    {
        $token = $this->input->get_request_header('Authorization', TRUE);
        $account_id = $this->account_model->validate_token_and_get_account_id($token);

        $products = $this->product_model->get_products($token);

        $this->set_response([
            'status' => TRUE,
            'data' => $products
        ], REST_Controller::HTTP_OK);
    }
}
