  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import '../index.css';
  import { toast } from 'react-toastify';
  import Header from './Header';

  const Register = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch('http://localhost:3000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, age, email, password })
        });
      } catch (err) {
        toast.error('Registration failed');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div>
        <Header />
          <div id='registerPage'>
          <form id='registerForm' onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div className="registerFormInputDivs">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='registerFormInputs'
                required
              />
            </div>
            <div className="registerFormInputDivs">
              <label>Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className='registerFormInputs'
                required
              />
            </div>
            <div className="registerFormInputDivs">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='registerFormInputs'
                required
              />
            </div>
            <div className="registerFormInputDivs">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='registerFormInputs'
                required
              />
            </div>
            <div className='registerButtonDiv'>
              <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
              <p>
                Already have an account?{' '}
                <a className="goToLogin" onClick={() => navigate('/login')}>
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default Register;
