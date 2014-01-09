/* Peepoltv modules */
angular.module('peepoltv.models', ['plRestmod']);
angular.module('peepoltv.services', ['peepoltv.models']);
angular.module('peepoltv.directives', []);
angular.module('peepoltv.filters', []);
angular.module('peepoltv.controllers', ['peepoltv.services', 'peepoltv.models', 'peepoltv.filters']);
