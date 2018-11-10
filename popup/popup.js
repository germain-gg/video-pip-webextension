const init = () => {
	if (document.pictureInPictureEnabled) {
		chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
			sendMessage(tab, "GET_VIDEOS", {}, render(tab));
			sendMessage(tab, "EXIT_PIP");
		});
	}
};

const render = tab => response => {

	if (!document.pictureInPictureEnabled) {
		root.innerHTML = `
			<div class="empty">
				<h1>😢</h1>
				<p>Your browser does not support Picture-in-Picture, you should upgrade to the latest version</p>
			</div>
		`;
	} else if (!response.data.videos.length) {
		root.innerHTML = `
			<div class="empty">
				<h1>😢</h1>
				<p>It looks like there are no videos here...</p>
			</div>
		`;
	} else {
		root.innerHTML = "";
		response.data.videos.forEach((video, index) => {

			const el = document.createElement("div");
			el.className = "video";
			el.innerHTML = `
				<div class="thumbnail">${video.poster ?
					`<img src="${video.poster}" alt="Video #${index} thumbnail" />` : ""
				}</div>
				<p>Video #${index}</p>
			`;

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
	}

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

setTimeout(init, 500)
