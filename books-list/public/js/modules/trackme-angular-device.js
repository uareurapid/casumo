/**
 * Created by paulocristo on 30/10/15.
 */

//device module
var trackme = angular.module('trackme').controller('DevicesController',function ($scope, $cookies, $http) {

    $scope.formData = {};

    //all these stuff should be on the services, not on the controllers,
    //$http and $resource on services, $scope on controllers
    //like: https://scotch.io/tutorials/setting-up-a-mean-stack-single-page-application
    //http://kirkbushell.me/when-to-use-directives-controllers-or-services-in-angular/

    $scope.getDeviceOwner = function(successCallback, errorCallback) {

        console.log("getting device owner...");
        $http.get('/profile/user')
            .success(function (data) {
                console.log("device owner: " + data.username);
                //assign the username to the scope var
                $scope.formData.owner = data.username;
                successCallback();

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.selectedDevice = "Show all";


    //############ GET ALL USER DEVICES ##################
    $scope.getUserDevices = function() {

        console.log("getting all available devices for username: " + $scope.formData.owner);

        var apiPath = '/api/devices?owner=' + $scope.formData.owner;
        $http.get(apiPath)
            .success(function(data) {
                $scope.devices = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // when landing on the page, get all devices and and show them!
    $scope.getDeviceOwner($scope.getUserDevices);

    //############ CREATE A NEW DEVICE ####################
    //this is actually the submit of the form
    //called from ui, to add a new device
    $scope.createDevice = function() {

        console.log("submitting the form to add a new device for user: " + $scope.formData.owner);

        //now submit the form and create the device
        $http.post('/api/devices', $scope.formData)
            .success(function(data) {

                $scope.formData.deviceId = ""; // clear the form so our user is ready to enter another
                $scope.formData.deviceDescription = "";
                //do not clear $scope.formData.owner

                //get all updated/devices list again
                $scope.getUserDevices();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a device after checking it
    $scope.deleteDevice = function(id) {

        $http.delete('/api/devices/' + id)
            .success(function(data) {
                $scope.devices = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

});