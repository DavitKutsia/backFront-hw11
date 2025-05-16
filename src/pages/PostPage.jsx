import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Header from './Header';

const PostPage = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [director, setDirector] = useState(null);
  const [filmTitle, setFilmTitle] = useState('');
  const [filmContent, setFilmContent] = useState('');
  const [filmGenre, setFilmGenre] = useState('drama'); 
  const [filmYear, setFilmYear] = useState(new Date().getFullYear()); 
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get('token');

  const getDirector = async () => {
    try {
      const res = await fetch('http://localhost:3000/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setDirector(data.director);
    } catch (err) {
      toast.error(err.message);
      if (err.message.toLowerCase().includes('unauthorized')) {
        Cookies.remove('token');
        navigate('/login');
      }
    }
  };
  
  const fetchFilms = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://backend-hw11.vercel.app/films', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFilms(data); 
    } catch (err) {
      toast.error(err.message);
      if (err.message.toLowerCase().includes('unauthorized')) {
        Cookies.remove('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://backend-hw11.vercel.app/films/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if(res.status === 200) {
        toast.success('Film deleted successfully');
        await fetchFilms();
      } else {
        toast.error('Failed to delete film');
      }
    } catch (err) {
      toast.error(err.message);
      if (err.message.toLowerCase().includes('unauthorized')) {
        Cookies.remove('token');
        navigate('/login');
      }
    }
  };

  const handleCreateFilm = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      if (!director) {
        toast.error('Director information not loaded');
      }

      const res = await fetch('https://backend-hw11.vercel.app/films', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'director-id': director._id          
        },
        body: JSON.stringify({
          title: filmTitle,
          content: filmContent,
          genre: filmGenre,
          year: filmYear
        }),
      });

      const data = await res.json();

      if(res.status === 201) {
        toast.success('Film created successfully!');
        setFilmTitle('');
        setFilmContent('');
        await fetchFilms();
      } else {
        toast.error(data.message || 'Failed to create film');
      } 
    } catch (err) {
      toast.error(err.message);
      if (err.message.toLowerCase().includes('unauthorized')) {
        Cookies.remove('token');
        navigate('/login');
      }
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      const loadData = async () => {
        await getDirector();
        await fetchFilms();
      };
      loadData();
    }
  }, [token, navigate]);

  return (
    <div>
      <Header />
      <div className="feed-container">
          <form onSubmit={handleCreateFilm}>
            <h1 id='newFilmTitle'>Add New Film</h1>
            <div className="form-groups">
              <div className="form-group">
                <label>Film Title</label>
                <input
                  name="title"
                  value={filmTitle}
                  onChange={(e) => setFilmTitle(e.target.value)}
                  required
                  placeholder='Minimum 3 characters'
                />
              </div>
              <div className="form-group">
                <label>Film Content</label>
                <textarea
                  name="content"
                  value={filmContent}
                  onChange={(e) => setFilmContent(e.target.value)}
                  required
                  rows={4}
                  placeholder='Minimum 10 characters'
                />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <select
                  value={filmGenre}
                  onChange={(e) => setFilmGenre(e.target.value)}
                  id='genre'
                  required
                >
                  <option value="drama">Drama</option>
                  <option value="comedy">Comedy</option>
                  <option value="action">Action</option>
                  <option value="horror">Horror</option>
                </select>
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  value={filmYear}
                  onChange={(e) => setFilmYear(e.target.value)}
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
            </div>
            <button id='addFilmButton' type="submit" disabled={isCreating || !director}>
              {isCreating ? 'Creating...' : 'Add Film'}
            </button>
          </form>

        <div className="films-container">
          {loading && films.length === 0 ? (
            <p>Loading films...</p>
          ) : films.length > 0 ? (
            films.map(film => (
              <div id='film-container' key={film._id}>
                <h1>{film.title}</h1>
                <p>{film.content}</p>
                <p>Genre: {film.genre}</p>
                <p>Year: {film.year}</p>
                <p id='directorName'>Director: {film.director?.name}</p>
                <button 
                  onClick={() => handleDelete(film._id)}
                  disabled={isDeleting === film._id}
                  id='deleteButton'
                >
                  {isDeleting === film._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))
          ) : (
            <p>No films available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;