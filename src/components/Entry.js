import React from "react";

export const Entry = ({ entry, onEditButtonClick, onDeleteButtonClick }) => {
  const getMessageType = () => {
    if (entry.mood) {
      switch (entry.mood.label) {
        case 'Angry':
          return 'is-danger'
        case 'Happy':
          return 'is-success'
        case 'Ok':
          return 'is-warning'
        case 'Sad':
          return 'is-primary'
        default:
          break;
      }
    }
  }

  return (
    <article className={`message ${getMessageType()}`} style={{width:"100%"}}>
      <div className="message-body">
        <p className="entry__concept">{entry.concept}</p>
        <p className="entry__entry">{entry.entry}</p>
        <p className="entry__date">{entry.date}</p>
        <p className="entry__mood">{entry.mood.label}</p>
        <div className="entry__tags">Tag(s): {entry.tags.length}</div>
        <div className="entry__tag_list">
        {
          entry.tags.length > 0
          ? entry.tags.map((tag) => <div className= "entry__tag">{tag.label}</div>)
          : ""
        }
        </div>
        <div className="buttons">
          <button className={`button ${getMessageType()} is-outlined`} onClick={
            () => {
              onEditButtonClick(entry.id)
            }
          }>Edit</button>
          <button className={`button ${getMessageType()}`} onClick={
            () => {
              onDeleteButtonClick(entry.id)
            }
          }>Delete</button>
        </div>
      </div>
    </article>
  )
};
