
function getBugParts() {
	var parts = [
		{
			image: new Image(),
			src: "static/images/body_gray.png",
			width: 208,
			height: 340,
			top: 50,
			left: 191,
			owner: -1,
			id: 1
		},
		{
			image: new Image(),
			src: "static/images/body_yellow.png",
			width: 208,
			height: 340,
			top: 50,
			left: 191,
			owner: -1,
			id: 2 
		},
		{
			image: new Image(),
			src: "static/images/wing_upper.png",
			width: 659,
			height: 117,
			top: 122,
			left: -30,
			owner: -1,
			id: 3 
		},
		{
			image: new Image(),
			src: "static/images/wing_lower.png",
			width: 651,
			height: 101,
			top: 207,
			left: -30,
			owner: -1,
			id: 4
		},
		{
			image: new Image(),
			src: "static/images/eyes_purple.png",
			width: 132,
			height: 84,
			top: 92,
			left: 229,
			owner: -1,
			id: 5
		},
		{
			image: new Image(),
			src: "static/images/eyes_white.png",
			width: 132,
			height: 84,
			top: 92,
			left: 229,
			owner: -1,
			id: 6
		},
		{
			image: new Image(),
			src: "static/images/legs_square.png",
			width: 316,
			height: 205,
			top: 249,
			left: 140,
			owner: -1,
			id: 7
		},
		{
			image: new Image(),
			src: "static/images/legs_circle.png",
			width: 316,
			height: 249,
			top: 207,
			left: 140,
			owner: -1,
			id: 8
		},
		{
			image: new Image(),
			src: "static/images/antennae.png",
			width: 169,
			height: 77,
			top: 1,
			left: 201,
			owner: -1,
			id: 9
		},
		{
			image: new Image(),
			src: "static/images/star.png",
			width: 107,
			height: 88,
			top: 266,
			left: 236,
			owner: -1,
			id: 10
		},
		{
			image: new Image(),
			src: "static/images/triangle.png",
			width: 147,
			height: 57,
			top: 211,
			left: 217,
			owner: -1,
			id: 11
		},
		{
			image: new Image(),
			src: "static/images/headband_red.png",
			width: 139,
			height: 17,
			top: 77,
			left: 219,
			owner: -1,
			id: 12
		},
		{
			image: new Image(),
			src: "static/images/headband_striped.png",
			width: 139,
			height: 17,
			top: 77,
			left: 219,
			owner: -1,
		},
		{
			image: new Image(),
			src: "static/images/freckles.png",
			width: 175,
			height: 41,
			top: 161,
			left: 201,
			owner: -1,
		}];
	return parts;
}

function getHouses() {
	// TODO: randomize order (and owners, I guess)
	var elements = [];
	elements.push({
		image: new Image(),
		src: "static/images/house_red.png",
		width: 173,
		height: 169,
		top: margin_y,
		left: margin_x,
		owner: 'Joe'
	});

	elements.push({
		image: new Image(),
		src: "static/images/house_blue.png",
		width: 173,
		height: 169,
		top: margin_y,
		left: margin_x+offset,
		owner: 'Rover'
	});

	elements.push({
		image: new Image(),
		src: "static/images/house_blue2.png",
		width: 173,
		height: 169,
		top: margin_y+offset,
		left: margin_x,
		owner: 'Lucy'
	});

	elements.push({
		image: new Image(),
		src: "static/images/house_red.png",
		width: 173,
		height: 169,
		top: margin_y+offset,
		left: margin_x+offset,
		owner: 'Tina'
	});
	return elements;
}

function getButtons() {
	var buttons = [];
	buttons.push({
	    color: '#CC0000',
	    width: 80,
	    height: 50,
	    top: button_y,
	    left: margin_x,
	    text: "Red?"
	});

	buttons.push({
	    color: '#666666',
	    width: button_size,
	    height: 50,
	    top: button_y,
	    left: margin_x+.6*button_offset,
	    text: "Window?"
	});

	buttons.push({
	    color: '#0000CC',
	    width: 100,
	    height: 50,
	    top: button_y,
	    left: margin_x+1.5*button_offset,
	    text: "Blue?"
	});
	return buttons;
}