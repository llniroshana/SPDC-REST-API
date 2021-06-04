/**
 * This controller will redirect the user once they are logged in
 */
pharmacy.controller('HomeCtrl', function (Page) { // eslint-disable-line no-undef
    Page.setTitle('Home')
  
    consolelog('HomeCtrl')
    if (!Page.isLoggedIn()) {
      Page.redirect('/login')
    } else {
      Page.redirect('/products')
    }
  })
  