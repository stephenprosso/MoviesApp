(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['omdbFactory', 'placesFactory', 'NgMap', '$scope', '$timeout'];

    /* @ngInject */
    function HomeController(omdbFactory, placesFactory, NgMap, $scope, $timeout) {
        var vm = this;
        vm.movies = [];
        vm.loading = true;
        vm.randomDivVisibility = false;
        vm.customDivVisibility = false;
        vm.showButons = true;

        vm.movieName = '';
        vm.restaurantName = '';


        vm.getRandomDate = function getRandomDate() {
            vm.randomDivVisibility = true;
            vm.customDivVisibility = false;
            vm.showButons = false;

            //MOVIES
            // get a list of movies that contains the random letter
            vm.movieAPICall(vm.getRandomLetter()).then(function(movies) {
                // pick randomly one movie of the list
                vm.randomNumber = parseInt(getRandomArbitrary(0, (movies.length - 1)));
                // slect the movie at that index
                vm.selectedMovie = movies[vm.randomNumber];
                vm.movieName = vm.selectedMovie.Title;
            });
            //RESTAURANTS
            vm.restaurantAPICall().then(function(restaurants) {
                vm.randomNumber = parseInt(getRandomArbitrary(0, (restaurants.length - 1)));
                vm.selectedRestaurant = restaurants[vm.randomNumber];
                vm.restaurantName = vm.selectedRestaurant.name;
            });
        }

        vm.getRandomLetter = function getRandomLetter() {
            var letter = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            letter = possible.charAt(Math.floor(Math.random() * possible.length));
            return letter;
        }

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        vm.showSearchPage = function showSearchPage() {
            vm.customDivVisibility = true;
            vm.randomDivVisibility = false;
            vm.showButons = false;
            
            $timeout(function() {
                vm.loading = false;
            }, 3000);
            // RESTAURANTS LIST
            vm.restaurantAPICall();
        }


        //MAP
        NgMap.getMap().then(function(map) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    vm.pos = pos;
                    vm.lat = pos.lat;
                    vm.long = pos.lng;

                    map.setCenter(pos);

                    $scope.$apply();
                });
            }
        });


        // SEARCH MOVIE
        vm.clearControl = function clearControl() {
            vm.searchMovieText = '';
        }

        //GET CUSTOM - MOVIE
        vm.getMovies = function getMovies() {
            vm.movieAPICall(vm.searchMovieText);
        }

        vm.movieAPICall = function movieAPICall(searchText) {
            return omdbFactory
                .getMovies(searchText)
                .then(function(movies) {
                    vm.movies = movies.Search;
                    vm.clearControl();
                    return movies.Search;
                    console.log("getting movies");
                })
                .catch(function(error) {
                    console.log(error);
                })
        }

        vm.restaurantAPICall = function restaurantAPICall() {
            return placesFactory
                .getPlaces()
                .then(function(restaurants) {
                    vm.restaurants = restaurants;
                    console.log(restaurants);
                    return restaurants;
                })
                .catch(function(error) {
                    console.log(error);
                })
        }

        activate();

        function activate() {}
    }

})();
