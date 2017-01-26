var drawnShapes = [];
var undoneShapes = [];
var penDrawings = [];
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

    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "#" + document.getElementById("colorPicker").value;
        this.lineWid = lineWidthSelector();
    }

    Rectangle.prototype.draw = function() {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWid;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
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
        penDrawings.push({
            type: pen,
            x1: this.x1, 
            x2: this.x2, 
            y1: this.y1, 
            y2: this.y2});
        console.log(penDrawings);
    }

    var pen = {

        points : penDrawings
             
    }

    pen.draw = function() {

        for (var i = 0; i < penDrawings.length; i++) {
            ctx.moveTo(pen.points[i].x1, pen.points[i].y1);
            ctx.lineTo(pen.points[i].x2, pen.points[i].y2);
            ctx.strokeStyle = pen.points[i].color;
            ctx.lineWidth = pen.points[i].lineWidth;
            ctx.stroke();
            ctx.closePath();
        }
    }

    function Text(x, y, str, fonttype, size, color) {
        this.x = x;
        this.y = y;
        this.size = parseInt($('#selectFontSize').find(':selected').text());
        this.fonttype =  $('#selectFontFamily').find(':selected').text();
        this.color = "#" + document.getElementById("colorPicker").value;
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
        textbox.css("font-family",font);
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
                penDrawings.push(currShape);
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
            } else if (clickedshape === "pen") {
                prevX = currX;
                prevY = currY;
                currX = e.pageX - this.offsetLeft;
                currY = e.pageY - this.offsetTop;
                currShape.x1 = prevX;
                currShape.y1 = prevY;
                currShape.x2 = currX;
                currShape.y2 = currY;
            } else if (clickedshape === "text") {
                typing = false;
                isDrawing = false;
            }
            redraw();
            currShape.draw();
        }
    });

    $("#myCanvas").mouseup(function(e) {
        isDrawing = false;
        
        if(clickedshape === "pen") {
            console.log("drawings", penDrawings);
           /* var pen = {


                points : penDrawings


            }*/
            drawnShapes.push(pen);
            //penDrawings = [];
        }
        else {
            console.log("currShape", currShape);
            drawnShapes.push(currShape); 
        }
        
        
        redraw();
    })

    function redraw() {
        if (clickedshape != "pen") {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        for (var i = 0; i < drawnShapes.length; i++) {
            drawnShapes[i].draw();
        }
       
    }

    function undo() {
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
            if (drawnShapes[i].x === this.x && drawnShapes[i].y === this.y) {
                drawnShapes[i].x === 0 & drawnShapes[i].y === 0;
                console.log("hi");
            }
        }
    }

    function lineWidthSelector(){
        var lineSizeSelector = $('#selectLineWidth').find(':selected').text();

            ctx.lineJoin = ctx.lineCap = "round";
            if(lineSizeSelector === "Thin"){
                lineSize = 1;
            }
            else if(lineSizeSelector === "Medium"){
                lineSize = 10;
            }
            else if(lineSizeSelector === "Bold"){
                lineSize = 40;
            }
        return lineSize;
    }


});

//git add .
//git commit -m ""
//git pull 
//git push