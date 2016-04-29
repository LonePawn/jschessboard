// The Square object is really just a container for holding some basic information, (it's own name), as well as 
// some knowledge of it's own state, (whether it has a piece on it, and what that piece is). This is important
// because that means that "moving" a piece is as simple as extracting the piece information from the start square
// and transplanting it onto the destination square, which is fairly analogous to the real-life operation.

var Square = function(){
return {
  name: null,
  piece: null,
  board: null,

  init: function(board, name){
    this.board = board;
    this.name  = name;
    return this;
  },

}}
