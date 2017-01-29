

$(document).ready(function() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    //resizeCanvas();

    var drawnShapes = [];
    var undoneShapes = [];
    var currShape = undefined;

    var isDrawing = false;
    var clickedShape = undefined;
    var clickedEvent = undefined;
    var inputbox = undefined;
    var textbox = undefined;
    var typing = false;
    var selectUndone = false;

    var dragOk = false;
    var dragX;
    var dragY;
    var mouseStartX;
    var mouseStartY;
    var startX;
    var startY;
    var val;

    var BB = canvas.getBoundingClientRect();
    var offsetX = BB.left;
    var offsetY = BB.top;
    clickedShape = "pen";

    document.getElementById('divtextbox').addEventListener('keypress', handleKeyPress);
    document.getElementById('divtextbox').addEventListener('keyup', handleKeyUp);

    //Section 1: Shapes

    function Rectangle(x, y, width, height) {
        this.shape = 'rect';
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
        this.shape = 'circle';
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sAngle = sAngle;
        this.eAngle = eAngle;
        this.color = "#" + document.getElementById("colorPicker").value;
        this.lineWidth = lineWidthSelector();
        this.isDragging = false;
    }

    Circle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.sAngle, this.eAngle);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    }

    function Line(x1, y1, x2, y2) {
        this.shape = 'line';
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.lineWidth = lineWidthSelector();
        this.color = "#" + document.getElementById("colorPicker").value;
        this.isDragging = false;
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
        this.shape = 'pen';
        this.x = x;
        this.y = y;
        this.maxX = x;
        this.maxY = y;
        this.minX = x;
        this.minY = y;
        this.penPoints = new Array(new Point(x, y));
        this.lineWidth = lineWidthSelector();
        this.isDragging = false;
        this.color = "#" + document.getElementById("colorPicker").value;
    }

    Pen.prototype.addPoint = function(x, y) {
        this.penPoints.push(new Point(x, y));
        this.getMinMaxPoints();
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

    Pen.prototype.getMinMaxPoints = function() {
        for (var i = 0; i < this.penPoints.length; i++) {
            if (this.penPoints[i].x > this.maxX) {
                this.maxX = this.penPoints[i].x;
            }
            if (this.penPoints[i].y > this.maxY) {
                this.maxY = this.penPoints[i].y;
            }
            if (this.penPoints[i].x < this.minX) {
                this.minX = this.penPoints[i].x;
            }
            if (this.penPoints[i].y < this.minY) {
                this.minY = this.penPoints[i].y;
            }
        }
    }

    function Point(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }


    function Text(x, y, str, fonttype, size, color) {
        this.shape = 'text';
        this.x = x;
        this.y = y;
        this.size = parseInt($('#selectFontSize').find(':selected').text());
        this.fonttype = $('#selectFontFamily').find(':selected').text();
        this.color = "#" + document.getElementById("colorPicker").value;
        this.isDragging = false;
    }

    Text.prototype.draw = function() {
        ctx.font = this.size + "px " + this.fonttype;
        ctx.fillStyle = this.color;
        ctx.fillText(this.str, this.x + Number(this.size), this.y + Number(this.size));
    }

    function showTextbox(x, y) {
        if (textbox) {
            textbox.remove();
        }

        textbox = $("<textarea id='textarea'/>");
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

    //Section 2: Key presses

    function handleKeyPress(e) {
        if (typing) {
            if (e.which == 13 || e.keyCode == 13) {
                currShape.str = $('#divtextbox').find('textarea').val();
                drawnShapes.push(currShape);
                currShape.draw();
                typing = false;
                textbox.remove();
            }
        }
    }

    function handleKeyUp(e) {
        if (e.which === 27 || e.keyCode === 27) {
            typing = false;
            textbox.remove();
        }
    }

    //Section 3: Click functions

    $(".Shape").click(function() {
        clickedShape = $(this).attr('id');
        $(".Shape").removeClass("active");
        $(this).addClass("active");

        switch (clickedShape) {
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
            case "clear":
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawnShapes = [];
                break;


        }
    })


    //Section 4: Mouse functions

    $("#myCanvas").mousedown(function(e) {
        e.preventDefault();
        e.stopPropagation();
        var x = e.clientX - offsetX;
        var y = e.clientY - offsetY;

        isDrawing = true;


        var mx = e.clientX - offsetX; //parseInt(e.clientX - offsetX);
        var my = e.clientY - offsetY;
        dragOk = false;

        if (clickedShape === "select") {
            select(mx, my);
        }
        if (clickedShape === "eraser") {
            eraser(mx, my);
        }


        switch (clickedShape) {
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
                currShape = new Text(x, y); //x, y);
                typing = true;
                isDrawing = false;
                break;
            case "pen":
                currShape = new Pen(x, y);
                isDrawing = true;
                break;
        }
    });

    $("#myCanvas").mousemove(function(e) {

        var x = e.clientX - offsetX;
        var y = e.clientY - offsetY;

        if (dragOk) {
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
                    ctx.setLineDash([6]);
                    if (s.shape === 'line') {
                        s.x1 += dx;
                        s.x2 += dx;
                        s.y1 += dy;
                        s.y2 += dy;
                    } else if (s.shape === 'pen') {
                        s.x += dx;
                        s.y += dy;
                        for (var i = 0; i < s.penPoints.length; i++) {
                            s.penPoints[i].x += dx;
                            s.penPoints[i].y += dy;
                        }
                        s.maxX += dx;
                        s.maxY += dy;
                        s.minX += dx;
                        s.minY += dy;
                    } else {
                        s.x += dx;
                        s.y += dy;
                    }
                }
                redraw();
            }
            mouseStartX = mx;
            mouseStartY = my;

        }

        if (isDrawing === true) {
            if (clickedShape === "rect") {
                var w = x - currShape.x;
                var h = y - currShape.y;
                currShape.width = w;
                currShape.height = h;

            } else if (clickedShape === "circle") {
                var dia = x - currShape.x;
                currShape.radius = Math.abs(dia / 2);
                currShape.sAngle = 0;
                currShape.eAngle = 2 * Math.PI;

            } else if (clickedShape === "line") {
                var x2 = x;
                var y2 = y;
                currShape.x2 = x2;
                currShape.y2 = y2;
            } else if (clickedShape === "pen") {
                currShape.addPoint(x, y);
            }


            redraw();
            currShape.draw();
        }

    });

    $("#myCanvas").mouseup(function(e) {
        e.preventDefault();
        e.stopPropagation();

        ctx.setLineDash([]);
        dragOk = false;
        for (var i = 0; i < drawnShapes.length; i++) {
            drawnShapes[i].isDragging = false;
        }

        if (isDrawing) {
            if (currShape !== undefined) {
                drawnShapes.push(currShape);
            }
        }

        isDrawing = false;
        redraw();
    });


    //Section 5: Event functions

    function select(mx, my) {
        isDrawing = false;

        for (var i = 0; i < drawnShapes.length; i++) {
            var s = drawnShapes[i];
            // decide if the shape is a rect or circle               
            if (s.shape === 'rect') {
                // test if the mouse is inside this rect
                if (mx > s.x && mx < s.x + s.width && my > s.y && my < s.y + s.height) {              
                    dragOk = true;
                    s.isDragging = true;
                }

            } else if (s.shape === 'circle') {
                if (Math.pow(mx - s.x, 2) + Math.pow(my - s.y, 2) < Math.pow(s.radius, 2)) {
                    dragOk = true;
                    s.isDragging = true;
                }

            } else if (s.shape === 'line') {
                var epsilon = 5;
                var m = (s.y2 - s.y1) / (s.x2 - s.x1);
                var b = s.y1 - m * s.x1;
                if (Math.abs(my - (m * mx + b)) < epsilon) {
                    dragOk = true;
                    s.isDragging = true;
                }

            } else if (s.shape === 'pen') {
                //if (Math.abs(mx - s.penPoints[i].x) < 0.005 || Math.abs(my - s.penPoints[i].y) < 0.005) {
                if (mx < s.maxX && mx > s.minX && my < s.maxY && my > s.minY) {
                    dragOk = true;
                    s.isDragging = true;
                }
            } else if (s.shape === 'text') {
                var metrics = ctx.measureText(s.str);
                var width = metrics.width;
                var x = s.x + Number(s.size);
                var y = s.y + Number(s.size);

                if (mx >= x && mx <= x + width && my <= y && my >= y - Number(s.size)) {
                    dragOk = true;
                    s.isDragging = true;
                }
            }
        }
        mouseStartX = mx;
        mouseStartY = my;
    }


    function eraser(mx, my) {
        isDrawing = false;

        for (var i = 0; i < drawnShapes.length; i++) {
            var s = drawnShapes[i];
            // decide if the shape is a rect or circle               
            if (s.shape === 'rect') {
                // test if the mouse is inside this rect
                if (mx > s.x && mx < s.x + s.width && my > s.y && my < s.y + s.height) {
                   drawnShapes.splice(i, 1);
                };

            } else if (s.shape === 'circle') {
                if (Math.pow(mx - s.x, 2) + Math.pow(my - s.y, 2) < Math.pow(s.radius, 2)) {
                    drawnShapes.splice(i, 1);
                }

            } else if (s.shape === 'line') {
                var epsilon = 5;
                var m = (s.y2 - s.y1) / (s.x2 - s.x1);
                var b = s.y1 - m * s.x1;
                if (Math.abs(my - (m * mx + b)) < epsilon) {
                    drawnShapes.splice(i, 1);
                }

            } else if (s.shape === 'pen') {
                if (mx < s.maxX && mx > s.minX && my < s.maxY && my > s.minY) {
                    drawnShapes.splice(i, 1);;
                }
            } else if (s.shape === 'text') {
                var metrics = ctx.measureText(s.str);
                var width = metrics.width;
                var x = s.x + Number(s.size);
                var y = s.y + Number(s.size);

                if (mx >= x && mx <= x + width && my <= y && my >= y - Number(s.size)) {
                    drawnShapes.splice(i, 1);
                }
            }
        }
        mouseStartX = mx;
        mouseStartY = my;
    }


    function undo() {

        if (clickedShape === "text") {
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


    /*function loadDoc() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                //document.getElementById("sTitle").innerHTML = this.responseText;
            }
        };
        xhttp.open("GET", "ajax_info.txt", true);
        xhttp.send();
    }*/

    //Section 6: Saving and loading

    var url = "http://localhost:3000/api/drawings";

    $(".Save").click(function() {
        val = $('#sTitle').val();
        document.getElementById("sTitle").value = ' ';

        var JSONdrawnShapes = JSON.stringify(drawnShapes);
        var drawing = {
            title: val,
            content: JSONdrawnShapes
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify(drawing),
            success: function(data) {

                drawnShapes = [];

                // The drawing was successfully saved
            },
            error: function(xhr, err) {
                console.log('Error occurred in the operation');
                // The drawing could NOT be saved
            }
        });

    });

    function showSavedList(data) {
        var html = "";
        for (var i = 0; i < data.length; i++) {
            var title = data[i]["title"];
            var id = data[i]["id"];
            html += "<li class='canvasDrawing' value=" + id + ' "><a href= #>' + title + "</a></li>";

        }
        return html;
    }


    $(".Load").click(function() {
        var JSONdrawnShapes = JSON.stringify(drawnShapes);
        var drawing = {
            title: val,
            content: JSONdrawnShapes
        };
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: url,
            dataType: "json",
            data: JSON.stringify(drawing),
            success: function(data) {
                var savedList = showSavedList(data);
                $(savedData).html(savedList);
            },
            error: function(xhr, err) {
                console.log('Error occurred in the operation ');
                // The drawing could NOT be saved
            }

        });
    });

    $(document).on('click', '.canvasDrawing', function() {
        var id = $(this).val();
        console.log("id: " + id);
        getDrawing(id);
    });

    function getDrawing(id) {
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "http://localhost:3000/api/drawings/" + id,
            data: {
                id: id
            },
            dataType: "json",
            success: function(data) {
                var objects = JSON.parse(data['content']);
                drawnShapes = [];
                redraw();
                drawObjects(objects);
            },
            error: function(xhr, err) {
                console.log('Error occurred in the operation ');
                // The drawing could NOT be saved
            }

        });
    }

    function drawObjects(objects) {
        for (var i = 0; i < objects.length; i++) {
            var shape = undefined;
            switch (objects[i].shape) {
                case "rect":
                    shape = new Rectangle(objects[i].x, objects[i].y, objects[i].color, objects[i].lineWidth);
                    shape.width = objects[i].width;
                    shape.height = objects[i].height;
                    shape.color = objects[i].color;
                    shape.lineWidth = objects[i].lineWid;

                    break;
                case "circle":
                    shape = new Circle(objects[i].x, objects[i].y, objects[i].color, objects[i].lineWidth);
                    shape.radius = objects[i].radius;
                    shape.sAngle = objects[i].sAngle;
                    shape.eAngle = objects[i].eAngle;
                    shape.color = objects[i].color;
                    shape.lineWidth = objects[i].lineWidth;

                    break;
                case "line":
                    shape = new Line(objects[i].x1, objects[i].y1, objects[i].color, objects[i].lineWidth);
                    shape.x2 = objects[i].x2;
                    shape.y2 = objects[i].y2;
                    shape.color = objects[i].color;
                    shape.lineWidth = objects[i].lineWidth;
                    break;
                case "text":
                    shape = new Text(objects[i].x, objects[i].y);
                    shape.size = objects[i].size;
                    shape.fonttype = objects[i].fonttype;
                    shape.color = objects[i].color;
                    shape.str = objects[i].str;
                    break;
                case "pen":
                    shape = new Pen(objects[i].x, objects[i].y, objects[i].color, objects[i].lineWidth);
                    for (var j = 0; j < objects[i].penPoints.length; j++) {
                        shape.addPoint(objects[i].penPoints[j].x, objects[i].penPoints[j].y);
                    }

                    shape.color = objects[i].color;
                    shape.lineWidth = objects[i].lineWidth
                    break;
            }
            drawnShapes.push(shape);
        }
        redraw();
    }

    //Section 7: Other

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < drawnShapes.length; i++) {
            drawnShapes[i].draw();
        }

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

        return lineSize;
    }

    function resizeCanvas() {
        ctx.canvas.width = window.innerWidth - 30;
        if (ctx.canvas.height < window.innerHeight) {
            ctx.canvas.height = window.innerHeight - 200;
        }
        var ratio = canvas.width / canvas.height;

        var width = window.innerWidth - 5;
        var height = window.innerHeight - 5;

        if (width / height > ratio)
            width = height * ratio;
        else
            height = width / ratio;

        canvas.style.width = width;
        canvas.style.height = height;

        canvas.style.top = (window.innerHeight - height) / 2;
        canvas.style.left = (window.innerWidth - width) / 2;
    }
    resizeCanvas();

});


