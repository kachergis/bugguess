var	FAM_NROWS = 2,
	FAM_NCOLS = 2,
	STUDY_NROWS = 4,
	STUDY_NCOLS = 4,
	N_STUDY_BLOCKS = 4,
	ITEMS_PER_STUDY_ROUND = STUDY_NCOLS * STUDY_NCOLS,
	TOTAL_STUDY_ITEMS = N_STUDY_BLOCKS * ITEMS_PER_STUDY_ROUND,
	STUDY_FRAME_DELAY = 500,
	STUDY_DURATION = 'selfpaced', // 'none' | 'selfpaced' | fixed t
	STUDY_BLOCK_TIME = 60000 * 2,
	STUDY_INIT_DELAY = 1000,
	STUDY_EXPOSE = 'free', // 'none' | 'free' | 'snake'
	STUDY_EXPOSE_DURATION = 10000,
	STUDY_COND = ['active', 'yoked'], //replace with randomization
	N_TEST_BLOCKS = 8,
	TEST_INIT_DELAY = 1000,
	TEST_NROWS = 3,
	TEST_NCOLS = 4,
	ITEMS_PER_TEST_BLOCK = TEST_NCOLS * TEST_NROWS,
	TEST_DURATION = 'none',
	TEST_FRAME_DELAY = 0,
	TEST_BLOCK_TIME = 60000 * 5; // maximum test block duration (not implemented)

var exp,
	active_item = undefined,
	yokeddata = [],
	stimuli;

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);
var LOGGING = mode != "debug";
var LOGGING = true;

psiTurk.preloadPages(['instruct.html',
					  'chooser.html',
					  'stage.html',
					  'feedback.html']);



psiTurk.preloadImages(IMAGES); // array in stimuli.js
$('#loading').css('display', 'none');

// Generic function for saving data
function output(arr) {
    psiTurk.recordTrialData(arr);
    if (LOGGING) console.log(arr.join(" "));
};


function clear_buttons() {
	$('#buttons').html('');
};



var Item = function(pars) {
	var self = this;

	self.stage = pars['stage'];
	self.ind = pars['ind'];
	self.id = 'item-' + self.ind;
	self.row = pars['row'];
	self.col = pars['col'];
	self.width = pars['width'];
	self.height = pars['height'];
	self.x_off = pars['x_off'] | 0;
	self.x = self.width * self.row + self.x_off;
	self.y = self.height * self.col;
	self.framedelay = pars['framedelay'];
	self.duration = pars['duration'];
	self.img = pars['image'];
	self.blocking = pars['blocking'] | true;

	padding = 10;
	self.obj_x = self.x + padding;
	self.obj_y = self.y + padding;
	self.obj_w = self.width - 2 * padding;
	self.obj_h = self.height - 2 * padding;

	// state variables
	self.active = false;
	self.framed = false;


	self.disp = self.stage.append('g')
						  .attr('id', self.id);


	self.obj = self.disp.append('image')
						.attr('x', self.obj_x)
						.attr('y', self.obj_y)
						.attr('width', self.obj_w)
						.attr('height', self.obj_h)
						.attr('opacity', 0.)
						.attr('xlink:href', self.img);

	self.frame = self.disp.append('rect')
						  .attr('x', self.x + padding/2)
						  .attr('y', self.y + padding/2)
						  .attr('width', self.width - padding)
						  .attr('height', self.height - padding)
						  .attr('rx', 15)
						  .attr('ry', 15)
						  .attr('stroke-width', 5)
						  .attr('stroke', '#D8D8D8')
						  .attr('fill', 'none')
						  .attr('opacity', 0.)


	self.frame_on = function() {
		self.framed = true;
		self.frame.attr('stroke', 'red')
				  .attr('opacity', 1.);
	};

	self.frame_inactive = function() {
		self.framed = false;
		self.frame.attr('stroke', '#D8D8D8')
				  .attr('opacity', 1.);
	};

	self.frame_off = function() {
		self.framed = false;
		self.frame.attr('opacity', 0.);
	};

	self.object_on = function() {
		self.obj.attr('opacity', 1.)
	};

	self.object_off = function() {
		self.active = false;
		self.obj.attr('opacity', 0.)
	};

	self.show = function(duration, callback) {
		self.object_on();
		setTimeout(function() {
			self.object_off();
			if (callback) callback();
		}, duration);
	};

	self.study = function() {
		self.object_on();

		switch (self.duration) {

			case 'none':
				break;
			case 'selfpaced':
				break;
			default:
				setTimeout(function() {
					active_item = undefined;
					self.frame_inactive();
					self.object_off();
				}, self.duration);
				break;
		};

	};


	self.listen = function() {

		self.disp.on('click', function() {

			// if not active, then proceed with study episode
			if (!self.active && active_item==undefined) {

				self.active = true;
				if (self.blocking) active_item = self.id;

				self.frame_on();
				setTimeout(function() {
					self.study();
				}, self.framedelay);

			// otherwise only handle clicks if study
			// duration is self-paced
			} else if (self.id==active_item && self.duration=='selfpaced') {

				active_item = undefined;
				self.object_off();
				self.frame_inactive();

			};

		});

	};

	self.listen_test = function() {

		self.disp.on('click', function() {

			if (self.active) {
				self.active = false;
				self.frame_inactive();
			} else {
				self.active = true;
				self.frame_on();
			}

		});

	}


	self.unlisten = function() {
		self.disp.on('click', function() {});
	};

};


var StudyPhase = function(block) {
	var self = this,
		expose_ind;
	self.study_cond = STUDY_COND[block % 2];

	if (self.study_cond == 'yoked') {
		self.yevent_ind = -1;
		self.yevent_data = yokeddata[block % 2];
	}

	psiTurk.showPage('stage.html');
	self.stage = d3.select('#stagesvg');
	self.nrow = STUDY_NROWS;
	self.ncol = STUDY_NCOLS;
	self.images = [];
	self.items = [];
	//self.stage_w = Number(self.stage.attr("width"));
	self.stage_h = Number(self.stage.attr("height"));
	self.stage_w = self.stage_h; // square
	self.x_off = (Number(self.stage.attr("width")) - self.stage_w) / 2;

	self.item_w = self.stage_w / self.nrow;
	self.item_h = self.stage_h / self.ncol;

	for (var i=0; i<self.nrow; i++) {
		for (var j=0; j<self.ncol; j++) {
			var ind = i * self.nrow + j;
			self.items.push(new Item({'stage': self.stage,
									  'ind': ind,
									  'row': i,
									  'col': j,
									  'x_off': self.x_off,
									  'width': self.item_w,
									  'height': self.item_h,
									  'image': IMAGES[stimuli[block][ind]],
									  'framedelay': STUDY_FRAME_DELAY,
									  'duration': STUDY_DURATION
									 }))
		};
	};


	self.expose_free = function() {
		output(['expose free']);

		$.each(self.items, function(i, item) {
			item.show(STUDY_EXPOSE_DURATION);
		})

		setTimeout(function() {
			self.study();
		}, STUDY_EXPOSE_DURATION);

	};

	self.expose_snake = function() {
		output(['expose snaking']);

		if (expose_ind == (self.items.length - 1)) {
			self.study();
		} else {
			expose_ind += 1;
			self.items[expose_ind].show(STUDY_EXPOSE_DURATION,
									    self.expose_snake);
		}
	};


	self.study_active = function() {
		output(['study active']);

		$.each(self.items, function(i, item) {
			item.listen();
		})

		// start the timer
		setTimeout(function() {
			exp.study();
		}, STUDY_BLOCK_TIME);
	};

	self.study_yoked = function() {
		output(['study yoked']);

		var event_ind = -1;
		for (i=0; i<self.yevent_data.length; i++) {

			episode = self.yevent_data[i];
			item_ind = episode[0];
			onset_t = episode[1];

			console.log(item_ind, onset_t);

			if (onset_t < STUDY_BLOCK_TIME) {

				setTimeout(function() {
					event_ind += 1;
					item_ind = self.yevent_data[event_ind][0];
					item = self.items[item_ind];
					item.duration = self.yevent_data[event_ind][2];
					item.frame_on();
					setTimeout(function() {
						item.study();
					}, item.framedelay);

				}, self.yevent_data[i][1]);

			};
		};

		// start the timer
		setTimeout(function() {
			exp.study();
		}, STUDY_BLOCK_TIME);

	};

	self.study = function() {
		$.each(self.items, function(i, item) {
			item.frame_inactive();
		});
		if (self.study_cond == 'active') self.study_active();
		else self.study_yoked();
	};

	setTimeout(function() {
		switch (STUDY_EXPOSE) {
			case 'none':
				self.study();
				break;
			case 'free':
				self.expose_free();
				break;
			case 'snake':
				expose_ind = -1;
				self.expose_snake();
				break;
		}
	}, STUDY_INIT_DELAY);
};


var TestPhase = function(block) {
	var self = this,
		expose_ind;

	psiTurk.showPage('stage.html');
	self.stage = d3.select('#stagesvg');
	self.nrow = TEST_NROWS;
	self.ncol = TEST_NCOLS;
	self.items = [];
	//self.stage_w = Number(self.stage.attr("width"));
	self.stage_h = Number(self.stage.attr("height"));
	self.stage_w = self.stage_h; // square
	self.x_off = (Number(self.stage.attr("width")) - self.stage_w) / 2;

	self.item_w = self.stage_w / self.nrow;
	self.item_h = self.stage_h / self.ncol;

	for (var i=0; i<self.nrow; i++) {
		for (var j=0; j<self.ncol; j++) {
			var ind = i * self.nrow + j;
			self.items.push(new Item({'stage': self.stage,
									  'ind': ind,
									  'row': i,
									  'col': j,
									  'x_off': self.x_off,
									  'width': self.item_w,
									  'height': self.item_h,
									  'image': IMAGES[testitems[block][ind]],
									  'framedelay': TEST_FRAME_DELAY,
									  'duration': TEST_DURATION,
									  'blocking': false,
									 }))
		};
	};

	btn_size = self.item_w * .7;

	self.done_btn = self.stage.append('g')
							  .attr('id', 'done-btn')
							  .attr('opacity', 0.);

	self.done_btn.btn =self.done_btn.append('rect')
							  .attr('x', 1.5 * self.x_off + self.stage_h - btn_size/2)
							  .attr('y', self.stage_h / 2 - btn_size/2)
							  .attr('width', btn_size)
							  .attr('height', btn_size)
							  .attr('rx', 15)
							  .attr('ry', 15)
							  .attr('fill', '#D8D8D8');

	self.done_btn.label = self.done_btn.append('text')
									.attr('x', 1.5 * self.x_off + self.stage_h)
									.attr('y', self.stage_h / 2 + 10)
									.attr('text-anchor', 'middle')
									.attr('id', 'test-done-btn')
									.attr('fill', 'white')
									.text('OK!');


	self.test = function() {
		output(['test']);

		self.done_btn.attr('opacity', 1.)

		$.each(self.items, function(i, item) {
			item.object_on();
			item.frame_inactive();
			item.listen_test();
		})

		self.done_btn.on('click', function() {

			// add checking here to make sure right
			// number of images have been selected

			self.done_btn.btn.attr('stroke', 'black');
			self.done_btn.label.attr('fill', 'black')
			setTimeout(exp.test, 300);
		});
	}


	setTimeout(function() {
		self.test();
	}, TEST_INIT_DELAY);
};


var Exit = function() {
	output('COMPLETE');
	psiTurk.saveData();
	psiTurk.completeHIT();
};


var Experiment = function() {
	var self = this;
	self.studyblock = -1;
	self.testblock = -1;


	self.study = function() {
		self.studyblock += 1;

		if (self.studyblock == N_STUDY_BLOCKS) {
			self.chooser();
		} else {
			self.view = new StudyPhase(self.studyblock);
		}

	};

	self.test = function() {
		self.testblock += 1;
		if (self.testblock == N_TEST_BLOCKS) {
			self.chooser();
		} else {
			self.view = new TestPhase(self.testblock);
		}

	};


	self.chooser = function() {
		psiTurk.showPage('chooser.html');


		$('#choose-setup').on('click', function() {
			self.setup();
		})

		$('#choose-fam').on('click', function() {
			self.view = new FamiliarizationPhase();
		})

		$('#choose-study').on('click', function() {
			self.study();
		})

		$('#choose-test').on('click', function() {
			self.test();
		})

		$('#choose-finish').on('click', function() {
			self.finish();
		})

	};

	self.finish = function() {
		Exit();
	};


	// setting up stimuli
	// indices of "yoked" stimuli
	yokeditems = sample_range(TOTAL_STUDY_ITEMS, (N_STUDY_BLOCKS/2)*ITEMS_PER_STUDY_ROUND);
	remaining = _.difference(range(2 * TOTAL_STUDY_ITEMS), yokeditems);
	activeitems = shuffle(remaining.sample(TOTAL_STUDY_ITEMS/2));
	nonstudied  = shuffle(_.difference(remaining, activeitems));

	stimuli = [activeitems.slice(0,ITEMS_PER_STUDY_ROUND),
			   yokeditems.slice(0,ITEMS_PER_STUDY_ROUND),
			   activeitems.slice(ITEMS_PER_STUDY_ROUND, activeitems.length),
			   yokeditems.slice(ITEMS_PER_STUDY_ROUND, yokeditems.length)]

	// stimulate some yoked data for now
	yokeddata = [];
	for (b=0; b<N_STUDY_BLOCKS/2; b++) {
		block_data = [];
		for (i=0; i<60; i++) {
			block_data.push([randrange(0, ITEMS_PER_STUDY_ROUND),
							 i*3000 + randrange(0, 1000),
							 randrange(500, 2000)])
		};
		yokeddata.push(block_data);
	};

	testitems = [];

	activeitems = shuffle(activeitems);
	yokeditems = shuffle(yokeditems);
	remaining = shuffle(remaining);

	for (b=0; b<N_TEST_BLOCKS; b++) {
		ti_b = [];
		for (i=0; i<(ITEMS_PER_TEST_BLOCK/4); i++) {
			ti_b.push(activeitems[(b * ITEMS_PER_TEST_BLOCK/4) + i]);
			ti_b.push(yokeditems[(b * ITEMS_PER_TEST_BLOCK/4) + i]);
		}
		for (i=0; i<(ITEMS_PER_TEST_BLOCK/2); i++) {
			ti_b.push(remaining[(b * ITEMS_PER_TEST_BLOCK/2) + i]);
		}
	testitems.push(ti_b);
	}

};


// vi: noexpandtab tabstop=4 shiftwidth=4
