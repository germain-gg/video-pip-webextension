chrome.runtime.onMessage.addListener(
	(request) => {
		switch(request.name) {
			case "ENTER_PIP":
				return enterPip.apply(this, arguments);
			case "EXIT_PIP":
				return exitPip.apply(this, arguments);
			case "FOCUS_VIDEO":
				return focusVideo.apply(this, arguments);
			case "BLUR_VIDEO":
				return blurVideo.apply(this, arguments);
			case "GET_VIDEOS":
			default:
				return getVideos.apply(this, arguments);
		}
	}
)

const enterPip = (request) => {
	const video = document.querySelectorAll("video")[request.data.index];
	video.requestPictureInPicture();
};

const exitPip = () => {
	document.exitPictureInPicture();
}

const getVideos = (request, sender, sendResponse) => {

	const nodeList = document.querySelectorAll("video");
	const videos = [];

	for (node of nodeList) {
		videos.push({
			poster: node.getAttribute("poster"),
			src: node.getAttribute("src")
		});
	}

	sendResponse({
		name: "GET_VIDEOS",
		data: { videos }
	});
};

const highlightVideo = request => {
	const video = document.querySelectorAll("video")[request.data.index];

	const boundingRect = video.getBoundingClientRect();

	setStyles(video, {
		position:"fixed",
		zIndex: 999999999,
		left: boundingRect.left + "px",
		top: boundingRect.top + "px",
		filter: "grayscale(100%)",
		opacity: "0.5"
	});
}

const unhighlightVideo = request => {
	const video = document.querySelectorAll("video")[request.data.index];
	undoStyles(video);
}

const setStyles = (el, styles) => {

	const properties = Object.keys(styles);
	const oldStyles = {};
	properties.forEach(property => {
		oldStyles[property] = el.style[property];
		el.style[property] = styles[property];
	});

	el.setAttribute("data-pip-saved-style", JSON.stringify(oldStyles));

};

const undoStyles = el => {

	const styles = JSON.parse(el.getAttribute("data-pip-saved-style"));

	Object.keys(styles).forEach(property => {
		el.style[property] = styles[property];
	});

	el.removeAttribute("data-pip-saved-style");
}
