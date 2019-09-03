export class Helper {
	/**
	 * Logs the mouse position in the console, but overlays a div that consumes all events
	 * since the actual story book stories are rendered as an iFrame.
	 */
	static logMousePosition() {
		let element = window.parent.document.createElement('mouse-position');
		element.style.position = 'absolute';
		element.style.top = '0px';
		element.style.left = '0px';
		element.style.bottom = '0px';
		element.style.right = '0px';
		element.style.zIndex = '10';
		window.parent.document.body.appendChild(element);

		window.parent.window.addEventListener('mousemove', event => {
			console.clear();
			console.log(event.clientX, event.clientY);
		});
	}

	static stringToColor(str: string) {
		var hash = 5381;
		for (var i = 0; i < str.length; i++) {
		  hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
		}
		var r = (hash & 0xFF0000) >> 16;
		var g = (hash & 0x00FF00) >> 8;
		var b = hash & 0x0000FF;
		return "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2);
	}

}
