var drawnShapes = [];
var undoneShapes = [];
var currShape = undefined;
var startX;
var startY;
var prevX;
var currX;
var prevY;
var currY;
var isDrawing = false;
var clickedshape = undefined;
var clickedEvent = undefined;
var inputbox = undefined;
var textbox = undefined;
var typing = false;

$(document).ready(function() {

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    document.getElementById('divtextbox').addEventListener('keypress', handleKeyPress);
    document.getElementById('divtextbox').addEventListener('keyup', handleKeyUp);

    

    function redraw() {
        if (clickedshape != "pen") {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        //console.log('sup');
        for (var i = 0; i < drawnShapes.length; i++) {
            drawnShapes[i].draw();
        }
    }

    function undo() {
        if (drawnShapes.length === 0) {
            console.log("There are no shapes to redo");
        } else {
            undoneShapes.push(drawnShapes.pop());
            redraw();
        }
    }

    function redo() {
        if (undoneShapes.length === 0) {
            console.log("There are no shapes to redo");
        } else {
            drawnShapes.push(undoneShapes.pop());
            redraw()
        };
    }

    function drag() {
    	for(var i = drawnShapes.length - 1; i >= 0; i--) {
    		if(drawnShapes[i].x == this.x & drawnShapes[i].y == this.y) {
    			drawnShapes[i].x == 0 & drawnShapes[i].y == 0;
    		}
    	}
    }




});

//git add .
//git commit -m ""
//git pull 
//git push

