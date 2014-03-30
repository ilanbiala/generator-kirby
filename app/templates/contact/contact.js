var submitted;

$(document).ready(function() {
	$("#comment").on('keyup', function() {
  		$("#character-count").text("Characters left: " + (500 - $(this).val().length));
	});
});

$('#contact-form').submit(function(e) {
	if (submitted == true) {
		$('#info').text('Your message has already been received and we will try to get back to you as soon as possible. In the meantime, please enjoy some good cat memes. You have our permission.');
		return false;
	}

	e.preventDefault();
	var formData = $("#contact-form").serialize();

	$.ajax({  
		type: "POST",  
		url: "server/mail.php",  
		data: formData
	}).done(function(xhr) {
		submitted = true;
		console.log(xhr);
		$('#info').text('Awesome man, we\'re so happy to get feedback. We\'ll try to get back to you as soon as possible.');
	}).fail(function(xhr, err) {
		console.log(xhr.status + ' ' + err);
		$('#info').text('Something went wrong, please refresh the page and try again.');
	}); 
});