var pharmacy = angular.module('pharmacy', 
['ngRoute', 
'ngCookies', 
'ngSanitize',
'ngCart',
'credit-cards'
])

/**
 * turn useConnector to false if you are having trouble connecting through the WSO2 ESB
 */
var config = {
    apiUrl: 'http://localhost/backend/index.php/api/',
    connectorUrl: 'http://localhost:8280/pharmacy/',
    useConnector: true,
    debugEnabled: true
}

var apiUrl = config.useConnector ? config.connectorUrl : config.apiUrl

var siteTitle = 'Pharmacy'

var consolelog = function (text) {
  if (config.debugEnabled) {
    console.log(text)
  }
}

pharmacy.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/blank.html',
      controller: 'HomeCtrl'
    }).when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'AccountCtrl'
    }).when('/products', {
      templateUrl: 'partials/products.html',
      controller: 'ProductsCtrl'
    }).when('/checkout', {
      templateUrl: 'partials/checkout.html',
      controller: 'CheckoutCtrl'
    }).when('/pay/:id/:amount', {
      templateUrl: 'partials/pay.html',
      controller: 'PayCtrl'
    }).when('/orders', {
      templateUrl: 'partials/orders.html',
      controller: 'OrdersCtrl'
    })
})