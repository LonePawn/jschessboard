// Mechanisms for interacting with the board via clicking
//

var ClickResponder = function(){
return {
  start_square: null,

  init: function(canvas_id, board){
    canvas = document.getElementById(canvas_id);
    canvas.addEventListener('click', function(e){
      x_coord = e.pageX - 8;
      y_coord = e.pageY - 8;
      file = String(board._fileByX(x_coord));
      rank = String(board._rankByY(y_coord));

      square_name = file + rank;
      
      if(this.start_square && square_name == this.start_square){
        board.draw();
      }else if(!this.start_square){
        board.draw();
        board._strokeSquare(square_name, 'yellow');
        this.start_square = square_name
      }else{
        board.movePiece(this.start_square, square_name);
        this.start_square = null;
      }
      
    }, false);
  
  }

}}
