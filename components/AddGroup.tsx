import { FormEvent, useState } from "react";
import styles from "../styles/Home.module.css";

const AddGroup = () => {
  const [newGroupInput, setNewGroupInput] = useState("");
  const onSubmitAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`https://buddy-reads-backend.herokuapp.com/groups/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newGroupInput }),
    })
      .then((res) => res.json())
      // .then(group => setGroups([group, ...groups]))
      .then(() => setNewGroupInput(""));
  };

  return (
    <form onSubmit={onSubmitAdd}>
      <h2>Add Group</h2>
      <label htmlFor="group-name">Group Name</label>
      <div className={styles.inputContainer}>
        <input
          id="group-name"
          onChange={(e) => setNewGroupInput(e.target.value)}
          value={newGroupInput}
          className={styles.input}
          placeholder="New Group Name"
        ></input>
        <button type="submit" className={styles.groupBtn}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddGroup;
