/**
 * This controller is responsible for app-wide/common functions
 */
pharmacy.controller('BaseCtrl', function ($scope, Page, AppService, $interval, ngCart) { // eslint-disable-line no-undef
    $scope.page = Page
    Page.setTitle('Home')
  
    if (!Page.isLoggedIn()) {
      Page.redirect('/login')
    }
  
    $scope.logout = function () {
      Page.logout()
    }

    /**
     * returns the number of items in the cart
     */
    $scope.itemCount = function(){
      return ngCart.getTotalItems();
    }

    /**
     * checks if the user is logged in and the credentials are right every 5 seconds if they are logged in
     */
    $interval(function() {
      if (Page.isLoggedIn()) {
        AppService.ping(function (response) {
          if (Page.checkResponse(response)) {
            Page.setPoints(response.data.points)
            Page.setAccountDetails(response.data.account)
          } else {
            if (Page.isLoggedIn()) {
              Page.logout()
            }
          }
        })
      }
    }, 5000)
  })
  