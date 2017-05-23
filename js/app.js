document.addEventListener("DOMContentLoaded", function(event) {
    'user strict';

    var draggedElement,
    grabPointY,
    grabPointX;

    var addNoteBtn = document.querySelector('.addNoteBtn');

    function createNote(){
        var stickerElement = document.createElement('div'),
        barElement = document.createElement('div'),
        textareaElement = document.createElement('textarea');

        var notePosition = "translateX(" + Math.random() * 600 + "px) translateY(" + Math.random() * 600 + "px)";

        stickerElement.classList.add('sticker');
        barElement.classList.add('bar');

        document.body.appendChild(stickerElement);
        stickerElement.appendChild(barElement);
        stickerElement.appendChild(textareaElement);
        stickerElement.style.transform = notePosition;
        stickerElement.addEventListener('mousedown', onDragStart, false);
    }

    function onDragStart(event){
        var boundingClientRect;

        if (event.target.className.indexOf('bar') === -1){
            return;
        }

        draggedElement = this; //sticker element

        boundingClientRect = draggedElement.getBoundingClientRect();
        grabPointY = boundingClientRect.top - event.clientY;
        grabPointX = boundingClientRect.left - event.clientX;
    }

    function onDrag(event){
        if (!draggedElement){
            return;
        }
        var posY = event.clientY  + grabPointY;
        var posX = event.clientX  + grabPointX;

        posY = (posY < 0) ? 0 : posY;
        posX = (posX < 0) ? 0 : posX;

        draggedElement.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px)";
    }

    function onDragEnd(){
        draggedElement = null;
        grabPointY = null;
        grabPointX = null;
    }

    addNoteBtn.addEventListener('click', createNote);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onDragEnd);
});
