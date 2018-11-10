chrome.runtime.onMessage.addListener(
	(...args) => {
		const requestName = args[0].name;
		switch(requestName) {
			case "ENTER_PIP":
				return enterPip(...args);
			case "EXIT_PIP":
				return exitPip(...args);
			case "FOCUS_VIDEO":
				return focusVideo(...args);
			case "BLUR_VIDEO":
				return blurVideo(...args);
			case "GET_VIDEOS":
			default:
				return getVideos(...args);
		}
	}
)

const enterPip = (request) => {
	const video = document.querySelectorAll("video")[request.data.index];
	video.requestPictureInPicture();
};

const exitPip = () => {
	if (document.pictureInPictureElement !== null) {
		document.exitPictureInPicture();
	}
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

const focusVideo = request => {
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

const blurVideo = request => {
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
