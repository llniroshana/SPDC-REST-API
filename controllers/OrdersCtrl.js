/**
 * This controller is responsible for the orders page
 */
pharmacy.controller('OrdersCtrl', function ($scope, $cookies, Page, AppService) { // eslint-disable-line no-undef
  if (!Page.isLoggedIn()) {
    Page.redirect('/login')
  }
  
  Page.setTitle('Orders')

  consolelog('Ctrl')

  $scope.searchObj = {
    text: ''
  }

  $scope.orders = []

  /**
   * reload the orders page with latest data
   */
  $scope.refreshOrders = function(){
    AppService.getAllOrders(function (response) {
      if (Page.checkResponse(response)) {
        $scope.orders = response.data.data
      }
    })
  }
  
  /**
   * will redirect to an order payment url
   * @param {int} id 
   * @param {float} balance 
   */
  $scope.navigateToPay = function(id,balance){
    Page.redirect('/pay/'+id+'/'+balance)
  }

  $scope.refreshOrders();
})