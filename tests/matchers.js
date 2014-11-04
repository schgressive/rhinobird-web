var rbMatchers = {
  toBeTheOnlyPickIn: function(util, customEqualityTesters){

    return {
      compare: function(pick, picksArray, propertyToCheck){

        var result = {};
        var pickIndex = picksArray.indexOf(pick);

        // Is in the array?
        var isInArray = (pickIndex >= 0)? true : false;
        result.pass = isInArray;

        // Is active?
        var isPropertyTrue = picksArray[pickIndex][propertyToCheck] === true;
        result.pass = isPropertyTrue;

        // Are the other picks inactive
        var areOthersInactive = true;
        angular.forEach(picksArray, function(pick, idx){
          if(idx !== pickIndex && areOthersInactive){
            areOthersInactive = pick[propertyToCheck] === false;
          }
        });
        result.pass = areOthersInactive;

        if (!isInArray) {
          result.message = 'Expected ' + pick + ' is not in the picks array';
        }
        else if (!isPropertyTrue){
          result.message = 'Expected ' + pick + ' \'' + propertyToCheck + '\' property to be true';
        }
        else if (!areOthersInactive){
          result.message = 'Expected other picks \'' + propertyToCheck + '\' properties to be false';
        }

        return result;
      }
    };
  }
};

beforeEach(function() {
  jasmine.addMatchers(rbMatchers);
});
