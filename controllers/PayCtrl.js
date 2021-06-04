/**
 * This controller will handle payments
 */
pharmacy.controller('PayCtrl', function ($scope, $cookies, Page, AppService, ngCart, $routeParams) { // eslint-disable-line no-undef
  if (!Page.isLoggedIn()) {
    Page.redirect('/login')
  }
  Page.setTitle('Pay')

  consolelog('PayCtrl');

  $scope.id = $routeParams.id;
  $scope.amount = $routeParams.amount;

  console.log($scope.id);
  console.log($scope.amount);

  $scope.paymentOptions = {
    amount: $scope.amount,
    method: 'SAMPATH', /** default method is card payment */
    cvv: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cardHolder: Page.getAccountDetails().name,
    phoneNumber: '',//Page.getAccountDetails().phone,
    pin: ''
  }

  $scope.paying = false
  /**
   * confirm before paying, goes to orders page if a successfull payment was made.
   */
  $scope.pay = function(){
    Page.commonConfirm('Are you sure you want to pay using the given method?','Confirm!',function (response) {
      if(response){
        $scope.paying = true
        AppService.payForOrder($scope.id, $scope.paymentOptions, function (response) {
          $scope.paying = false
          if (Page.checkResponse(response)) {
            Page.redirect('/orders')
          } else {
            Page.commonAlert("Error!")
          }
        })
      }
    })
  }

})
  