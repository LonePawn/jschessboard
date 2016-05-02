// The Piece object maintains a few vital pieces of information...the name of the piece, it's color,
// and based upon those data points, the appropriate glyph to render for the piece. In addition, given
// the name of a particular starting square, the Piece object is able to determine the list of squares
// to which that piece may "naturally" move in a single turn. That is, all of the squares that are 
// available to it assuming standard rules and an otherwise empty board. A slight exception is made 
// for pawns. A pawn piece will always have it's "capture" squares returned in the list, even if those 
// squares are empty, (and therefore not eligible for capture by a pawn). This is because whether or not a 
// pawn may move to it's capture squares, (including an en passant square), is determined by the state of 
// other pieces on the board at the time, which the Piece object is not, (and should not), be privy to.

var Piece = function(){
return {
  name: '',
  color: '',
  _fileToIndex: {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 },
  _indexToFile: {1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h'},

  init: function(name, color){
    this.name = name;
    this.color = color;
    return this;
  },

  //glyph: function(){
    //switch(this.name){
      //case 'K': 
        //return this.color == 'white' ? '\u2654' : '\u265A'
      //break;
      //case 'Q':
        //return this.color == 'white' ? '\u2655' : '\u265B'
      //break;
      //case 'B':
        //return this.color == 'white' ? '\u2657' : '\u265D'
      //break;
      //case 'N':
        //return this.color == 'white' ? '\u2658' : '\u265E'
      //break;
      //case 'R':
        //return this.color == 'white' ? '\u2656' : '\u265C'
      //break;
      //case 'P':
        //return this.color == 'white' ? '\u2659' : '\u265F'
      //break;
    //} 
  //},

  glyph: function(){
    switch(this.name){
      case 'K': 
        return '\u265A';
      break;
      case 'Q':
        return '\u265B';
      break;
      case 'B':
        return '\u265D';
      break;
      case 'N':
        return '\u265E';
      break;
      case 'R':
        return '\u265C';
      break;
      case 'P':
        return '\u265F';
      break;
    } 
  },

  _nextRank: function(current_rank){
    if(!current_rank) return null;
    return (current_rank + 1 <= 8) ? (current_rank + 1) : null;
  },

  _previousRank: function(current_rank){
    if(!current_rank) return null;
    return (current_rank - 1 >= 1) ? (current_rank - 1) : null;
  },

  _nextFile: function(current_file){
    if(!current_file) return null;
    file_index = this._fileToIndex[current_file]
    return (file_index + 1 <= 8) ? (this._indexToFile[(file_index + 1)]) : null;
  },

  _previousFile: function(current_file){
    if(!current_file) return null;
    file_index = this._fileToIndex[current_file]
    return (file_index - 1 >= 1) ? (this._indexToFile[(file_index - 1)]) : null;
  },

  destinationSquares: function(start_square){
    // Determine what squares this piece may move to assuming unimpeded movement, 
    // and given the start_square provided. Note that this method does not check the
    // legality of the move vis a vis other _pieces_ on the board. That should be handled 
    // externally by some object with knowledge of the state of the board and any conditions
    // imposed by the rules.
    
    file    = start_square[0];
    rank    = parseInt(start_square[1]);
    squares = [];

    switch(this.name){
      case 'K': 
        if(this._nextRank(rank)){ // One up
          squares.push(file + this._nextRank(rank));
        }

        if(this._previousRank(rank)){ // One back
          squares.push(file + this._previousRank(rank));
        }

        if(this._nextFile(file)){ // One right
          squares.push(this._nextFile(file) + rank);
        }

        if(this._previousFile(file)){ // One left
          squares.push(this._previousFile(file) + rank);
        }

        if(this._nextFile(file) && this._nextRank(rank)){ // Diagonal up right
          squares.push(this._nextFile(file) + this._nextRank(rank));
        }

        if(this._previousFile(file) && this._nextRank(rank)){ // Diagonal up left
          squares.push(this._previousFile(file) + this._nextRank(rank));
        }

        if(this._nextFile(file) && this._previousRank(rank)){ // Diagonal down right
          squares.push(this._nextFile(file) + this._previousRank(rank));
        }

        if(this._previousFile(file) && this._previousRank(rank)){ // Diagonal down left
          squares.push(this._previousFile(file) + this._previousRank(rank));
        }

        // Conditional Castling Squares, (color dependent)
        // Note that this doesn't take into account the legality of a castling move based upon castling through/out of check, castling after moving the king previously, etc.
        // As with every other "allowed" move here, it only considers the position of _this piece_ on the board.
        if(this.color == 'white'){
          console.log(rank);
          console.log(file);
          if(rank == 1 && file == 'e'){
            squares.push('g1');
            squares.push('c1');
          }
        }else{
          if(rank == 8 && file == 'e'){
            squares.push('g8');
            squares.push('c8');
          }
        
        }
      break;
      case 'Q':
        // Another way to think of the queen is as the 'iterative king'...same move profile, but continue
        // adding to her squares until you run out of them in each direction.
        
        if(this._nextRank(rank)){ // Upward
          next_rank = this._nextRank(rank);
          while(next_rank){
            squares.push(file + next_rank);
            next_rank = this._nextRank(next_rank);
          }
        }

        if(this._previousRank(rank)){ // Backwards
          prev_rank = this._previousRank(rank);
          while(prev_rank){
            squares.push(file + prev_rank);
            prev_rank = this._previousRank(prev_rank);
          }
        }

        if(this._nextFile(file)){ // Rightwards
          next_file = this._nextFile(file);
          while(next_file){
            squares.push(next_file + rank) ;
            next_file = this._nextFile(next_file);
          }
        }

        if(this._previousFile(file)){ // Leftwards
          prev_file = this._previousFile(file);
          while(prev_file){
            squares.push(prev_file + rank) ;
            prev_file = this._previousFile(prev_file);
          }
        }

        if(this._nextFile(file) && this._nextRank(rank)){ // Diagonal up right
          next_file = this._nextFile(file);
          next_rank = this._nextRank(rank);
          while(next_file && next_rank){
            squares.push(next_file + next_rank);
            next_file = this._nextFile(next_file);
            next_rank = this._nextRank(next_rank);
          }
        }

        if(this._previousFile(file) && this._nextRank(rank)){ // Diagonal up left
          prev_file = this._previousFile(file);
          next_rank = this._nextRank(rank);
          while(prev_file && next_rank){
            squares.push(prev_file + next_rank);
            prev_file = this._previousFile(prev_file);
            next_rank = this._nextRank(next_rank);
          }
        }

        if(this._previousFile(file) && this._nextRank(rank)){ // Diagonal down right
          next_file = this._nextFile(file);
          prev_rank = this._previousRank(rank);
          while(next_file && prev_rank){
            squares.push(next_file + prev_rank);
            next_file = this._nextFile(next_file);
            prev_rank = this._previousRank(prev_rank);
          }
        }

        if(this._previousFile(file) && this._nextRank(rank)){ // Diagonal down left
          prev_file = this._previousFile(file);
          prev_rank = this._previousRank(rank);
          while(prev_file && prev_rank){
            squares.push(prev_file + prev_rank);
            prev_file = this._previousFile(prev_file);
            prev_rank = this._previousRank(prev_rank);
          }
        }

      break;
      case 'B':
        // Same move profile as the Queen, but without the straights
        if(this._nextFile(file) && this._nextRank(rank)){ // Diagonal up right
          next_file = this._nextFile(file);
          next_rank = this._nextRank(rank);
          while(next_file && next_rank){
            squares.push(next_file + next_rank);
            next_file = this._nextFile(next_file);
            next_rank = this._nextRank(next_rank);
          }
        }

        if(this._previousFile(file) && this._nextRank(rank)){ // Diagonal up left
          prev_file = this._previousFile(file);
          next_rank = this._nextRank(rank);
          while(prev_file && next_rank){
            squares.push(prev_file + next_rank);
            prev_file = this._previousFile(prev_file);
            next_rank = this._nextRank(next_rank);
          }
        }

        if(this._previousFile(file) && this._nextRank(rank)){ // Diagonal down right
          next_file = this._nextFile(file);
          prev_rank = this._previousRank(rank);
          while(next_file && prev_rank){
            squares.push(next_file + prev_rank);
            next_file = this._nextFile(next_file);
            prev_rank = this._previousRank(prev_rank);
          }
        }

        if(this._previousFile(file) && this._nextRank(rank)){ // Diagonal down left
          prev_file = this._previousFile(file);
          prev_rank = this._previousRank(rank);
          while(prev_file && prev_rank){
            squares.push(prev_file + prev_rank);
            prev_file = this._previousFile(prev_file);
            prev_rank = this._previousRank(prev_rank);
          }
        }
      break;
      case 'N':
        if(this._nextRank(rank) && this._nextFile(this._nextFile(file))){// 1 up, 2 right
          squares.push(this._nextFile(this._nextFile(file)) + this._nextRank(rank));
        }

        if(this._nextRank(rank) && this._previousFile(this._previousFile(file))){// 1 up, 2 left
          squares.push(this._previousFile(this._previousFile(file)) + this._nextRank(rank));
        }

        if(this._nextRank(this._nextRank(rank)) && this._nextFile(file)){// 2 up, 1 right
          squares.push(this._nextFile(file) + this._nextRank(this._nextRank(rank)));
        }

        if(this._nextRank(this._nextRank(rank)) && this._previousFile(file)){// 2 up, 1 left
          squares.push(this._previousFile(file) + this._nextRank(this._nextRank(rank)));
        }

        if(this._previousRank(rank) && this._nextFile(this._nextFile(file))){// 1 down, 2 right
          squares.push(this._nextFile(this._nextFile(file)) + this._previousRank(rank));
        }

        if(this._previousRank(rank) && this._previousFile(this._previousFile(file))){// 1 down, 2 left
          squares.push(this._previousFile(this._previousFile(file)) + this._previousRank(rank));
        }

        if(this._previousRank(this._previousRank(rank)) && this._nextFile(file)){// 2 down, 1 right
          squares.push(this._nextFile(file) + this._previousRank(this._previousRank(rank)));
        }

        if(this._previousRank(this._previousRank(rank)) && this._previousFile(file)){// 2 down, 1 left
          squares.push(this._previousFile(file) + this._previousRank(this._previousRank(rank)));
        }

      break;
      case 'R':
        // Identical to the Queen except lacking in diagonals
        if(this._nextRank(rank)){ // Upward
          next_rank = this._nextRank(rank);
          while(next_rank){
            squares.push(file + next_rank);
            next_rank = this._nextRank(next_rank);
          }
        }

        if(this._previousRank(rank)){ // Backwards
          prev_rank = this._previousRank(rank);
          while(prev_rank){
            squares.push(file + prev_rank);
            prev_rank = this._previousRank(prev_rank);
          }
        }

        if(this._nextFile(file)){ // Rightwards
          next_file = this._nextFile(file);
          while(next_file){
            squares.push(next_file + rank) ;
            next_file = this._nextFile(next_file);
          }
        }

        if(this._previousFile(file)){ // Leftwards
          previous_file = this._previousFile(file);
          while(previous_file){
            squares.push(previous_file + rank) ;
            previous_file = this._previousFile(previous_file);
          }
        }
      break;
      case 'P':
        // The pawn can only move "forward" from it's own perspective, so this is the only piece we care about color for.
        // We also care about board position in the sense that if they are on their 'start rank', we offer them 2 squares
        // of forward advancement. Otherwise, pawns get 1 square ahead, including diagonals, (for capture situations)
        
        if(this.color == 'white'){

          if(this._nextRank(rank)){
            squares.push(file + this._nextRank(rank));
          }

          if(rank == 2){ // If we're on the second rank, we're allowed an extra forward square
            squares.push(file + this._nextRank(this._nextRank(rank)));
          }

          if(this._nextFile(file) && this._nextRank(rank)){ // Right side capture
            squares.push(this._nextFile(file) + this._nextRank(rank));
          }

          if(this._previousFile(file) && this._nextRank(rank)){ // Left side capture
            squares.push(this._previousFile(file) + this._nextRank(rank));
          }
        
        }else{

          if(this._previousRank(rank)){
            squares.push(file + this._previousRank(rank));
          }

          if(rank == 7){ // If we're on the seventh rank, we're allowed an extra forward square
            squares.push(file + this._previousRank(this._previousRank(rank)));
          }

          if(this._previousFile(file) && this._previousRank(rank)){ // Left side capture
            squares.push(this._previousFile(file) + this._previousRank(rank));
          }

          if(this._nextFile(file) && this._previousRank(rank)){ // Right side capture
            squares.push(this._nextFile(file) + this._previousRank(rank));
          }
        }
      break;
    } 
    return squares;
  }

}}

// The Square object is really just a container for holding some basic information, (it's own name), as well as 
// some knowledge of it's own state, (whether it has a piece on it, and what that piece is). This is important
// because that means that "moving" a piece is as simple as extracting the piece information from the start square
// and transplanting it onto the destination square, which is fairly analogous to the real-life operation.

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

}}

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
