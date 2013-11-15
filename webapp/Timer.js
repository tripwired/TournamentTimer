//Setup TournamentTimer Object
if(typeof window.TournamentTimer === "undefined"){ window.TournamentTimer = {}; }


Function.prototype.bind = function() {
  var __method = this, args = Array.prototype.slice.call(arguments), object = args.shift();
  return function() {
    var local_args = args.concat(Array.prototype.slice.call(arguments));
    if (this !== window) local_args.push(this);
    return __method.apply(object, local_args);
  };
};
//Timer Function -------------------------------------------------
//Provides 1 second signaling to specified function
//Has start stop functionality as well as
//a signal function to add functions that should be 
//signaled every second.
TournamentTimer.Timer = function() {
  this.running = false;
  this.signals = [];

  $(this.setup.bind(this));
};

TournamentTimer.Timer.prototype.setup = function() {
  this.signal.bind(this);
  this.tick.bind(this);
  this.start.bind(this);
  this.stop.bind(this);
};

TournamentTimer.Timer.prototype.start = function() {
  var tick = this.tick.bind(this);
  
  if(!this.running) {
    this.running = true;
    this.clock = setInterval(tick, 1000);
  }
};

TournamentTimer.Timer.prototype.stop = function() {
  if(this.running) {
    this.running = false;
    clearInterval(this.clock);
  }
};

TournamentTimer.Timer.prototype.tick = function() {
  var i = 0,
      max = this.signals.length;

  for(; i < max; i += 1){
    this.signals[i]();
  }
};

TournamentTimer.Timer.prototype.signal = function(fn) {
  this.signals.push(fn);
};




//CLOCK Object ----------------------------------------------------
TournamentTimer.Clock = function(view) {
  this.view = view;
  this.currentSeconds = 0;
  this.timerLength = 0;
  this.timer = new TournamentTimer.Timer();
  $(this.setup.bind(this));
};

TournamentTimer.Clock.prototype.setup = function() {
  $(this.view.addSecond).click(this.addSecond.bind(this));
  $(this.view.subtractSecond).click(this.subtractSecond.bind(this));
  $(this.view.addMinute).click(this.addMinute.bind(this));
  $(this.view.subtractMinute).click(this.subtractMinute.bind(this));
  $(this.view.start).click(this.start.bind(this));
  $(this.view.stop).click(this.stop.bind(this));
  $(this.view.restart).click(this.restart.bind(this));

  this.timer.signal(this.tick.bind(this));
  this.update();
};

TournamentTimer.Clock.prototype.addSecond = function() {
  this.timerLength += 1;
  this.currentSeconds = this.timerLength;
  this.update();
};

TournamentTimer.Clock.prototype.subtractSecond = function() {
  if(this.timerLength > 0) {
    this.timerLength -= 1;
    this.currentSeconds = this.timerLength;
  }
  this.update();
};

TournamentTimer.Clock.prototype.addMinute = function() {
  this.timerLength += 60;
  this.currentSeconds = this.timerLength;
  this.update();
};

TournamentTimer.Clock.prototype.subtractMinute = function() {
  if(this.timerLength > 0) {
    this.timerLength -= 60;
    this.currentSeconds = this.timerLength;
  }
  this.update();
};

TournamentTimer.Clock.prototype.start = function() {
  this.timer.start();
};

TournamentTimer.Clock.prototype.stop = function() {
  this.timer.stop();
};

TournamentTimer.Clock.prototype.restart = function() {
  this.stop();
  this.currentSeconds = this.timerLength;
  this.update();
};

TournamentTimer.Clock.prototype.reset = function() {
  this.restart();
};

TournamentTimer.Clock.prototype.update = function() {
  var seconds = this.currentSeconds,
      minutes = 0,
      timerStr;

  minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  
  timerStr = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
 
  $(this.view.timer).text(timerStr);
  localStorage.setItem("timer", timerStr);
};

TournamentTimer.Clock.prototype.tick = function() {
  if(this.currentSeconds > 0) {
    this.currentSeconds -= 1;
  } else {
    this.stop();
    this.reset();
  }
  this.update();
};



//ScoreCard------------------------------------------------------
TournamentTimer.ScoreCard = function(key,view) {
  this.key = key;
  this.view = view;
  this.fourPoints = 0;
  this.threePoints = 0;
  this.twoPoints = 0;
  this.totalPoints = 0;
  this.listeners = [];

  $(this.setup.bind(this));
};

TournamentTimer.ScoreCard.prototype.setup = function () {
  this.updatePoint.bind(this);
  this.onPoint.bind(this);

  $(this.view.four.add).click(this.addFour.bind(this));
  $(this.view.four.subtract).click(this.subtractFour.bind(this));
  $(this.view.three.add).click(this.addThree.bind(this));
  $(this.view.three.subtract).click(this.subtractThree.bind(this));
  $(this.view.two.add).click(this.addTwo.bind(this));
  $(this.view.two.subtract).click(this.subtractTwo.bind(this));
  this.updatePoint();
};

TournamentTimer.ScoreCard.prototype.addFour = function() {
  this.fourPoints += 1;
  $(this.view.four.value).text(this.pad(this.fourPoints));
  this.updatePoint();
};

TournamentTimer.ScoreCard.prototype.subtractFour = function() {
  if(this.fourPoints > 0) {
    this.fourPoints -= 1;
  }
  
  $(this.view.four.value).text(this.pad(this.fourPoints));
  this.updatePoint();
};

TournamentTimer.ScoreCard.prototype.addThree = function() {
  this.threePoints += 1;
  $(this.view.three.value).text(this.pad(this.threePoints));
  this.updatePoint();
};

TournamentTimer.ScoreCard.prototype.subtractThree = function() {
  if(this.threePoints > 0) {
    this.threePoints -= 1;
  }

  $(this.view.three.value).text(this.pad(this.threePoints));
  this.updatePoint();
};

TournamentTimer.ScoreCard.prototype.addTwo = function() {
  this.twoPoints += 1;
  $(this.view.two.value).text(this.pad(this.twoPoints));
  this.updatePoint();
};

TournamentTimer.ScoreCard.prototype.subtractTwo = function() {
  if(this.twoPoints > 0) {
    this.twoPoints -= 1;
  }

  $(this.view.two.value).text(this.pad(this.twoPoints));
  this.updatePoint();
};

TournamentTimer.ScoreCard.prototype.pad = function(val) {
  if(val < 10) {
    return "0" + val;
  } else {
    return val;
  }
};

TournamentTimer.ScoreCard.prototype.updatePoint = function() {
  var i = 0,
      max = this.listeners.length,
      total = (this.fourPoints * 4) + (this.threePoints * 3) + (this.twoPoints * 2);

  $(this.view.total).text(this.pad(total));
  
  localStorage.setItem(this.key, this.pad(total));
  
  for(; i < max; i += 1) {
    this.listeners[i](total);
  }
};

TournamentTimer.ScoreCard.prototype.reset = function() {
  this.fourPoints = 0;
  this.threePoints = 0;
  this.twoPoints = 0;
  this.totalPoints = 0;

  $(this.view.two.value).text(this.pad(this.twoPoints));
  $(this.view.three.value).text(this.pad(this.threePoints));
  $(this.view.four.value).text(this.pad(this.fourPoints));
  this.updatePoint();
};

TournamentTimer.ScoreCard.prototype.onPoint = function(fn) {
  this.listeners.push(fn);
};



TournamentTimer.Pointbox = function(key,data) {
  this.key = key;
  this.penaltyBox = $(data.penaltyBox);
  this.penaltyAdd = $(data.penaltyAdd);
  this.penaltySubtract = $(data.penaltySubtract);
  this.advantageBox = $(data.advantageBox);
  this.advantageAdd = $(data.advantageAdd);
  this.advantageSubtract = $(data.advantageSubtract);
  this.penalty = 0;
  this.advantage = 0;

  this.penaltyAdd.click(this.penaltyAddPoint.bind(this));
  this.penaltySubtract.click(this.penaltySubtractPoint.bind(this));
  this.advantageAdd.click(this.advantageAddPoint.bind(this));
  this.advantageSubtract.click(this.advantageSubtractPoint.bind(this));
  this.updateView();
};

TournamentTimer.Pointbox.prototype.advantageAddPoint = function() {
  this.advantage += 1;
  this.updateView();
};

TournamentTimer.Pointbox.prototype.advantageSubtractPoint = function() {
  if(this.advantage > 0) {
    this.advantage -= 1;
  }

  this.updateView();
};

TournamentTimer.Pointbox.prototype.penaltyAddPoint = function() {
  this.penalty += 1;
  this.updateView();
};

TournamentTimer.Pointbox.prototype.penaltySubtractPoint = function() {
  if(this.penalty > 0) {
    this.penalty -= 1;
  }

  this.updateView();
};

TournamentTimer.Pointbox.prototype.reset = function() {
  this.penalty = 0;
  this.advantage = 0;
  this.updateView();
};

TournamentTimer.Pointbox.prototype.pad = function(val) {
  if(val < 10) {
    return "0" + val;
  } else {
    return val;
  }
};

TournamentTimer.Pointbox.prototype.updateView = function() {
  $(this.penaltyBox).text(this.pad(this.penalty));
  $(this.advantageBox).text(this.pad(this.advantage));
  var penaltyKey = this.key + "_penalty",
      advantageKey = this.key + "_advantage";
  localStorage.setItem(penaltyKey, this.pad(this.penalty));
  localStorage.setItem(advantageKey, this.pad(this.advantage));
};


$().ready(function(){

  var myTimer = new TournamentTimer.Clock({
    timer: $(".timer"),
    addMinute: $(".addMinute"),
    subtractMinute: $(".subtractMinute"),
    addSecond: $(".addSecond"),
    subtractSecond: $(".subtractSecond"),
    start: $(".startTimer"),
    stop: $(".stopTimer"),
    restart: $(".restartTimer")
  });

  var topPointBox = new TournamentTimer.Pointbox("topBox",{
    penaltyBox: $(".scoreboard.top .points .penalty"),
    penaltyAdd: $(".scoreboard.top .buttons .penalty .add"),
    penaltySubtract: $(".scoreboard.top .buttons .penalty .subtract"),
    advantageBox: $(".scoreboard.top .points .advantage"),
    advantageAdd: $(".scoreboard.top .buttons .advantage .add"),
    advantageSubtract: $(".scoreboard.top .buttons .advantage .subtract")
  });

  var bottomPointBox = new TournamentTimer.Pointbox("bottomBox",{
    penaltyBox: $(".scoreboard.bottom .points .penalty"),
    penaltyAdd: $(".scoreboard.bottom .buttons .penalty .add"),
    penaltySubtract: $(".scoreboard.bottom .buttons .penalty .subtract"),
    advantageBox: $(".scoreboard.bottom .points .advantage"),
    advantageAdd: $(".scoreboard.bottom .buttons .advantage .add"),
    advantageSubtract: $(".scoreboard.bottom .buttons .advantage .subtract")
  });

  var topCard = new TournamentTimer.ScoreCard("topCard",{
    four: {
      value: $(".top .four .value"),
      add: $(".top .four .add"),
      subtract: $(".top .four .subtract")
    },
    three: {
      value: $(".top .three .value"),
      add: $(".top .three .add"),
      subtract: $(".top .three .subtract")
    },
    two: {
      value: $(".top .two .value"),
      add: $(".top .two .add"),
      subtract: $(".top .two .subtract")
    },
    total: $(".scoreboard.top .totalPoint")
  });

  var bottomCard = new TournamentTimer.ScoreCard("bottomCard",{
    four: {
      value: $(".bottom .four .value"),
      add: $(".bottom .four .add"),
      subtract: $(".bottom .four .subtract")
    },
    three: {
      value: $(".bottom .three .value"),
      add: $(".bottom .three .add"),
      subtract: $(".bottom .three .subtract")
    },
    two: {
      value: $(".bottom .two .value"),
      add: $(".bottom .two .add"),
      subtract: $(".bottom .two .subtract")
    },
    total: $(".scoreboard.bottom .totalPoint")
  });

  $(".reset").click(function() {
    myTimer.reset();
    topPointBox.reset();
    bottomPointBox.reset();
    topCard.reset();
    bottomCard.reset();
  });

  $(".publicview").click(function() {
    var publicWindow = window.open('public.html', '', "location=1,status=1,scrollbars=1,width=800,height=600");
    if(publicWindow.opener === null) {
      publicWindow.opener = window;
    }
  });
  $(".fullscreen").click(function() {
    document.documentElement.webkitRequestFullScreen();
  });
});

