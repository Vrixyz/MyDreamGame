/**
 * Created by TiTi on 17/08/15.
 */

require.config({
    baseUrl: "app/angular/bower_components",

    // FIXME: dev options should be present (debug libraries)
    // FIXME: add passport
    // alias libraries paths.  Must set 'angular'
    paths: {
        'angular': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular',
        'angular-route': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-route.min',
        'angularAMD': '//cdn.jsdelivr.net/angular.amd/0.2.0/angularAMD.min',
        'app':'../app'
    },
    //nodeRequire: require,
    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        'angularAMD': ['angular'],
        'angular-route': ['angular'],
        'app':['angular', 'angularAMD', 'angular-route']
    },

    // kick start application
    deps: ['app']
});