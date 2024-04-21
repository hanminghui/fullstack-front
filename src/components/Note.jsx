const Note = ({note, toggleImportance, removeNote}) => {
    const label = note.important ? 'make not important': 'make important';
    const noteClass = note.important ? 'note-important': 'note-not-important';
    return (
        <li className={noteClass}>
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
            <button onClick={removeNote}>delete</button>
        </li>
    )
}

export default Note;