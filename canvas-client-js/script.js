window.addEventListener("load", init);

function init() {
    initServer();
    canvas = new fabric.Canvas('canvas');
    canvas.freeDrawingBrush.color = 'black';
    canvas.freeDrawingBrush.lineWidth = 20;
    pencil.addEventListener('click', pencilHandler);
    addCircle.addEventListener('click', addCircleHandler);
    canvas.on('object:moving', function() {
        console.log('Event object:moving Triggered');
    });
    canvas.on('object:modified', function() {
        console.log('Event object:modified Triggered');
    });
    canvas.on('mouse:up', function() {
        console.log('Event mouse:up Triggered');
    });
    canvas.on('mouse:down', function() {
        console.log('Event mouse:down Triggered');
    });
}

function initServer() {
    websocket = io.connect("http://localhost:5000");
    websocket.on('connect', () => { console.log(websocket.connected); });

    websocket.on("get-dibujo", (canvasmsg) => {
        canvas.clear();
        const shapes = canvasmsg.canvas.objects;
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
    $.getJSON(url, function(shapes) {
        console.log(shapes);
        shapes.forEach(element => {
            canvas.add(getShapeFromServer(element));
        });
    });

}

function getShapeFromServer(element) {
    if (element.type = "circle") {
        const obj = {
            radius: element.radius,
            fill: element.fill,
            left: element.left,
            top: element.top
        };
        return new fabric.Circle(obj);
    }
}



function pencilHandler() {
    canvas.isDrawingMode = true;
}

function addCircleHandler() {
    const obj = {
        radius: 20,
        fill: 'green',
        left: 100,
        top: 100
    };
    const shape = new fabric.Circle(obj);
    canvas.add(shape);
    sendObject();
}

function sendObject() {
    debugger;
    websocket.emit("dibujar", { 'canvas': canvas });
}

function randomNumber() {
    return Math.random() * 250;
}