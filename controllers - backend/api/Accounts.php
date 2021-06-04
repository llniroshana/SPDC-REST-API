<?php
use Restserver\Libraries\REST_Controller;
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';
/**
 * This controller is responsible for all the operations related to user's account
 */
class Accounts extends REST_Controller {

    
    /**
     * __construct
     *
     * @return void
     */
    function __construct()
    {
        // Enable cross-site-requests
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
        
        // Construct the parent class
        parent::__construct();
        // Load the model
        $this->load->model("account_model");
    }

    /**
     * returns 200 for all preflight requests
     *
     * @return void
     */
    public function preflight_get(){
        $this->set_response([
            'preflight' => TRUE
        ], REST_Controller::HTTP_OK);
    }

    
    /**
     * ping will return the number of points available, and account details for a logged in account
     *
     * @return void
     */
    public function ping_get()
    {
        $token = $this->input->get_request_header('Authorization', TRUE);
        $account_id = $this->account_model->validate_token_and_get_account_id($token);

        if ($account_id !== 0)
        {
            $this->set_response([
                'status' => TRUE,
                'message' => '',
                'points' => floatval($this->account_model->get_points($account_id)),
                'account' => $this->account_model->get_account_details($account_id)
            ], REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
        }
    }

    
    /**
     * login
     *
     * @return void
     */
    public function login_post()
    {
        $request = $this->request->body;
        $token = $this->account_model->get_token($request['email'],$request['password']);
        if ($token !== '')
        {
            $this->set_response([
                'status' => TRUE,
                'token' => $token
            ], REST_Controller::HTTP_OK);
        }else{
            $this->set_response([
                'status' => FALSE,
                'token' => $token,
                'message' => 'Invalid Logins!'
            ], REST_Controller::HTTP_NOT_FOUND);
        }
    }

    /**
     * register
     *
     * @return void
     */
    public function register_post()
    {
        $request = $this->request->body;
        if($this->account_model->check_phone_used($request['phone'])){
            $this->set_response([
                'status' => FALSE,
                'message' => "Phone number is being used by another account"
            ], REST_Controller::HTTP_CONFLICT);
        }else if($this->account_model->check_email_used($request['email'])){
            $this->set_response([
                'status' => FALSE,
                'message' => "Email address is being used by another account"
            ], REST_Controller::HTTP_CONFLICT);
        }else{
            $inserted_user_id = $this->account_model->register_user_and_get_id(
                $request['name'],
                $request['email'],
                $request['phone'],
                $request['password']
            );
            $this->set_response([
                'status' => TRUE,
                'token' => $this->account_model->get_token($request['email'],$request['password'])
            ], REST_Controller::HTTP_OK);
        }
    }
}
