$(document).ready(function() {
    console.log("Ready!");
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    //ctx.moveTo(0, 0);
    //ctx.lineTo(200, 100);
    //ctx.stroke();

    $("#myCanvas").mousedown(function(e) {
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        console.log("X: " + x + "Y: " + y);
        ctx.strokeRect(x - 30, y - 30, 50, 50);
    });

});