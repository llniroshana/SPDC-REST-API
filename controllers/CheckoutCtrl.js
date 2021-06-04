/**
 * This controller is responsible for checkout page
 */
pharmacy.controller('CheckoutCtrl', function ($scope, $cookies, Page, AppService, ngCart, $timeout) { // eslint-disable-line no-undef
    if (!Page.isLoggedIn()) {
      Page.redirect('/login')
    }
  
    Page.setTitle('Checkout')
  
    consolelog('CheckoutCtrl');

    $scope.points = Page.getPoints();

    /**
     * the function calculates the maximum number of points the user can use for the current transaction
     * never allows user to have a bill with a minus amount
     */
    $scope.maxPoints = function(){
      var points = ($scope.points !== undefined ? $scope.points : 0);
      var total = ngCart.getSubTotal();
      if(points >= total){
        return points;
      }
      return Page.getPoints();
    }

    /**
     * checks if checkout form is valid
     */
    $scope.checkoutFormValid = function(){
      return ngCart.getTotalItems() && $scope.points !== undefined
    }

    /**
     * calculates the grand total by deducting loyality points from the cart total
     */
    $scope.grandTotal = function(){
      return ngCart.getSubTotal() - ($scope.points !== undefined ? $scope.points : 0);
    }

    /**
     * finalize the order by calling the endpoint and moving to payment screen
     */
    $scope.placeOrder = function(){
      var items = ngCart.getItems();
      var order = {
        items: [],
        points: ($scope.points !== undefined ? $scope.points : 0)
      }
      items.forEach(element => {
        order.items.push({
          ItemId:parseInt(element._id),
          qty:element._quantity
        });
      });

      AppService.createOrder(order, function (response) {
        if (Page.checkResponse(response)) {
          //response.data.order_id,response.data.remaining
          // clear the shopping list
          ngCart.empty()
          $scope.points = 0
          Page.redirect('/pay/' + response.data.order_id + "/" + response.data.remaining)
        } else {
          Page.commonAlert("Error!")
        }
      })
    }
  
  })
  