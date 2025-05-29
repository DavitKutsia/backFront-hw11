import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Header from './Header';
import { Pencil, ThumbsDown, ThumbsUp, Trash } from 'lucide-react';

const PostPage = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [director, setDirector] = useState(null);
  const [filmTitle, setFilmTitle] = useState('');
  const [filmContent, setFilmContent] = useState('');
  const [filmGenre, setFilmGenre] = useState('drama'); 
  const [filmYear, setFilmYear] = useState(new Date().getFullYear()); 
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filmId, setFilmId] = useState(null);
  const [updateFilmTitle, setUpdateFilmTitle] = useState('');
  const [updateFilmContent, setUpdateFilmContent] = useState('');
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


  const handleReaction = async (type, id) => {
    const resp = await fetch(`http://localhost:3000/films/${id}/reactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        reaction: type 
      }),
    })  
    if (resp.status === 200) {
      await fetchFilms();
      toast.success(`You ${type === 'like' ? 'liked' : 'disliked'} the film!`);
    }
  }


  const handleUpdate = async (id) => {
    setShowModal(prev => !prev);
    setFilmId(id);
    await getFilmById(id);
  }

  const getFilmById = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/films/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUpdateFilmTitle(data.title);
      setUpdateFilmContent(data.content);
    } catch (err) {
      toast.error(err.message);
    }
  }

  const handleUpdateForm = async (e) => {
    e.preventDefault();
    const film = films.find(el => el._id === filmId);
        const resp = await fetch(`http://localhost:3000/films/${film._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: updateFilmTitle,
        content: updateFilmContent
      }),
    });

    const data = await resp.json();
    if (resp.status === 200) {
      toast.success('Film updated successfully!');
      setShowModal(false);
      setUpdateFilmTitle('');
      setUpdateFilmContent('');
      setFilmId(null);
      await fetchFilms();
    } else {
      toast.error(data.message || 'Failed to update film');
    }
  }


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
      {showModal && 
        <div id='modal' onClick={() => {
          setShowModal(false)
          setFilmId(null);
        }}>
          <form id='updateForm' onClick={(e) => e.stopPropagation()} onSubmit={handleUpdateForm}>
            <input type="text" value={updateFilmTitle} onChange={(e) => setUpdateFilmTitle(e.target.value)}/>
            <input type="text" value={updateFilmContent} onChange={(e) => setUpdateFilmContent(e.target.value)}/>
            <button>Update</button>
          </form>         
        </div>}
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
                <div id='filmActions'>
                  {director && director._id === film.director?._id && (
                    <Trash
                      id='deleteButton'
                      onClick={() => handleDelete(film._id)}
                    />
                      
                  )}
                  {director && director._id === film.director?._id && (
                    <Pencil
                      id='editButton'
                      onClick={() => handleUpdate(film._id)}
                    />
                  )}
                </div>
                <div id='thumbsContainer'>
                  <div id='thumbsUpContainer'>
                    <ThumbsUp id='thumbsUp' onClick={() => handleReaction('like', film._id)} />
                    {film.reactions?.likes?.length || 0}
                  </div>
                  <div id='thumbsDownContainer'>
                    <ThumbsDown id='thumbsDown' onClick={() => handleReaction('dislike', film._id)} />
                    {film.reactions?.dislikes?.length || 0}
                  </div>
                </div>
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