
// ToDo: (3/2/15)
// make exp toggle betwen two phases: ask (hypothesis or feature query) and eliminate (gray out hypotheses)
// (but also keep a version that automatically grays out eliminated options)

var img_dir_prefix = "static/images/";
var button_dir = img_dir_prefix + "features/";
// need a function to assign/counterbalance image_set

// var image_set = function getSet() {}


// iPad Retina
//var screen_width = 2048,
//    screen_height = 1536;
var screen_width = 1024*.97,
    screen_height = 768*.93;

var button_width = .11*screen_width,
    button_height = .11*screen_width; // was 150...

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);
var LOGGING = mode != "debug";
var LOGGING = true;

//console.log(location.search);



var N_TRIALS = 10;
var ids = uniqueId.split(':') // to get our condition num?
var SEED = (ids[1] == "None");

var exp,
  outpfx = [];

//var mycond = condition; // from psiturk (0 or 1, i think)

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}


var subject_num = getURLParameter('workerId');
var mycond = getURLParameter('condit');
var myage =  getURLParameter('age');
var myipad = getURLParameter('ipad');


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


// simple solution to 'click' delay in iOS:
var p = navigator.platform;

// if(p==='iPad' || p==='iPhone' || p==='iPod') {
//   var click_type = 'touchstart'; 
// } else {
//   var click_type = 'click';
// }
var click_type = 'touchstart'; 

// get rid of 300ms touchscreen click delay (maybe also try binding touchstart to click..)
$(function() {
   FastClick.attach(document.body);
});

// http://stackoverflow.com/questions/13655919/how-to-bind-both-mousedown-and-touchstart-but-not-respond-to-both-android-jqu
//touch click helper
// (function ($) {
//     $.fn.tclick = function (onclick) {
//         this.bind("touchstart", function (e) { onclick.call(this, e); e.stopPropagation(); e.preventDefault(); });
//         this.bind("click", function (e) { onclick.call(this, e); });   //substitute mousedown event for exact same result as touchstart         
//         return this;
//     };
// })(jQuery);


// For every element on your page that has an OnClick, add a class - say TouchTarget. Then use this in your startup function.
// if (Modernizr.touch) { // if touch is available
//   $('.TouchTarget').bind('touchstart', function (e) {
//       e.preventDefault();
//       touchStart(e, this);
//   });
// }


//var features = {"f1":"legs", "f2":"antennae", "f3":"bodycolor", "f4":"eyes", "f5":"antennae", "f6":"markings", "f7":"dots", "f8":"fur", "f9":"water", "f10":"leaf"};
// "basebody"

var Experiment = function() {
  var self = this;
  self.trial_num = -1;
  // if(mycond==1) {
  //   self.condition = "automatic"; //condition; "manual" / "automatic"
  // } else {
  //   self.condition = "manual";
  // }
  self.condition = mycond;
  console.log(self.condition);
  // assign once and keep for all repetitions; OR for testing: use bug_features
  //self.features = assignFeatures(); // bug_features;
  //self.buttons = assignButtons(); // or use bug_buttons (predefined in stimuli.js) for testing

  output(['participantid', ids[0]]);
  output(['seed', SEED]);
  output(['subject='+subject_num,'age='+myage,'condition='+mycond,'ipad_familiar='+myipad]);
  shuffle(beetle_features);
  shuffle(abstract_features);
  self.bug_buttons = []
  self.features = {}
  for (i = 0; i < beetle_features.length; i++) { 
    self.bug_buttons.push({"id":beetle_features[i], "feature":abstract_features[i]});
    self.features[abstract_features[i]] = beetle_features[i];
  }

  self.bug_buttons.push({"id":"basebody", "feature":"f10"});
  self.features["f10"] = "basebody";

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
    // $('#choose-pretrain').on(click_type, function() {
    //   //self.setup();
    //   console.log("dot game");
    //   //self.view = new dotGame
    // })

    $('#choose-train').on(click_type, function() {
      //self.setup();
      self.view = new PlayRound(house_exemplars, house_buttons, house_features, self.condition, "training", -1); 
    })

    $('#choose-main').on(click_type, function() {
      self.play();
    })

    $('#choose-done').on(click_type, function() {
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
  psiTurk.saveData({
    success: function() {
      psiTurk.completeHIT();
    },
    error: resubmit
    });
}

var resubmit = function() {
  document.body.innerHTML = error_message;
  setTimeout(Exit,10000);
}

var assignButtons = function() {
  shuffle(beetle_features);
  shuffle(abstract_features);
  self.bug_buttons = []
  for (i = 0; i < beetle_features.length; i++) { 
    bug_buttons.append({id:beetle_features[i], feature:abstract_features[i]});
  }
}


  // NEED TO RANDOMIZE ASSIGNMENT OF REAL FEATURES ("legs") TO ABSTRACT FEATURES ("f1") -- and then save the configuration (and use mapping for buttons...)
  //features = {"f1":"legs", "f2":"antennae", "f3":"bodycolor", "f4":"eyes", "f5":"markings", "f6":"dots", "f7":"fur", "f8":"water", "f9":"leaf"};
  //bug_exemplars = {"id":"A" , "f1":1 , "f2":0 , "f3":0 , "f4":1 , "f5":0 , "f6":0 , "f7":0 , "f8":0 , "f9":0, "f10":0 }, ...

  // really just make a dictionary: features["f1":"legs" or whatever]
  // really just need to randomly create the button mapping (we never use bug_features)
  

  // have option to use all the same "basebody" or all unique

// show slide function
function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}

var images = new Array();
//for dot game
var dots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", "x", "dot_smiley"];
for (i = 0; i<dots.length; i++) {
  images[i] = new Image();
  images[i].src = img_dir_prefix+"dots/" + dots[i] + ".jpg";
}

createDot = function(dotx, doty, i, tag) {
  var dots;
  if (tag === "smiley") {
    dots = ["smiley1", "smiley2", "smiley3", "smiley4", "smiley5"];
  } else {
    dots = [1, 2, 3, 4, 5];
  }

  var dot = document.createElement("img");
  dot.setAttribute("class", "dot");
  dot.id = "dot_" + dots[i];
  if (tag === "smiley") {
    dot.src = img_dir_prefix+"dots/dot_" + "smiley" + ".jpg";
  } else {
    dot.src = img_dir_prefix+"dots/dot_" + dots[i] + ".jpg";
  }

    var x = Math.floor(Math.random()*950);
    var y = Math.floor(Math.random()*540);

    var invalid = "true";

    //make sure dots do not overlap
    while (true) {
      invalid = "true";
      for (j = 0; j < dotx.length ; j++) {
        if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 250) {
          var invalid = "false";
          break; 
        }
    }
    if (invalid === "true") {
      dotx.push(x);
          doty.push(y);
          break;  
      }
      x = Math.floor(Math.random()*400);
      y = Math.floor(Math.random()*400);
  }

    dot.setAttribute("style","position:absolute;left:"+x+"px;top:"+y+"px;");
    training.appendChild(dot);
}

var dotGame = {
  training: function(dotgame) {
    var allDots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", 
            "dot_smiley1", "dot_smiley2", "dot_smiley3", 
            "dot_smiley4", "dot_smiley5"];
    var xcounter = 0;
    var dotCount = 5;

    //preload sound
    if (dotgame === 0) {
      audioSprite.play();
      audioSprite.pause();
    }

    var dotx = [];
    var doty = [];

    if (dotgame === 0) {
      for (i = 0; i < dotCount; i++) {
        createDot(dotx, doty, i, "");
      }
    } else {
      for (i = 0; i < dotCount; i++) {
        createDot(dotx, doty, i, "smiley");
      }
    }
    showSlide("training");
    $('.dot').bind('click touchstart', function(event) {
        var dotID = $(event.currentTarget).attr('id');

        //only count towards completion clicks on dots that have not yet been clicked
        if (allDots.indexOf(dotID) === -1) {
          return;
        }
        allDots.splice(allDots.indexOf(dotID), 1);
        document.getElementById(dotID).src = img_dir_prefix+"dots/x.jpg";
        xcounter++
        if (xcounter === dotCount) {
          setTimeout(function () {
            $("#training").hide();
            if (dotgame === 0) {    
              //hide old x marks before game begins again
              var dotID;
              for (i = 1; i <= dotCount; i++) {
                dotID = "dot_" + i;
                training.removeChild(document.getElementById(dotID));
              }
            experiment.training();
            dotgame++; 
          } else {
            //document.body.style.background = "black";
            setTimeout(function() {
              showSlide("prestudy");
              //experiment.next();
            }, normalpause*2);
          }
        }, normalpause*2);
      }
      });    
  }
}

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
  output(['answer',self.answer]);
  outpfx =['play-round', trial_num, self.condition, self.stage, self.answer_ind]; 
  output(['init']);

  if(stage==="training") {
    var sidebar_width = screen_width*.2,
        bug_width = screen_width*.23,
        bug_height = screen_height*.22;
  } else {
    var sidebar_width = screen_width*.2,
        bug_width = screen_width*.12+2,
        bug_height = screen_height*.23; // 330, 280
  }

  //var nrows = 1; //buttons.length>4 ? 2 : 1
  var ncols = buttons.length>4 ? 2 : 1

  self.rectGrid = d3.layout.grid()
    .bands()
    .nodeSize([bug_width, bug_height]) 
    .padding([10, 20]); // padding is absolute if nodeSize is used
    // .size([100,100])

  self.buttonGrid = d3.layout.grid()
    .bands()
    .cols(ncols)
    .nodeSize([button_width, button_height]) 
    .padding([10, 20]);

  self.bugs = d3.select("#stimArray").append("svg")
    .attr({
      width: 1024*.55,
      height: 768 
    }) 
    .attr("id", "bugArray")
    .append("g")
    .attr("transform", "translate(-2,0)");

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
      .attr("highlighted", false)
      .attr("id", function(d) { return d.id; })
      .attr("width", self.rectGrid.nodeSize()[0])
      .attr("height", self.rectGrid.nodeSize()[1])
      .attr("transform", function(d) { return "translate(" + (d.x)+ "," + d.y + ")"; });

    rect.on(click_type, function(d, i){
        thisOne =  d3.select(this); // d3.select("#"+d.id); 
        output(['exemplar_click',"button_phase="+self.button_phase,"id="+d.id,"highlighted="+thisOne.attr("highlighted"),"active="+thisOne.attr("active")]);
        if(self.button_phase) { // can make guesses (and eliminate one by one)
          //thisOne.selectAll("[highlighted='false']").attr()
          if(thisOne.attr("active")=='true') {
            newOpacity = .2;
            thisOne.attr("active", false);
          } else {
            newOpacity = 1; // can't reactivate (e.g., why hypothesis test twice?)
          }
          // Hide or show the elements
          d3.select("#"+d.id).style("opacity", newOpacity);
        } else {
          if(thisOne.attr("highlighted")==='true') {
            thisOne.selectAll(".highlight").remove();
            thisOne.attr("highlighted", false);
          } else {
            if(thisOne.attr("active")=='true') {
              // highlight (draw a rectangle?) the selected bugs -- have kids select which *are* possible
              thisOne
                .attr("highlighted", true)
                .append("rect")
                .attr("x",20)
                .attr("y",0)
                .attr("rx",15) 
                .attr("ry",15)
                .attr("class", "highlight")    
                .attr("width", self.rectGrid.nodeSize()[0]-30)
                .attr("height", self.rectGrid.nodeSize()[1]) 
                .style("stroke-width", 5)
                .style("stroke", "green")
                .style("opacity", .7)
                .style("fill", "none"); 
              //this.highlighted = true;
            } 
          }
        }
        //console.log("active: "+rect.active+"  newOpacity: "+newOpacity);

        if(self.button_phase) {
          // do the 1-click test for now (otherwise use ready button state)
          if(d.id===self.answer.id) {
              //.attr("xlink:href", function(d) { return img_dir_prefix+"smiley.svg"; })
            var correct = self.bugs.append("image")
              .attr("xlink:href", function(d) { return img_dir_prefix+"smiley.svg"; })
              .attr("id", "correct")
              .attr("x", screen_width/4 - 100)
              .attr("y", screen_height/2 - 100)
              .attr("height", screen_height/3)
              .attr("width", screen_height/3)
              .style("opacity", 1)
              .on(click_type, function(d) { correct.remove() });
            correct.transition().duration(1000).delay(1000).style("opacity", 1e-6);
            setTimeout(function() { exp.chooser(); }, 5000);
          } else {
            //incorrect.style("opacity", 1);
            //incorrect.transition().delay(2000).style("opacity", 1e-6);
            var incorrect = self.bugs.append("image")
              .attr("xlink:href", function(d) { return img_dir_prefix+"red_x.svg"; })
              .attr("id", "incorrect")
              .attr("x", d.x )
              .attr("y", d.y + 20)
              .attr("height", self.rectGrid.nodeSize()[0]*.8)
              .attr("width", self.rectGrid.nodeSize()[1]*.8)
              .style("opacity", 1)
              .on(click_type, function(d) { incorrect.remove(); });
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

    // turn the eyes blue so they're a bit more visible
    rect.selectAll("eyes").style("fill", "blue");

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
      height: screen_height
    }) 
    .attr("id", "sidebar");

  self.rug = self.sidebar.append("g")
    .attr("id", "rug")
    .attr("transform", "translate(10,10)")
    .append("image")
    .attr("xlink:href", function(d) { return "static/images/"+side_img+".png"; })
    .attr({
      width: .18*screen_width,
      height: .3*screen_height
    })
    .style("opacity", 1);


  // self.wiggle = function wiggle(d) {
  // move the carpet around periodically (or something entertaining)
  //   setInterval(self.wiggle(), 5000);
  // };

  self.callout = self.sidebar.append("g")
    .attr("id", "callout")
    .attr("transform", function(d) { return "translate(0,"+ .31*screen_height +")"; })

  self.callout.append("image")
    .attr("xlink:href", function(d) { return "static/images/callout.svg"; })
    .attr({
      width: .19*screen_width,
      height: 225
    })
    .style("opacity", 1);
    //.attr("transform", "translate(0,0)");

  self.text = self.callout.append("text")
    .attr("x", 15)
    .attr("y", 140)
    .attr("font-size", 35)
    .text(callout_txt);

  self.buttonbar = d3.select("#controls").append("svg")
    .attr({
      width: screen_width*.25,
      height: screen_height
    })
    .attr("id", "buttonArray")
    .append("g")
    .attr("transform", "translate(5,10)");

  var phaseButton = self.sidebar.append("g")
    .attr("id", "phaseButton")
    .attr("transform", function(d) { return "translate(0,"+ .64*screen_height +")"; })
    .on(click_type, function(){
      self.phaseChange()
      // if(condition==="automatic") then they must click click this to eliminate the irrelevant stimuli self.last_button
    });

  self.sidebar.append("text")
    .attr("x", 20)
    .attr("y", .85*screen_height)
    .attr("font-size", 20)
    .text(self.condition);

  self.phaseChange = function() {
    output(["button_press","button_phase="+self.button_phase]);
    // if they click button in eliminate phase, they're done eliminating: time for buttons/guessing
    phaseButton.select("text").remove();
    if(self.button_phase===false) { // eliminate phase
      if(self.condition==="automatic") { // automatically make translucent the ones not matching the answer feature
        d3.selectAll(".rect")
         .filter(function(d) {
           return d[self.last_button] !== self.answer[self.last_button];
         })
         .style("opacity", .2).attr("active", false);
      } else if(self.condition==="manual") {
        // making unhighlighted options translucent
        d3.selectAll("[highlighted='false']")
          .style("opacity", .2)
          .attr("active", false);
      }

      // remove the green circles (should only be necessary in manual condition)
        d3.selectAll(".highlight")
          .remove();
      // reset all to not highlighted
        d3.selectAll("[highlighted='true']")
            .attr("highlighted", false)

      self.button_phase = true;
      self.buttonbar.selectAll(".buttong").style("opacity", 1);
      // select and deactivate all the clicked exemplars (they already are--in rectGrid code)
      phaseButton.select("rect").style("fill", "green");
      self.text.remove();
      self.text = self.callout.append("text")
        .attr("x", 15)
        .attr("y", 136)
        .attr("font-size", 35)
        .text(callout_txt);
      var phaseText = phaseButton.append("text")
        .attr("x", 20)
        .attr("y", 68)
        .text("Guess!");
    } else {
      self.button_phase = false;
      phaseButton.select("rect").style("fill", "red");
      var phaseText = phaseButton.append("text")
        .attr("x", 20)
        .attr("y", 68)
        .text("Eliminate");
    }
  }

  phaseButton.append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("rx",20) 
    .attr("ry",20)
    .attr("width", .18*screen_width)
    .attr("height", 90)
    .attr("class", "pbutton")
    .attr("fill", "green");
    //.attr("transform", "translate(50,0)");
  
  var phaseText = phaseButton.append("text")
    .attr("id", "phaseText")
    .attr("x", 25)
    .attr("y", 68)
    .text("Guess!");

  self.addButtons = function(buttons) { 
    //shuffle(buttons);
    var button = self.buttonbar.selectAll(".button")
      .data(self.buttonGrid(buttons));
    button.enter().append("g")
      .attr("class", "buttong")
      .attr("transform", function(d) { return "translate(" + d.x+ "," + d.y + ")"; })
      .on(click_type, function(d){
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
      .attr("x", 7)
      .attr("y", 7)
      .attr("width", self.buttonGrid.nodeSize()[0]-14)
      .attr("height", self.buttonGrid.nodeSize()[1]-14)
      .style("opacity", 1);
      
  };

  // ToDo: make css buttons with bug parts inside -- no more PNGs
  self.addButtons(self.buttons);

  self.buttonPress = function(b) {
    output(["feature_button_press","id="+b.id,"feature="+b.feature]);
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
            .attr("x", 25)
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
