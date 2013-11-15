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

TournamentTimer.Clock.prototype.update = function() {
  var seconds = this.currentSeconds,
      minutes = 0,
      timerStr;

  minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  
  timerStr = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
 
  $(this.view.timer).html(timerStr);

};

TournamentTimer.Clock.prototype.tick = function() {
  if(this.currentSeconds >= 0) {
    this.currentSeconds -= 1;
  } else {
    this.stop();
  }
  this.update();
};