var drawnShapes = [];
var currShape = undefined;
var startX;
var startY;
var isDrawing = false;

$(document).ready(function() {

    console.log("Ready!");
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    function rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    rectangle.prototype.draw = function() {
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    $("#myCanvas").mousedown(function(e) {
        console.log("clicked");
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;

        startX = x;
        startY = y;
        isDrawing = true;
        currShape = new rectangle(x, y);
    });

    $("#myCanvas").mousemove(function(e) {
        if (isDrawing === true) {
            var w = e.pageX - startX;
            var h = e.pageY - startY;
            currShape.width = w;
            currShape.height = h;
            redraw();
            currShape.draw();
        }
    });

    $("#myCanvas").mouseup(function(e) {
        isDrawing = false;
        drawnShapes.push(currShape);
        redraw();
    })

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < drawnShapes.length; i++) {
            drawnShapes[i].draw();
        }
    }

});

//git add .
//git commit -m ""
//git pull 
//git push