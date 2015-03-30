
// ToDo: (3/2/15)
// make exp toggle betwen two phases: ask (hypothesis or feature query) and eliminate (gray out hypotheses)
// (but also keep a version that automatically grays out eliminated options)

var img_dir_prefix = "static/images/";
var button_dir = img_dir_prefix + "features/";
// need a function to assign/counterbalance image_set

// var image_set = function getSet() {}


// iPad Retina
var screen_width = 2048,
    screen_height = 1536;

var button_width = 160,
    button_height = 160; // was 150...

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);
var LOGGING = mode != "debug";
var LOGGING = true;

var N_TRIALS = 10;
var ids = uniqueId.split(':') // to get our condition num?
var SEED = (ids[1] == "None");

var exp,
  outpfx = [];

var mycond = condition; // from psiturk (1 or 2?)

psiTurk.preloadPages(['instruct.html',
            'chooser.html',
            'stage.html']); // 'feedback.html'

// psiTurk.preloadImages if necessary

$('#loading').css('display', 'none');

// disable vertical bounce
$(document).bind(
      'touchmove',
          function(e) {
            e.preventDefault();
          }
);

// fastclick
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}


//var features = {"f1":"legs", "f2":"antennae", "f3":"bodycolor", "f4":"eyes", "f5":"antennae", "f6":"markings", "f7":"dots", "f8":"fur", "f9":"water", "f10":"leaf"};
// "basebody"

var Experiment = function() {
  var self = this;
  self.trial_num = -1;
  if(mycond==1) {
    self.condition = "automatic"; //condition; "manual" / "automatic"
  } else {
    self.condition = "manual";
  }

  // assign once and keep for all repetitions; OR for testing: use bug_features
  //self.features = assignFeatures(); // bug_features;
  //self.buttons = assignButtons(); // or use bug_buttons (predefined in stimuli.js) for testing

  output(['participantid', ids[0]]);
  //output(['partnerid', ids[1]]);
  output(['seed', SEED]);
  console.log(beetle_features);
  console.log(abstract_features);
  shuffle(beetle_features);
  shuffle(abstract_features);
  self.bug_buttons = []
  self.features = {}
  for (i = 0; i < beetle_features.length; i++) { 
    self.bug_buttons.push({"id":beetle_features[i], "feature":abstract_features[i]});
    self.features[abstract_features[i]] = beetle_features[i];
  }
  console.log(beetle_features);
  console.log(abstract_features);

  // also shuffle exemplars just once:
  shuffle(bug_exemplars);

  self.play = function() {
    self.trial_num += 1;
    if (self.trial_num == N_TRIALS) {
      self.chooser();
    } else {
      self.view = new PlayRound(bug_exemplars, self.bug_buttons, self.features, self.condition, "bugs", self.trial_num);
    }
  };

  self.chooser = function() {
    psiTurk.showPage('chooser.html');
    $('#choose-train').on('click', function() {
      //self.setup();
      self.view = new PlayRound(house_exemplars, house_buttons, house_features, self.condition, "training", -1); 
    })

    $('#choose-main').on('click', function() {
      self.play();
    })

    $('#choose-done').on('click', function() {
      self.finish();
    })
  };

  self.finish = function() {
    Exit();
  };

  self.chooser();
}

var Exit = function() {
  output('COMPLETE');
  psiTurk.saveData();
  psiTurk.completeHIT();
};


var assignButtons = function() {
  shuffle(beetle_features);
  shuffle(abstract_features);
  self.bug_buttons = []
  for (i = 0; i < beetle_features.length; i++) { 
    bug_buttons.append({id:beetle_features[i], feature:abstract_features[i]});
  }
}


var assignFeatures = function(features, exemplars) {
  // NEED TO RANDOMIZE ASSIGNMENT OF REAL FEATURES ("legs") TO ABSTRACT FEATURES ("f1") -- and then save the configuration (and use mapping for buttons...)
  //features = {"f1":"legs", "f2":"antennae", "f3":"bodycolor", "f4":"eyes", "f5":"markings", "f6":"dots", "f7":"fur", "f8":"water", "f9":"leaf"};
  //bug_exemplars = {"id":"A" , "f1":1 , "f2":0 , "f3":0 , "f4":1 , "f5":0 , "f6":0 , "f7":0 , "f8":0 , "f9":0, "f10":0 }, ...

  // really just make a dictionary: features["f1":"legs" or whatever]
  // really just need to randomly create the button mapping (we never use bug_features)
  

  // have option to use all the same "basebody" or all unique
};

function PlayRound(exemplars, buttons, features, condition, stage, trial_num) {
  var self = this;
  self.exemplars = exemplars;
  self.buttons = buttons;
  self.features = features;
  self.condition = condition; // "automatic" grays out eliminated bugs on button press; "manual" requires subjects to gray out
  self.stage = stage; // "training" or "bugs"
  self.trial_num = trial_num;

  self.last_button = "none";
  self.last_button_id = "none";

  psiTurk.showPage('stage.html');

  // for the "manual" condition, this tracks phase: time to ask a question or eliminate some hypotheses
  self.button_phase = true; 

  self.answer_ind = Math.floor((Math.random() * exemplars.length));
  self.answer = exemplars[self.answer_ind];

  // do we want the whole correct answer in the prefix?
  output([self.answer]);
  outpfx =['play-round', trial_num, self.condition, self.stage, self.answer_ind]; 
  output(['init']);

  if(stage==="training") {
    var sidebar_width = 600,
        bug_width = 360,
        bug_height = 360;
  } else {
    var sidebar_width = 400,
        bug_width = 265,
        bug_height = 265; // 330, 280
  }
  var nrows = 1; //buttons.length>4 ? 2 : 1

  self.rectGrid = d3.layout.grid()
    .bands()
    .nodeSize([bug_width, bug_height]) 
    .padding([10, 20]); // padding is absolute if nodeSize is used
    // .size([100,100])

  self.buttonGrid = d3.layout.grid()
    .bands()
    .rows(nrows)
    .nodeSize([button_width, button_height]) 
    .padding([30, 20]);

  self.bugs = d3.select("#stimArray").append("svg")
    .attr({
      width: screen_width-sidebar_width,
      height: (screen_height -1.3*button_height)
    }) 
    .attr("id", "bugArray")
    .append("g")
    .attr("transform", "translate(20,0)");

  // // Load bug and return callback
  // self.loadBug = function(callback, canvas) {
  // // append svg file from filename to div
  //   d3.xml(img_dir_prefix+'beetles/beetle1.svg', "image/svg+xml", function( xml ) {
  //     var importedNode = document.importNode(xml.documentElement, true);
  //     $(canvas).append(importedNode); 

  //     // Initialize bug selectors
  //     //bug = d3.selectAll(canvas).select("svg");
  //     callback();
  //   });
  // };

  self.addImages = function(exemplars, img_dir) { 
    //shuffle(self.exemplars);

    rect = self.bugs.selectAll(".rect")
      .data(self.rectGrid(self.exemplars)); 
    console.log(rect)

    //self.loadBug(function () { console.log("adding bug..."); }, "#bugArray"); 

    if(self.stage==="training") {
      stim_svg = 'house.svg';
    } else {
      var base_stimulus = Math.floor(Math.random() * 16) + 1;
      stim_svg = 'beetles/beetle'+base_stimulus+'.svg'
    }

    d3.xml(img_dir_prefix+stim_svg, "image/svg+xml", function( xml ) {
      var importedNode = document.importNode(xml.documentElement, true);
      //importedNode.setAttribute("transform", "scale(" + .1 + " " + .1 +")");
      importedNode.setAttribute("width", self.rectGrid.nodeSize()[0]); // or this way
      importedNode.setAttribute("height", self.rectGrid.nodeSize()[1]); 
    rect.enter().append("g")
      .each(function(d,i) {
        var plane = this.appendChild(importedNode.cloneNode(true));
        //for f, key in features  ... if(d[key]==0) d3.select(plane).select(f).remove();
        for(var key in features) {
          if(d[key]==0) {
            d3.select(plane).select("#"+self.features[key]).remove();
          }
        }
      })
      .attr("class", "rect")
      .attr("active", true)
      .attr("id", function(d) { return d.id; })
      .attr("width", self.rectGrid.nodeSize()[0])
      .attr("height", self.rectGrid.nodeSize()[1])
      .attr("transform", function(d) { return "translate(" + (d.x + 20)+ "," + d.y + ")"; })
      .on("click", function(d){
        output(['exemplar_click',d.id,this.active]);
        //console.log(d);
        if(typeof(this.active)=="undefined" || this.active) {
          newOpacity = .2;
          this.active = false;
        } else {
          newOpacity = 1;
          this.active = true;
        }
        console.log("active: "+rect.active+"  newOpacity: "+newOpacity);
        // Hide or show the elements
        d3.select("#"+d.id).style("opacity", newOpacity);

        if(self.button_phase) {
          // do the 1-click test for now (otherwise use ready button state)
          if(d.id===self.answer.id) {
              //.attr("xlink:href", function(d) { return img_dir_prefix+"smiley.svg"; })
            var correct = d3.select("g").append("image")
              .attr("xlink:href", function(d) { return img_dir_prefix+"smiley.svg"; })
              .attr("id", "correct")
              .attr("x", 490)
              .attr("y", 430)
              .attr("height", 400)
              .attr("width", 400)
              .style("opacity", 1)
              .on("click", function(d) { correct.remove() });
            correct.transition().duration(1000).delay(1000).style("opacity", 1e-6);
            setTimeout(function() { exp.chooser(); }, 5000);
          } else {
            //incorrect.style("opacity", 1);
            //incorrect.transition().delay(2000).style("opacity", 1e-6);
            var incorrect = d3.select("g").append("image")
              .attr("xlink:href", function(d) { return img_dir_prefix+"red_x.svg"; })
              .attr("id", "incorrect")
              .attr("x", d.x + 15)
              .attr("y", d.y + 45)
              .attr("height", self.rectGrid.nodeSize()[0]-15)
              .attr("width", self.rectGrid.nodeSize()[1]-15)
              .style("opacity", 1)
              .on("click", function(d) { incorrect.remove(); });
            incorrect.transition().duration(1000).delay(1000).style("opacity", 1e-6);
            }
          } else {
            // it's elimination time...no feedback; just gray out stuff (and un-gray out?)
          }
        });
  
    // rect.selectAll("svg")
    //   .transition()
    //   .attr("transform","scale(.3)");

    rect.exit().transition()
      .style("opacity", 1e-6)
      .remove();

    }); // d3.xml

      };


  //self.loadBug(function () { console.log("adding bug..."); }, "#rect");

  if(self.stage==="training") {
    self.addImages(self.exemplars, img_dir_prefix+"/");
    callout_txt = "Woof?";
    side_img = "dog";
  } else {
    self.addImages(self.exemplars, img_dir_prefix+"/");
    callout_txt = "Who am I?";
    side_img = "rug";
  }

  self.sidebar = d3.select("#sideBar").append("svg")
    .attr({
      width: sidebar_width,
      height: (screen_height-1.3*button_height)
    }) 
    .attr("id", "sidebar");

  self.rug = self.sidebar.append("g")
    .attr("id", "rug")
    .attr("transform", "translate(20,50)")
    .append("image")
    .attr("xlink:href", function(d) { return "static/images/"+side_img+".png"; })
    .attr({
      width: 261,
      height: 437
    })
    .style("opacity", 1)
    .on("click", function(d) {
      d3.select(this).transition()
        .attr("width",261+50)
        .duration(1000) // this is 1s
        .delay(500);
      d3.select(this).transition()
        .attr("width",261)
        .duration(500)
        .delay(100);
    });

  //function wiggle(d) {}

  self.callout = self.sidebar.append("g")
    .attr("id", "callout")
    .attr("transform", "translate(0,490)");

  self.callout.append("image")
    .attr("xlink:href", function(d) { return "static/images/callout.svg"; })
    .attr({
      width: 300,
      height: 250
    })
    .style("opacity", 1);
    //.attr("transform", "translate(0,0)");

  self.text = self.callout.append("text")
    .attr("x", 32)
    .attr("y", 140)
    .text(callout_txt);

  self.buttonbar = d3.select("#controls").append("svg")
    .attr({
      width: screen_width,
      height: 1.2*button_height
    })
    .attr("id", "buttonArray")
    .append("g")
    .attr("transform", "translate(100,5)");

  var phaseButton = self.sidebar.append("g")
    .attr("id", "phaseButton")
    .attr("transform", "translate(0,760)")
    .on("click", function(){
      self.phaseChange()
      // if(condition==="automatic") then they must click click this to eliminate the irrelevant stimuli self.last_button
    });

  self.sidebar.append("text")
    .attr("x", 20)
    .attr("y", 930)
    .attr("font-size", 20)
    .text(self.condition);

  self.phaseChange = function() {
    output(["button_press","phase",self.button_phase]);
    // if they click button in eliminate phase, they're done eliminating: time for buttons/guessing
    phaseButton.select("text").remove();
    if(self.button_phase===false) {
      if(self.condition=="automatic") {
        d3.selectAll(".rect")
         .filter(function(d) {
           return d[self.last_button] !== self.answer[self.last_button];
         })
         .style("opacity", .2).attr("active", true);
      }

      self.button_phase = true;
      self.buttonbar.selectAll(".buttong").style("opacity", 1);
      // select and deactivate all the clicked exemplars (they already are--in rectGrid code)
      phaseButton.select("rect").style("fill", "green");
      self.text.remove();
      self.text = self.callout.append("text")
        .attr("x", 30)
        .attr("y", 136)
        .text(callout_txt);
      var phaseText = phaseButton.append("text")
        .attr("x", 35)
        .attr("y", 85)
        .text("Guess!");
    } else {
      self.button_phase = false;
      phaseButton.select("rect").style("fill", "red");
      var phaseText = phaseButton.append("text")
        .attr("x", 35)
        .attr("y", 85)
        .text("Eliminate!");
    }
  }

  phaseButton.append("rect")
    .attr("x", 20)
    .attr("y", 20)
    .attr("rx",20) 
    .attr("ry",20)
    .attr("width", 250)
    .attr("height", 100)
    .attr("class", "pbutton")
    .attr("fill", "green");
    //.attr("transform", "translate(50,0)");
  
  var phaseText = phaseButton.append("text")
    .attr("id", "phaseText")
    .attr("x", 35)
    .attr("y", 85)
    .text("Guess!");

  self.addButtons = function(buttons) { 
    //shuffle(buttons);
    var button = self.buttonbar.selectAll(".button")
      .data(self.buttonGrid(buttons));
    button.enter().append("g")
      .attr("class", "buttong")
      .attr("transform", function(d) { return "translate(" + d.x+ "," + d.y + ")"; })
      .on("click", function(d){
        self.buttonPress(d);
      })
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("rx",20) 
      .attr("ry",20)
      .attr("width", self.buttonGrid.nodeSize()[0])
      .attr("height", self.buttonGrid.nodeSize()[1])
      .attr("class", "fbutton");

    d3.selectAll(".buttong")
      .append("image")
      .attr("xlink:href", function(d) { return button_dir+d.id+".png"; })
      .attr("class", "button")
      .attr("id", function(d) { return d.id; })
      .attr("width", self.buttonGrid.nodeSize()[0])
      .attr("height", self.buttonGrid.nodeSize()[1])
      .style("opacity", 1);
      
  };

  // ToDo: make css buttons with bug parts inside -- no more PNGs
  self.addButtons(self.buttons);

  self.buttonPress = function(b) {
    output(["button_press",b.id,b.feature]);
    self.last_button_id = b.id;
    self.last_button = b.feature;

    // select the rects that do not have the answer's d[b.feature] 
    //if(self.condition==="automatic") {
      
      // d3.selectAll(".rect")
      //  .filter(function(d) {
      //    return d[b.feature] !== self.answer[b.feature];
      //  })
      //  .style("opacity", .2).attr("active", true);
    //} else if(condition==="manual") {
    // is it question asking (button pressing) time, or 
       if(self.button_phase) { 
          d3.selectAll(".buttong")
            .filter(function(d) {
              return d[b.feature] !== self.answer[b.feature];
            })
            .style("opacity", .2).attr("active", true);

          answer_text = self.answer[b.feature]===1 ? "Yes!" : "No!";

          self.text.remove();
          self.text = self.callout.append("text")
            .attr("x", 30)
            .attr("y", 136)
            .text(answer_text);
          //  .text(b.id+": "+answer_text);
       }
     
     self.phaseChange()
     //}
  };

  //var div = d3.select("#container").append("div")   
  //    .attr("class", "tooltip")               
  //    .style("opacity", 0);
    // OR show them a dialog with the correct feature in it
    // tooltip with image in it:
    // http://bl.ocks.org/jarobertson/1483052

}; // end PlayRound



// Generic function for saving data
function output(arr) {
    arr = outpfx.concat(arr);
    psiTurk.recordTrialData(arr);
    if (LOGGING) console.log(arr.join(" "));
};

function clear_buttons() {
  $('#buttons').html('');
};

//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o) { 
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}
