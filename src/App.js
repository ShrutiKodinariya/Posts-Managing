import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './Components/signIn';
import SignUp from './Components/signUp';
import PostDashboard from './Components/dashboard';

function App() {
  return (
      <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in" />} /> 
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/posts" element={<PostDashboard />} />
      </Routes>
    </Router>
    
  );
}

export default App;
