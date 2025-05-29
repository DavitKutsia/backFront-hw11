import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Header from './Header';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://backend-hw11.vercel.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set('token', data.token, { expires: 1 / 24 });
        toast.success('Logged in successfully');
        navigate('/profile');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
        <div id='loginPage'>
        <form id='loginForm' onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className='loginFormInputDivs'>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='loginFormInputs'
              required
            />
          </div>
          <div className='loginFormInputDivs'>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='loginFormInputs'
              required
            />
          </div>
          <div className='loginFormInputDivs'>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='loginFormInputs'
              required
            />
          </div>
          <div className='loginButtonDiv'>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p>
              Don't have an account?{' '}
              <a className="goToRegister" onClick={() => navigate('/register')}>
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
    
  );
};

export default Login;
