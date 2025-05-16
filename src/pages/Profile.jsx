import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from './Header';
import { toast } from 'react-toastify'; 
import '../index.css';

export default function Profile() {
  const [director, setDirector] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get('token');

  const getDirector = async () => {
    try {
      const res = await fetch('http://localhost:3000/auth/profile', {
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

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      getDirector();
    }
  }, [token, navigate]);

  return (
    <div>
      <Header />
      <div id="profileDiv">
        <h1>Name: {director?.name}</h1>
        <h1>Email: {director?.email}</h1>
        <h1>Age: {director?.age}</h1>
      </div>
    </div>
  );
}