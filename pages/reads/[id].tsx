import { GetServerSideProps } from "next";
import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";
import styles from "../../styles/Groups.module.css";

interface Message {
  id: string;
  owner: string;
  username: string;
  read: string;
  progress: number;
  content: string;
  createdAt: number;
}

interface ReadPageProps {
  id: string;
  name: string;
  read: string;
}

export default function ReadPage({ id, name }: ReadPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [progressInput, setProgressInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [messageInput, setMessageInput] = useState("");

  const onMessageSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("http://localhost:3001/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: messageInput,
        progress,
        read: id,
      }),
    })
      .then((res) => res.json())
      .then((message) => [message, ...messages])
      .then((unsortedMessages) => {
        unsortedMessages.sort(
          (a: Message, b: Message) =>
            b.progress - a.progress || b.createdAt - a.createdAt
        );
        setMessages(unsortedMessages);
      })
      .then(() => setMessageInput(""));
  };

  useEffect(() => {
    fetch(`http://localhost:3001/progress/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => {
        if (res.status === 500) {
          return { progress: 0 };
        }
        return res.json();
      })
      .then((data) => setProgress(data.progress));
  }, [id]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("http://localhost:3001/progress/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        progress: parseInt(progressInput),
        read: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => setProgress(data.progress));
    setProgressInput("");
  };

  useEffect(() => {
    fetch(`http://localhost:3001/messages/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data.sort(
          (a: Message, b: Message) =>
            b.progress - a.progress || b.createdAt - a.createdAt
        );
        setMessages(data);
      });
  }, [progress, id]);

  return (
    <div className={styles.container}>
      <Head>
        <title>{name}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <h1>{name}</h1>
        <h2>Current Progress - {progress}%</h2>
        <form onSubmit={onSubmit}>
          <input
            className={styles.input}
            value={progressInput}
            onChange={(e) => setProgressInput(e.target.value)}
            placeholder="Progress"
          ></input>
          <button className={styles.button} type="submit">
            Submit
          </button>
        </form>
        <form onSubmit={onMessageSubmit}>
          <h2>Type a message</h2>
          <input
            className={styles.input}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type here"
          ></input>
          <button className={styles.button} type="submit">
            Submit
          </button>
        </form>
        {messages.map((message) => (
          <p className={styles.message} key={message.id}>
            {message.content} - {message.username} {message.progress}%
          </p>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const readRes = await fetch(
    `http://localhost:3001/reads/${context.params!.id}`
  );
  const read = await readRes.json();

  if (read.err) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...read,
    },
  };
};
