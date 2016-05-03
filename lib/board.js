// Class to render a graphical representation of a chess board.
// Methods on this class should be limited to those necessary to
// draw the squares of the board and to display an appropriate 
// graphic for pieces placed there. There should be no game or 
// rules related logic here.

var Board = function(){
return {
  light_square_color: '#FFCE9E',
  dark_square_color: '#D18B47',
  board_width: 400,
  square_width: function(){ return (this.board_width / 8 ); },
  piece_size: function(){ return (this.square_width() * .75); },
  b_canvas: null,
  coordinates: false,
  coordinate_color: '#000000',
  white_piece_color: '#FFFFFF',
  black_piece_color: '#000000',
  squares: [],
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    
  init: function(canvas_id, options){
    options               = options ? options : {};
    this.b_canvas         = document.getElementById(canvas_id);
    this.light_square_color     = options['light_square_color'] ? options['light_square_color'] : this.light_square_color;
    this.dark_square_color      = options['dark_square_color'] ? options['dark_square_color'] : this.dark_square_color;
    this.board_width      = options['board_width'] ? options['board_width'] : this.board_width;
    this.coordinates      = options['coordinates']; 
    this.coordinate_color = options['coordinate_color'] ? options['coordinate_color'] : this.coordinate_color;
    this.white_piece_color = options['white_piece_color'] ? options['white_piece_color'] : this.white_piece_color;
    this.black_piece_color = options['black_piece_color'] ? options['black_piece_color'] : this.black_piece_color;
    this.fen              = options['fen'] ? options['fen'] : this.fen;

    this.b_canvas.width  = this.board_width;
    this.b_canvas.height = this.board_width;

    this.loadSquares();
    this.setPieces();
    return this;
  },

  loadSquares: function(){
    self = this;
    square_names =                     ['a1', 'a2', 'a3', 'a4', 'a5', 'a6','a7', 'a8'];
    square_names = square_names.concat(['b1', 'b2', 'b3', 'b4', 'b5', 'b6','b7', 'b8']);
    square_names = square_names.concat(['c1', 'c2', 'c3', 'c4', 'c5', 'c6','c7', 'c8']);
    square_names = square_names.concat(['d1', 'd2', 'd3', 'd4', 'd5', 'd6','d7', 'd8']);
    square_names = square_names.concat(['e1', 'e2', 'e3', 'e4', 'e5', 'e6','e7', 'e8']);
    square_names = square_names.concat(['f1', 'f2', 'f3', 'f4', 'f5', 'f6','f7', 'f8']);
    square_names = square_names.concat(['g1', 'g2', 'g3', 'g4', 'g5', 'g6','g7', 'g8']);
    square_names = square_names.concat(['h1', 'h2', 'h3', 'h4', 'h5', 'h6','h7', 'h8']);

    square_names.forEach(function(sn, idx){
      sq =  Square().init(this, sn);
      self.squares.push(sq);
    });
  },

  // Draw the board
  draw: function(){
    this.b_canvas.width = this.b_canvas.width;
    b_context = this.b_canvas.getContext('2d');
    b_context.font = (this.square_width()/4) + "px Arial";
    
    for(p = 0; p < 8; p++){
      for(i = 0; i < 8; i++){
        if(i % 2 == 0){
          b_context.fillStyle =  p % 2 == 0 ? this.light_square_color : this.dark_square_color;
        }else{
          b_context.fillStyle = p % 2 == 0 ? this.dark_square_color : this.light_square_color;
        }
        b_context.fillRect((this.square_width() * i), (this.square_width() * p), this.square_width(), this.square_width());
        
        if(i == 0 && this.coordinates == true){ // Rank Numbers
          b_context.font      = (this.square_width()/4) + "pt Arial";
          b_context.fillStyle = this.coordinate_color;
          rank_number         = (8 - p);
          x_pos               = 1;
          y_pos               = p * this.square_width() + this.square_width();
          b_context.fillText(rank_number, x_pos, y_pos);
        } 

        if(p == 0 && this.coordinates == true){ // File letters
          file_letters        = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
          b_context.font      = (this.square_width()/4) + "pt Arial";
          b_context.fillStyle = this.coordinate_color;
          file_letter         = file_letters[i];
          y_pos               = this.board_width * .030;
          x_pos               = i * this.square_width();

          b_context.fillText(file_letter, x_pos, y_pos);
        }
      }
    }
    this.renderPieces();
  },

  renderPieces: function(){
    self = this;
    this.squares.forEach(function(sq){
      if(sq.piece){
        color = sq.piece.color == 'white' ? self.white_piece_color : self.black_piece_color;
        self._drawPiece(sq.piece.glyph(), color, sq.name);
      } 
    });
  },

  // Place a piece glyph on the indicated square
  _drawPiece: function(glyph, color, squareName){
    b_context = this.b_canvas.getContext('2d');
    b_context.font      = this.piece_size() + "pt Arial";
    b_context.fillStyle = color,
    coordinates         = this._centerOfSquare(squareName);
    x_pos               = coordinates[0];
    y_pos               = coordinates[1];
    b_context.fillText(glyph, x_pos, y_pos);
  },

 setPieces: function(){
   self        = this;
   files       = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

   segments = this.fen.split(' ');
   piece_placement = segments[0];

   rank_by_rank = piece_placement.split('/');

   rank_by_rank.forEach(function(pieceString, idx){
    idx_to_rank = {0: 8, 1: 7, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1 };
    rank        = idx_to_rank[idx];
    pieceList   = pieceString.split('');

    var sidx  = 0;
    pieceList.forEach(function(piece){
      if(piece.match(/[kqnbrpKQNBRP]/)){
        // If we have a letter, put the indicated piece in the corresponding square.
        square_name = files[sidx] + rank;

        square      = self.squares.find(function(sq){ return sq.name == square_name});
        color       = piece.toLowerCase() == piece ? 'black' : 'white';
        name        = piece.toUpperCase();

        square.piece = Piece().init(name, color);
        sidx += 1;
      }else{
        // If we get back a number instead, that essentially means that there's nothing in the next N squares. We need to advance sidx by that amount 
        sidx += parseInt(piece);
      }

    });
   });
 
 },
 
  clear: function(){
    this.squares.forEach(function(sq){
      sq.piece = null; 
    });
    this.setPieces();
    this.draw();
  },

  movePiece: function(start_square_name, destination_square_name){
    start_square       = this.squares.find(function(sq){ return sq.name == start_square_name});
    destination_square = this.squares.find(function(sq){ return sq.name == destination_square_name});
    destination_square.piece = start_square.piece;
    start_square.piece = null;
    this.draw();
  },

  setPiece: function(piece_name, color, square_name){
    piece  = Piece().init(piece_name, color);
    square = this.squares.find(function(sq){ return sq.name == square_name  });
    square.piece = piece;
  },

  showMovesFor: function(origin_square_name){
    self   = this;
    square = this.squares.find(function(sq){ return sq.name == origin_square_name });
    piece  = square.piece;
    if(!piece) return false;
    availableMoves = piece.destinationSquares(origin_square_name);
    availableMoves.forEach(function(square_name){
      self._strokeSquare(square_name, 'green');
    });
  },

  _strokeSquare(square_name, stroke_color){
    coordinates = this._centerOfSquare(square_name); 
    x           = coordinates[0] + 1.65;
    y           = (coordinates[1] + (this.square_width() * 0.025)) -  (this.square_width() * .74);
    b_context   = this.b_canvas.getContext('2d');
    box_width   = this.square_width() - (this.square_width() * 0.0275);

    b_context.strokeStyle = stroke_color;
    b_context.lineWidth   = 2;
    b_context.strokeRect(x, y, box_width, box_width);
  },


 _centerOfSquare(squareName){
  file         = squareName[0];
  rank         = parseInt(squareName[1]);
  file_letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  rank_indices = {1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1};
 
  h_center_line   = this.square_width() * file_letters.indexOf(file);
  v_center_line   = (this.square_width() * rank_indices[rank]) - (this.piece_size()/2.75);

  return [h_center_line, v_center_line];
 }





}}
