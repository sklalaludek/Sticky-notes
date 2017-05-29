(function() {
    'user strict';

    var draggedElement,
        onDragStart,
        onDrag,
        onDragEnd,
        grabPointY,
        grabPointX,
        getNoteObject,
        onAddNoteClick,
        createNote,
        testLocalStorage,
        init,
        saveNote,
        deleteNote,
        loadNotes,
        addNoteImg;

    onDragStart = function(event) {
        var boundingClientRect;

        if (event.target.className.indexOf('bar') === -1) {
            return;
        }
        //sticker element
        draggedElement = this;
        boundingClientRect = draggedElement.getBoundingClientRect();

        grabPointY = boundingClientRect.top - event.clientY;
        grabPointX = boundingClientRect.left - event.clientX;
    }

    onDrag = function(event) {
        if (!draggedElement) {
            return;
        }
        var posY = event.clientY + grabPointY;
        var posX = event.clientX + grabPointX;

        posY = (posY < 0) ? 0 : posY;
        posX = (posX < 0) ? 0 : posX;

        draggedElement.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px)";
    }

    onDragEnd = function() {
        draggedElement = null;
        grabPointY = null;
        grabPointX = null;
    }

    getNoteObject = function(el) {
        var textarea = el.querySelector('textarea');
        return {
            notePosition: el.style.transform,
            content: textarea.value,
            id: el.id,
        };
    }

    onAddNoteClick = function() {
        createNote();
    }

    createNote = function(options) {
        var stickerEl = document.createElement('div'),
            barEl = document.createElement('div'),
            saveBtnEl = document.createElement('button'),
            deleteBtnEl = document.createElement('button'),
            textareaEl = document.createElement('textarea'),
            BOUNDARIES = 600,
            noteConfig = options || {
                notePosition : "translateX(" + Math.random() * BOUNDARIES + "px) translateY(" + Math.random() * BOUNDARIES + "px)",
                content : ' ',
                id : "sticker_" + new Date().getTime(),
            },
            onSave,
            onDelete;

        onSave = function() {
            saveNote(
                getNoteObject(stickerEl)
            )
        }

        onDelete = function() {
            deleteNote(
                getNoteObject(stickerEl)
            )
            document.body.removeChild(stickerEl);
        }

        stickerEl.style.transform = noteConfig.notePosition;
        stickerEl.id = noteConfig.id;
        textareaEl.value = noteConfig.content;

        stickerEl.classList.add('sticker');
        stickerEl.addEventListener('mousedown', onDragStart);
        barEl.classList.add('bar');
        saveBtnEl.classList.add('saveBtn');
        saveBtnEl.addEventListener('click', onSave);
        deleteBtnEl.classList.add('deleteBtn');
        deleteBtnEl.addEventListener('click', onDelete);

        barEl.appendChild(saveBtnEl);
        barEl.appendChild(deleteBtnEl);
        stickerEl.appendChild(barEl);
        stickerEl.appendChild(textareaEl);
        textareaEl.setAttribute('placeholder','Make some notes!');

        document.body.appendChild(stickerEl);
    }

    testLocalStorage = function() {
        var foo = 'foo';
        try {
            localStorage.setItem(foo, foo);
            localStorage.removeItem(foo);
            return true;
        } catch (e) {
            return false;
        }
    }

    init = function() {
        if (!testLocalStorage) {
            var message = "We are sorry but you cannot use localStorage";
            saveNote = function() {
                console.warn(message);
            }
            deleteNote = function() {
                console.warn(message);
            }
        } else {
            saveNote = function(note) {
                localStorage.setItem(note.id, JSON.stringify(note));
            }
            deleteNote = function(note) {
                localStorage.removeItem(note.id);
            }
            loadNotes = function() {
                for (var i = 0; i < localStorage.length; i++) {
                    var noteObject = JSON.parse(
                        localStorage.getItem(
                            localStorage.key(i)
                        )
                    );
                    createNote(noteObject);
                }
            }
            loadNotes();
        }
        addNoteImg = document.querySelector('.addNote');
        addNoteImg.addEventListener('click', onAddNoteClick);
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', onDragEnd);
    }
    init();
})();
