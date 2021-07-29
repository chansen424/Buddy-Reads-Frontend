import Head from 'next/head'
import Link from 'next/link'
import useAuth from '../hooks/auth'
import {useState, useEffect} from 'react';
import styles from '../styles/Home.module.css'

interface Group {
  id: string;
  name: string;
  owner: string;
  reads: any[];
  members: Set<any>;
}

export default function Home() {
  const {authenticated, logout} = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (authenticated) {
      fetch(
        'http://localhost:3001/groups/',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.accessToken}`
          }
        }
      ).then(res => res.json())
      .then(json => setGroups(json));
    }
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div>
          <h1 className={styles.centered}>Home</h1>
          { authenticated ? 
            <button className={styles.logout} onClick={e => logout()}>Logout</button> : 
            <Link href="/login"><a className={styles.signin}>Sign In</a></Link> 
          }
        </div>
        {
          authenticated && <>
            <h2>Groups</h2>
        {groups.map(group => <Link key={group.id} href={`/groups/${group.id}`}><a>{group.name}</a></Link>)}
          </>
        }
        
      </div>
    </div>
  )
}
