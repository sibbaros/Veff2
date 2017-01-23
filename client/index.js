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
var fabric1;

$(document).ready(function() {

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(100, 120);
    ctx.lineTo(120, 120);
    ctx.lineTo(120, 140);
    ctx.lineTo(100, 140);
    ctx.lineTo(100, 160);
    ctx.lineTo(80, 160);
    ctx.lineTo(80, 140);
    ctx.lineTo(60, 140);
    ctx.lineTo(60, 120);
    ctx.lineTo(80, 120);
    ctx.lineTo(80, 100);
    ctx.lineTo(100, 100);
    ctx.stroke();

    document.getElementById('divtextbox').addEventListener('keypress', handleKeyPress);
    document.getElementById('divtextbox').addEventListener('keyup', handleKeyUp);

    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "#" + document.getElementById("colorPicker").value;
        this.lineWid = lineWidthSelector();
        console.log("constructor: " + lineWidthSelector());

    }

    Rectangle.prototype.draw = function() {
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.lineWidth = this.lineWid;
        //console.log("draw: " + ctx.lineWidth);
    }

    function Circle(x, y, radius, sAngle, eAngle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sAngle = sAngle;
        this.eAngle = eAngle;
        this.color = "#" + document.getElementById("colorPicker").value;
        this.lineWidth = lineWidthSelector();

    }

    Circle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.sAngle, this.eAngle);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    }

    function Line(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.lineWidth = lineWidthSelector();
        this.color = "#" + document.getElementById("colorPicker").value;

    }

    Line.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    function Pen(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.lineWidth = lineWidthSelector();
        this.color = "#" + document.getElementById("colorPicker").value;

    }

    Pen.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.closePath();
    }

    function Text(x, y, str, fonttype, size, color) {
        //this.str = str;
        this.x = x;
        this.y = y;
        this.size = parseInt($('#selectFontSize').find(':selected').text());
        this.fonttype = $('#selectFontFamily').find(':selected').text();
        this.color = "#" + document.getElementById("colorPicker").value;
        //this.str = document.getElementById("text").value();
        // console.log(value);
    }

    Text.prototype.draw = function() {
        ctx.font = this.size + "px " + this.fonttype;
        ctx.fillStyle = this.color;
        ctx.fillText(this.str, this.x, this.y);
    }

    function showTextbox(x, y) {
        if (textbox) {
            textbox.remove();
        }

        textbox = $("<textarea id='text'/>"); //$("<input type='text' id='text'/>");
        var size = $('#selectFontSize').find(':selected').text();
        var font = $('#selectFontFamily').find(':selected').text();
        var color = "#" + document.getElementById("colorPicker").value;


        textbox.css("position", "fixed");
        textbox.css("top", y);
        textbox.css("left", x);
        textbox.css("fontSize", parseInt(size));
        textbox.css("font-family", font);
        textbox.css("color", color);
        $(".Inputtextbox").append(textbox);
        textbox.focus();
    }

    function handleKeyPress(e) {
        if (typing) {
            if (e.which == 13 || e.keyCode == 13) {
                currShape.str = $('#divtextbox').find('textarea').val();
                drawnShapes.push(currShape);
                currShape.draw();
                typing = false;
                textbox.remove();
                //currShape.str = $('input:text').val();
            }
        }
    }

    function handleKeyUp(e) {
        if (e.which === 27 || e.keyCode === 27) {
            typing = false;
            textbox.remove();
        }
    }

    $(".Shape").click(function() {
        clickedshape = $(this).attr('id');
        $(".Shape").removeClass("active");
        $(this).addClass("active");

        switch (clickedshape) {
            case "rect":
            case "circle":
            case "line":
            case "text":
            case "pen":
        }

    });

    $(".Event").click(function() {
        clickedEvent = $(this).attr('id');

        $(".Event").removeClass("active");
        $(this).addClass("active");

        switch (clickedEvent) {
            case "undo":
                undo();
                break;
            case "redo":
                redo();
                break;
            case "select":
        }
    })

    $("#myCanvas").mousedown(function(e) {
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        prevX = currX;
        prevY = currY;
        currX = e.clientX - this.offsetLeft;
        currY = e.clientY - this.offsetTop;
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
                currShape = new Line(startX, startY);
                break;
            case "text":
                showTextbox(e.clientX, e.clientY);
                currShape = new Text(x, y);
                typing = true;
                break;
            case "pen":
                currShape = new Pen(prevX, prevY, currX, currY);
                break;
        }
        if (clickedEvent == "select") {
            drag();
        }


    });

    $("#myCanvas").mousemove(function(e) {
        if (isDrawing === true) {
            if (clickedshape === "rect") {
                var w = e.pageX - startX;
                var h = e.pageY - startY;
                currShape.width = w;
                currShape.height = h;
                redraw();
                currShape.draw();
            } else if (clickedshape === "circle") {
                var dia = e.pageX - startX;
                currShape.radius = Math.abs(dia / 2);
                currShape.sAngle = 0;
                currShape.eAngle = 2 * Math.PI;
                redraw();
                currShape.draw();
            } else if (clickedshape === "line") {
                var x2 = e.pageX - this.offsetLeft;
                var y2 = e.pageY - this.offsetTop;
                currShape.x2 = x2;
                currShape.y2 = y2;
                redraw();
                currShape.draw();
            } else if (clickedshape === "pen") {
                prevX = currX;
                prevY = currY;
                currX = e.pageX - this.offsetLeft;
                currY = e.pageY - this.offsetTop;
                currShape.x1 = prevX;
                currShape.y1 = prevY;
                currShape.x2 = currX;
                currShape.y2 = currY;
                redraw();
                currShape.draw();
            } else if (clickedshape === "text") {
                typing = false;
                isDrawing = false;
            }
            //redraw();
            //currShape.draw();
        }
    });

    $("#myCanvas").mouseup(function(e) {
        isDrawing = false;
        if (currShape != undefined) {
            drawnShapes.push(currShape);
        }
        redraw();
    })

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
        if (clickedshape === "text") {
            typing = false;
            textbox.remove();
        }
        if (drawnShapes.length === 0) {
            console.log("There are no shapes to undo");
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
        for (var i = drawnShapes.length - 1; i >= 0; i--) {
            if (drawnShapes[i].x == this.x && drawnShapes[i].y == this.y) {
                drawnShapes[i].x == 0 & drawnShapes[i].y == 0;
                console.log("hi");
            }
        }

    }

    function lineWidthSelector() {
        var lineSizeSelector = $('#selectLineWidth').find(':selected').text();

        if (lineSizeSelector == "Thin") {
            lineSize = 1;
        } else if (lineSizeSelector == "Medium") {
            lineSize = 10;
        } else if (lineSizeSelector == "Bold") {
            lineSize = 40;
        }
        console.log(lineSize);
        return lineSize;
    }




});

//git add .
//git commit -m ""
//git pull 
//git push