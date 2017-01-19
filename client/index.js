var drawnShapes = [];
var currShape = undefined;
var startX;
var startY;
var isDrawing = false;
var clickedshape = undefined;

$(document).ready(function() {

    console.log("Ready!");
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    function Circle(x, y, radius, sAngle, eAngle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sAngle = sAngle;
        this.eAngle = eAngle;
    }

    function Line(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    Rectangle.prototype.draw = function() {
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    Circle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.sAngle, this.eAngle);
        ctx.stroke();
    }

    Line.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }

    $(".Shape").click(function() {
        clickedshape = $(this).attr('id');
        $(".Shape").removeClass("active");
        $(this).addClass("active");

        switch (clickedshape) {
            case "rect":
            case "circle":
            case "line":
        }

    });

    $("#myCanvas").mousedown(function(e) {
        console.log("clicked");
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;

        startX = x;
        startY = y;
        isDrawing = true;

        switch (clickedshape) {
            case "rect":
                currShape = new Rectangle(x, y);
                break;
            case "circle":
                currShape = new Circle(x, y);
                break;
            case "line":
                currShape = new Line(startX, startY)

        }
    });

    $("#myCanvas").mousemove(function(e) {
        if (isDrawing === true) {
            if (clickedshape === "rect") {
                var w = e.pageX - startX;
                var h = e.pageY - startY;
                currShape.width = w;
                currShape.height = h;
            } else if (clickedshape === "circle") {
                var dia = e.pageX - startX;
                currShape.radius = Math.abs(dia / 2);
                currShape.sAngle = 0;
                currShape.eAngle = 2 * Math.PI;
            } else if (clickedshape === "line") {
                var x2 = e.pageX - this.offsetLeft;
                var y2 = e.pageY - this.offsetTop;
                currShape.x2 = x2;
                currShape.y2 = y2;
            }
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
        console.log('sup');
        for (var i = 0; i < drawnShapes.length; i++) {
            drawnShapes[i].draw();
        }
    }

});

//git add .
//git commit -m ""
//git pull 
//git push


/*$(".Shape").click(function() {
        shapeclicked = $(this).attr('id');
        shapes.push(shapeclicked);
        $(".Shape").removeClass("active");
        $(this).addClass("active");

        //cange mouse cursor after witch shape was clicked.
        switch (shapeclicked) {
            case "rectangle":
            case "circle":
            case "line":
            case "select":
                document.body.style.cursor = 'crosshair';
                break;
            case "text":
                document.body.style.cursor = 'text';
                break;
            case "pencil":
                document.body.style.cursor = 'url(images/pencil.png), auto';
                break;
            case "eraser":
                document.body.style.cursor = 'url(images/eraser.png), auto';
                break;
        }
    });*/