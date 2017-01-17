$(document).ready(function() {

    console.log("Ready!");
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    //ctx.moveTo(0, 0);
    //ctx.lineTo(200, 100);
    //ctx.stroke();
    drag = false;
    var startX;
    var startY;
    var isDrawing = false;

    $("#myCanvas").mousedown(function(e) {
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;

        startX = x;
        startY = y;
        isDrawing = true;
    });

    $("#myCanvas").mousemove(function(e) {
        if (isDrawing === true) {
            var x = e.pageX - startX;
            var y = e.pageY - startY;

            ctx.clearRect(0, 0, 500, 200);
            ctx.strokeRect(startX, startY, x, y);
        }

    });

    $("#myCanvas").mouseup(function(e) {
        isDrawing = false;
    })

});

//git add .
//git commit -m ""
//git pull 
//git push