var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html',
        })

        .state('shop', {
            url: '/shop',
            templateUrl: 'views/shop.html',
            controller: 'AllLaptopsCtrl'
        })

        // nested list with custom controller
        .state('laptop', {
            url: '/laptop/:name',
            templateUrl: 'views/laptops.html',
            controller: 'LaptopCtrl'
        })

        .state('cart', {
            url: '/cart',
            templateUrl: 'views/cart.html',
            controller: 'CartCtrl'
        })
});


routerApp.controller('CartCtrl', function ($scope, CommonProp) {
    $scope.total = CommonProp.getTotal();
    $scope.items = CommonProp.getItems();
    $scope.removeItem = function (laptop) {
        CommonProp.removeItem(laptop);
        $scope.total = CommonProp.getTotal();
    };
});

routerApp.controller('AllLaptopsCtrl', function ($scope, $http, CommonProp) {

    $scope.useBrands = {};
    $scope.useRams = {};
    $scope.useHDDs = {};
    $scope.useVideos = {};
    $scope.useProcessors={};
    $scope.total = CommonProp.getTotal();
    $http.get('laptops/laptops.json').success(function (data) {
        $scope.laptops = data;
    });

    // Watch the laptops that are selected
    $scope.$watch(function () {
        return {
            laptops: $scope.laptops,
            useBrands: $scope.useBrands,
            useRams: $scope.useRams,
            useHDDs: $scope.useHDDs,
            useVideos: $scope.useVideos,
            useProcessors: $scope.useProcessors
        }
    }, function (value) {
        var selected;

        $scope.count = function (prop, value) {
            return function (el) {
                return el[prop] == value;
            };
        };
        $scope.brandsGroup = uniqueItems($scope.laptops, 'brand');
        var filterAfterBrands = [];
        selected = false;
        for (var j in $scope.laptops) {
            var p = $scope.laptops[j];
            for (var i in $scope.useBrands) {
                if ($scope.useBrands[i]) {
                    selected = true;
                    if (i == p.brand) {
                        filterAfterBrands.push(p);
                        break;
                    }
                }
            }
        }
        if (!selected) {
            filterAfterBrands = $scope.laptops;
        }


        $scope.ramsGroup = uniqueItems($scope.laptops, 'ram');
        var filterAfterRams = [];
        selected = false;
        for (var j in filterAfterBrands) {
            var p = filterAfterBrands[j];
            for (var i in $scope.useRams) {
                if ($scope.useRams[i]) {
                    selected = true;
                    if (i == p.ram) {
                        filterAfterRams.push(p);
                        break;
                    }
                }
            }
        }
        if (!selected) {
            filterAfterRams = filterAfterBrands;
        }


        $scope.hddsGroup = uniqueItems($scope.laptops, 'hdd');
        var filterAfterHDDs = [];
        selected = false;
        for (var j in filterAfterRams) {
            var p = filterAfterRams[j];
            for (var i in $scope.useHDDs) {
                if ($scope.useHDDs[i]) {
                    selected = true;
                    if (i == p.hdd) {
                        filterAfterHDDs.push(p);
                        break;
                    }
                }
            }
        }
        if (!selected) {
            filterAfterHDDs = filterAfterRams;
        }

        $scope.videosGroup = uniqueItems($scope.laptops, 'video');
        var filterAfterVideos = [];
        selected = false;
        for (var j in filterAfterHDDs) {
            var p = filterAfterHDDs[j];
            for (var i in $scope.useVideos) {
                if ($scope.useVideos[i]) {
                    selected = true;
                    if (i == p.video) {
                        filterAfterVideos.push(p);
                        break;
                    }
                }
            }
        }
        if (!selected) {
            filterAfterVideos = filterAfterHDDs;
        }
        
        
        
        
        $scope.processorsGroup = uniqueItems($scope.laptops, 'processor');
        var filterAfterProcessors = [];
        selected = false;
        for (var j in filterAfterVideos) {
            var p = filterAfterVideos[j];
            for (var i in $scope.useProcessors) {
                if ($scope.useProcessors[i]) {
                    selected = true;
                    if (i == p.processor) {
                        filterAfterProcessors.push(p);
                        break;
                    }
                }
            }
        }
        if (!selected) {
            filterAfterProcessors = filterAfterVideos;
        }
        
        
        
        
        
        
        
        


        $scope.filteredLaptops = filterAfterProcessors;
    }, true);

    $scope.$watch('filtered', function (newValue) {
        if (angular.isArray(newValue)) {
            console.log(newValue.length);
        }
    }, true);

    $http.get('laptops/ram.json').success(function (data2) {
        $scope.ram = data2;
    });


    $scope.filter = {};

    $scope.getOptionsFor = function (propName) {
        return ($scope.ram || []).map(function (w) {
            return w[propName];
        }).filter(function (w, idx, arr) {
            return arr.indexOf(w) === idx;
        });
    };

    $scope.filterByProperties = function (laptop) {
        // Use this snippet for matching with AND
        var matchesAND = true;
        for (var prop in $scope.filter) {
            if (noSubFilter($scope.filter[prop])) continue;
            if (!$scope.filter[prop][laptop[prop]]) {
                matchesAND = false;
                break;
            }
        }
        return matchesAND;
        /**/
        /*
         // Use this snippet for matching with OR
         var matchesOR = true;
         for (var prop in $scope.filter) {
         if (noSubFilter($scope.filter[prop])) continue;
         if (!$scope.filter[prop][wine[prop]]) {
         matchesOR = false;
         } else {
         matchesOR = true;
         break;
         }
         }
         return matchesOR;
         /**/
    };

    function noSubFilter(subFilterObj) {
        for (var key in subFilterObj) {
            if (subFilterObj[key]) return false;
        }
        return true;
    }


    $scope.messagee = function (laptop) {
        CommonProp.addItem(laptop);
        CommonProp.setTotal(laptop);
        $scope.total = CommonProp.getTotal();
    }
});


var uniqueItems = function (data, key) {
    var result = [];

    for (var i = 0; i < data.length; i++) {
        var value = data[i][key];

        if (result.indexOf(value) == -1) {
            result.push(value);
        }

    }
    return result;
};

//routerApp.controller('MyCtrl', function($scope, filterFilter) {
//    $scope.usePants = {};
//    $scope.useShirts = {};
//    $scope.useShoes = {};
//
//    $scope.players = [
//        {name: 'Bruce Wayne', shirt: 'XXL', pants: '42', shoes: '12'},
//        {name: 'Wayne Gretzky', shirt: 'XL', pants: '38', shoes: '10'},
//        {name: 'Michael Jordan', shirt: 'M', pants: '32', shoes: '9'},
//        {name: 'Rodman', shirt: 'XSXL', pants: '42', shoes: '11'},
//        {name: 'Jake Smitz', shirt: 'XXL', pants: '42', shoes: '12'},
//        {name: 'Will Will', shirt: 'XXLL', pants: '42', shoes: '12'},
//        {name: 'Youasdf Oukls', shirt: 'XL', pants: '38', shoes: '10'},
//        {name: 'Sam Sneed', shirt: 'XL', pants: '38', shoes: '10'},
//        {name: 'Bill Waxy', shirt: 'M', pants: '32', shoes: '9'},
//        {name: 'Javier Xavior', shirt: 'M', pants: '32', shoes: '9'},
//        {name: 'Bill Knight', shirt: 'M', pants: '32', shoes: '9'},
//        {name: 'One More', shirt: 'M', pants: '32', shoes: '9'},
//        {name: 'Player One', shirt: 'XXL', pants: '42', shoes: '11'},
//        {name: 'Space Cadet', shirt: 'XXL', pants: '42', shoes: '12'},
//        {name: 'Player Two', shirt: 'XXXXL', pants: '42', shoes: '12'}
//    ];
//
//    // Watch the pants that are selected
//    $scope.$watch(function () {
//        return {
//            players: $scope.players,
//            usePants: $scope.usePants,
//            useShirts: $scope.useShirts,
//            useShoes: $scope.useShoes
//        }
//    }, function (value) {
//        var selected;
//
//        $scope.count = function (prop, value) {
//            return function (el) {
//                return el[prop] == value;
//            };
//        };
//
//        $scope.pantsGroup = uniqueItems($scope.players, 'pants');
//        var filterAfterPants = [];
//        selected = false;
//        for (var j in $scope.players) {
//            var p = $scope.players[j];
//            for (var i in $scope.usePants) {
//                if ($scope.usePants[i]) {
//                    selected = true;
//                    if (i == p.pants) {
//                        filterAfterPants.push(p);
//                        break;
//                    }
//                }
//            }
//        }
//        if (!selected) {
//            filterAfterPants = $scope.players;
//        }
//
//        $scope.shirtsGroup = uniqueItems($scope.players, 'shirt');
//        var filterAfterShirts = [];
//        selected = false;
//        for (var j in filterAfterPants) {
//            var p = filterAfterPants[j];
//            for (var i in $scope.useShirts) {
//                if ($scope.useShirts[i]) {
//                    selected = true;
//                    if (i == p.shirt) {
//                        filterAfterShirts.push(p);
//                        break;
//                    }
//                }
//            }
//        }
//        if (!selected) {
//            filterAfterShirts = filterAfterPants;
//        }
//
//        $scope.shoesGroup = uniqueItems($scope.players, 'shoes');
//        var filterAfterShoes = [];
//        selected = false;
//        for (var j in filterAfterShirts) {
//            var p = filterAfterShirts[j];
//            for (var i in $scope.useShoes) {
//                if ($scope.useShoes[i]) {
//                    selected = true;
//                    if (i == p.shoes) {
//                        filterAfterShoes.push(p);
//                        break;
//                    }
//                }
//            }
//        }
//        if (!selected) {
//            filterAfterShoes = filterAfterShirts;
//        }
//
//        $scope.filteredPlayers = filterAfterShoes;
//    }, true);
//
//
//    $scope.$watch('filtered', function (newValue) {
//        if (angular.isArray(newValue)) {
//            console.log(newValue.length);
//        }
//    }, true);
//});

routerApp.filter('groupBy',
    function () {
        return function (collection, key) {
            if (collection === null) return;
            return uniqueItems(collection, key);
        };
    });


routerApp.controller('LaptopCtrl', function ($scope, $stateParams, $http) {
        var name = $stateParams.name;
        $http.get('laptops/' + name + '.json').success(function (data) {
            $scope.laptop = data;
        });
    })
    .service('CommonProp', function () {
        var Items = [];
        var Total = 0;

        return {
            getItems: function () {
                return Items;
            },
            addItem: function (item) {
                if (Items.length != 0) {
                    var flag = false;
                    for (var i = 0; i < Items.length; i++) {
                        if (Items[i].id == item.id) {
                            Items[i].count += 1;
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        Items.push({'id': item.id, 'count': 1, 'price': item.price, 'model': item.model});
                    }
                }
                else {
                    Items.push({'id': item.id, 'count': 1, 'price': item.price, 'model': item.model});
                }
            },
            getTotal: function () {
                return Total;
            },
            setTotal: function () {
                Total = 0;
                for (var i = 0; i < Items.length; i += 1) {
                    Total += Items[i].price * Items[i].count;
                }
            },
            removeItem: function (item) {
                for (var i = 0; i < Items.length; i += 1) {
                    if (Items[i].id == item) {
                        Items.splice(i, 1);
                    }
                }
                Total = 0;
                for (var i = 0; i < Items.length; i += 1) {
                    Total += Items[i].price * Items[i].count;
                }

            }
        };
    });