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
