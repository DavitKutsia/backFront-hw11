import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../index.css';

export default function Header() {
  const [director, setDirector] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get('token');

  const getDirector = async () => {
    try {
      const res = await fetch('https://backend-hw11.vercel.app/auth/profile', {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      const data = await res.json();
      setDirector(data.director);
    } catch (error) {
      toast.error('Failed to fetch director:', error);
      navigate('/login');
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  useEffect(() => {
    getDirector();
  }, [token, navigate]);

  return (
    <header>
      <h1>Film App</h1>
      <div>
        {director ? (
          <div id='profile'>
            <h2 onClick={() => {
              navigate('/posts');
            }}>Films</h2>
            <h2 onClick={() => {
              navigate('/profile');
            }}>Profile</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
          </div>
        )}
      </div>
    </header>
  );
}
