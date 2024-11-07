import React from 'react'
import './note.css'

const Note = ({faculty,description,download,module,student,time}) => {
  return (
    <div className="notesobj">
      <h3>Module: {module}</h3>
        <p><b>Faculty:</b> {faculty}</p>  
        <p><b>Description: </b>{description}</p>
        <p><b>Uploader:</b> {student}</p>
        <p><b>TimeStamp: </b>{time}</p>
        <a target="_blank"  rel="noopener noreferrer" href={download}>Open</a>
    </div>
  )
}

export default Note