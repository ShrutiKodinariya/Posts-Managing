import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
  const [form, setForm] = useState({
    emailid: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate hook for redirection

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Retrieve stored user credentials
    const storedCredentials = JSON.parse(localStorage.getItem('userCredentials'));

    // Validate entered credentials
    if (storedCredentials) {
      if (form.emailid === storedCredentials.email && form.password === storedCredentials.password) {
        localStorage.setItem('authenticated', 'true'); // Set authenticated flag
        navigate('/posts'); // Redirect to dashboard if credentials are valid
      } else {
        setError('Invalid email or password');
      }
    } else {
      setError('No user found. Please sign up first.');
    }
  };

  return (
    <Container 
      className="d-flex justify-content-center align-items-center" 
      style={{ height: '100vh' }} 
    >
      <Row className="justify-content-center">
        <Col>
          <div className="p-4 shadow-sm border rounded flex-grow-1" style={{ minWidth: '400px' }}>
            <h2 className="text-center mb-4">Sign In</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="emailid"
                  value={form.emailid} // Controlled input bound to state
                  onChange={handleChange} // Calls handleChange on typing
                  placeholder="Enter email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>

              {error && <p style={{ color: 'red' }}>{error}</p>}

              <Button variant="primary" type="submit" className="w-100">
                Sign In
              </Button>
            </Form>
            <p className="mt-3">
              Don't have an account? <Link to="/sign-up">Sign Up here</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
