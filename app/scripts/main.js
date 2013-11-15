/* initialize tooltips */
	if (!window.matchMedia || (window.matchMedia("(min-width: 767px)").matches))
	$(function () {
		$('.base').tooltip({
	      selector: '[rel="tooltip"]'
	    })
	  });

$(document).ready(function() {

	/* bootstrap tooltips */
	$('.base').tooltip({
	   selector: '[rel="tooltip"]'
	 });

 	/* video slider */
   $("#streamSet").owlCarousel();

  /* collapses menu in mobile after clicking link */
  $('#hideonclick a').click(function (e) {
	        e.preventDefault();
	        $(this).tab('show');
	        if ($('.btn').is(":visible"))
	            $('.btn').click();
	    });

});