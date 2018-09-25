$(document).ready(function(){
	const SCROLL_SPEED = 800;

	// Enable tooltips
	$('[data-toggle="tooltip"]').tooltip()

	// Enable animated scrolling
	$("a").on("click", function(event) {
		// Ensure that is a target hash before overriding behavior
		if (this.hash !== "") {
			// Prevent default behavior
			event.preventDefault();

			var hash = this.hash;

			$("html, body").animate({
				scrollTop: $(hash).offset().top
			}, SCROLL_SPEED, function(){
		    	// Add anchor to URL upon completion
		    	// window.location.hash = hash;
		    });
		}
	});

	//Cancels dragging immediately upon drag start
	$(".undraggable").on("dragstart", function (event) {
		return false;
	});
});