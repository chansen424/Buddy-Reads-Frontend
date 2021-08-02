import { useContext, createContext, useState, useEffect } from "react";

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    setAuthenticated("accessToken" in localStorage);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (localStorage.getItem("refreshToken")) {
      interval = setInterval(async () => {
        fetch("https://buddy-reads-backend.herokuapp.com/users/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("refreshToken"),
          }),
        }).then((res) => res.json());
      }, 60 * 60 * 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, []);

  const login = (username: string, password: string) => {
    fetch("https://buddy-reads-backend.herokuapp.com/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.accessToken === undefined || json.refreshToken === undefined) {
          throw Error("Access Token or Refresh Token missing.");
        }
        localStorage.setItem("accessToken", json.accessToken);
        localStorage.setItem("refreshToken", json.refreshToken);
        setAuthenticated(true);
      })
      .catch((e) => setAuthenticated(false));
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    fetch('https://buddy-reads-backend.herokuapp.com/logout',
    {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: refreshToken })
    });
    localStorage.clear();
    setAuthenticated(false);
  };

  const register = (username: string, password: string) => {
    fetch("https://buddy-reads-backend.herokuapp.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  };

  return { authenticated, login, register, logout };
};

export default useAuth;
