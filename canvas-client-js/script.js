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
    websocket.on("dibujar", onMessageFromServer);
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
    canvas.add(shape);
    sendObject();
}

function sendObject() {
    console.log("Sending data");
    websocket.emit("dibujar", JSON.stringify({ 'canvas': canvas }));
}

function onMessageFromServer(canvasmsg) {
    canvas = canvasmsg;
}