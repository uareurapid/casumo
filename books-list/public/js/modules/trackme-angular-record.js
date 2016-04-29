/**
 * Created by paulocristo on 31/10/15.
 */

//get the records on main page to load into the map
var trackme = angular.module('trackme').controller('RecordsController', function($scope,$http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/records')
        .success(function(data) {
            $scope.records = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

});