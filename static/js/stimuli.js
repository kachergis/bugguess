// set1 (old cartoon bugs)
//var features = {"f1":"body", "f2":"eyes", "f3":"antennae", "f4":"star", "f5":"triangle", "f6":"feet", "f7":"wings", "f8":"freckles", "f9":"headband"};

var bug_features = {"f1":"legs", "f2":"antennae", "f3":"bodycolor", "f4":"eyes", "f5":"markings", "f6":"dots", "f7":"fur", "f8":"water", "f9":"leaf"};
// "basebody"

var bug_buttons = [
  {id:"legs", "feature":"f1"},
  {id:"antennae", "feature":"f2"},
  {id:"bodycolor", "feature":"f3"},
  {id:"eyes", "feature":"f4"},
  {id:"markings", "feature":"f5"},
  {id:"dots", "feature":"f6"},
  {id:"fur", "feature":"f7"},
  {id:"water", "feature":"f8"},
  {id:"leaf", "feature":"f9"},
  {id:"basebody4", "feature":"#basebody4"},
  {id:"basebody10", "feature":"#basebody10"}
  ];

var bug_exemplars = [
  {"id":"A" , "f1":1 , "f2":0 , "f3":0 , "f4":1 , "f5":0 , "f6":0 , "f7":0 , "f8":0 , "f9":0, "f10":0 },
  {"id":"B" , "f1":1 , "f2":1 , "f3":0 , "f4":1 , "f5":0 , "f6":0 , "f7":0 , "f8":0 , "f9":0, "f10":0 },
  {"id":"C" , "f1":0 , "f2":1 , "f3":0 , "f4":1 , "f5":0 , "f6":0 , "f7":0 , "f8":0 , "f9":1, "f10":0 },
  {"id":"D" , "f1":0 , "f2":1 , "f3":0 , "f4":1 , "f5":0 , "f6":0 , "f7":0 , "f8":0 , "f9":0, "f10":0 },
  {"id":"E" , "f1":1 , "f2":0 , "f3":0 , "f4":0 , "f5":0 , "f6":0 , "f7":0 , "f8":0 , "f9":0, "f10":0 },
  {"id":"F" , "f1":1 , "f2":1 , "f3":0 , "f4":0 , "f5":0 , "f6":0 , "f7":0 , "f8":0 , "f9":0, "f10":0 },
  {"id":"G" , "f1":0 , "f2":1 , "f3":0 , "f4":0 , "f5":0 , "f6":0 , "f7":1 , "f8":1 , "f9":0, "f10":0 },
  {"id":"H" , "f1":0 , "f2":1 , "f3":0 , "f4":0 , "f5":0 , "f6":0 , "f7":1 , "f8":0 , "f9":0, "f10":0 },
  {"id":"I" , "f1":1 , "f2":0 , "f3":1 , "f4":0 , "f5":0 , "f6":1 , "f7":0 , "f8":0 , "f9":1, "f10":0 },
  {"id":"J" , "f1":1 , "f2":0 , "f3":1 , "f4":0 , "f5":0 , "f6":1 , "f7":0 , "f8":0 , "f9":0, "f10":0 },
  {"id":"K" , "f1":0 , "f2":0 , "f3":1 , "f4":0 , "f5":0 , "f6":0 , "f7":0 , "f8":0 , "f9":0, "f10":0 },
  {"id":"L" , "f1":0 , "f2":0 , "f3":0 , "f4":0 , "f5":0 , "f6":0 , "f7":0 , "f8":0 , "f9":0, "f10":0 },
  {"id":"M" , "f1":1 , "f2":0 , "f3":1 , "f4":0 , "f5":1 , "f6":0 , "f7":0 , "f8":1 , "f9":0, "f10":0 },
  {"id":"N" , "f1":1 , "f2":0 , "f3":1 , "f4":0 , "f5":1 , "f6":0 , "f7":0 , "f8":0 , "f9":0, "f10":0 },
  {"id":"O" , "f1":0 , "f2":0 , "f3":1 , "f4":0 , "f5":1 , "f6":0 , "f7":0 , "f8":0 , "f9":0, "f10":0 },
  {"id":"P" , "f1":0 , "f2":0 , "f3":0 , "f4":0 , "f5":1 , "f6":0 , "f7":0 , "f8":0 , "f9":0, "f10":0 },
  ];

// FOR CARTOON BUGS: varies with image set, so we need a function to return the right button set
var bug_buttons_set1 = [
  {id:"body", "feature":"f1"},
  {id:"eyes", "feature":"f2"},
  {id:"antennae", "feature":"f3"},
  {id:"star", "feature":"f4"},
  {id:"triangle", "feature":"f5"},
  {id:"feet", "feature":"f6"},
  {id:"wings", "feature":"f7"},
  {id:"freckles", "feature":"f8"},
  {id:"headband", "feature":"f9"},
  {id:"mouth", "feature":"f10"}
//  {id:"ready"}
  ];

var house_features = {"f1":"chimney","f2":"door","f3":"roof"};

var house_exemplars = [
  {"id":"A", "f1":1, "f2":0, "f3":1},
  {"id":"B", "f1":1, "f2":1, "f3":1},
  {"id":"C", "f1":0, "f2":0, "f3":0},
  {"id":"D", "f1":0, "f2":1, "f3":1}
  ];

var house_buttons = [
  {id:"chimney", "feature":"f1"},
  {id:"door", "feature":"f2"},
  {id:"roof", "feature":"f3"}
  ];
