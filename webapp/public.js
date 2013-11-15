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

TournamentTimer.PublicBoard = function(parent) {
  this.mainWindow = parent;
  $(this.setup.bind(this));

};

TournamentTimer.PublicBoard.prototype.setup = function() {
  setInterval(this.tick, 100);
};

TournamentTimer.PublicBoard.prototype.tick = function() {
  $(".timer").text(localStorage.getItem("timer"));
  $(".scoreboard.top .totalPoint").text(localStorage.getItem("topCard"));
  $(".scoreboard.bottom .totalPoint").text(localStorage.getItem("bottomCard"));
  $(".scoreboard.top .penalty").text(localStorage.getItem("topBox_penalty"));
  $(".scoreboard.top .advantage").text(localStorage.getItem("topBox_advantage"));
  $(".scoreboard.bottom .penalty").text(localStorage.getItem("bottomBox_penalty"));
  $(".scoreboard.bottom .advantage").text(localStorage.getItem("bottomBox_advantage"));
};

$(function() {
  var publicScoreboard = new TournamentTimer.PublicBoard(window.opener);
  
  $(".fullscreen").click(function() {
    document.documentElement.webkitRequestFullScreen();
  });
});
