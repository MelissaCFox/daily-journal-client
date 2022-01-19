import React, { useState, useEffect } from "react"
import { getTags } from "./tags/TagManager"

export const EntryForm = ({ entry, moods, onFormSubmit }) => {
    const [editMode, setEditMode] = useState(false)
    const [updatedEntry, setUpdatedEntry] = useState(entry)
    const [tags, setTags] = useState([])
    const [userTags, setUserTags] = useState([])

    const checkTag = (event) => {
        let tagId = parseInt(event.target.value)
        let copy = [...userTags]
        let alreadySelected = copy.find((tag) => tag === tagId)
        if (alreadySelected) {
            let newCopy = copy.filter((id) => id !== tagId)
            setUserTags(newCopy)
        } else {
            copy.push(tagId)
            setUserTags(copy)
        }
    }

    useEffect(() => {
        getTags().then(setTags)
    }, [])

    useEffect(() => {
        if (updatedEntry) {
            let copy = {...updatedEntry}
            if (userTags.length > 0) {
                copy.tags = userTags
                setUpdatedEntry(copy)
            } else {
                return false
            }
        }
    }, [userTags])

    useEffect(() => {
        setUpdatedEntry(entry)
        if ('id' in entry) {
            setEditMode(true)
            let userTags = []
            for (const tag of entry.tags) {
                userTags.push(tag.id)
            }
            setUserTags(userTags)
        }
        else {
            setEditMode(false)
        }
    }, [entry] )

    const handleControlledInputChange = (event) => {
        /*
            When changing a state object or array, always create a new one
            and change state instead of modifying current one
        */
        const newEntry = Object.assign({}, updatedEntry)
        if (event.target.name === "mood_id") {
            newEntry[event.target.name] = parseInt(event.target.value)
        } else {
            newEntry[event.target.name] = event.target.value
        }
        setUpdatedEntry(newEntry)
    }


    const constructNewEntry = () => {
        const copyEntry = { ...updatedEntry }
        if (!copyEntry.date) {
            copyEntry.date = Date(Date.now()).toLocaleString('en-us').split('GMT')[0]
        } 

        onFormSubmit(copyEntry)
        setUserTags([])
        copyEntry.mood_id = "0"
        setUpdatedEntry(copyEntry)

    }

    return (
        <article className="panel is-info">
            <h2 className="panel-heading">{editMode ? "Update Entry" : "Create Entry"}</h2>
            <div className="panel-block">
                <form id="entry_form" style={{ width: "100%" }}>
                    <div className="field">
                        <label htmlFor="concept" className="label">Concept: </label>
                        <div className="control">
                            <input type="text" name="concept" required autoFocus className="input"
                                proptype="varchar"
                                placeholder="Concept"
                                value={updatedEntry.concept}
                                onChange={handleControlledInputChange}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="entry" className="label">Entry: </label>
                        <div className="control">
                            <textarea
                                className="textarea"
                                name="entry"
                                value={updatedEntry.entry}
                                onChange={handleControlledInputChange}
                            ></textarea>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="mood_id" className="label">Mood: </label>
                        <div className="control">
                            <div className="select">
                                <select id="mood_select" name="mood_id"
                                    proptype="int"
                                    value={updatedEntry.mood_id}
                                    onChange={handleControlledInputChange}>

                                    <option value="0">Select a mood</option>
                                    {moods.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="tags" className="label">Tags: </label>
                        <div className="control tags">
                            {
                                tags.map((tag) => {
                                    return <div key={tag.id} className="tag_option">
                                    <input type="checkbox" id={tag.id} name="tags" value={tag.id}
                                    onChange={checkTag}
                                    checked={userTags.find((tagId) => tagId == tag.id)? "checked" : ""}
                                    >    
                                    </input>
                                    <label className="tag_label" for={tag.id}>{tag.label}</label>
                                    </div>
                                })
                            }
                            
                        </div>
                    </div>

                    <div className="field">
                        <div className="control">
                            <button type="submit"
                                onClick={evt => {
                                    evt.preventDefault()
                                    constructNewEntry()
                                }}
                                className="button is-link">
                                {editMode ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </article>
    )
}
