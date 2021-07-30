import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState, useEffect } from "react";
import useAuth from "../hooks/auth";
import styles from "../styles/Login.module.css";

export default function Login() {
  const router = useRouter();
  const { authenticated, login, logout } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(username, password);
    setUsername("");
    setPassword("");
  };

  useEffect(() => {
    if (authenticated) {
      router.push("/");
    }
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.formContainer}>
        <h1 className={styles.centered}>Login</h1>
        <form className={styles.form} onSubmit={onSubmit}>
          <input
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          ></input>
          <input
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          ></input>
          <button className={styles.loginBtn} type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
