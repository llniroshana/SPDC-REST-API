/**
 * AppService is a factory method, it contains interfaces for calling the app services
 */
pharmacy.factory('AppService', ['$http', '$cookies', 'Page', function ($http, $cookies, Page) {
    return {
      login: function (obj, callback) {
        $http({
          method: 'POST',
          url: apiUrl + 'accounts/login',
          headers: {
            'Content-Type': 'application/json'
          },
          data: obj
        }).then(function successCallback (response) {
          callback(response)
        }, function errorCallback (response) {
          callback(response)
        })
      },
      register: function (obj, callback) {
        $http({
          method: 'POST',
          url: apiUrl + 'accounts/register',
          headers: {
            'Content-Type': 'application/json'
          },
          data: obj
        }).then(function successCallback (response) {
          callback(response)
        }, function errorCallback (response) {
          callback(response)
        })
      },
      ping: function (callback) {
        $http({
          method: 'GET',
          url: apiUrl + 'accounts/ping',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Page.getAuthHeader()
          }
        }).then(function successCallback (response) {
          callback(response)
        }, function errorCallback (response) {
          callback(response)
        })
      },
      getAllProducts: function (callback) {
        $http({
          method: 'GET',
          url: apiUrl + 'products',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Page.getAuthHeader()
          }
        }).then(function successCallback (response) {
          callback(response)
        }, function errorCallback (response) {
          callback(false)
        })
      },
      getAllOrders: function (callback) {
        $http({
          method: 'GET',
          url: apiUrl + 'orders',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Page.getAuthHeader()
          }
        }).then(function successCallback (response) {
          callback(response)
        }, function errorCallback (response) {
          callback(false)
        })
      },
      createOrder: function (orderObj,callback) {
        $http({
          method: 'POST',
          url: apiUrl + 'orders',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Page.getAuthHeader()
          },
          data: orderObj
        }).then(function successCallback (response) {
          callback(response)
        }, function errorCallback (response) {
          callback(false)
        })
      },
      payForOrder: function (orderId,paymentObj,callback) {
        $http({
          method: 'POST',
          url: apiUrl + 'orders/pay/' + orderId,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Page.getAuthHeader()
          },
          data: paymentObj
        }).then(function successCallback (response) {
          callback(response)
        }, function errorCallback (response) {
          callback(false)
        })
      }
    }
  }])
  