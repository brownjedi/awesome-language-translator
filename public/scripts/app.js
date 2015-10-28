function getLanguageCode(language) {

	var languageCodes = {
		'English': 'en',
		'Spanish': 'es',
		'French': 'fr',
		'Portuguese': 'pt',
		'Arabic': 'ar'
	}
	return languageCodes[language];
}

// On Document Ready
$(document).ready(function() {

	$('.help-screen').hide();
	$('#source-speech').hide();

	$('#help-button').click(function() {
		if ($('.help-screen').is(":visible")) {
			$('.help-screen').hide();
			$('#help-button > i').text('help_outline');
		} else {
			$('.help-screen').show();
			$('#help-button > i').text('close');
		}
	});
});
