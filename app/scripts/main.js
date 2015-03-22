'use strict';

/* initialize tooltips */
if (!window.matchMedia || (window.matchMedia('(min-width: 767px)').matches)){
  $(function () {
    $('.base').tooltip({
      selector: '[rel="tooltip"]'
    });
  });
}

$(document).ready(function() {
  /* bootstrap tooltips */
  $('.base').tooltip({
    selector: '[rel="tooltip"]'
  });
});
