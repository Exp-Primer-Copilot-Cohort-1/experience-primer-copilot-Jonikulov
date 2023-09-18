function skillsMember() {
  return {
    restrict: 'E',
    template: '<ul><li ng-repeat="skill in member.skills">{{skill}}</li></ul>'
  };
}