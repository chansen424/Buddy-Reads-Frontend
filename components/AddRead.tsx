import { FormEvent, useState } from "react";
import styles from "../styles/Groups.module.css";

const AddRead = ({ group }: { group: string }) => {
  const [newReadInput, setNewReadInput] = useState("");
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`http://localhost:3001/reads/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newReadInput, group }),
    })
      .then((res) => res.json())
      .then(() => setNewReadInput(""));
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        className={styles.input}
        onChange={(e) => setNewReadInput(e.target.value)}
        value={newReadInput}
        placeholder="New Read Name"
      ></input>
      <button className={styles.button} type="submit">
        Submit
      </button>
    </form>
  );
};

export default AddRead;
