import { useEffect, useState } from "react";
import Note from "./Note";
import noteService from "../services/notes"

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('a new note...');
    const [showAll, setShowAll] = useState(true);

    useEffect(() => {
        console.log('effect');
        noteService.getAll()
            .then(initialNotes => 
                setNotes(initialNotes)
            );
    },[]);
    console.log('render', notes.length, 'notes.');

    const addNote = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
        }
        noteService.create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote));
                setNewNote('');
            });
    }

    const handleNoteChange = (event) => {
        setNewNote(event.target.value);
    }

    const toggleImportance = (id) => {
        console.log(`toggleImportance of note ${id}`);
        const note = notes.find(note => note.id === id);
        const changedNote = {...note, important: !note.important};
        noteService.update(id, changedNote)
            .then(returnedNote => {
                setNotes(notes.map(note => note.id !== id ? note: returnedNote));
            });
    }

    const removeNote = (id) => {
        console.log(`removeNote of note ${id}`);
        noteService.remove(id)
            .then(() => {
                setNotes(notes.filter(note => note.id !== id));
            });
    }

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important);

    return (
    <div>
        <h1>Notes</h1>
        <div>
            <button onClick={() => setShowAll(!showAll)}>
                show {showAll ? "important" : "all"}
            </button>
        </div>
        <ul>
            {notesToShow.map(note => 
                <Note 
                    key={note.id} note={note} 
                    toggleImportance={() => {toggleImportance(note.id)}} 
                    removeNote={() => {removeNote(note.id)}}></Note>)}
        </ul>
        <form onSubmit={addNote}>
            <input value={newNote} onChange={handleNoteChange}></input>
            <button type="submit">save</button>
        </form>
    </div>
    )
}

export default Notes;