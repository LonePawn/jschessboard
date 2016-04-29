## JSChessBoard

JSChessboard is a javascript library for creating and rendering interactive chess boards on your web site. It is written in HTML 5 and vanilla javascript. No external resources are necessary to get started -- you don't even need CSS or images.

It's worth mentioning that when we say "interactive" we mean "programatically
interactive". This is not a chess game, and out of the box, it is only possible to interact with the board via javascript method calls. The idea is that interested developers can take this library and use it as a basis for creating their own web-based chess applications. Our hope is that by providing a simple means of rendering a board and pieces, and allowing developers to easily place and move pieces around the board, we'll cut down some of the tedium and allow them to get to coding the real guts of their idea.

### Features

* Easily set up one or multiple boards with simple javascript.
* Board size and colors are configurable.
* Optionally display coordinates on the board.
* Recognizes FEN notation, allowing you to quickly and easily set up specific positions.
* Piece movement via simple method calls.

### Getting Started

The following HTML snippet provides just enough to get a chess board rendered on your page:

```html
<html>
  <head>
    <!-- You need the charset to be UTF-8 so that the pieces display properly -->
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />

    <title>JSChess Test</title>
    <!-- You don't need to include anything except the jschess.js file -->
    <script type='text/javascript' src='jschess.js'></script>
  </head>
  <body>
    <!-- Place a canvas element wherever you would like your chess board(s) to render.  Remember to give each canvas a unique ID! -->
    <canvas id='board'></canvas>
    <script type='text/javascript'>
      board   = Board().init('board');
      board.draw();
    </script>
  </body>
</html>
```

### Customization Options
The `init` method on `Board` takes a map of options which allow you to customize the display of the board and the layout of the pieces. Those options are detailed below, followed
by an example.


`light_square_color`: HTML hex code for the color you want for the light squares on the board. Defaults to #FFCE9E

`dark_square_color`: HTML hex code for the color you want for the dark squares on the board. Defaults to #D18B47

`board_width`: The size, (in pixels), that you would like to display the board in. Whatever size you choose, the squares and pieces will be scaled to fit properly. Defaults to 400px

`coordinates`: Whether or not to display algebraic coordinates on the board. Defaults to false.

`coordinate_color`: If `coordinates` is true, the color to display coordinate values in.

`white_piece_color`: HTML hex code for the color to render the white pieces in. Defaults to #FFFFFF.

`black_piece_color`: HTML hex code for the color to render the black pieces in. Defaults to #000000.

`fen`: The FEN string to use for setting up the board position. Defaults to `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`, which is the standard starting position.


#### Customization Example

The following snippet will render an 800 px chess board with coordinates displayed in red. The position on the board is a chess puzzle -- White has mate in 2.

```javascript
options = {board_width: 800, 
           coordinates: true, 
           coordinate_color: '#FF0000', 
           fen: "4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 1 0"};
board = Board().init('board', options);
board.draw();
```

### Interacting With The Board

#### Moving Pieces

Piece movement is accomplished using the (aptly named), `movePiece` method. `movePiece` takes two arguments. The first is the algebraic notation for the square currently 
occupied by the piece you want to move.  The second is the algebraic notation for the square you want to move the piece to. For instance, for the opening `1. e4`:

```javascript
board.movePiece('e2', 'e4');
```

#### Resetting the Board
It's really that simple. Another handy method is `clear`, which takes no arguments and simply resets the board to your starting FEN position:

```javascript
board.clear();
```

#### Placing Pieces 

If you can't or don't want to bother with FEN strings to set up your board, you can do so entirely programmatically with the `setPiece` method. This method takes
three arguments: the name of the piece, the color of the piece, and the square to place the piece on. Piece names follow standard algebraic notation: K, Q, N, B, R, P

```javascript
board.setPiece('K', 'white', 'e4');
board.setPiece('N', 'black', 'c6');
```
Keep in mind that after you've set your pieces, you need to call the `draw` method in order to update the visual state of the board.


### Requests and Contributions

If you're interested in the project and there's anything you'd like to see added to it, my first suggestion would be to fork this repo, make your changes and submit a pull request.
Alternatively, feel free to open up an issue, and I'll take a look when I have a chance.
