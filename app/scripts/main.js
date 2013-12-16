/* initialize tooltips */
if (!window.matchMedia || (window.matchMedia("(min-width: 767px)").matches)){
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

  /* collapses menu in mobile after clicking link */
  $('#hideonclick a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    if ($('.btn').is(":visible")){
      $('.btn').click();
    }
  });

  /*hookup flexslider*/
  /*
$('.body').fadeIn(800);
      });
*/
});

$(window).load(function() {
  $('.flexslider').flexslider({
    animation: 'slide',
    directionNav: false,
    controlNav: false
  });
});
