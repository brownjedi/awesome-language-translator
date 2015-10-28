var audioController = (function() {
	function setAudioSource(source) {
		var audioPlayer = $('.audio').get(0);
		try {
			audioPlayer.currentTime = 0;
		} catch (ex) {
			// ignore. Firefox just freaks out here for no apparent reason.
		}
		audioPlayer.src = source;
	}

	function playAudio() {
		var audioPlayer = $('.audio').get(0);
		if (audioPlayer.src) {
			audioPlayer.play();
		}
	}

	function pauseAudio() {
		var audioPlayer = $('.audio').get(0);
		if (audioPlayer.src) {
			audioPlayer.pause();
		}
	}

	return {
		setAudioSource: setAudioSource,
		playAudio: playAudio,
		pauseAudio: pauseAudio
	};
}());
