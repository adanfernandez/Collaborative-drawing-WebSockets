function init() {
    canvas = new fabric.Canvas('canvas');
    canvas.freeDrawingBrush.color = 'black';
    canvas.freeDrawingBrush.lineWidth = 20;
    pencil.addEventListener('click', pencilHandler);
}


function pencilHandler() {
    canvas.isDrawingMode = true;
}



window.addEventListener("load", init);