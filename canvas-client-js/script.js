window.addEventListener("load", init);

function init() {
    initServer();
    canvas = new fabric.Canvas('canvas');
    canvas.freeDrawingBrush.color = 'black';
    canvas.freeDrawingBrush.lineWidth = 20;
    pencil.addEventListener('click', pencilHandler);
    addCircle.addEventListener('click', addCircleHandler);
}

function initServer() {
    websocket = io.connect("http://localhost:5000");
    websocket.on('connect', () => { console.log(websocket.connected); });

    websocket.on("get-dibujo", (canvasmsg) => {
        const shape = new fabric.Circle(canvasmsg.shape);
        canvas.add(shape);
    });

    websocket.on("usuarios-activos", (usuarios) => {
        document.getElementById("number-users").innerHTML = usuarios.length;
    });

    websocket.on("disconnect", function() {
        console.log("client disconnected from server");
    });
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
    sendObject("Circulo", obj);
    canvas.add(shape);
}

function sendObject(type, obj) {
    debugger;
    websocket.emit("dibujar", { 'type': type, "shape": obj });
}

function randomNumber() {
    return Math.random() * 250;
}