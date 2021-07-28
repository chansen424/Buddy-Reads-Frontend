import { useContext, createContext, useState, useEffect } from 'react';

const useAuth = () => {
    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => {
        setAuthenticated('accessToken' in localStorage);
      }, []);

    useEffect(() => {
        let interval: NodeJS.Timer;
        if (localStorage.getItem('refreshToken')) {
            interval = setInterval(async () => {
            fetch('http://localhost:3001/users/token',
                {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: localStorage.getItem('refreshToken')
                })
                }
            )
            .then(res => res.json());
            }, 60 * 60 * 1000);
        }
        return () => {
            clearInterval(interval);
        }
    }, []);

    const login = (username: string, password: string) => {
        fetch(
            'http://localhost:3001/users/login',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                username, 
                password
              })
            }
        )
        .then(res => res.json())
        .then(json => {
            if (json.accessToken === undefined || json.refreshToken === undefined) {
                throw Error('Access Token or Refresh Token missing.');
            }
            localStorage.setItem('accessToken', json.accessToken);
            localStorage.setItem('refreshToken', json.refreshToken);
            setAuthenticated(true);
        })
        .catch(e => setAuthenticated(false));
    }

    const logout = () => {
        localStorage.clear();
        setAuthenticated(false);
    }

    return {authenticated, login, logout}
}

export default useAuth;