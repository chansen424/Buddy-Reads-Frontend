import { FormEvent, useState } from "react";
import styles from "../styles/Home.module.css";

const JoinGroup = () => {
  const [joinGroupInput, setJoinGroupInput] = useState("");
  const onSubmitJoin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(
      `https://buddy-reads-backend.herokuapp.com/groups/${joinGroupInput}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      // .then(group => setGroups([group, ...groups]))
      .then(() => setJoinGroupInput(""));
  };

  return (
    <form onSubmit={onSubmitJoin}>
      <h2>Join Group</h2>
      <label htmlFor="group-id">Group ID</label>
      <div className={styles.inputContainer}>
        <input
          id="group-id"
          onChange={(e) => setJoinGroupInput(e.target.value)}
          value={joinGroupInput}
          className={styles.input}
          placeholder="Group ID"
        ></input>
        <button type="submit" className={styles.groupBtn}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default JoinGroup;
