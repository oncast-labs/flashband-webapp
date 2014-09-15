module.exports = {
  registerMock: function() {
    angular.module('authenticate.invalid', ['ngMockE2E', 'flashbandWebapp']).run(function($httpBackend) {
      $httpBackend.whenPOST('http://localhost:1337/authenticate').respond(401);

      var all = /.*/;
      $httpBackend.whenGET(all).passThrough();
      $httpBackend.whenPOST(all).passThrough();
      $httpBackend.whenPUT(all).passThrough();
      $httpBackend.whenDELETE(all).passThrough();
    });
  }
};