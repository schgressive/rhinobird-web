/* Peepoltv modules */
angular.module('peepoltv.models', ['plRestmod']);
angular.module('peepoltv.services', ['peepoltv.models']);
angular.module('peepoltv.directives', []);
angular.module('peepoltv.filters', []);
angular.module('peepoltv.controllers', ['peepoltv.services', 'peepoltv.models', 'peepoltv.filters']);

/* 3rd party modules */
angular.module('peepoltv.vendor', ['ui.router', 'ui.bootstrap', 'infinite-scroll']);
angular.module('peepoltv.platanus', ['pl-licode', 'plRestmod']);
