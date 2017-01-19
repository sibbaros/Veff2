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

    function rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    function Circle(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = 40;
        this.start = 0;
        this.end = 2 * Math.PI;
    }

    $(".Shape").click(function() {
        clickedshape = $(this).attr('id');
        $(".Shape").removeClass("active");
        $(this).addClass("active");

        switch (clickedshape) {
            case "rect":
            case "circle":
        }

    });


    rectangle.prototype.draw = function() {
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    Circle.prototype.draw = function() {
        ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
        ctx.stroke();

    }
    $("#myCanvas").mousedown(function(e) {
        console.log("clicked");
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;

        startX = x;
        startY = y;
        isDrawing = true;

        switch (clickedshape) {
            case "rect":
                currShape = new rectangle(x, y);
                break;
            case "circle":
                console.log("yolo");
                currShape = new Circle(x, y);
                break;

        }
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