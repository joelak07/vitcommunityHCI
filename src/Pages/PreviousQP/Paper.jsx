import React from 'react'
import './paper.css'

const Paper = ({faculty,examtype,examcat,date,slot,download,time,student}) => {
  return (
    <div className='paper'>
        <h3>{examcat} {examtype}</h3>
        <p><b>Faculty:</b> {faculty}</p>  
        <p><b>Slot: </b>{slot}</p>
        <p><b>Uploader:</b> {student}</p>
        <p><b>TimeStamp: </b>{time}</p>
        <p><b>Exam Date: </b>{date}</p>
        <a target="_blank"  rel="noopener noreferrer" href={download}>Open</a>
    </div>
  )
}

export default Paper