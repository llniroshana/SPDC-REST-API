/**
 * Page is a factory method, it contains all the functions that can be used throughout the app
 */
pharmacy.factory('Page', ['$location', '$cookies', '$document', 'ngCart', function ($location, $cookies, $document, ngCart) { // eslint-disable-line no-undef
    var title = siteTitle // eslint-disable-line no-undef
    var account = {
      name: "",
      email: "",
      phone: ""
    };
    var points = 0; //hold the number of points available
    return {
      /**
       * return the account object above
       */
      getAccountDetails: function () {
        return account
      },
      /**
       * update the account details object
       */
      setAccountDetails: function (details) {
        account = details
      },
      getPoints: function () {
        return points
      },
      setPoints: function (newPoints) {
        points = newPoints
      },
      /**
       * retrieve the current route
       */
      getPath: function () {
        return $location.path()
      },
      title: function () {
        return title
      },
      setTitle: function (newTitle) {
        title = newTitle
        $(document).attr('title', siteTitle + ' - ' + newTitle) // eslint-disable-line no-undef
      },
      /**
       * checks if the given HTTP response is a SUCCESSFUL one  (STATUS 200)
       */
      checkResponse: function (response) {
        return response.status === 200
      },
      /**
       * handle other common HTTP responses
       */
      checkErrorResponse: function (response) {
        if (response.status === 401) {
          this.commonAlert('You need to login again', 'Oops!')
          this.logout()
        } else {
          if (response.data.Data !== undefined) {
            this.commonAlert(response.data.Data.Message !== undefined ? response.data.Data.Message : 'Server Error', response.data.Result !== undefined ? response.data.Data.Result : 'Error!')
          } else {
            this.commonAlert('Server Error', 'Error!')
          }
        }
      },
      /**
       * extracts the error message in an HTTP response
       */
      getError: function (response) {
        return response.data.Data.Message === undefined ? response.data.Data : response.data.Data.Message
      },
      /**
       * redirects to the given route, if stopScroll is false, it will navigate and move to top
       */
      redirect: function (dest, stopScroll) {
        $location.hash('')
        $location.path(dest)
        if (!stopScroll) $document.scrollTop(0, 500)
      },
      /**
       * logs out by clearing cookies, emptying the cart, clearing account details.
       */
      logout: function (path) {
        var cookies = $cookies.getAll()
        angular.forEach(cookies, function (v, k) { // eslint-disable-line no-undef
          $cookies.remove(k)
        })
        ngCart.empty()
        account = {
          name: "",
          email: "",
          phone: ""
        }
        consolelog((path === undefined ? '/login' : path)) // eslint-disable-line no-undef
        $location.path((path === undefined ? '/login' : path))
        $document.scrollTop(0, 500)
      },
      /**
       * checks whether the user is logged in
       */
      isLoggedIn: function () {
        return $cookies.get('token') !== undefined
      },
      /**
       * return the Authentication Header to be used in all app service calls
       */
      getAuthHeader: function(){
        return 'Bearer ' + ($cookies.get('token') !== undefined ? $cookies.get('token') : '')
      },
      /**
       * alers the user with the given text and title
       */
      commonAlert: function (text, header) {
        alert(header+"\n\n"+text)
      },
      /**
       * gets a YES NO answer from user
       */
      commonConfirm: function (text, header, callback) {
        if (confirm(header+"\n\n"+text)) {
            callback(true)
        } else {
            callback(false)
        }
      }
    }
  }])
  