(function() {
  'use strict';

  angular
    .module('rhinobird.services')
    .service('ValidateUserResponse', ValidateUserResponse);

  function ValidateUserResponse() {
    var service = {
      validate: validate
    }

    return service;
    //////////////////

    function validate(form, e) {
        if(angular.isObject(e.$response.data) && e.$response.data){
          var info = e.$response.data;

          //mark fields as valid = false if there's a need
          form.email.$setValidity('taken', (angular.isUndefined(info.email) || info.email[0].match(/taken/) === null));
          form.email.$setValidity('invalid', (angular.isUndefined(info.email) || info.email[0].match(/invalid/) === null));
          if (!angular.isUndefined(form.password)) {
            form.password.$setValidity('minlength', (angular.isUndefined(info.password) || info.password[0].match(/short/) === null));
            form.password.$setValidity('match', (angular.isUndefined(info.password) || info.password[0].match(/match/) === null));
            form.username.$setValidity('taken', (angular.isUndefined(info.username) || info.username[0].match(/taken/) === null));
          }
          return false;
        } else {
          // the response is invalid and unknown
          return true;
        }
    }
  }

})();
