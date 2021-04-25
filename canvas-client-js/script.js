window.addEventListener("load", init);

function init() {
    initServer();
    canvas = new fabric.Canvas('canvas');
    canvas.freeDrawingBrush.color = 'black';
    addCircle.addEventListener('click', addCircleHandler);
    addTriangle.addEventListener('click', addTriangleHandler);
    addRectangle.addEventListener('click', addRectangleHandler);

    canvas.on('object:moving', function() {
        sendObject();
    });
    canvas.on('object:modified', function() {
        sendObject();
    });
}

function initServer() {
    websocket = io.connect("http://localhost:5000");
    websocket.on('connect', () => { console.log(websocket.connected); });

    websocket.on("get-dibujo", (canvasmsg) => {
        canvas.clear();
        const shapes = JSON.parse(canvasmsg.canvas);
        shapes.forEach(element => {
            canvas.add(getShapeFromServer(element));
        });
    });

    websocket.on("usuarios-activos", (usuarios) => {
        document.getElementById("number-users").innerHTML = usuarios.length;
    });

    websocket.on("disconnect", function() {
        console.log("client disconnected from server");
    });
    getInitialShapes();
}

function getInitialShapes() {
    var url = "http://localhost:5000/dibujo";
    $.getJSON(url, function(result) {
        if (result.canvas) {
            JSON.parse(result.canvas).forEach(element => {
                canvas.add(getShapeFromServer(element));
            });
        }
    });

}

function getShapeFromServer(element) {
    if (element.type === "circle") {
        return new fabric.Circle(element);
    } else if (element.type === "rect") {
        return new fabric.Rect(element);
    } else if (element.type === "triangle") {
        return new fabric.Triangle(element);
    }
}


function addCircleHandler() {
    const obj = {
        radius: randomNumber(),
        fill: randomColor(),
        left: randomNumber(),
        top: randomNumber()
    };
    const shape = new fabric.Circle(obj);
    canvas.add(shape);
    sendObject();
}

function addRectangleHandler() {
    var obj = {
        width: randomNumber(),
        height: randomNumber(),
        fill: randomColor(),
        left: randomNumber(),
        top: randomNumber()
    };
    const shape = new fabric.Rect(obj);
    canvas.add(shape);
    sendObject();
}

function addTriangleHandler() {
    var obj = {
        width: randomNumber(),
        height: randomNumber(),
        fill: randomColor(),
        left: randomNumber(),
        top: randomNumber()
    };
    const shape = new fabric.Triangle(obj);
    canvas.add(shape);
    sendObject();
}


function sendObject() {
    websocket.emit("dibujar", { 'canvas': JSON.stringify(canvas.getObjects()) });
}


function randomNumber() {
    return Math.random() * 250;
}

function randomColor() {
    const colores = ["blue", "green", "red", "black", "white", "gray", "yellow"];
    const index = Math.round(Math.random() * (colores.length - 1));
    return colores[index];
}