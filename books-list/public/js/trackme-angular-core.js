/**
 * Created by paulocristo on 25/10/15.
 * - public            <!-- holds all our files for our frontend angular application -->
 ----- core.js       <!-- all angular code for our app -->
 ----- index.html    <!-- main view -->
 - package.json      <!-- npm configuration to install dependencies/modules -->
 - server.js         <!-- Node configuration -->

 https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
 */

//var modalModule = angular.module('modalModule', ['ui.bootstrap']);

// A module in AngularJS is a place where you can collect and organize
// components like controllers, services, directives, and filters

var trackme = angular.module('trackme', ['uiGmapgoogle-maps','ngCookies']);

/**
 * A service can be used to share data between controllers
trackme.service('sharedProperties', function () {
    var property = 'First';

    return {
        getProperty: function () {
            return property;
        },
        setProperty: function(value) {
            property = value;
        }
    };

    //use it in a controller
    function Ctrl2($scope, sharedProperties) {
    $scope.prop2 = "Second";
    $scope.both = sharedProperties.getProperty() + $scope.prop2;
}
});*/


trackme.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBQVDtQOCDfWg4ikGXBvOTB9y03RgLb0M8',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});

trackme.controller("MapController", function($scope,$http,uiGmapGoogleMapApi) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []

    //$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    //will hold the map markers
    $scope.mapMarkers = [];
    //will hold the lines between records
    $scope.polylines = [];

    //creates the marker for the record on the map!!!
    var createRecordMarker = function(i, lat,lng, bounds, idKey) {

        if (idKey == null) {
            idKey = "id";
        }

        /*

         //icon as background image
         var newstyle = {
         'background-image':'url("img/markers/'+value[8]+'")',
         'background-size': '36.5px 61px',
         'background-position': 'top left',
         'background-repeat': 'no-repeat'
         }

        on css
         .labelClass {
         padding-top:29px;
         padding-left:2px;
         color:#000;
         font-family: 'open_sansregular';
         height:61px;
         width:37px;
         font-size:9px;
         line-height: 12px;
         }



         */

        var newstyle = {
         'opacity': '0.75'
        }

        var marker = {
            latitude: lat,
            longitude: lng,
            title: 'm' + i,
            options: {
                labelContent : 'Paulo Cristo',
                labelAnchor: "36 61",
                labelClass: 'labelClass',
                labelStyle: newstyle,
                labelInBackground: false
            }

        };
        marker[idKey] = i;
        return marker;
    };

    $scope.map = {
        center: {
            latitude: 40.1451,
            longitude: -99.6680
        },
        zoom: 4,
        control:{},
        bounds: {}
    };
    $scope.options = {
        scrollwheel: true
    };

    //call this
    $scope.refreshMap = function (newMarkers) {
        //clear previous markers
        $scope.mapMarkers = newMarkers;

        $scope.mapMarkers.push(createRecordMarker(1,32.779680, -79.935493, $scope.map.bounds));  

        console.log("refreshing map for device/trackable change....");
        //optional param if you want to refresh you can pass null undefined or false or empty arg
        $scope.map.control.refresh($scope.map.center);//{latitude: 32.779680, longitude: -79.935493}
        $scope.map.control.getGMap().setZoom($scope.map.zoom);
        return;
    };

    $scope.deviceChanged = function(deviceFilter) {

        var path = "/api/records";

        if(deviceFilter==null) {
            deviceFilter = "Show all";
        }
        else {
            path = path + "?device_id=" + deviceFilter;
        }
        console.log("device changed to: " + deviceFilter);

        //clear markers
        var markers = [];
        $http.get(path)
            .success(function(data) {
                $scope.records = data;
                console.log("received" + JSON.stringify(data));
                for(var i=0; i< data.length; i++) {

                    var latitude = data[i].latitude;
                    var longitude = data[i].longitude;
                    markers.push(createRecordMarker(i, latitude, longitude, $scope.map.bounds));
                }
                $scope.refreshMap(markers);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

    };

    $scope.trackableChanged = function(trackableFilter) {

        var path = "/api/records";

        if(trackableFilter==null) {
            trackableFilter = "Show all";
        }
        else {
            path = path + "?trackable_id=" + trackableFilter;
        }
        console.log("trackable changed to: " + trackableFilter);

        //clear markers
        var markers = [];
        $http.get(path)
            .success(function(data) {
                $scope.records = data;
                console.log("received" + JSON.stringify(data));

                for(var i=0; i< data.length; i++) {

                    var latitude = data[i].latitude;
                    var longitude = data[i].longitude;
                    markers.push(createRecordMarker(i, latitude, longitude, $scope.map.bounds));
                }

                $scope.refreshMap(markers);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

    };



    


    //TODO make sure we have values on everything!!!!! makes the map unresponsive

    
    // Get the bounds from the map once it's loaded
    $scope.$watch(function() {
        return $scope.map.bounds;
    }, function(nv, ov) {

        console.log("generating new map...");

        // Only need to regenerate once
        if (!ov.southwest && nv.southwest) {
            var markers = [];

            $scope.polylines = [];
            // when landing on the page, get all todos and show them
            $http.get('/api/records')
                .success(function(data) {
                    console.log("records: " + JSON.stringify(data));

                    //TODO, this is wrong the line should be always between records of same trackable (even if from different devices?)
                    //TODO and the values should be returned in order/date no?? otherwise the lines are not correct
                    var previous = 0;
                    var current = 0;
                    var currentTrackableId = "";
                    var previousTrackableId = "";
                    for(var i=0; i< data.length; i++) {

                        if(i > 0) {
                            previous = i-1;
                            previousTrackableId = data[previous].trackableId;
                        }
                        current = i;
                        currentTrackableId = data[current].trackableId;

                        var latitude = data[i].latitude;
                        var longitude = data[i].longitude;
                        markers.push(createRecordMarker(i,latitude, longitude, $scope.map.bounds));

                        current = i;


                        if( (current!=previous && current > previous) && (previousTrackableId===currentTrackableId) ) {
                            //run the loop again BAD!!!
                            console.log("ADDING A POLYLINE!!!!!");
                            $scope.polylines  = [
                                {
                                    id: i,
                                    path: [
                                            {
                                                latitude: data[previous].latitude,
                                                longitude: data[previous].longitude
                                            },
                                            {
                                                latitude: data[current].latitude,
                                                longitude: data[current].longitude
                                            }
                                        ],

                                    stroke: {
                                        color: '#6060FB',
                                        weight: 3
                                    },
                                    editable: false,
                                    draggable: false,
                                    geodesic: true,
                                    visible: true,
                                    icons: [{
                                        icon: {
                                            path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
                                        },
                                        offset: '25px',
                                        repeat: '50px'
                                    }]
                                }
                            ];

                        }

                    }







                    //$scope.records = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });


            $scope.mapMarkers = markers;
        }
    }, true);


    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {

    });
});



//trackme.controller('GreetingController', ['$scope', function($scope,$http) {
//    $scope.greeting2 = 'Hola Paulo!';
//}]);







