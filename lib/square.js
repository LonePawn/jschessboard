var Square = function(){
return {
  name: null,
  rank: null,
  file: null,
  piece: null,
  board: null,

  init: function(board, name){
    this.board = board;
    this.name  = name;
    this.file  = name[0];
    this.rank  = parseInt(name[1]);
    return this;
  },

  isThreatened: function(){
    // If this square has a piece on it, whether or not any piece of the opposite color may reach it.
    if(!this.piece) return false; // A square with no piece on is 'reachable' not threatened.
  },

  reachableBy: function(){
    // List of squares containing pieces which are able to reach this square with unimpeded movement, (irrespective of the position of other pieces) 
  }

}}
