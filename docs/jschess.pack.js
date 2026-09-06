/* vim:set filetype=javascript:*/
/*jsl:import BoardPiece.js*/
/*jsl:import BoardPosition.js*/
/*jsl:import PieceColor.js*/
/*jsl:import PieceType.js*/
/*jsl:import PiecePosition.js*/


/**
  @class Represents a full board This is the main class to interact with.
  Using this class you can: 1. Use pieces: put, remove and move them.
  2. Do something with all pieces.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var Board = Class.create(/** @lends Board.prototype */{
  /**
    creates a new instance
    @this {Board}
    @return {Board} the new object created.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function() {
    var i, j, ar;
    // create 8x8 undefined squares
    this.bd = [];
    for (i = 0; i < 8; i++) {
      ar = [];
      for (j = 0; j < 8; j++) {
        ar.push(undefined);
      }
      this.bd.push(ar);
    }
    this.pieces = [];
    // callbacks
    this.preAddCB = [];
    this.postAddCB = [];
    this.preRemoveCB = [];
    this.postRemoveCB = [];
    this.preMoveCB = [];
    this.postMoveCB = [];
  },
  /**
    toString method that allows you to get a nice printout for this type
    @this {Board}
    @return {string} string representation of this object.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    var i, j;
    var str = '';
    for (i = 0; i < 8; i++) {
      for (j = 0; j < 8; j++) {
        str += this.bd[i][j];
      }
      str += '\n';
    }
    return str;
  },
  /**
    Check that no piece is at a certain position.
    Will throw an exception if that is not the case.
    @this {Board}
    @param {PiecePosition} piecePosition position to check that no piece is at.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  checkNoPieceAt: function(piecePosition) {
    if (this.bd[piecePosition.x][piecePosition.y] !== undefined) {
      throw 'already have piece at position ' + piecePosition.toString();
    }
  },
  /**
    Check that piece is at a certain position.
    Will throw an exception if that is not the case.
    @this {Board}
    @param {PiecePosition} piecePosition position to check that a piece is at.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  checkPieceAt: function(piecePosition) {
    if (this.bd[piecePosition.x][piecePosition.y] === undefined) {
      throw 'dont have piece at position ' + piecePosition.toString();
    }
  },
  /**
    Check that a certain piece is at a certain position.
    Will throw an exception if that is not the case.
    @this {Board}
    @param {BoardPiece} boardPiece the piece in question.
    @param {PiecePosition} piecePosition position to check that a piece is at.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  checkBoardPieceAt: function(boardPiece, piecePosition) {
    if (this.bd[piecePosition.x][piecePosition.y] !== boardPiece) {
      throw 'wrong piece at position ' + piecePosition.toString();
    }
  },
  /**
    Add a piece to the position
    @this {Board}
    @param {BoardPiece} boardPiece piece to add.
    @param {PiecePosition} piecePosition where to add the piece.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  addPiece: function(boardPiece, piecePosition) {
    this.preAddCB.forEach(function(f) {
      f(boardPiece, piecePosition);
    });
    this.checkNoPieceAt(piecePosition);
    this.bd[piecePosition.x][piecePosition.y] = boardPiece;
    this.postAddCB.forEach(function(f) {
      f(boardPiece, piecePosition);
    });
  },
  /**
    Remove a piece
    @this {Board}
    @param {BoardPiece} boardPiece piece to remove.
    @param {PiecePosition} piecePosition the position to remove it from.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  removePiece: function(boardPiece, piecePosition) {
    this.checkBoardPieceAt(boardPiece, piecePosition);
    this.preRemoveCB.forEach(function(f) {
      f(boardPiece, piecePosition);
    });
    this.bd[piecePosition.x][piecePosition.y] = undefined;
    this.postRemoveCB.forEach(function(f) {
      f(boardPiece, piecePosition);
    });
  },
  /**
    Move a piece
    @this {Board}
    @param {BoardPiece} boardPiece piece to move.
    @param {PiecePosition} fromPiecePosition from where to move the piece.
    @param {PiecePosition} toPiecePosition to where to move the piece.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  movePiece: function(boardPiece, fromPiecePosition, toPiecePosition) {
    this.checkPieceAt(fromPiecePosition);
    this.checkNoPieceAt(toPiecePosition);
    this.preMoveCB.forEach(function(f) {
      f(boardPiece, fromPiecePosition, toPiecePosition);
    });
    this.bd[fromPiecePosition.x][fromPiecePosition.y] = undefined;
    this.bd[toPiecePosition.x][toPiecePosition.y] = boardPiece;
    this.postMoveCB.forEach(function(f) {
      f(boardPiece, fromPiecePosition, toPiecePosition);
    });
  },
  /**
    Clear the board
    @this {Board}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  clearPieces: function() {
    var that = this;
    this.forEachPiece(function(boardPiece, piecePosition) {
      that.removePiece(boardPiece, piecePosition); });
  },
  /**
    Add a piece to the position (seperate pieces of data).
    @this {Board}
    @param {string} color color of the piece (black/white).
    @param {string} type type of the piece (rook/knight/bishop/queen/king/pawn).
    @param {number} x x location of the piece [0..8).
    @param {number} y y location of the piece [0..8).
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  addPieceVals: function(color, type , x, y) {
    var boardPiece = new BoardPiece(
        new PieceColor(color),
        new PieceType(type));
    this.addPiece(boardPiece, new PiecePosition(x, y));
  },
  /**
    Run a function for each piece in this position
    @this {Board}
    @param {function()} f function to be called back for each piece.
    This function should receive the piece to work on.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  forEachPiece: function(f) {
    var i, j;
    for (i = 0; i < 8; i++) {
      for (j = 0; j < 8; j++) {
        if (this.bd[i][j] !== undefined) {
          f(this.bd[i][j], new PiecePosition(i, j));
        }
      }
    }
  },
  /**
    Get a piece at a specific position
    @this {Board}
    @param {PiecePosition} piecePosition position to get the piece at.
    @return {BoardPiece} the piece at the specified position.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  getPieceAtPosition: function(piecePosition) {
    this.checkPieceAt(piecePosition);
    return this.bd[piecePosition.x][piecePosition.y];
  },
  /**
    Get a piece at a specific position (in parts)
    @this {Board}
    @param {number} x x position to get piece at [0..8).
    @param {number} y y position to get piece at [0..8).
    @return {BoardPiece} the piece at the specified position.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  getPieceAtPositionVals: function(x, y) {
    return this.getPieceAtPosition(new PiecePosition(x, y));
  },
  /**
    Do we have a piece in a specific position?
    @this {Board}
    @param {PiecePosition} piecePosition position to check for a piece at.
    @return {boolean} whether there is a piece at the position.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  hasPieceAtPosition: function(piecePosition) {
    return this.bd[piecePosition.x][piecePosition.y] !== undefined;
  },
  /**
    Do we have a piece in a specific position?
    @this {Board}
    @param {number} x x position to check for piece at [0..8).
    @param {number} y y position to check for piece at [0..8).
    @return {boolean} is there a piece at position.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  hasPieceAtPositionVals: function(x, y) {
    return this.hasPieceAtPosition(new PiecePosition(x, y));
  },
  /**
    Add a callback for adding a piece
    @this {Board}
    @param {function()} f callback function.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  addPiecePostAddCallback: function(f) {
    this.postAddCB.push(f);
  },
  /**
    Add a callback for removing a piece
    @this {Board}
    @param {function()} f callback function.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  addPiecePostRemoveCallback: function(f) {
    this.postRemoveCB.push(f);
  },
  /**
    Add a callback for moving a piece
    @this {Board}
    @param {function()} f callback function.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  addPiecePostMoveCallback: function(f) {
    this.postMoveCB.push(f);
  },
  /**
    Clear the board and add a position to the current board
    @this {Board}
    @param {BoardPosition} boardPosition position to set.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  setPosition: function(boardPosition) {
    this.clearPieces();
    var that = this;
    boardPosition.forEachPiece(function(boardPiece, piecePosition) {
      that.addPiece(boardPiece, piecePosition); });
  },
  /**
    Put the board in starting position of standard chess.
    @this {Board}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  startPosition: function() {
    this.setPosition(BoardPosition.startPos());
  },
  /**
    Move a piece according to positions.
    @this {Board}
    @param {PiecePosition} fromPiecePosition from where to move.
    @param {PiecePosition} toPiecePosition to where to move.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  movePieceByPos: function(fromPiecePosition, toPiecePosition) {
    var boardPiece = this.getPieceAtPosition(fromPiecePosition);
    this.movePiece(boardPiece, fromPiecePosition, toPiecePosition);
  },
  /**
    Get the position of a piece
    @this {Board}
    @param {BoardPiece} boardPiece piece to get the position for.
    @return {PiecePosition} the position of the piece in question.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  getPiecePosition: function(boardPiece) {
    var i, j;
    for (i = 0; i < 8; i++) {
      for (j = 0; j < 8; j++) {
        if (this.bd[i][j] === boardPiece) {
          return new PiecePosition(i, j);
        }
      }
    }
    throw 'piece not on board ' + boardPiece;
  }
});

// the demo pages use this class as a browser global
window.Board = Board;
/* vim:set filetype=javascript:*/


/**
  @class represents a piece on the board: color, type The instance also has
  a data field that could be used for private data attached to the piece.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var BoardPiece = Class.create(/** @lends BoardPiece.prototype */{
  /**
    constructs a new object.
    @this {BoardPiece}
    @param {string} color color of this piece (black/white).
    @param {string} type type of this piece
    (rook/knight/bishop/queen/king/pawn).
    @return {BoardPiece} the new object created.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(color, type) {
    this.color = color;
    this.type = type;
    this.data = undefined;
  },
  /**
    toString method that allows you to get a nice printout for this type
    @this {BoardPiece}
    @return {string} string representation of this object.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    return 'BoardPiece: ' + [this.color, this.type, this.data].join();
  },
  /**
    Method to set secret data for this piece
    @this {BoardPiece}
    @param {anything} data the extra data to hold for this piece.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  setData: function(data) {
    this.data = data;
  },
  /**
    Method to get secret data for this piece
    @this {BoardPiece}
    @return {anything} the secret data associated with this piece.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  getData: function() {
    return this.data;
  },
  /**
    Method to unset secret data for this piece
    @this {BoardPiece}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  unsetData: function() {
    this.data = undefined;
  }
});
/* vim:set filetype=javascript:*/
/*jsl:import BoardPiece.js*/
/*jsl:import PieceColor.js*/
/*jsl:import PieceType.js*/
/*jsl:import PiecePosition.js*/


/**
  @class represents a full position of the board
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var BoardPosition = Class.create(/** @lends BoardPosition.prototype */{
  /**
    constructs a new object
    @this {BoardPosition}
    @return {BoardPosition} a new object of this type.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function() {
    this.pieces = [];
  },
  /**
    toString method that allows you to get a nice printout for this type
    @this {BoardPosition}
    @return {string} a string representation of this object.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    return this.pieces.join();
  },
  /**
    Add a piece to the position
    @this {BoardPosition}
    @param {string} color the color of the piece (black/white).
    @param {string} type the type of the piece
    (rook/knight/bishop/queen/king/pawn).
    @param {number} x the x position of the piece [0..8).
    @param {number} y the y position of the piece [0..8).
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  addPiece: function(color, type, x, y) {
    var boardPiece = new BoardPiece(new PieceColor(color), new PieceType(type));
    var piecePosition = new PiecePosition(x, y);
    this.pieces.push([boardPiece, piecePosition]);
  },
  /**
    Run a function for each piece in this position
    @this {BoardPosition}
    @param {function()} f function to run getting each piece in turn.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  forEachPiece: function(f) {
    this.pieces.forEach(function(pieceAndPos) {
      var boardPiece = pieceAndPos[0];
      var position = pieceAndPos[1];
      f(boardPiece, position);
    });
  }
});


/**
  Static method that returns a starting position in standard chess.
  @return {BoardPosition} A standard chess starting position.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
BoardPosition.startPos = function() {
  /*
  var newPos=new BoardPosition();
  newPos.addPiece('white','rook',0,0);
  newPos.addPiece('white','knight',1,0);
  newPos.addPiece('white','bishop',2,0);
  newPos.addPiece('white','queen',3,0);
  newPos.addPiece('white','king',4,0);
  newPos.addPiece('white','bishop',5,0);
  newPos.addPiece('white','knight',6,0);
  newPos.addPiece('white','rook',7,0);
  newPos.addPiece('white','pawn',0,1);
  newPos.addPiece('white','pawn',1,1);
  newPos.addPiece('white','pawn',2,1);
  newPos.addPiece('white','pawn',3,1);
  newPos.addPiece('white','pawn',4,1);
  newPos.addPiece('white','pawn',5,1);
  newPos.addPiece('white','pawn',6,1);
  newPos.addPiece('white','pawn',7,1);

  newPos.addPiece('black','rook',0,7);
  newPos.addPiece('black','knight',1,7);
  newPos.addPiece('black','bishop',2,7);
  newPos.addPiece('black','queen',3,7);
  newPos.addPiece('black','king',4,7);
  newPos.addPiece('black','bishop',5,7);
  newPos.addPiece('black','knight',6,7);
  newPos.addPiece('black','rook',7,7);
  newPos.addPiece('black','pawn',0,6);
  newPos.addPiece('black','pawn',1,6);
  newPos.addPiece('black','pawn',2,6);
  newPos.addPiece('black','pawn',3,6);
  newPos.addPiece('black','pawn',4,6);
  newPos.addPiece('black','pawn',5,6);
  newPos.addPiece('black','pawn',6,6);
  newPos.addPiece('black','pawn',7,6);
  return newPos;
  */
  return BoardPosition.setupFEN(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  );
};


/**
  Setup a position according to FEN notation.
  See Forsyth-Edwards Notation in wikipedia for more details.
  Example of start position is:
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  @param {string} fen a string describing a chess board position in FEN
  notation.
  @return {BoardPosition} A position object corresponding to the FEN
  notation given.
  @author mark.veltzer@gmail.com (Mark Veltzer)
  TODO
  - add more sanity tests (regexp) for the whole input.
  - parse the 5 other blocks after the position itself
  (what do I do with that ?!?).
*/
BoardPosition.setupFEN = function(fen) {
  var irank, iletter, rank, letter;
  var blocks = fen.split(' ');
  if (blocks.length !== 6) {
    throw 'parse error - number of blocks is not 6';
  }
  var ranks = blocks[0].split('/');
  if (ranks.length !== 8) {
    throw 'parse error - number of ranks is not 8';
  }
  var newPos = new BoardPosition();
  for (irank = 7; irank >= 0; irank--) {
    rank = ranks[7 - irank];
    for (iletter = 0; iletter < rank.length; iletter++) {
      letter = rank[iletter];
      switch (letter) {
        case 'r':
          newPos.addPiece('black', 'rook', iletter, irank);
          break;
        case 'R':
          newPos.addPiece('white', 'rook', iletter, irank);
          break;
        case 'n':
          newPos.addPiece('black', 'knight', iletter, irank);
          break;
        case 'N':
          newPos.addPiece('white', 'knight', iletter, irank);
          break;
        case 'b':
          newPos.addPiece('black', 'bishop', iletter, irank);
          break;
        case 'B':
          newPos.addPiece('white', 'bishop', iletter, irank);
          break;
        case 'q':
          newPos.addPiece('black', 'queen', iletter, irank);
          break;
        case 'Q':
          newPos.addPiece('white', 'queen', iletter, irank);
          break;
        case 'k':
          newPos.addPiece('black', 'king', iletter, irank);
          break;
        case 'K':
          newPos.addPiece('white', 'king', iletter, irank);
          break;
        case 'p':
          newPos.addPiece('black', 'pawn', iletter, irank);
          break;
        case 'P':
          newPos.addPiece('white', 'pawn', iletter, irank);
          break;
        default:
          iletter += Number(letter) - 1;
          break;
      }
    }
  }
  return newPos;
};
/* vim:set filetype=javascript:*/
/*jsl:import Utils.js*/


/**
  @class Type safe config class
  The config class is basically a fancy dictionary. The difference
  between it and a dictionary is that it consults a template object
  when setting and getting a value.
  - When setting a value it makes sure that you are giving a name
  of a parameter that exists in the template and that the value
  that you gave to the parameter is correctly converted to the
  type expected.
  - When getting a value it makes sure you use the right name for
  the key.
  The idea is that the user will not be able to accidently put config
  options which are not used and will only be able to supply the right
  types.
  In addition, some config options will <b>have</b> to be supplied by the user
  (div id where to create some HTML elements is an example of this).
  Config will also supply a method by which config options by the user
  will override anything in the default config.
  This class <b>should not</b> be a singleton since the user may want to put
  two boards on the page and have each configured differently.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var Config = Class.create(/** @lends Config.prototype */{
  /**
    creates a new instance.
    @this {Config}
    @param {object} tmpl template to use.
    @return {Config} new instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(tmpl) {
    // the dictionary holding the current config
    this.d = {};
    // the template to be used
    this.tmpl = tmpl;
  },
  /**
    get a value for a key.
    @this {Config}
    @param {anything} key key to store in the config.
    @return {anything} the value associated with the key.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  getValue: function(key) {
    if (this.tmpl.hasKey(key)) {
      if (this.d[key] !== undefined) {
        return this.d[key];
      }
      return this.tmpl.getDefaultValue(key);
    }
    throw 'request for bad key [' + key + ']';
  },
  /**
    set a key to a certain value in the current configuration
    @this {Config}
    @param {anything} key key to store in the config.
    @param {anything} value value to store in the config.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  setValue: function(key, value) {
    // check that the key and value are ok.
    this.tmpl.check(key, value);
    this.d[key] = value;
  },
  /**
    set many values at once
    @this {Config}
    @param {object} d dictionary of values.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  override: function(d) {
    var x;
    for (x in d) {
      this.setValue(x, d[x]);
    }
  },
  /**
    check that the config is good to go
    for instance: check that all required arguments are set
    @this {Config}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  check: function() {
    // TODO
    return;
  }
});
/* vim:set filetype=javascript:*/
/*jsl:import Utils.js*/


/**
  @class Type safe config class
  This is a configuration template, it has, for each configuration key,
  the following:
  - the key itself (string).
  - the type of the value for that key.
  - the default value for the key (of the same type).
  - an optional validation function.
  - is this option required
  - description of the option
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var ConfigTmpl = Class.create(/** @lends ConfigTmpl.prototype */{
  /**
    create a new instance of this class.
    @this {ConfigTmpl}
    @return {ConfigTmpl} a new instance of this class.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function() {
    // the dictionary holding the current config
    this.tuples = {};
    this.tuplist = [];
  },
  /**
    add another option to this template
    @this {ConfigTmpl}
    @param {object} s config option with all needed properties.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  add: function(s) {
    Utils.checkEquals(s, ConfigTmpl.fullSet);
    if (!(Object.prototype.hasOwnProperty.call(ConfigTmpl.types, s.type))) {
      throw 'bad type [' + s.type + ']';
    }
    if (Object.prototype.hasOwnProperty.call(this.tuples, s.name)) {
      throw 'repeat of key [' + s.name + ']';
    }
    this.tuples[s.name] = s;
    this.tuplist.push(s);
  },
  /**
    check that a key,value combo is ok
    This method will throw an exception if it finds anything wrong.
    @this {ConfigTmpl}
    @param {string} key key to check.
    @param {anything} value value to check.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  check: function(key, value) {
    if (!(Object.prototype.hasOwnProperty.call(this.tuples, key))) {
      throw 'wrong key [' + key + ']';
    }
    var type_to_check = this.tuples[key].type;
    var our_type = ConfigTmpl.types[type_to_check];
    Utils.checkType(value, our_type);
  },
  /**
    return whether the template has a key
    @this {ConfigTmpl}
    @param {string} key the key to check.
    @return {boolean} is the key part of this config template.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  hasKey: function(key) {
    return Object.prototype.hasOwnProperty.call(this.tuples, key);
  },
  /**
    return the default value for a key
    @this {ConfigTmpl}
    @param {string} key the key to fetch the value for.
    @return {anything} the default value for the given key.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  getDefaultValue: function(key) {
    return this.tuples[key].defaultValue;
  },
  /**
    show HTML that lists all config options for the current template
    @this {ConfigTmpl}
    @return {string} HTML representation of this config template.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  getHTML: function() {
    var shtml = '';
    shtml += '<table border=\'1\'>';
    shtml += '<tr>';
    shtml += '<td>name</td>';
    shtml += '<td>type</td>';
    shtml += '<td>required</td>';
    shtml += '<td>description</td>';
    shtml += '<td>defaultValue</td>';
    shtml += '</tr>';
    this.tuplist.forEach(function(e) {
      shtml += '<tr>';
      shtml += '<td>' + e.name + '</td>';
      shtml += '<td>' + e.type + '</td>';
      shtml += '<td>' + e.required + '</td>';
      shtml += '<td>' + e.description + '</td>';
      shtml += '<td>' + e.defaultValue + '</td>';
      shtml += '</tr>';
    });
    shtml += '</table>';
    return shtml;
  }
});


/**
  All needed properties for each config option.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
ConfigTmpl.fullSet = {
  name: undefined,
  type: undefined,
  required: undefined,
  description: undefined,
  defaultValue: undefined
};


/**
  All allowed types for config options.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
ConfigTmpl.types = {
  t_string: 'string',
  t_number: 'number',
  t_boolean: 'boolean'
};
/* vim:set filetype=javascript:*/


/**
  @class A set of controls to control the game of chess.
  Includes 6 buttons: goto_start, prev_move, prev_play, next_play, next_move,
  goto_end
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var Controls = Class.create(/** @lends Controls.prototype */{
  /**
    creates a new instance of this class.
    @this {Controls}
    @param {object} dict A hash with initial values.
    @return {Controls} new instance of this class.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(dict) {
    this.id = dict.id;
    this.b_goto_start = new Element('button').update('goto_start');
    this.b_prev_move = new Element('button').update('prev_move');
    this.b_prev_play = new Element('button').update('prev_play');
    this.b_next_play = new Element('button').update('next_play');
    this.b_next_move = new Element('button').update('next_move');
    this.b_goto_end = new Element('button').update('goto_end');
    $(this.id).appendChild(this.b_goto_start);
    $(this.id).appendChild(this.b_prev_move);
    $(this.id).appendChild(this.b_prev_play);
    $(this.id).appendChild(this.b_next_play);
    $(this.id).appendChild(this.b_next_move);
    $(this.id).appendChild(this.b_goto_end);
  },
  /**
    toString method that allows you to get a nice printout for this type
    @this {Controls}
    @return {string} string representation of this instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    return 'no toString for type Controls';
  }
});

// the demo pages use this class as a browser global
window.Controls = Controls;
/* vim:set filetype=javascript:*/


/**
  @class A full game of chess. Contains the starting position
  including a full set of moves of type GameMove.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var Game = Class.create(/** @lends Game.prototype */{
  /**
    creates a new instance of this class.
    @return {Game} new instance of this class.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function() {
    return;
  },
  /**
    toString method that allows you to get a nice printout for this type
    @return {string} string representation of this instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    return 'no toString for type Game';
  }
});

// the demo pages use this class as a browser global
window.Game = Game;
/* vim:set filetype=javascript:*/


/**
  @class A single move in a game
  contains the position from which the move starts,
  the position where it ends, the piecetype and color doing the
  moving.
  Also potentially more things:
  - A piece which was removed as a result of this move and its
  position before the capture (the position is needed since the piece
  could be in a different position than the capturing position like
  in en passant).
  - info about whether this was a 0-0 or 0-0-0 (all other info
  needed for castling).
  - info about what the piece turns to (in case the piece turns
  into some other piece like in the case of coronation).
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var GameMove = Class.create(/** @lends GameMove.prototype */{
  /**
    creates a new instance
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function() {
    return;
  },
  /**
    Debug method that allows you to get a nice printout for this type
    @return {string} the string representation
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    return 'no toString for type GameMove';
  }
});

// the demo pages use this class as a browser global
window.GameMove = GameMove;
/* vim:set filetype=javascript:*/
/*jsl:import Utils.js*/


/**
  @class A PGN reader. A class that knows how to read a PGN file and give
  instructions to a board.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var PgnReader = Class.create(/** @lends PgnReader.prototype */{
  /**
    creates a new instance
    @return {PgnReader} the new instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function() {
    return;
  },
  /**
    toString method so that you can get a nice printout of instances of
    this type
    @return {string} string representation of this instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    throw 'toString for PgnReader not implemented yet';
  },
  /**
    A method to read a pgn file via ajax.
    @param {string} url url to do the GET from (same server).
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  get: function(url) {
    //Utils.fakeUse(url);
    // we use prototype to do HTTP GET
    var req = new Ajax.Request(url, {
      method: 'get',
      onSuccess: function(transport) {
        var response = transport.responseText;
        //console.log('got response ' + response);
        var chess = new Chess();
        chess.load_pgn(response);
        console.log(chess.history({ verbose: true }));
      },
      onFailure: function(transport) {
        console.log('error in transport for url ' + url);
        console.dir(transport);
      }
    });
    Utils.fakeUse(req);
  }
});

// the demo pages use this class as a browser global
window.PgnReader = PgnReader;
/* vim:set filetype=javascript:*/


/**
  @class represents a piece color (white,black)
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var PieceColor = Class.create(/** @lends PieceColor.prototype */{
  /**
    creates a new instance
    @this {PieceColor}
    @param {string} color string which represents
    the color of the piece. Must be one of 'white' or 'black'.
    @return {PieceColor} new instance of this class.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(color) {
    if (!(Object.prototype.hasOwnProperty.call(PieceColor.colors, color))) {
      throw 'illegal piecetype ' + color;
    }
    this.color = color;
  },
  /**
    toString method that allows you to get a nice printout for this type
    @this {PieceColor}
    @return {string} string representation of this instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    return this.color;
  },
  /**
    Return whether the piece is white
    @this {PieceColor}
    @return {boolean} boolean indicating whether the piece is white.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  isWhite: function() {
    return this.color === 'white';
  },
  /**
    Return whether the piece is black
    @this {PieceColor}
    @return {boolean} boolean indicating whether the piece is black.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  isBlack: function() {
    return this.color === 'black';
  }
});


/**
  Array of piece colors
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
PieceColor.colors = {
  white: undefined,
  black: undefined
};
/* vim:set filetype=javascript:*/
/*jsl:import Utils.js*/


/**
  @class represents a position on the board
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var PiecePosition = Class.create(/** @lends PiecePosition.prototype */{
  /**
    creates a new instance
    @this {PiecePosition}
    @param {number} x x co-ordinate.
    @param {number} y y co-ordinate.
    @return {PiecePosition} the new instance of this class.
    The method checks if the values given to it are in the 0..7 range.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(x, y) {
    Utils.checkType(x, 'number');
    Utils.checkType(y, 'number');
    if (x < 0 || x > 7) {
      throw 'bad value for x ' + x + ',' + typeof x;
    }
    if (y < 0 || y > 7) {
      throw 'bad value for y ' + y + ',' + typeof y;
    }
    this.x = x;
    this.y = y;
  },
  /**
    toString method so that you can get a nice printout of
    instances of this type
    @this {PiecePosition}
    @return {string} the string representation of this instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    return 'PiecePosition: (' + this.x + ',' + this.y + ')';
  },
  /**
    compare one position to another
    @this {PiecePosition}
    @param {PiecePosition} otherPos the position to compare to
    @return {boolean} is this position to some other position.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  notEqual: function(otherPos) {
    if (!(otherPos instanceof PiecePosition)) {
      throw 'bad type passed';
    }
    return otherPos.x !== this.x || otherPos.y !== this.y;
  },
  /**
    compare one position to another
    @this {PiecePosition}
    @param {PiecePosition} otherPos the position to compare to
    @return {boolean} is this position to some other position.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  equal: function(otherPos) {
    if (!(otherPos instanceof PiecePosition)) {
      throw 'bad type passed';
    }
    return otherPos.x === this.x && otherPos.y === this.y;
  }
});
/* vim:set filetype=javascript:*/


/**
  @class represents a piece type (rook,knight,bishop,queen,king,pawn)
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var PieceType = Class.create(/** @lends PieceType.prototype */{
  /**
    creates a new instance
    @this {PieceType}
    @param {string} type the type of the piece.
    @return {PieceType} the new instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(type) {
    if (!(Object.prototype.hasOwnProperty.call(PieceType.types, type))) {
      throw 'illegal piecetype ' + type;
    }
    this.type = type;
  },
  /**
    toString method that allows you to get a nice printout for this type
    @this {PieceType}
    @return {string} string representation of this instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    return this.type;
  },
  /**
    Return whether the piece is a rook
    @this {PieceType}
    @return {boolean} is this piece a rook.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  isRook: function() {
    return this.type === 'rook';
  },
  /**
    Return whether the piece is a knight
    @this {PieceType}
    @return {boolean} is this piece a knight.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  isKnight: function() {
    return this.type === 'knight';
  },
  /**
    Return whether the piece is a bishop
    @this {PieceType}
    @return {boolean} is this piece a bishop.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  isBishop: function() {
    return this.type === 'bishop';
  },
  /**
    Return whether the piece is a queen
    @this {PieceType}
    @return {boolean} is this piece a queen.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  isQueen: function() {
    return this.type === 'queen';
  },
  /**
    Return whether the piece is a king
    @this {PieceType}
    @return {boolean} is this piece a king.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  isKing: function() {
    return this.type === 'king';
  },
  /**
    Return whether the piece is a pawn
    @this {PieceType}
    @return {boolean} is this piece a pawn.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  isPawn: function() {
    return this.type === 'pawn';
  }
});


/**
  Array of piece types
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
PieceType.types = {
  rook: undefined,
  knight: undefined,
  bishop: undefined,
  queen: undefined,
  king: undefined,
  pawn: undefined
};
/* vim:set filetype=javascript:*/
/*jsl:import SvgPieceData.js*/
/*jsl:import SvgCreator.js*/
/*jsl:import SvgPixelPosition.js*/
/*jsl:import PiecePosition.js*/
/*jsl:import Board.js*/
/*jsl:import WRaphael.js*/
/*jsl:import Utils.js*/
/*jsl:import Config.js*/
/*jsl:import SvgConfigTmpl.js*/


/**
  @class a whole board to play with
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var SvgBoard = Class.create(/** @lends SvgBoard.prototype */{
  /**
    creates a new instance
    @this {SvgBoard}
    @param {Board} board instance to use as the abstract board.
    @param {object} dict overridables to the configuration for this object.
    @return {SvgBoard} the new instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(board, dict) {
    // lets create a config connected to our singleton template
    this.config = new Config(SvgConfigTmpl.getInstance());
    // lets override with user preferences
    this.config.override(dict);
    // lets check the config
    this.config.check();
    // now we are ready to go...
    // get RW vars from the config
    this.boardview = this.getValue('boardview');
    this.size = this.getValue('size');
    if (this.getValue('do_letters')) {
      var partial = this.getValue('partial');
      this.square = this.getValue('size') / (8 + partial);
      this.offX = this.square * (partial / 2);
      this.offY = this.square * (partial / 2);
    } else {
      this.square = this.getValue('size') / 8.0;
      this.offX = 0;
      this.offY = 0;
    }
    // real code starts here
    this.board = board;
    this.raphaelPrep();
    this.drawBoard();
    if (this.getValue('do_letters')) {
      this.drawBorder();
    }
    // hook the board to our graphics
    var that = this;
    this.board.addPiecePostAddCallback(function(boardPiece, piecePosition) {
      that.postAddPiece(boardPiece, piecePosition);
    });
    this.board.addPiecePostRemoveCallback(function(boardPiece, piecePosition) {
      that.postRemovePiece(boardPiece, piecePosition);
    });
    this.board.addPiecePostMoveCallback(function(boardPiece, fromPos, toPos) {
      that.postMovePiece(boardPiece, fromPos, toPos);
    });
    this.overlay();
    // build the glow object
    this.glow_obj = {};
    this.glow_obj.width = this.getValue('glow_width');
    this.glow_obj.fill = this.getValue('glow_fill');
    this.glow_obj.opacity = this.getValue('glow_opacity');
    this.glow_obj.offsetx = this.getValue('glow_offsetx');
    this.glow_obj.offsety = this.getValue('glow_offsety');
    this.glow_obj.color = this.getValue('glow_color');
    // selection variables
    // last board position
    this.lastPos = undefined;
    // current board position
    this.currentPos = undefined;
    // selected piece
    this.selectedPiece = undefined;
    // selected rec
    this.selectedRec = undefined;
  },
  /**
    get the logical board [Board] associated with this SvgBoard
    @this {SvgBoard}
    @return {Board} the logical board associated with this SvgBoard.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  getBoard: function() {
    return this.board;
  },
  /**
    get the config value for a key
    @this {SvgBoard}
    @param {string} key the key to get the config for.
    @return {anything} the value of the configuration option.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  getValue: function(key) {
    return this.config.getValue(key);
  },
  /**
    Prepare the raphael paper so we could do graphics
    @this {SvgBoard}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  raphaelPrep: function() {
    // async way
    /*
    var widget=this
    Raphael(this.getValue('id'),this.getValue('size'),
        this.getValue('size'),function() {
      widget.paper=this
      widget.drawBoard()
    })
    */
    // sync way
    this.paper = new WRaphael(
        this.getValue('id'),
        this.getValue('size'),
        this.getValue('size'));
    /*
    this.paper=Raphael(
        this.getValue('id'),
        this.getValue('size'),
        this.getValue('size'));
    */
    this.elem = $(this.getValue('id'));
    var offset = this.elem.cumulativeOffset();
    this.startX = offset.left;
    this.startY = offset.top;
  },
  /**
    Fill a rectangle using the default color
    This method must take board rotation into consideration
    It currently doesn't because the board looks the same in terms
    of white/black square when you totally flip it. If we ever support
    90% flips then this method must be modified.
    @this {SvgBoard}
    @param {rect} rec Raphael.js rectangle object to fill.
    @param {boolean} anim do you want animation (slow transition).
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  rectFill: function(rec, anim) {
    var piecePosition = rec.data('pos');
    var mod;
    if (this.boardview === 'white' || this.boardview === 'black') {
      mod = 1;
    } else {
      mod = 0;
    }
    var val;
    if ((piecePosition.x + piecePosition.y) % 2 === mod) {
      if (this.getValue('gradients')) {
        val = this.getValue('white_square_gradient');
      } else {
        val = this.getValue('white_square_color');
      }
    } else {
      if (this.getValue('gradients')) {
        val = this.getValue('black_square_gradient');
      } else {
        val = this.getValue('black_square_color');
      }
    }
    if (anim) {
      // TODO: animation with gradients looks bad
      if (this.getValue('gradients')) {
        rec.attr('fill', val);
      } else {
        var ms = this.getValue('move_ms');
        rec.animate({fill: val},ms);
      }
    } else {
      rec.attr('fill', val);
    }
  },
  /**
    Draw the border
    @this {SvgBoard}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  drawBorder: function() {
    var x, y, txt1, txt2, txt3, txt4;
    var part = 0.5;
    var partial = this.getValue('partial');
    this.texts = [];
    for (y = 0; y < 8; y++) {
      txt1 = this.paper.text(
          this.square * (partial / 2) * part,
          (y + 0.5) * this.square + this.offY,
          8 - y);
      this.texts.push(txt1);
      txt2 = this.paper.text(
          this.offX + this.square * 8.0 + this.square * (partial / 2) * part,
          (y + 0.5) * this.square + this.offY,
          8 - y);
      this.texts.push(txt2);
    }
    for (x = 0; x < 8; x++) {
      txt3 = this.paper.text(
          (x + 0.5) * this.square + this.offX,
          this.square * (partial / 2) * part,
          String.fromCharCode(x + 'A'.charCodeAt(0)));
      this.texts.push(txt3);
      txt4 = this.paper.text(
          (x + 0.5) * this.square + this.offX,
          this.offY + this.square * 8.0 + this.square * (partial / 2) * part,
          String.fromCharCode(x + 'A'.charCodeAt(0)));
      this.texts.push(txt4);
    }
  },
  /**
    Translate a position from a rectangle position
    to a logical position according to board rotation.
    @this {SvgBoard}
    @param {PiecePosition} pos the position to translate.
    @return {PiecePosition} the logical position.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  translatePos: function(pos) {
    if (this.boardview === 'white') {
      return new PiecePosition(pos.x, pos.y);
    }
    if (this.boardview === 'black') {
      return new PiecePosition(7 - pos.x, 7 - pos.y);
    }
    if (this.boardview === 'left') {
      return new PiecePosition(pos.y, pos.x);
    }
    if (this.boardview === 'right') {
      return new PiecePosition(7 - pos.y, 7 - pos.x);
    }
    throw 'boardview is not correct';
  },
  /**
    Draw the board (white and black squares)
    @this {SvgBoard}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  drawBoard: function() {
    var x, y, rec_line, rec, piecePosition;
    var that = this;
    var f = function(tpos, trec, type) {
      return function() {
        var ttpos = that.translatePos(tpos);
        that.eventPosition(ttpos, trec, type);
      };
    };
    this.recs = [];
    for (x = 0; x < 8; x++) {
      rec_line = [];
      for (y = 0; y < 8; y++) {
        rec = this.paper.rect(
            x * this.square + this.offX,
            y * this.square + this.offY,
            this.square,
            this.square);
        rec.attr({
          stroke: this.getValue('rec_stroke_color'),
          'stroke-width': this.getValue('rec_stroke_width')
        });
        rec_line.push(rec);
        piecePosition = new PiecePosition(x, 7 - y);
        rec.data('pos', piecePosition);
        this.rectFill(rec, false);
        rec.click(f(piecePosition, rec, 'click'));
        rec.mousedown(f(piecePosition, rec, 'mousedown'));
        /* rec.mousemove(f(piecePosition, rec, 'mousemove')); */
        rec.mouseout(f(piecePosition, rec, 'mouseout'));
        rec.mouseover(f(piecePosition, rec, 'mouseover'));
        rec.mouseup(f(piecePosition, rec, 'mouseup'));
      }
      rec_line.reverse();
      this.recs.push(rec_line);
    }
  },
  /**
    Create an overlay rectange for the entire board
    @this {SvgBoard}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  overlay: function() {
    if (this.getValue('do_select_global')) {
      var that = this;
      var delta = 0;
      var rec = this.paper.rect(this.offX + delta, this.offY + delta,
          this.square * 8.0 - delta, this.square * 8.0 - delta);
      rec.attr({fill: Raphael.getColor()});
      rec.attr({opacity: 0.0});
      /*
      rec.mousemove(function(evt, x, y) {
        that.eventGlobal(evt,x-that.startX-that.offX,y-that.startY-that.offY,'mousemove');
      });
      */
      rec.mouseover(function(evt, x, y) {
        that.eventGlobal(evt, x - that.startX - that.offX,
            y - that.startY - that.offY, 'mouseover');
      });
      rec.mouseout(function(evt, x, y) {
        that.eventGlobal(evt, x - that.startX - that.offX,
            y - that.startY - that.offY, 'mouseout');
      });
      rec.toFront();
      this.fullRec = rec;
    }
    /*
    if(this.getValue('do_select_piecerec')) {
      var rec_out=this.paper.rect(this.offX+delta,this.offY+delta,
          this.square*8.0-delta,this.square*8.0-delta);
      rec_out.attr({opacity:0.0});
      rec_out.mouseout(function(evt, x, y) {
        that.eventGlobal(evt,x-that.startX-that.offX,y-that.startY-that.offY,'mouseout');
      });
      rec_out.toFront();
    }
    */
  },
  /**
    Callback method that is called whenever a piece is added to the board
    This method is to be used to do something after a piece is added,
    removed etc.
    @this {SvgBoard}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  postGraphics: function() {
    if (this.getValue('do_select_global')) {
      this.fullRec.toFront();
    }
  },
  /**
    Callback method that is called after the logical board adds a piece.
    This is where we add the SVG representation of the piece in real graphics.
    @this {SvgBoard}
    @param {BoardPiece} boardPiece the piece that was added.
    @param {PiecePosition} piecePosition the position where the piece was added.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  postAddPiece: function(boardPiece, piecePosition) {
    var that = this;
    var svgPiece = SvgCreator.createPiece(
        this.config, boardPiece.color, boardPiece.type);
    // calculate transform (move and scale)
    var pixelPos = this.posToPixels(piecePosition);
    var m = Raphael.matrix();
    m.translate(pixelPos.x + this.offX, pixelPos.y + this.offY);
    m.scale(this.square / svgPiece.size, this.square / svgPiece.size);
    var transform = m.toTransformString();
    // now put it on the paper
    var set = svgPiece.toSet(this.paper, transform);
    set.eventRegister((function(iboardPiece) {
      return function(eventName) {
        that.eventPiece(iboardPiece, eventName);
      };
    }(boardPiece)), ['click', 'mouseover', 'mouseout']);
    //}(boardPiece),['click','mouseover','mouseout','mousemove','mouseup','mousedown']);
    // lets put our own data with the piece
    var svgPieceData = new SvgPieceData(set, pixelPos);
    boardPiece.setData(svgPieceData);
    this.postGraphics();
  },
  /**
    Callback method that is called after the logical board removes a piece.
    @param {BoardPiece} boardPiece the piece to add.
    @param {PiecePosition} piecePosition the position where the piece was
    removed.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  postRemovePiece: function(boardPiece, piecePosition) {
    Utils.fakeUse(piecePosition);
    var svgPieceData = boardPiece.getData();
    svgPieceData.set.remove();
    boardPiece.unsetData();
  },
  /**
    Translates position (0..7,0..7) to pixels
    This method must take board rotation into consideration
    @this {SvgBoard}
    @param {PiecePosition} piecePosition logical (0..7,0..7) to translate.
    @return {SvgPixelPosition} position in pixels.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  posToPixels: function(piecePosition) {
    if (this.boardview === 'white') {
      return new SvgPixelPosition(
          piecePosition.x * this.square,
          (7 - piecePosition.y) * this.square
      );
    }
    if (this.boardview === 'black') {
      return new SvgPixelPosition(
          (7 - piecePosition.x) * this.square,
          piecePosition.y * this.square
      );
    }
    if (this.boardview === 'left') {
      return new SvgPixelPosition(
          piecePosition.y * this.square,
          (7 - piecePosition.x) * this.square
      );
    }
    if (this.boardview === 'right') {
      return new SvgPixelPosition(
          (7 - piecePosition.y) * this.square,
          piecePosition.x * this.square
      );
    }
    throw 'boardview is bad';
  },
  /**
    Translates pixel position (x,y) to board position (0..7,0..7)
    This method must take board rotation into consideration
    @this {SvgBoard}
    @param {SvgPixelPosition} svgPixelPosition object to translate.
    @return {PiecePosition} logical position.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  pixelsToPos: function(svgPixelPosition) {
    var x = Math.floor((svgPixelPosition.x) / this.square);
    var y = Math.floor((svgPixelPosition.y) / this.square);
    if (this.boardview === 'white') {
      return new PiecePosition(x, 7 - y);
    }
    if (this.boardview === 'black') {
      return new PiecePosition(7 - x, y);
    }
    if (this.boardview === 'left') {
      return new PiecePosition(y, 7 - x);
    }
    if (this.boardview === 'right') {
      return new PiecePosition(7 - y, x);
    }
    throw 'boardview is bad';
  },
  /**
    Forgiving version of the previous function.
    @this {SvgBoard}
    @param {SvgPixelPosition} svgPixelPosition object to translate.
    @return {PiecePosition} logical position.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  pixelsToPosForgiving: function(svgPixelPosition) {
    var x = Math.floor((svgPixelPosition.x) / this.square);
    var y = Math.floor((svgPixelPosition.y) / this.square);
    if (x > 7 || x < 0 || y > 7 || y < 0) {
      return undefined;
    }
    if (this.boardview === 'white') {
      return new PiecePosition(x, 7 - y);
    }
    if (this.boardview === 'black') {
      return new PiecePosition(7 - x, y);
    }
    if (this.boardview === 'left') {
      return new PiecePosition(y, 7 - x);
    }
    if (this.boardview === 'right') {
      return new PiecePosition(7 - y, x);
    }
    throw 'boardview is bad';
  },
  /**
    Resize the board
    @this {SvgBoard}
    @param {set} set Raphael set to resize.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  resize: function(set) {
    var m = Raphael.matrix();
    m.scale(1.7, 1.7);
    var transformString = m.toTransformString();
    set.forEach(function(el) {
      //el.animate({transform: transformString},ms);
      el.transform(transformString);
      //el.scale(5,5);
    },this);
  },
  /**
    Shows or hides a given piece according to parameter
    @this {SvgBoard}
    @param {BoardPiece} boardPiece piece to show or hide.
    @param {boolean} hide show or hide the piece.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  showHidePiece: function(boardPiece, hide) {
    var data = boardPiece.getData();
    data.forEach(function(el) {
      if (hide) {
        el.hide();
      } else {
        el.show();
      }
    });
  },
  /**
    Quick method to show a piece
    @this {SvgBoard}
    @param {BoardPiece} boardPiece the piece to show.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  showPiece: function(boardPiece) {
    this.showHidePiece(boardPiece, false);
  },
  /**
    Quick method to hide a piece
    @this {SvgBoard}
    @param {BoardPiece} boardPiece the piece to hide.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  hidePiece: function(boardPiece) {
    this.showHidePiece(boardPiece, true);
  },
  /**
    Callback called when the logical board moves a piece
    @this {SvgBoard}
    @param {BoardPiece} boardPiece the piece to move.
    @param {PiecePosition} fromPiecePosition position from which to move.
    @param {PiecePosition} toPiecePosition position to which to move.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  postMovePiece: function(boardPiece, fromPiecePosition, toPiecePosition) {
    this.timeMovePiece(boardPiece, fromPiecePosition, toPiecePosition);
  },
  /**
    Move a piece on the board (including animation if so configured)
    @this {SvgBoard}
    @param {BoardPiece} boardPiece the piece to move.
    @param {PiecePosition} fromPiecePosition position from which to move.
    @param {PiecePosition} toPiecePosition position to which to move.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  timeMovePiece: function(boardPiece, fromPiecePosition, toPiecePosition) {
    Utils.fakeUse(fromPiecePosition);
    var ms = this.getValue('move_ms');
    var pixelPosFrom = boardPiece.getData().pixelPos;
    var pixelPosTo = this.posToPixels(toPiecePosition);
    boardPiece.getData().forEach(function(el) {
      var m = Raphael.matrix();
      m.translate(pixelPosTo.x - pixelPosFrom.x, pixelPosTo.y - pixelPosFrom.y);
      var transformString = m.toTransformString();
      el.animate({transform: transformString},ms);
    });
  },
  /**
    Flips the board (see it from the other side)
    If the board is 90 deg left it be will 90 deg right.
    Black view will turn to white and white to black.
    @this {SvgBoard}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  flip: function() {
    var oldview = this.boardview;
    switch (this.boardview) {
      case 'white':
        this.boardview = 'black';
        break;
      case 'black':
        this.boardview = 'white';
        break;
      case 'left':
        this.boardview = 'right';
        break;
      case 'right':
        this.boardview = 'left';
        break;
      default:
        throw 'boardview is bad';
    }
    // now redraw the board (after the change of view)
    this.redraw(oldview);
  },
  /**
    Rotate the board to the right 90 degrees
    @this {SvgBoard}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  rotateright: function() {
    var oldview = this.boardview;
    if (!(Object.prototype.hasOwnProperty.call(SvgBoard.ObjRotateRight, oldview))) {
      throw 'boardview is bad';
    }
    this.boardview = SvgBoard.ObjRotateRight[this.boardview];
    // now redraw the board (after the change of view)
    this.redraw(oldview);
  },
  /**
    Rotate the board to the left 90 degrees
    @this {SvgBoard}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  rotateleft: function() {
    var oldview = this.boardview;
    if (!(Object.prototype.hasOwnProperty.call(SvgBoard.ObjRotateLeft, oldview))) {
      throw 'boardview is bad';
    }
    this.boardview = SvgBoard.ObjRotateLeft[this.boardview];
    // now redraw the board (after the change of view)
    this.redraw(oldview);
  },
  /**
    toString function
    This method is not yet implemented and will throw an exception.
    @this {SvgBoard}
    @return {string} a string representation of this object.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    throw 'not yet implemented';
  },
  /**
    Make a piece glow
    @this {SvgBoard}
    @param {BoardPiece} boardPiece the piece to make glow.
    @param {object} glow properties to pass to the glow function as per
    Raphael.js.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  glow: function(boardPiece, glow) {
    var svgPieceData = boardPiece.getData();
    if (glow) {
      svgPieceData.extra = svgPieceData.set.glow(this.glow_obj);
    } else {
      svgPieceData.extra.remove();
      svgPieceData.extra = undefined;
    }
  },
  /**
    Redraw the entire board
    @this {SvgBoard}
    @param {viewType} oldview the old view of the board.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  redraw: function(oldview) {
    var x, y;
    Utils.fakeUse(oldview);
    // redraw the pieces
    var that = this;
    this.board.forEachPiece(function(boardPiece, position) {
      that.timeMovePiece(boardPiece, position, position);
    });
    // redraw the squares
    for (x = 0; x < 8; x++) {
      for (y = 0; y < 8; y++) {
        this.rectFill(this.getRec(new PiecePosition(x, y)), true);
      }
    }
  },
  /**
    Event handler for events happening on the pieces.
    Types of events: click, mouseover and more...
    @this {SvgBoard}
    @param {BoardPiece} boardPiece instance the event happened on.
    @param {string} type the type of event that happened.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  eventPiece: function(boardPiece, type) {
    //Utils.fakeUse(boardPiece,type);
    if (this.getValue('do_select_piecerec')) {
      if (type === 'mouseover') {
        var piecePosition = this.board.getPiecePosition(boardPiece);
        if (this.currentPos === undefined ||
            piecePosition.notEqual(this.currentPos)) {
          this.lastPos = this.currentPos;
          this.currentPos = piecePosition;
          this.newPosition();
        }
      }
    }
  },
  /**
    Events for position. Positions are logical and do
    not depend on the flipping of the board.
    Types of events: mouseover, mouseout, click and more.
    @this {SvgBoard}
    @param {PiecePosition} piecePosition the position of the event.
    @param {rect} rec the Raphael.js rectangle where the event happened.
    @param {string} type which is the name of the event that happened.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  eventPosition: function(piecePosition, rec, type) {
    if (this.getValue('do_select_piecerec')) {
      if (type === 'mouseover') {
        this.lastPos = this.currentPos;
        this.currentPos = piecePosition;
        this.newPosition();
      }
      if (type === 'mouseout') {
        this.lastPos = this.currentPos;
        this.currentPos = undefined;
        this.newPosition();
      }
      /*
      if(type=='mouseout') {
        // this is done with a timeout just for getting out of the board...
        var pos=this.currentPos;
        var that=this;
        window.setTimeout(function() {
          if(pos!=undefined && pos.equal(that.currentPos)) {
            that.lastPos=that.currentPos;
            that.currentPos=undefined;
            that.newPosition();
          }
        },100);
      }
      */
    }
    if (this.getValue('do_select_click')) {
      if (type === 'click') {
        if (this.selected) {
          if (this.selected === rec) {
            this.rectFill(this.selected, false);
            this.selected = undefined;
          } else {
            this.rectFill(this.selected, false);
            rec.attr('fill', this.getValue('select_color'));
            this.selected = rec;
          }
        } else {
          rec.attr('fill', this.getValue('select_color'));
          this.selected = rec;
        }
      }
    }
  },
  /**
    Events for position. Positions are logical and do
    not depend on the flipping of the board.
    Types of events: mouseover, mouseout, click and more.
    @this {SvgBoard}
    @param {string} eventtype which event happened.
    @param {int} x x position of event.
    @param {int} y y position of event.
    @param {string} type which event happened.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  eventGlobal: function(eventtype, x, y, type) {
    Utils.fakeUse(eventtype);
    if (this.getValue('do_select_global')) {
      if (type === 'mouseover' || type === 'mousemove') {
        var piecePosition =
            this.pixelsToPosForgiving(new SvgPixelPosition(x, y));
        if (piecePosition !== undefined) {
          if (this.currentPos === undefined) {
            this.lastPos = undefined;
            this.currentPos = piecePosition;
            this.newPosition();
          } else {
            if (piecePosition.notEqual(this.currentPos)) {
              this.lastPos = this.currentPos;
              this.currentPos = piecePosition;
              this.newPosition();
            }
          }
        } else {
          // forget about this event?!?
          Utils.pass();
        }
      }
      if (type === 'mouseout') {
        this.lastPos = this.currentPos;
        this.currentPos = undefined;
        this.newPosition();
      }
    }
    if (this.getValue('do_select_piecerec')) {
      if (type === 'mouseout') {
        this.lastPos = this.currentPos;
        this.currentPos = undefined;
        this.newPosition();
      }
    }
  },
  /**
    Internal method. This method is called whenever
    the cursor changes position over the board and ONLY when
    it changes position.
    No parameters are passed because This method uses:
    this.selectedPiece, this.selectedRec, this.lastPos, this.currentPos
    to do it's work.
    @this {SvgBoard}
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  newPosition: function() {
    if (this.currentPos === undefined) {
      if (this.selectedPiece !== undefined) {
        if (this.getValue('do_select_piece')) {
          this.glow(this.selectedPiece, false);
          this.selectedPiece = undefined;
        }
      }
      if (this.selectedRec !== undefined) {
        if (this.getValue('do_select_square')) {
          this.rectFill(this.selectedRec, false);
          this.selectedRec = undefined;
        }
      }
    } else {
      if (this.board.hasPieceAtPosition(this.currentPos)) {
        var boardPiece = this.board.getPieceAtPosition(this.currentPos);
        //this.eventPiece(boardPiece,'square'+type);
        if (this.getValue('do_select_piece')) {
          if (this.selectedPiece === undefined) {
            this.selectedPiece = boardPiece;
            this.glow(this.selectedPiece, true);
          } else {
            this.glow(this.selectedPiece, false);
            this.selectedPiece = boardPiece;
            this.glow(this.selectedPiece, true);
          }
        }
      } else {
        if (this.selectedPiece !== undefined) {
          if (this.getValue('do_select_piece')) {
            this.glow(this.selectedPiece, false);
            this.selectedPiece = undefined;
          }
        }
      }
      if (this.getValue('do_select_square')) {
        var rec = this.getRec(this.currentPos);
        if (this.selectedRec === undefined) {
          this.selectedRec = rec;
          this.selectedRec.attr('fill', this.getValue('over_color'));
        } else {
          this.rectFill(this.selectedRec, false);
          this.selectedRec = rec;
          this.selectedRec.attr('fill', this.getValue('over_color'));
        }
      }
    }
  },
  /**
    Return the square at a position.
    This method must take into consideraton board rotation
    @this {SvgBoard}
    @param {PiecePosition} piecePosition the logical position for which to
    return the square.
    @return {rec} the Raphael.js rec in question.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  getRec: function(piecePosition) {
    if (this.boardview === 'white') {
      return this.recs[piecePosition.x][piecePosition.y];
    }
    if (this.boardview === 'black') {
      return this.recs[7 - piecePosition.x][7 - piecePosition.y];
    }
    if (this.boardview === 'left') {
      return this.recs[piecePosition.y][piecePosition.x];
    }
    if (this.boardview === 'right') {
      return this.recs[7 - piecePosition.y][7 - piecePosition.x];
    }
    throw 'boardview is bad';
  }
});


/**
  Which sides go to which when rotating right.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
SvgBoard.ObjRotateRight = {
  white: 'left',
  left: 'black',
  black: 'right',
  right: 'white'
};


/**
  Which sides go to which when rotating left.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
SvgBoard.ObjRotateLeft = {
  white: 'right',
  right: 'black',
  black: 'left',
  left: 'white'
};
/* vim:set filetype=javascript:*/
/*jsl:import ConfigTmpl.js*/


/**
  @class Singleton configuration for jschess
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var SvgConfigTmpl = Class.create(ConfigTmpl,/** @lends SvgConfigTmpl.prototype */ {
  /**
    creates a new instance
    @this {SvgConfigTmpl}
    @param {parent} $super prototype.js parent to enable to call the
    parent constructur.
    @return {SvgConfigTmpl} the new instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function($super) {
    $super();
    this.add({
      name: 'id',
      type: 't_string',
      required: true,
      description: 'id where to place the board',
      defaultValue: undefined
    });
    this.add({
      name: 'size',
      type: 't_number',
      required: false,
      description: 'size of the board',
      defaultValue: 500
    });
    this.add({
      name: 'black_color',
      type: 't_string',
      required: false,
      description: 'color of the black pieces',
      defaultValue: '#000000'
    });
    this.add({
      name: 'white_color',
      type: 't_string',
      required: false,
      description: 'color of the white pieces',
      defaultValue: '#ffffff'
    });
    this.add({
      name: 'black_square_color',
      type: 't_string',
      required: false,
      description: 'color of the black squares',
      defaultValue: '#819faa'
    });
    this.add({
      name: 'white_square_color',
      type: 't_string',
      required: false,
      description: 'color of the white squares',
      defaultValue: '#ffffff'
    });
    this.add({
      name: 'black_square_gradient',
      type: 't_string',
      required: false,
      description: 'gradient for black squares',
      defaultValue: '0-#91afba:0-#819faa:50-#819faa:100'
    });
    this.add({
      name: 'white_square_gradient',
      type: 't_string',
      required: false,
      description: 'gradient for white squares',
      defaultValue: '0-#eee:0-#fff:50-#fff:100'
    });
    // TODO: turn this to an enum: white, black, left, right
    this.add({
      name: 'boardview',
      type: 't_string',
      required: false,
      description: 'what board view to use',
      defaultValue: 'white'
    });
    this.add({
      name: 'move_ms',
      type: 't_number',
      required: false,
      description: 'ms for moving animation',
      defaultValue: 350
    });
    this.add({
      name: 'flip_ms',
      type: 't_number',
      required: false,
      description: 'how fast should flip work in ms',
      defaultValue: 350
    });
    this.add({
      name: 'pencolor',
      type: 't_string',
      required: false,
      description: 'pen color for drawing the shapes',
      defaultValue: 'black'
    });
    this.add({
      name: 'gradients',
      type: 't_boolean',
      required: false,
      description: 'should we use gradients?',
      defaultValue: true
    });
    this.add({
      name: 'select_color',
      type: 't_string',
      required: false,
      description: 'color of selected squares',
      defaultValue: '#ffff00'
    });
    this.add({
      name: 'over_color',
      type: 't_string',
      required: false,
      description: 'color of selected squares',
      defaultValue: '#00ff00'
    });
    this.add({
      name: 'do_select_click',
      type: 't_boolean',
      required: false,
      description: 'should we select clicks',
      defaultValue: false
    });
    this.add({
      name: 'do_select_square',
      type: 't_boolean',
      required: false,
      description: 'should we select squares',
      defaultValue: true
    });
    this.add({
      name: 'do_select_piece',
      type: 't_boolean',
      required: false,
      description: 'should we select pieces',
      defaultValue: true
    });
    this.add({
      name: 'do_select_global',
      type: 't_boolean',
      required: false,
      description: 'should we select pieces via the global variables',
      defaultValue: false
    });
    this.add({
      name: 'do_select_piecerec',
      type: 't_boolean',
      required: false,
      description: 'should we select pieces via the global variables',
      defaultValue: false
    });
    this.add({
      name: 'do_letters',
      type: 't_boolean',
      required: false,
      description: 'draw letters around the board',
      defaultValue: true
    });
    this.add({
      name: 'rec_stroke_color',
      type: 't_string',
      required: false,
      description: 'rectangles stroke color',
      defaultValue: 'black'
    });
    this.add({
      name: 'rec_stroke_width',
      type: 't_number',
      required: false,
      description: 'rectangles stroke width',
      defaultValue: 0.1
    });
    this.add({
      name: 'glow_width',
      type: 't_number',
      required: false,
      description: 'glow width',
      defaultValue: 7
    });
    this.add({
      name: 'glow_fill',
      type: 't_boolean',
      required: false,
      description: 'glow fill',
      defaultValue: false
    });
    this.add({
      name: 'glow_opacity',
      type: 't_number',
      required: false,
      description: 'glow opacity',
      defaultValue: 0.5
    });
    this.add({
      name: 'glow_offsetx',
      type: 't_number',
      required: false,
      description: 'glow offsetx',
      defaultValue: 0
    });
    this.add({
      name: 'glow_offsety',
      type: 't_number',
      required: false,
      description: 'glow offsety',
      defaultValue: 0
    });
    this.add({
      name: 'glow_color',
      type: 't_string',
      required: false,
      description: 'glow color',
      defaultValue: 'black'
    });
    this.add({
      name: 'partial',
      type: 't_number',
      required: false,
      description: 'how many squares for borders',
      defaultValue: 0.6
    });
  }
});


/**
  The static singleton instance.
  This is part of the singleton pattern.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
SvgConfigTmpl.instance = undefined;


/**
  The static singleton instance.
  This is part of the singleton pattern.
  @return {SvgConfigTmpl} the singleton SvgConfigTmpl instance.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
SvgConfigTmpl.getInstance = function() {
  if (SvgConfigTmpl.instance === undefined) {
    SvgConfigTmpl.instance = new SvgConfigTmpl();
  }
  return SvgConfigTmpl.instance;
};
/* vim:set filetype=javascript:*/
/*jsl:import Utils.js*/


/**
  @class Forward/Backwards controls.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var SvgControls = Class.create(/** @lends SvgControls.prototype */{
  /**
    creates a new instance
    @param {Config} config configuration for this instance.
    @return {SvgControls} the new instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(config) {
    Utils.pass(config);
  }
});

// the demo pages use this class as a browser global
window.SvgControls = SvgControls;
/* vim:set filetype=javascript:*/
/*jsl:import Utils.js*/
/*jsl:import SvgPathAndAttributes.js*/
/*jsl:import SvgPiece.js*/


/**
  @class static class to have just static methods for creating pieces
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var SvgCreator = Class.create(/** @lends SvgCreator.prototype */{
  /**
    creates a new instance
    @return {SvgCreator} the new instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function() {
    return;
  }
});


/**
  Method which creates a piece according to color and type
  @param {Config} config A configuration to work with.
  @param {PieceColor} pieceColor the color of the piece.
  @param {PieceType} pieceType the type of the piece.
  @return {SvgPiece} the newly created piece.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
SvgCreator.createPiece = function(config, pieceColor, pieceType) {
  // the 240.0 was found found empirically...
  var strokewidth = config.getValue('size') / 240.0;
  var stdatt = {
    'stroke-width': strokewidth,
    stroke: config.getValue('pencolor'),
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round'
  };
  var svgPiece;
  if (pieceColor.isWhite()) {
    // the first 0 is the direction of the gradient in degrees (0 is horizontal)
    //'fill': '0-#fff:0-#ccc:100',
    //'fill': '0-#fff:0-#fff:50-#999:100',
    // this is not the right way to make it hidden
    //'opacity':0,
    if (config.getValue('gradients')) {
      stdatt.fill = '0-#fff:0-#fff:50-#999:100';
    } else {
      stdatt.fill = config.getValue('white_color');
    }
    if (pieceType.isRook()) {
      svgPiece = new SvgPiece(45);
      svgPiece.add(new SvgPathAndAttributes(
          'M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L ' +
          '30,11 L 30,9 L 34,9 L 34,14', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 34,14 L 31,17 L 14,17 L 11,14', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 31,17 L 31,29.5 L 14,29.5 L 14,17', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11,14 L 34,14', stdatt));
      return svgPiece;
    }
    if (pieceType.isKnight()) {
      svgPiece = new SvgPiece(45);
      svgPiece.add(new SvgPathAndAttributes(
          'M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18 ' +
          '24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 ' +
          'C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C ' +
          '9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 ' +
          'C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L ' +
          '18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z',
          stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z',
          stdatt));
      return svgPiece;
    }
    if (pieceType.isBishop()) {
      svgPiece = new SvgPiece(45);
      svgPiece.add(new SvgPathAndAttributes(
          'M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,' +
          '35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 ' +
          '36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,' +
          '37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 ' +
          '9,36 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C ' +
          '30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,' +
          '14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5' +
          ' 15,32 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 25 8 A 2.5 2.5 0 1 1 20,8 A 2.5 2.5 0 1 1 25 8 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M' +
          ' 20,18 L 25,18', stdatt));
      return svgPiece;
    }
    if (pieceType.isQueen()) {
      svgPiece = new SvgPiece(45);
      // the head of the crown...
      svgPiece.add(new SvgPathAndAttributes(
          'M8,12C8,13.539600717839003,6.333333333333333,14.501851166488377,' +
          '5,13.732050807568877C4.381197846482994,13.374785217660714,4,' +
          '12.714531179816328,4,12C4,10.460399282160997,5.666666666666667,' +
          '9.498148833511623,7,10.267949192431123C7.618802153517006,' +
          '10.625214782339286,8,11.285468820183672,8,12C8,12,8,12,8,12',
          stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M24.5,7.5C24.5,9.039600717839003,22.833333333333332,' +
          '10.001851166488377,21.5,9.232050807568877C20.881197846482994,' +
          '8.874785217660714,20.5,8.214531179816328,20.5,7.5C20.5,' +
          '5.9603992821609975,22.166666666666668,4.998148833511623,23.5,' +
          '5.767949192431123C24.118802153517006,6.125214782339286,24.5,' +
          '6.785468820183672,24.5,7.5C24.5,7.5,24.5,7.5,24.5,7.5', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M41,12C41,13.539600717839003,39.333333333333336,' +
          '14.501851166488377,38,13.732050807568877C37.38119784648299,' +
          '13.374785217660714,37,12.714531179816328,37,12C37,' +
          '10.460399282160997,38.666666666666664,9.498148833511623,40,' +
          '10.267949192431123C40.61880215351701,10.625214782339286,41,' +
          '11.285468820183672,41,12C41,12,41,12,41,12', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M16,8.5C16,10.039600717839003,14.333333333333332,' +
          '11.001851166488377,13,10.232050807568877C12.381197846482994,' +
          '9.874785217660714,12,9.214531179816328,12,8.5C12,' +
          '6.9603992821609975,13.666666666666668,5.998148833511623,15,' +
          '6.767949192431123C15.618802153517006,7.125214782339286,16,' +
          '7.785468820183672,16,8.5C16,8.5,16,8.5,16,8.5', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M33,9C33,10.539600717839003,31.333333333333332,' +
          '11.501851166488377,30,10.732050807568877C29.381197846482994,' +
          '10.374785217660714,29,9.714531179816328,29,9C29,' +
          '7.4603992821609975,30.666666666666668,6.498148833511623,32,' +
          '7.267949192431123C32.61880215351701,7.625214782339286,33,' +
          '8.285468820183672,33,9C33,9,33,9,33,9', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 9,26 C 17.5,24.5 30,24.5 36,26 L 38,14 L 31,25 L 31,11 L 25.5,' +
          '24.5 L 22.5,9.5 L 19.5,24.5 L 14,10.5 L 14,25 L 7,14 L 9,26 z',
          stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C ' +
          '10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5' +
          ' 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,' +
          '33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5' +
          ' 17.5,24.5 9,26 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11.5,30 C 15,29 30,29 33.5,30', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 12,33.5 C 18,32.5 27,32.5 33,33.5', stdatt));
      return svgPiece;
    }
    if (pieceType.isKing()) {
      svgPiece = new SvgPiece(45);
      svgPiece.add(new SvgPathAndAttributes(
          'M 22.5,11.63 L 22.5,6', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 20,8 L 25,8', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 ' +
          '22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25',
          stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 ' +
          '41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L ' +
          '22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5' +
          ' L 11.5,37 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11.5,30 C 17,27 27,27 32.5,30', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11.5,37 C 17,34 27,34 32.5,37', stdatt));
      return svgPiece;
    }
    if (pieceType.isPawn()) {
      svgPiece = new SvgPiece(45);
      svgPiece.add(new SvgPathAndAttributes(
          'M 22,9 C 19.79,9 18,10.79 18,13 C 18,13.89 18.29,14.71 ' +
          '18.78,15.38 C 16.83,16.5 15.5,18.59 15.5,21 C 15.5,23.03 ' +
          '16.44,24.84 17.91,26.03 C 14.91,27.09 10.5,31.58 10.5,39.5 ' +
          'L 33.5,39.5 C 33.5,31.58 29.09,27.09 26.09,26.03 C 27.56,24.84 ' +
          '28.5,23.03 28.5,21 C 28.5,18.59 27.17,16.5 25.22,15.38 C 25.71,' +
          '14.71 26,13.89 26,13 C 26,10.79 24.21,9 22,9 z', stdatt));
      return svgPiece;
    }
  }
  if (pieceColor.isBlack()) {
    if (config.getValue('gradients')) {
      //stdatt.fill = '0-#000:0-#222:50-#555:100';
      stdatt.fill = '0-#555:0-#222:50-#000:100';
    } else {
      stdatt.fill = config.getValue('black_color');
    }
    if (pieceType.isRook()) {
      svgPiece = new SvgPiece(45);
      svgPiece.add(new SvgPathAndAttributes(
          'M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L ' +
          '30,11 L 30,9 L 34,9 L 34,14 L 11,14 z', stdatt));
      stdatt = Utils.clone(stdatt);
      stdatt.stroke = '#fff';
      svgPiece.add(new SvgPathAndAttributes(
          'M 12,35.5 L 33,35.5', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 13,31.5 L 32,31.5', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 14,29.5 L 31,29.5', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 14,16.5 L 31,16.5', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11,14 L 34,14', stdatt));
      return svgPiece;
    }
    if (pieceType.isKnight()) {
      svgPiece = new SvgPiece(45);
      svgPiece.add(new SvgPathAndAttributes(
          'M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18',
          stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 ' +
          '11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 ' +
          'C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 ' +
          '14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 ' +
          '16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10',
          stdatt));
      stdatt = Utils.clone(stdatt);
      stdatt.fill = '#fff';
      stdatt.stroke = '#fff';
      svgPiece.add(new SvgPathAndAttributes(
          'M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z',
          stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z',
          stdatt));
      stdatt = Utils.clone(stdatt);
      stdatt.fill = '#fff';
      stdatt.stroke = 'none';
      svgPiece.add(new SvgPathAndAttributes(
          'M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,' +
          '18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 ' +
          'L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,' +
          '11.02 25.06,10.5 L 24.55,10.4 z', stdatt));
      return svgPiece;
    }
    if (pieceType.isBishop()) {
      svgPiece = new SvgPiece(45);
      svgPiece.add(new SvgPathAndAttributes(
          'M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 ' +
          '32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 ' +
          '37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C ' +
          '19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 ' +
          '6,38 C 7.354,36.06 9,36 9,36 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 ' +
          '30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 ' +
          '22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 ' +
          '15,30 C 15,30 14.5,30.5 15,32 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 25 8 A 2.5 2.5 0 1 1 20,8 A 2.5 2.5 0 1 1 25 8 z', stdatt));
      stdatt = Utils.clone(stdatt);
      stdatt.stroke = '#fff';
      svgPiece.add(new SvgPathAndAttributes(
          'M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M ' +
          '20,18 L 25,18', stdatt));
      return svgPiece;
    }
    if (pieceType.isQueen()) {
      svgPiece = new SvgPiece(45);
      // the head of the crown...
      svgPiece.add(new SvgPathAndAttributes(
          'M8,12C8,13.539600717839003,6.333333333333333,14.501851166488377,' +
          '5,13.732050807568877C4.381197846482994,13.374785217660714,4,' +
          '12.714531179816328,4,12C4,10.460399282160997,5.666666666666667,' +
          '9.498148833511623,7,10.267949192431123C7.618802153517006,' +
          '10.625214782339286,8,11.285468820183672,8,12C8,12,8,12,8,12',
          stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M24.5,7.5C24.5,9.039600717839003,22.833333333333332,' +
          '10.001851166488377,21.5,9.232050807568877C20.881197846482994,' +
          '8.874785217660714,20.5,8.214531179816328,20.5,7.5C20.5,' +
          '5.9603992821609975,22.166666666666668,4.998148833511623,23.5,' +
          '5.767949192431123C24.118802153517006,6.125214782339286,24.5,' +
          '6.785468820183672,24.5,7.5C24.5,7.5,24.5,7.5,24.5,7.5', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M41,12C41,13.539600717839003,39.333333333333336,' +
          '14.501851166488377,38,13.732050807568877C37.38119784648299,' +
          '13.374785217660714,37,12.714531179816328,37,12C37,' +
          '10.460399282160997,38.666666666666664,9.498148833511623,40,' +
          '10.267949192431123C40.61880215351701,10.625214782339286,' +
          '41,11.285468820183672,41,12C41,12,41,12,41,12', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M16,8.5C16,10.039600717839003,14.333333333333332,' +
          '11.001851166488377,13,10.232050807568877C12.381197846482994,' +
          '9.874785217660714,12,9.214531179816328,12,8.5C12,' +
          '6.9603992821609975,13.666666666666668,5.998148833511623,' +
          '15,6.767949192431123C15.618802153517006,7.125214782339286,16,' +
          '7.785468820183672,16,8.5C16,8.5,16,8.5,16,8.5', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M33,9C33,10.539600717839003,31.333333333333332,11.501851166488377,' +
          '30,10.732050807568877C29.381197846482994,10.374785217660714,29,' +
          '9.714531179816328,29,9C29,7.4603992821609975,30.666666666666668,' +
          '6.498148833511623,32,7.267949192431123C32.61880215351701,' +
          '7.625214782339286,33,8.285468820183672,33,9C33,9,33,9,33,9',
          stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 ' +
          'L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 ' +
          'L 9,26 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 ' +
          'C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 ' +
          '27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 ' +
          '33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C ' +
          '27.5,24.5 17.5,24.5 9,26 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11,38.5 A 35,35 1 0 0 34,38.5', stdatt));
      stdatt = Utils.clone(stdatt);
      stdatt.stroke = '#fff';
      svgPiece.add(new SvgPathAndAttributes(
          'M 11,29 A 35,35 1 0 1 34,29', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 12.5,31.5 L 32.5,31.5', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11.5,34.5 A 35,35 1 0 0 33.5,34.5', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 10.5,37.5 A 35,35 1 0 0 34.5,37.5', stdatt));
      return svgPiece;
    }
    if (pieceType.isKing()) {
      svgPiece = new SvgPiece(45);
      svgPiece.add(new SvgPathAndAttributes('M 22.5,11.63 L 22.5,6', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 ' +
          '24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C ' +
          '18,17.5 22.5,25 22.5,25', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11.5,37 C 17,40.5 27,40.5 32.5,37 L ' +
          '32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C ' +
          '34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 ' +
          'C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 ' +
          '11.5,29.5 L 11.5,37 z', stdatt));
      svgPiece.add(new SvgPathAndAttributes('M 20,8 L 25,8', stdatt));
      stdatt = Utils.clone(stdatt);
      stdatt.stroke = '#fff';
      svgPiece.add(new SvgPathAndAttributes(
          'M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 ' +
          '25,18 22.5,24.5 L 22.51,26.6 L 22.5,24.5 C 20,18 9.906,14 ' +
          '6.997,19.85 C 4.5,25.5 11.85,28.85 11.85,28.85', stdatt));
      svgPiece.add(new SvgPathAndAttributes(
          'M 11.5,30 C 17,27 27,27 32.5,30 M 11.5,33.5 C 17,30.5 ' +
          '27,30.5 32.5,33.5 M 11.5,37 C 17,34 27,34 32.5,37', stdatt));
      return svgPiece;
    }
    if (pieceType.isPawn()) {
      svgPiece = new SvgPiece(45);
      svgPiece.add(new SvgPathAndAttributes('M 22,9 C 19.79,9 18,10.79 18,13 ' +
          'C 18,13.89 18.29,14.71 18.78,15.38 C 16.83,16.5 ' +
          '15.5,18.59 15.5,21 C 15.5,23.03 16.44,24.84 ' +
          '17.91,26.03 C 14.91,27.09 10.5,31.58 10.5,39.5 ' +
          'L 33.5,39.5 C 33.5,31.58 29.09,27.09 ' +
          '26.09,26.03 C 27.56,24.84 28.5,23.03 28.5,21 C ' +
          '28.5,18.59 27.17,16.5 25.22,15.38 C ' +
          '25.71,14.71 26,13.89 26,13 C 26,10.79 24.21,9 ' +
          '22,9 z', stdatt));
      return svgPiece;
    }
  }
  throw 'unknown piece ' + pieceType;
};
/* vim:set filetype=javascript:*/


/**
  @class a path + attributes two tuple object
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var SvgPathAndAttributes = Class.create(/** @lends SvgPathAndAttributes.prototype */{
  /**
    creates a new instance
    @this {SvgPathAndAttributes}
    @param {string} path string representing SVG path.
    @param {object} attr object with attributes for said path.
    @return {SvgPathAndAttributes} the new instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(path, attr) {
    this.path = path;
    this.attr = attr;
  },
  /**
    toString method that allows you to get a nice printout for this type
    @this {SvgPathAndAttributes}
    @return {string} string representation of this instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    return [this.path, this.attr].join();
  }
});
/* vim:set filetype=javascript:*/


/**
  @class A single piece description.
  This includes: square size (assumes piece is 0,0,size,size)
  and array of paths and attributes to draw the path
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var SvgPiece = Class.create(/** @lends SvgPiece.prototype */{
  /**
    creates a new instance
    @this {SvgPiece}
    @param {number} size of the square of the piece.
    @return {SvgPiece} a new object of this type.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(size) {
    this.size = size;
    this.paas = [];
  },
  /**
    Adds a new path section to a piece description
    @this {SvgPiece}
    @param {PathAndAttributes} paa object to be added.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  add: function(paa) {
    this.paas.push(paa);
  },
  /**
    Create a Raphael.js set from this object
    @this {SvgPiece}
    @param {paper} paper Raphael.js paper to work on.
    @param {transform} transform Raphael.js transformating for this object.
    @return {set} the set after the transformation.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toSet: function(paper, transform) {
    var set = paper.set();
    this.paas.forEach(function(paa) {
      var orig_path = paa.path;
      var new_path = Raphael.transformPath(orig_path, transform);
      var el = paper.path(new_path);
      el.attr(paa.attr);
      //el.hide();
      set.push(el);
    });
    return set;
  }
});
/* vim:set filetype=javascript:*/


/**
  @class represents a position + graphics
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var SvgPieceData = Class.create(/** @lends SvgPieceData.prototype */{
  /**
    creates a new instance
    @this {SvgPieceData}
    @param {set} set raphael set for the piece.
    @param {SvgPixelPosition} pixelPos position for the pieces origin.
    This is important to be able to move it to other places
    pixelPos is not the translation of pos to pixels!!!
    @return {SvgPieceData} the new instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(set, pixelPos) {
    this.set = set;
    this.pixelPos = pixelPos;
    this.extra = undefined;
  },
  /**
    toString method that allows you to get a nice printout for this type
    @this {SvgPieceData}
    @return {string} a string representation of this instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    return [this.set, this.pixelPos, this.extra].join();
  },
  /**
    ForEach method on all presentation elements
    @this {SvgPieceData}
    @param {function()} f function to activate on each element.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  forEach: function(f) {
    //var that=this;
    this.set.forEach(function(el) {
      f(el);
    });
    if (this.extra !== undefined) {
      this.extra.forEach(function(el) {
        f(el);
      });
    }
  }
});
/* vim:set filetype=javascript:*/


/**
  @class represents a position on the screen (in pixels)
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var SvgPixelPosition = Class.create(/** @lends SvgPixelPosition.prototype */{
  /**
    creates a new instance
    @this {SvgPixelPosition}
    @param {number} x x co-ordinate.
    @param {number} y y co-ordinate.
    @return {SvgPixelPosition} the new instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(x, y) {
    /*
    if(x<0) {
      throw 'bad value for x '+x+','+typeof(x);
    }
    if(y<0) {
      throw 'bad value for y '+y+','+typeof(y);
    }
    */
    this.x = x;
    this.y = y;
  },
  /**
    toString method so that you can get a nice printout of instances
    of this type
    @this {SvgPixelPosition}
    @return {string} string representation of this object.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  toString: function() {
    return '(' + this.x + ',' + this.y + ')';
  }
});
/* vim:set filetype=javascript:*/


/**
  @class a class to have static utility functions
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var Utils = Class.create(/** @lends Utils.prototype */{
  /**
    creates a new instance
    @return {Utils} the new instance.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function() {
    return;
  }
});


/**
  Unite two javascript objects into a third one.
  Second trumps the first.
  @param {object} o1 first object.
  @param {object} o2 first object.
  @return {object} object which is the unification of the two objects.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Utils.unite = function(o1, o2) {
  var ret = {};
  var x, y;
  for (x in o1) {
    ret[x] = o1[x];
  }
  for (y in o2) {
    ret[y] = o2[y];
  }
  return ret;
};


/**
  Clone a javascript object
  @param {object} o the object to shalow clone.
  @return {object} object which is a clone of the original one.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Utils.clone = function(o) {
  var ret = {};
  var x;
  for (x in o) {
    ret[x] = o[x];
  }
  return ret;
};


/**
  Fake using a parameter.
  This is mainly used to avoid lint warnings.
  Pass as many args as you like to this function.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Utils.fakeUse = function() {
  if (Utils.nottrue) {
    window.junkVar = 'junkVal';
  }
};


/**
  Fake doing something
  This is mainly used to avoid lint warnings.
  Pass as many args as you like to this function.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Utils.pass = function() {
  return;
};


/**
  Shallow copy an array
  @param {Array} a the array to copy.
  @return {Array} The copy of the array.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Utils.arrClone = function(a) {
  return a.slice();
  /*
  var ret=[];
  a.forEach(function(x) {
    ret.push(x);
  });
  return ret;
  */
};


/**
  Return the type of a variable
  @param {anything} v the variable
  @return {string} the type.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Utils.getType = function(v) {
  return typeof v;
};


/**
  Check the type of a javascript variable
  This method will throw an exception if the check fails.
  @param {anything} v the variable to check.
  @param {string} t the string representation of the name of the
  type v should be of.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Utils.checkType = function(v, t) {
  if (Utils.getType(v) !== t) {
    throw 'type is wrong';
  }
};


/**
  Checks whether one dictionary contains all the keys of the
  other Throws an exceptions if that is not the case.
  @param {object} s1 first set.
  @param {object} s2 second set.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Utils.checkContains = function(s1, s2) {
  var x;
  for (x in s1) {
    if (!(Object.prototype.hasOwnProperty.call(s2, x))) {
      throw 'key ' + x + ' is bad';
    }
  }
};


/**
  Checks whether one dictionary key set equals that of another.
  other Throws an exceptions if that is not the case.
  @param {object} s1 first set.
  @param {object} s2 second set.
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
Utils.checkEquals = function(s1, s2) {
  Utils.checkContains(s1, s2);
  Utils.checkContains(s2, s1);
};
/* vim:set filetype=javascript:*/


/**
  @class Wrapper for Raphael.js set
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var WSet = Class.create(/** @lends WSet.prototype */{
  /**
    @this {WSet}
    @param {set} set the raphael set that this wraps.
    @param {wrapper} wrapper the raphael wrapper (with paper and all).
    @return {WSet} a new instance of this class.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function(set, wrapper) {
    this.set = set;
    this.wrapper = wrapper;
  },
  /**
    wrapper for the Raphael.js method of the same name.
    Pass anything you want to raphael.
    @this {WSet}
    @return {anything} anything that Raphael.js returns from this method.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  push: function() {
    var m = this.set.push;
    var r = m.apply(this.set, arguments);
    return r;
  },
  /**
    wrapper for the Raphael.js method of the same name.
    Pass anything you want to raphael.
    @this {WSet}
    @return {anything} anything that Raphael.js returns from this method.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  remove: function() {
    var m = this.set.remove;
    var r = m.apply(this.set, arguments);
    return r;
  },
  /**
    wrapper for the Raphael.js method of the same name.
    Pass anything you want to raphael.
    @this {WSet}
    @return {anything} anything that Raphael.js returns from this method.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  forEach: function() {
    var m = this.set.forEach;
    var r = m.apply(this.set, arguments);
    return r;
  },
  /**
    make a set glow
    @this {WSet}
    @param {object} glow_obj parameters to pass to the Raphael.js glow method.
    @return {set} the set of glow objects.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  glow: function(glow_obj) {
    var nset = this.wrapper.set();
    this.forEach(function(e) {
      nset.push(e.glow(glow_obj));
    },undefined);
    return nset;
  },
  /**
    setup events for this set
    @this {WSet}
    @param {function()} f callback. Callback should receive the type of the
      event.
    @param {object} names of events to register.
    supported are: click, mouseover, mouseout, mousemove, mouseup,
    mousedown.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  eventRegister: function(f, names) {
    var that = this;
    names.forEach(function(eventName) {
      that.forEach(function(e) {
        switch (eventName) {
          case 'click':
            e.click(function() {
              f(eventName);
            });
            break;
          case 'mouseover':
            e.mouseover(function() {
              f(eventName);
            });
            break;
          case 'mouseout':
            e.mouseout(function() {
              f(eventName);
            });
            break;
          case 'mousemove':
            e.mousemove(function() {
              f(eventName);
            });
            break;
          case 'mouseup':
            e.mouseup(function() {
              f(eventName);
            });
            break;
          case 'mousedown':
            e.mousedown(function() {
              f(eventName);
            });
            break;
          default:
            throw 'unknown event name ' + eventName;
        }
      });
    });
  }
});


/**
  @class Wrapper for Raphael.js
  @author mark.veltzer@gmail.com (Mark Veltzer)
*/
var WRaphael = Class.create(/** @lends WRaphael.prototype */{
  /**
    creates a new instance.
    Pass anything you want to raphael.
    @this {WRaphael}
    @return {WRaphael} a new instance of this class.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  initialize: function() {
    this.r = Raphael.apply(undefined, arguments);
  },
  /**
    create a rectangle on the paper.
    Pass anything you want to raphael.
    @this {WRaphael}
    @return {rect} whatever Raphael returns.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  rect: function() {
    var m = this.r.rect;
    var r = m.apply(this.r, arguments);
    return r;
  },
  /**
    create a set on the paper.
    Pass anything you want to raphael.
    @this {WRaphael}
    @return {set} our wrapper for Raphael sets.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  set: function() {
    var m = this.r.set;
    var r = m.apply(this.r, arguments);
    return new WSet(r, this);
  },
  /**
    create path on the paper.
    Pass anything you want to raphael.
    @this {WRaphael}
    @return {path} whatever Raphael returns.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  path: function() {
    var m = this.r.path;
    var r = m.apply(this.r, arguments);
    return r;
  },
  /**
    create text on the paper.
    Pass anything you want to raphael.
    @this {WRaphael}
    @return {text} whatever Raphael returns.
    @author mark.veltzer@gmail.com (Mark Veltzer)
  */
  text: function() {
    var m = this.r.text;
    var r = m.apply(this.r, arguments);
    return r;
  }
});
/* This file is a bunch of exten definitions to keep the google
closure compiler happy */
function Chess() {};
function Ajax() {};
function Raphael() {};
function Class() {};
function $() {};
goog.provide('$');
goog.provide('Ajax');
goog.provide('Chess');
goog.provide('Class');
goog.provide('Raphael');
goog.require('$');
goog.require('Ajax');
goog.require('Chess');
goog.require('Class');
goog.require('Raphael');
