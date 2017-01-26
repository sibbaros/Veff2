var drawnShapes = [];
var undoneShapes = [];
var currShape = undefined;

var isDrawing = false;
var clickedshape = undefined;
var clickedEvent = undefined;
var inputbox = undefined;
var textbox = undefined;
var typing = false;

var dragok = false;
var dragX;
var dragY;
var mouseStartX;
var mouseStartY;
var startX;
var startY;


$(document).ready(function() {

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var BB = canvas.getBoundingClientRect();
    var offsetX = BB.left;
    var offsetY = BB.top;
    clickedshape = "pen";

    document.getElementById('divtextbox').addEventListener('keypress', handleKeyPress);
    document.getElementById('divtextbox').addEventListener('keyup', handleKeyUp);

    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "#" + document.getElementById("colorPicker").value;
        this.lineWid = lineWidthSelector();
        this.isDragging = false;
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

    function Pen(x, y) {
        this.x = x;
        this.y = y;
        this.penPoints = new Array(new Point(x, y));
        this.lineWidth = lineWidthSelector();
        if(clickedshape === "eraser"){
            this.color = "white";
        }
        else{
             this.color = "#" + document.getElementById("colorPicker").value;

        }
    }

    Pen.prototype.addPoint = function(x, y) {
        this.penPoints.push(new Point(x, y));
    }

    Pen.prototype.draw = function() {
        ctx.beginPath();
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.moveTo(this.x, this.y);
        for (var i = 0; i < this.penPoints.length; i++) {
            ctx.lineTo(this.penPoints[i].x, this.penPoints[i].y);
        }
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.closePath();

    }

    function Point(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }


    function Text(x, y, str, fonttype, size, color) {
        this.x = x;
        this.y = y;
        this.size = parseInt($('#selectFontSize').find(':selected').text());
        this.fonttype = $('#selectFontFamily').find(':selected').text();
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
            case "select":
            case "eraser":
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
                //case "select":
        }
    })

    $("#myCanvas").mousedown(function(e) {
        e.preventDefault();
        e.stopPropagation();
        var x = e.clientX - offsetX; //e.pageX - this.offsetLeft;
        var y = e.clientY - offsetY; //e.pageY - this.offsetTop;
       

    
        isDrawing = true;


        var mx = parseInt(e.clientX - offsetX);
        var my = parseInt(e.clientY - offsetY);

        dragok = false;

        if (clickedshape === "select") {
            select(mx, my);
        }


        switch (clickedshape) {
            case "rect":
                currShape = new Rectangle(x, y);
                isDrawing = true;
                break;
            case "circle":
                currShape = new Circle(x, y);
                isDrawing = true;
                break;
            case "line":
                currShape = new Line(x, y); 
                isDrawing = true;
                break;
            case "text":
                showTextbox(e.clientX, e.clientY);
                currShape = new Text(x, y);
                typing = true;
                isDrawing = false;
                break;
            case "pen":
                currShape = new Pen(x, y); 
                isDrawing = true;
                break;
            case "eraser":
                currShape = new Pen(x, y);
                break;
        }
    });

    $("#myCanvas").mousemove(function(e) {

        var x = e.clientX - offsetX;
        var y = e.clientY - offsetY;

        if (dragok) {
            e.preventDefault();
            e.stopPropagation();
            // get the current mouse position
            var mx = parseInt(e.clientX - offsetX);
            var my = parseInt(e.clientY - offsetY);

            // calculate the distance the mouse has moved
            // since the last mousemove
            var dx = mx - mouseStartX;
            var dy = my - mouseStartY;

            // move each rect that isDragging 
            // by the distance the mouse has moved
            // since the last mousemove
            for (var i = 0; i < drawnShapes.length; i++) {
                var s = drawnShapes[i];
                if (s.isDragging) {
                    s.x += dx;
                    s.y += dy;
                }
                redraw();
            }
            //redraw();
            mouseStartX = mx;
            mouseStartY = my;

        }

        if (isDrawing === true) {
            if (clickedshape === "rect") {
                var w = x - currShape.x; //e.pageX - startX; //currShape.x; //startX;
                var h = y - currShape.y; //e.pageY - startY; //currShape.y; //startY;
                currShape.width = w;
                currShape.height = h;

            } else if (clickedshape === "circle") {
                var dia = x - currShape.x;
                currShape.radius = Math.abs(dia / 2);
                currShape.sAngle = 0;
                currShape.eAngle = 2 * Math.PI;

            } else if (clickedshape === "line") {
                var x2 = x;
                var y2 = y;
                currShape.x2 = x2;
                currShape.y2 = y2;
                
            } else if (clickedshape === "pen" || clickedshape === "eraser") {

                currShape.addPoint(x, y);
            }


            redraw();
            currShape.draw();
        }

    });

    $("#myCanvas").mouseup(function(e) {
        e.preventDefault();
        e.stopPropagation();


        dragok = false;
        for (var i = 0; i < drawnShapes.length; i++) {
            drawnShapes[i].isDragging = false;

        }

        if (isDrawing) {
            if (currShape !== undefined) {
                drawnShapes.push(currShape);
            }
            /*else if (clickedshape === "pen") {
                           console.log("drawings", penDrawings);
                           drawnShapes.push(pen);
                       }*/
        }

        isDrawing = false;
        //redraw();
    });

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < drawnShapes.length; i++) {
            drawnShapes[i].draw();
        }

    }

    function select(mx, my) {

        isDrawing = false;

        for (var i = 0; i < drawnShapes.length; i++) {
            var s = drawnShapes[i];
            // decide if the shape is a rect or circle               
            if (s.width) {
                // test if the mouse is inside this rect
                if (mx > s.x && mx < s.x + s.width && my > s.y && my < s.y + s.height) {
                    // if yes, set that rects isDragging=true
                    dragok = true;
                    s.isDragging = true;
                    //ctx.setLineDash([6]);
                }
            }
            mouseStartX = mx;
            mouseStartY = my;
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



    function lineWidthSelector() {
        var lineSizeSelector = $('#selectLineWidth').find(':selected').text();


        ctx.lineJoin = ctx.lineCap = "round";
        if (lineSizeSelector === "Thin") {
            lineSize = 1;
        } else if (lineSizeSelector === "Medium") {
            lineSize = 10;
        } else if (lineSizeSelector === "Bold") {
            lineSize = 40;
        }

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
    $("#save").click(function() {

        var drawing = {
            title: document.getElementById("title"),
            content: drawnShapes
        };

        var url = "http://localhost:3000/api/drawings";
        console.log(drawing.content);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify(drawing),
            success: function(data) {
                console.log(data);
                console.log('things are happening?');
                // The drawing was successfully saved
            },
            error: function(xhr, err) {
                console.log('Error occurred in the operation ');
                // The drawing could NOT be saved
            }
        });

    });

    /*$.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        data: JSON.stringify(drawing),
        success: function(data) {
            console.log(data);
            // The drawing was successfully saved
        },
        error: function(xhr, err) {
            console.log('Error occurred in the operation ');
            // The drawing could NOT be saved
        }
    });*/
});


/*http://localhost:3000/api/drawings - GET
Returns a list of all drawings. Each item in the list contains the properties id and title
 
http://localhost:3000/api/drawings/{id} - GET
Returns a single drawing, both the title and id, as well as the content of the drawing, and the created date.
 
http://localhost:3000/api/drawings - POST
Adds a single drawing to the in-memory database. The body of the request should 
contain the following two properties: "title" and "content". Example:


*/



//git add .
//git commit -m ""
//git pull 
//git push