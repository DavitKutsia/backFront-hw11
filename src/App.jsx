import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Register from './pages/Register';
import PostPage from './pages/PostPage';
import Profile from './pages/Profile';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<PostPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
  );
}

// ეს API (https://backend-hw11.vercel.app) პირველი დღე, როცა შევქმენი პროექტი მუშაობდა,
// მაგრამ მას შემდეგ ერორების ამოგდება დაიწყო, რის გამოც მომიწია localhost-ის გამოყენება. 
// ვერანაირად ვერ გამოვასწორე. 


export default App;