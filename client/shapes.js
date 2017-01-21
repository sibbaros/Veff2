    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    Rectangle.prototype.draw = function() {
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    function Circle(x, y, radius, sAngle, eAngle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sAngle = sAngle;
        this.eAngle = eAngle;
    }

    Circle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.sAngle, this.eAngle);
        ctx.stroke();
    }

    function Line(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    Line.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }

    function Pen(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    Pen.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.closePath();
    }

    function Text(x, y, str, fonttype, size, color) {
        //this.str = str;
        this.x = x;
        this.y = y;
        //this.fonttype = fonttype;
        //this.size = size;
        //this.color = color;
        //this.str = document.getElementById("text").value();
        // console.log(value);
    }

    Text.prototype.draw = function() {
        //ctx.font = this.size + "px " + this.fonttype;
        //ctx.fillStyle = this.color;
        ctx.fillText(this.str, this.x, this.y);
    }

    function showTextbox(x, y) {
        if (textbox) {
            textbox.remove();
        }
        textbox = $("<textarea id='text'/>"); //$("<input type='text' id='text'/>");
        textbox.css("position", "fixed");
        textbox.css("top", y);
        textbox.css("left", x);
        //textbox.css("font");
        //textbox.css("color", "blue");
        $(".Inputtextbox").append(textbox);
        textbox.focus();
    }