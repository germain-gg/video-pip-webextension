const init = () => {
	if (document.pictureInPictureEnabled) {
		chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
			sendMessage(tab, "EXIT_PIP");
			sendMessage(tab, "GET_VIDEOS", {}, render(tab))
		});
	}
};

const render = tab => response => {

	root.innerHTML = "";

	response.data.videos.forEach((video, index) => {

		const el = document.createElement("div");
		el.innerHTML = `Video #${index}`;

		root.appendChild(el);

		root.addEventListener("mouseenter", () =>
			sendMessage(tab, "FOCUS_VIDEO", { index })
		);

		root.addEventListener("mouseleave", () =>
			sendMessage(tab, "BLUR_VIDEO", { index })
		);

		root.addEventListener("click", () => {
			sendMessage(tab, "ENTER_PIP", { index });
			sendMessage(tab, "BLUR_VIDEO", { index }, () => window.close());
		})
	});

};

const sendMessage = (tab, name, data = {}, cb) => {
	return chrome.tabs.sendMessage(
		tab.id,
		{ name, data },
		{},
		cb
	)
};

const root = document.querySelector(".js-root");
init();
