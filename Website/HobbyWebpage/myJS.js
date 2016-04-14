
jQuery(document).ready(function($) {


	$(function (){
	  $('[data-toggle="tooltip"]').tooltip()
	})

	$(function (){
 	 $('[data-toggle="popover"]').popover()
	})

	$("#spoiler-picture").hide();

	$("#showButton").on("click", function() {

		$("#pictureModal").modal("hide");
		$("#questionButton").hide();
		$("#questionText").hide();
		$("#spoiler-picture").show();
	})



});

