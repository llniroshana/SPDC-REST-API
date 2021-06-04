/**
 * this controller is reposnsible for listing the products
 */
pharmacy.controller('ProductsCtrl', function ($scope, $cookies, Page, AppService) { // eslint-disable-line no-undef
  if (!Page.isLoggedIn()) {
    Page.redirect('/login')
  }
  Page.setTitle('Products')

  consolelog('ProductsCtrl')

  $scope.searchObj = {
    text: ''
  }

  $scope.products = []

  /**
   * get the latest stocks from the inventory
   */
  $scope.refreshProducts = function(){
    AppService.getAllProducts(function (response) {
      if (Page.checkResponse(response)) {
        $scope.products = response.data.data
      }
    })
  }

  $scope.refreshProducts();
})
  