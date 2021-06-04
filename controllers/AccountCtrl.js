/**
 * This controller is responsible for logging in and log out
 */
pharmacy.controller('AccountCtrl', function ($scope, $cookies, Page, AppService) { // eslint-disable-line no-undef
    if (Page.isLoggedIn()) {
      Page.redirect('/')
    }

    Page.setTitle('Login')
  
    consolelog('AccountCtrl')
  
    $scope.signinObj = {
      email: '',
      password: ''
    }

    $scope.signupObj = {
      name: '',
      phone: '',
      email: '',
      password: ''
    }
  
    $scope.submittingForm = false

    /**
     * sign in the user and set their token cookie
     * @param {boolean} valid 
     */
    $scope.signin = function (valid) {
      $scope.submittingForm = true
      AppService.login($scope.signinObj, function (response) {
        $scope.submittingForm = false
        if (Page.checkResponse(response)) {
          var expires = new Date()
          var y = new Date().getFullYear()
          expires.setFullYear(y + 1)
          $cookies.put('token', response.data.token, {
            'expires': expires
          })
          Page.redirect('/')
        } else {
          $scope.signinObj.password = ''
          Page.commonAlert(response.data.message, "")
        }
      })
    }

    /**
     * registers a user and sign them in immediately
     * @param {boolean} valid 
     */
    $scope.register = function (valid) {
      $scope.submittingForm = true
      AppService.register($scope.signupObj, function (response) {
        $scope.submittingForm = false
        if (Page.checkResponse(response)) {
          var expires = new Date()
          var y = new Date().getFullYear()
          expires.setFullYear(y + 1)
          $cookies.put('token', response.data.token, {
            'expires': expires
          })
          Page.redirect('/')
        } else {
          Page.commonAlert(response.data.message, "")
        }
      })
    }
  })
  