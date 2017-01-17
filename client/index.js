$(document).ready(function() {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var drawing = false;
    var x;
    var y;

    $("#myCanvas").mousedown(function(e) {

        x = e.pageX - this.offsetLeft;
        y = e.pageY - this.offsetTop;

        drawing = true;
    });

    $("#myCanvas").mousemove(function(e) {
        if (drawing === true) {
            var endX = e.pageX - x;
            var endY = e.pageY - y;

            context.clearRect(0, 0, 600, 200);
            context.beginPath();
            context.moveTo(x, y);
            context.strokeRect(x, y, endX, endY);
            context.stroke();
        }

    });

    $("#myCanvas").mouseup(function(e) {

        drawing = false;

    });

});

//git add .
//git commit -m ""
//git pull 
//git push