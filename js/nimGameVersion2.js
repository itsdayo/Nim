
var theCanvas;
var theCanvasOffset;
var g2D;
var mX, mY;
var bwidth = 800;
var bheight = 650;
var backgroundImage = new Image();
var image = new Image();
var branch = new Image();
var highlight = new Image();
var hand1 = new Image();
var hand2 = new Image();
var hwidth = 100, hheight =130;
var h1x = 0, h1y = bheight-hheight;
var h2x = bwidth-100, h2y = bheight-hheight;  
var resetButton = new Image();
var undoButton = new Image();
var cpuButton = new Image();
var cpuButtonS = new Image();
var arm = new Image();
var armS = new Image();
var undoX = 618, undoY = 4; 
var cpuX = 457, cpuY = -15;
var armX = 257, armY = -15;
var row1Y = bheight-475, row2Y = bheight-375, row3Y = bheight- 275;
var row4Y =  bheight-175, row5Y =  bheight-75;
var game;


function getMouseXY(e){
    mX = e.pageX-theCanvasOffset.left;
    mY = e.pageY-theCanvasOffset.top;
    if (mX<0){ 
        mX = 0
    }else if (mX>theCanvas.width){
        mX = theCanvas.width;
    }
    if (mY<0) {
        mY = 0;
    } else if (mY > theCanvas.height){
        mY = theCanvas.height;
    }
}//getMouseXY

function clearCanvas() {
    g2D.clearRect(0, 0, theCanvas.width, theCanvas.height);
    g2D.drawImage(backgroundImage, 0, 0, theCanvas.width, theCanvas.height)
}//clearCanvas

function drawButtons(playingCPU){  	
    g2D.drawImage(resetButton, 17,3, 120, 120);
    g2D.drawImage(undoButton, undoX, undoY, 120,120);
    if(!playingCPU){
    	g2D.drawImage(armS, armX, armY, 130, 130);
    	g2D.drawImage(cpuButton, cpuX, cpuY, 130, 130);
   	}else{
    	g2D.drawImage(arm, armX, armY, 130, 130);
    	g2D.drawImage(cpuButtonS, cpuX, cpuY, 130, 130);
    }   
}//drawButtons

function doPaintCanvas(){
    clearCanvas();
    game.draw();
}// doPaintCanvas

function showDialog1 (title, message){
 	$("#dialog1").empty();
 	$("#dialog1").append( "<p>"+ message +"</p>");
 	$("#dialog1").dialog("option", "title", title);
 	$( "#dialog1" ).dialog("option", "position", { my: "center", at: "center", of: "canvas" });
 	$("#dialog1").dialog({
      		modal: true,
      		buttons: {
        	   Ok: function() { $( this ).dialog( "close" );}
            }
    });
    $( "#dialog1" ).dialog("open");
};//showDialog1
                               
                               
function updateNumberOfStones(n){
	  $('#stoneCount').text(n.toString());
	  if (n<1 && game.player1){
	 	  showDialog1("Game Over", "Player 1 Wins!");
	 } else if (n<1 && game.player2){
	 	  if (game.playingCPU){ 
	 	  	showDialog1("Game Over", "Sorry Human loses!");
	 	  }	else { 
	 		showDialog1("Game Over", "Player 2 Wins");	
	 	  }
	}
}//updateNumberOfStones	 	



function doStart(){
	
    backgroundImage.src = "images/grassbackground.png";
    image.src = "images/rockV3.png";
    branch.src = "images/stick638x108.png";
    highlight.src = "images/highlight.png";
    hand1.src = "images/hand1.png";
    hand2.src = "images/hand2.png";
    resetButton.src = "images/clover.png"
    undoButton.src = "images/backbutton.png"
    cpuButton.src = "images/robot arm.png"
    cpuButtonS.src = "images/robot armS.png"
    arm.src = "images/arm.png"
    armS.src = "images/selectedArm.png"
   
 
    $("#dialog1").dialog({autoOpen: false});
   	
    function rock(id, row,x, y) {
        this.id = id;
        this.row = row;
        this.x = x;
        this.y = y;
        this.w = 100;
        this.h = 50;
        this.selected = false;
        this.visible = true;
    
        this.draw = draw;
        function draw(){
   	        if(this.visible){
 			    if (this.selected){
 				    g2D.drawImage(highlight, this.x, this.y, this.w/2, this.h/2);
			    }else{
				    g2D.drawImage(image, this.x, this.y, this.w, this.h);	
	 	        }
 	        }
 	    }//draw
    
        this.inRock = inRock;
        function inRock(x, y){
     	    x -= 50; y -= 25;
     	    return (Math.abs(this.y - y) < 25) && (Math.abs(this.x - x) <50)
        }
  
    }//rock

    function gameBoard(maxRows){ 

        this.maxRows = maxRows;
        this.board = new Array();
        this.selectedRow = 0;
        this.totalRocks = 15;
        this.player1 = true;
        this.player2 = false;
		this.player2cpu = false; 
		this.lastMove = [false, false, false, false, false];
		this.moveMade = false;
		this.rowCounts = [5, 4, 3, 2, 1];
		this.XorSum = 1;
		this.XorCounts = [4,5,2,3,0];
		this.XorRowMin = 0;
		this.XorMinIndex= 4;
		this.Started = false;
		this.playingCPU = false;
   
		this.init = init;
		function init(){
	  
			for (var r = 0; i< 5; i++){
				this.board[r] = new Array();
			}
   
		   
		//row 1
			var  row1 = new Array(); 
			for (var i = 1; i < 6; i++){
				x = bwidth - (220 + 75*i)
				row1[i - 1] = new rock(i, 1, x, row1Y);
			}
			this.board[0] = row1;
	
		//row 2
			var row2 = new Array(); 
			for (var i = 1; i < 5; i++){
				x = bwidth - (260 + 75*i)
				row2[i - 1] = new rock(i, 2, x, row2Y);
			}
			this.board[1] = row2;
	
		//row 3
			var row3 = new Array();    
			for (var i = 1; i < 4; i++){
				x = bwidth - (300 + 75*i)
				row3[i - 1] = new rock(i, 3, x, row3Y);
			}
			this.board[2] = row3;
		
		// row 4 
			var row4 = new Array();   
			for (var i = 1; i < 3; i++){
				x = bwidth - (340 + 75*i)
				row4[i - 1] = new rock(i, 4, x, row4Y);
			}
			this.board[3] = row4 ;
		
		//row 5
			var row5 = new Array();
			for (var i = 1; i < 2; i++){
				x = bwidth-(380 + 75*i)
				row5[i-1] = new rock(i, 5, x, row5Y);
			}
			this.board[4] = row5;
		
		}//init
	
		this.draw = draw;
		function draw(){
		
			drawButtons(this.playingCPU);    
			for(var r = 0; r < this.board.length; r++) {
				var row = this.board[r];
				for (var roc  = 0; roc < row.length; roc++){
					row[roc].draw();
				}
				if (this.selectedRow == r){
					g2D.drawImage(branch, 30, row[0].y + 20, 700, 40);
				}	 
			}
		
			if (this.player1){
				g2D.drawImage(hand1, 0, bheight - 120, 100, 120 );
			}
			if (this.player2){
				if(game.playingCPU){
					g2D.drawImage(cpuButton, bwidth - 120, bheight - 120, 120, 120);
				} else {
					g2D.drawImage(hand2, bwidth - 120, bheight - 120, 100, 120);
				}
			}
		
			g2D.drawImage(resetButton, 17,3, 120, 120);
			g2D.drawImage(undoButton, undoX, undoY, 120, 120);
		
		}//draw
  
		this.findRow = findRow
		function findRow(y){
			this.selectedRow = -1;
			y -= 25;
			if (Math.abs(row1Y - y) < 25){
			   this.selectedRow  = 0;
			} else if (Math.abs(row2Y - y) < 25){
				this.selectedRow = 1;
			} else if (Math.abs(row3Y - y) < 25){
				this.selectedRow = 2;
			} else if (Math.abs(row4Y - y) < 25){
				this.selectedRow = 3;
			} else if (Math.abs(row5Y - y) < 25){
				this.selectedRow = 4;
			}
			return (this.selectedRow > -1)
		}// findRow
	
		this.findStone = findStone;
		function findStone(x, y){
			var curSelectedRow = this.selectedRow;
			if ((curSelectedRow > -1) && this.findRow(y) && (this.selectedRow == curSelectedRow)) {
				var row = this.board[curSelectedRow];
				for(var c = 0; c< row.length; c++){
				   var rock = row[c];
				   if (rock.inRock(x, y)){
					  return rock;  
					}
				}
			} else{
				this.selectedRow  = curSelectedRow;
			}
			return null;
		}//FindStone
		   
		this.inHand1 = inHand1;
		function inHand1(x , y){
			x -= hwidth/2;
			y -= hheight/2;
			return (Math.abs(x - h1x) < hwidth/2) && (Math.abs(y - h1y) < hheight/2); 
		}//inHand1

		this.inHand2 = inHand2;
		function inHand2(x , y){
			x -= hwidth/2;
			y -= hheight/2;
			return (Math.abs(x - h2x) < hwidth/2) && (Math.abs(y - h2y) < hheight/2); 
		}//inHand2
	  
		this.inCPU = inCPU;
		function inCPU(x , y){
			x -= hwidth/2;
			y -= hheight/2;
			return (Math.abs(cpuX - x) < hwidth/2) && (Math.abs(cpuY - y) < hheight/2); 	 
		}//inCPU
	  
		this.inArm = inArm;
		function inArm(x , y){
			x -= hwidth/2;
			y -= hheight/2;
			return (Math.abs(armX - x) < hwidth/2) && (Math.abs(armY - y) < hheight/2);
		}// inArm
	  
		this.inResetButton = inResetButton;
		function inResetButton(x , y){
				x -= 60; y -= 60;
				return (Math.abs(17 - x) < 60) && (Math.abs(3 - y) < 60); 
		}// inResetButton

		this.inUndoButton = inUndoButton;
		function inUndoButton(x , y) {
			x-=60; y-=60;
			return (Math.abs(undoX-x) < 60) && (Math.abs(undoY-y) < 60); 
		};//inUndoButton
		
		this.cpuDelete = cpuDelete;
		function cpuDelete(){
			this.countStonescpu();
			this.selectedRow = this.XorMinIndex;
			var deleteNum = this.rowCounts[this.selectedRow ] - this.XorRowMin;
			if (deleteNum <= 0){
				deleteNum = 1;
				if (this.rowCounts[this.selectedRow ] == 0 ){
					for (var r = 0; r < this.rowCounts.length; r++){
						if (this.rowCounts[r]> 0){
							this.selectedRow = r;
							break;
						}
					}
				}
			}  
		
			var row = this.board[this.selectedRow]; 
			var lastMove = new Array();
			for (var c = 0; c < row.length; c++){
				if (row[c].visible && (deleteNum > 0)){
					row[c].visible = false;
					row[c].selected = false;
					lastMove[c] = true;
					this.totalRocks -= 1;
					deleteNum -= 1;
				} else if(deleteNum > 0){
					lastMove[c] = false;
				}  
			}
			this.lastMove = lastMove;
			this.moveMade = true;
		}// cpuDelete
 
		this.deleteStones = deleteStones;
		function deleteStones(){ 
			var row = this.board[this.selectedRow]; 
			var lastMove = new Array();
			var stoneDeleted = false;
			for ( var c = 0; c < row.length; c++){
				if (row[c].selected){
					row[c].visible = false;
					row[c].selected = false;
					lastMove[c] = true;
					this.totalRocks -= 1;
					stoneDeleted = true;
				} else{
					lastMove[c] = false;
				}  
			}
			this.lastMove = lastMove;
			this.moveMade = true;
			return stoneDeleted;
		}//delete stones
	  
		this.undoMove = undoMove;
		function undoMove(){
		var row = this.board[this.selectedRow];
			  for (var c = 0; c < row.length; c++){
				if (this.lastMove[c]){
					row[c].visible = true;
					row[c].selected = true;
					this.totalRocks += 1;	
				}
			}
			if (this.player1){
				this.switchPlayers(2);
			} else if (this.player2){
				this.switchPlayers(1);
			}
			this.moveMade = false;
		}//undoMove
			
		this.deselectStones = deselectStones;
		function deselectStones(){ 
			var row = this.board[this.selectedRow];
			for ( var c = 0; c < row.length; c++){
				if (row[c].selected){
					row[c].selected = false;
				}
			}
		}//deselectStones stones
	  
		this.resetStones = resetStones;
		function resetStones(){ 
			for(var r = 0; r < this.board.length; r++){
				var row = this.board[r];
				for ( var c = 0; c < row.length; c++){
					   row[c].visible =  true;
					   row[c].selected = false;
				}
			}
			this.totalRocks = 15;
			this.switchPlayers(1); 
			this.rowCounts = [5, 4, 3, 2, 1];
			this.playingCPU = false;   
		}//resetStones stones
			   
		this.switchPlayers = switchPlayers;
		function switchPlayers(p){
			if  (p == 1){
				this.player1 = true;
				this.player2 = false;
			} else if (p == 2){
				this.player1 = false;
				this.player2 = true;
			}
		}//switchPlayers
	  
		this.countStones = countStones;
		function countStones(){
			this.XorSum = 0;
			for (var r = 0; r < this.board.length; r++) {
				var row = this.board[r];
				var sum = 0;
				for (var roc  = 0; roc< row.length; roc++){
					if (row[roc].visible) {
						sum += 1;	
					}
				}
				this.rowCounts[r] = sum;
				this.XorSum = this.XorSum ^ sum;	
			}
	 
			var minvalue = 1000;
			var minIndex = -1;
			for (var r = 0; r< this.board.length; r++ ){
				var a = this.rowCounts[r] ^this.XorSum;
				this.XorCounts[r] = a;
				if (a < minvalue){
					minvalue = a;
					minIndex = r;
				}
			}  
			this.XorRowMin = minvalue;
			this.XorMinIndex = minIndex;
	 
			if (this.XorSum == 0){
				showDialog1("Nim", "Good Move!");
			}
	
		}//countStones 
	
		this.countStonescpu = countStonescpu;
		function countStonescpu(){
			this.XorSum = 0;
			for (var r = 0; r < this.board.length; r++) {
				var row = this.board[r];
				var sum = 0;
	 
				for (var roc  = 0; roc< row.length; roc++){
					if (row[roc].visible) {
						sum += 1;
					
					}
				}
				this.rowCounts[r] = sum;
				this.XorSum = this.XorSum ^ sum;
			
			} 
			var minvalue = 1000;
			var minIndex = -1;
			for (var r = 0; r< this.board.length; r++ ){
				var a = this.rowCounts[r] ^this.XorSum;
				this.XorCounts[r] = a;
				if (a < minvalue){
					minvalue = a;
					minIndex = r;
				}
			}  
			this.XorRowMin = minvalue;
			this.XorMinIndex = minIndex;
	
		}//countStonescpu 
 
	}//gameBoard 
  
 
    theCanvas = document.getElementById('myCanvas');
    theCanvasOffset = $('#myCanvas').offset();
    g2D = theCanvas.getContext("2d");
    $('#myCanvas').attr('style', "border: 7px solid;" );
   
    game = new gameBoard(5);
    game.init();
       
    $('#myCanvas').mouseenter( function(e) { getMouseXY(e); });
     
    $('#myCanvas').mousedown( function(e) {
   	    
        getMouseXY(e);
        if(!game.Started && game.inCPU(mX,mY)){
 		    game.playingCPU = true;
 		    showDialog1("Starting New Game", "Playing CPU!");
 		   doPaintCanvas();
 	    } else if(!game.Started && game.inArm(mX,mY)){ 
 		    game.playingCPU = false;
 		    showDialog1("Starting New Game", "Playing Human!");
 		    doPaintCanvas();
        } else if (game.selectedRow < 0){  
        	if (game.findRow(mY)) {
                doPaintCanvas(); 
                gameStarted = true;
        	}	   	     
        } else if (game.player1 && game.inHand1(mX,mY)){
      		var stoneDeleted = game.deleteStones();
      		if (stoneDeleted){
      		    game.countStones();
      		    updateNumberOfStones(game.totalRocks); 
      		    game.switchPlayers(2);
      		    doPaintCanvas();
      		}else{
      		    showDialog1 ("Error!", "Player 1 must select at least one stone!");
      		}
        } else if (game.player2 && game.inHand2(mX,mY)){
      		if(game.playingCPU){
      			game.cpuDelete();
      			updateNumberOfStones(game.totalRocks);  
      		    game.switchPlayers(1);
      		    doPaintCanvas();
      	    } else {
      	        var stoneDeleted = game.deleteStones();
      		    if (stoneDeleted){
      		        game.countStones();
      		        updateNumberOfStones(game.totalRocks); 
      		        game.switchPlayers(1);
      		        doPaintCanvas();
      		    }else{
      		        showDialog1 ("Error!", "Player 2 must select at least one stone!");
      		    }
            } 
        } else if (game.inResetButton(mX,mY)){
      		game.resetStones();
      		updateNumberOfStones(game.totalRocks); 
      		doPaintCanvas();	
        } else if (game.moveMade && game.inUndoButton(mX,mY)){
      		game.undoMove();
      		updateNumberOfStones(game.totalRocks); 
      		doPaintCanvas(); 
        } else {
        	var stone = game.findStone(mX, mY);
        	if (stone != null){
        	    stone.selected = true;
        	    doPaintCanvas();
        	 } else {
        	 	game.deselectStones();
        	 	if (game.findRow(mY)){ 
                   doPaintCanvas(); 
                }
        	 }	
        }
    });//mousedown
     
     
    $('#myCanvas').mousemove( function(e) { getMouseXY(e); });
     
    $('#myCanvas').mouseup( function(e) { }); 
     
    image.onload = function(){ doPaintCanvas(); };
        
 } //doStart
 

$(document).ready(function(){ doStart(); });




