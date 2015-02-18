/* Rhinobird modules */
angular.module('rhinobird.models', ['plRestmod']);
angular.module('rhinobird.services', ['rhinobird.models']);
angular.module('rhinobird.directives', []);
angular.module('rhinobird.providers', []);
angular.module('rhinobird.filters', []);
angular.module('rhinobird.controllers', ['rhinobird.services', 'rhinobird.models', 'rhinobird.filters']);
