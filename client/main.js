
// Register a main module
angular.module('myApp', [
  /*
   * Angular modules
   */
  'ngRoute',
  /*
   * 3rd Party modules
   */
  'ui.bootstrap',
  /*
   * Reusable cross app code modules
   */
  'myModal', 'errorHandler',

  'app.users', 'app.dashboard'
]);


angular.module('myApp')
  // Config
  .config(config)
  // Run
  .run(run)

config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];

function config($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home',
      controller: 'MainController',
      controllerAs: 'vm',
      access: {restricted: false}
    })
    .when('/about', {
      templateUrl : 'partials/about',
      controller  : 'AboutController',
      controllerAs  : 'vm',
      access: {restricted: false}
    })
    // route for the contact page
    .when('/contact', {
      templateUrl : 'partials/contact',
      controller  : 'ContactController',
      controllerAs  : 'vm',
      access: {restricted: false}
    })
    .when('/error', {
      templateUrl: 'partials/error',
      controller: 'ErrorController',
      controllerAs: 'vm',
      access: {restricted: false}
    })

    // If route does not exist - go to error page
    .otherwise({
      redirectTo: '/error',
      access: {restricted: false}
    });
    // Add base tag in head
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: true
  });

  $httpProvider.interceptors.push('httpInterceptor');
}



run.$inject = ['$rootScope', '$location', '$route', 'UsersService'];

function run($rootScope, $location, $route, UsersService) {

  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    $rootScope.loggedIn = false;
    $rootScope.error = false;
    $rootScope.username = null;

    var check = UsersService.isLoggedIn();
    if(check){
      $rootScope.loggedIn = true;
      var auth = UsersService.currentUser();
      $rootScope.username = auth.username;
      $rootScope.userId = auth._id;
    }

    // For restricted access
    if (next.access.restricted && !check){
      $location.path('/login');
      $route.reload();
    }

  });
}

// other general services
