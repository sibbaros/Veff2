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
                currShape = new Pen(prevX, prevY, currX, currY)
        }

        drag();
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
        if (currShape != undefined) {
            drawnShapes.push(currShape);
        }
        redraw();
    })