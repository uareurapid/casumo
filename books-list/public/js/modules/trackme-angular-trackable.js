/**
 * Created by paulocristo on 31/10/15.
 */

//trackables controller
var trackme = angular.module('trackme').controller('TrackablesController',function ($scope, $cookies, $http) {

    $scope.testGetProfile = function() {
        $scope.$emit("GetUserProfile", {});
    };

    console.log("trying it now....");
    $scope.testGetProfile();

    //store the main object on the scope
    $scope.formTrackablesData = {};

    //default privacy level
    $scope.formTrackablesData.privacy = "Private"

    $scope.formTrackablesData.showPrivacy = false;

    $scope.formTrackablesData.typeOptions = ['Person','Object', 'Animal'];

    $scope.privacyChanged = function() {
        console.log("privacy changed to: " + $scope.formTrackablesData.privacy);
    };


    //############ GET THE TRACKABLE OWNER #####################################
    $scope.getTrackableOwner = function(successCallback, errorCallback) {

        //actually gets the logged in username
        $http.get('/profile/user')
            .success(function (data) {
                console.log("trackable owner: " + data.username);
                //assign the username to the scope var
                $scope.formTrackablesData.owner = data.username;
                successCallback();

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    //TODO FOR FORM VALIDATION HOWTO CHECK:
    //https://scotch.io/tutorials/angularjs-form-validation

    $scope.selectedTrackable = "Show all";


    //######## GET ALL TRACKABLES ###############
    $scope.getAllTrackables = function() {

        console.log("getting all available trackables for username: " + $scope.formTrackablesData.owner);

        var apiPath = '/api/trackables?owner=' + $scope.formTrackablesData.owner;
        $http.get(apiPath)
            .success(function(data) {

                //reset all input fields, so we can add a new one again
                $scope.formTrackablesData.privacy = "Private";
                $scope.formTrackablesData.name = "";
                $scope.formTrackablesData.description = "";
                $scope.formTrackablesData.type = $scope.formTrackablesData.typeOptions[0];
                //do not clear $scope.formTrackablesData.owner

                //add new received data to the $scope var
                $scope.trackables = data;
                console.log("received: " +data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // when landing on the page, get the username, all his trackables, and then we show them!
    $scope.getTrackableOwner($scope.getAllTrackables);

    //############## CREATE NEW TRACKABLE ######################
    //this is actually the submit of the form
    //called from ui to create a new trackable object
    $scope.createTrackable = function() {

        //first thing is get the username
        //i do not need to check the username again, since the value is available since first landed on the page

        //now send the trackable data
        console.log("sending new trackable request now...");
        $http.post('/api/trackables', $scope.formTrackablesData)
            .success(function(data) {
                //get them all again and clear the form fields
                $scope.getAllTrackables();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

    };

    // delete a trackable after checking it
    $scope.deleteTrackable = function(id) {

        $http.delete('/api/trackables/' + id)
            .success(function(data) {
                $scope.trackables = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

});