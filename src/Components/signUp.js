import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaPen } from 'react-icons/fa'; // Icons for input fields
import { useNavigate, Link } from 'react-router-dom';

const SignUpPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
    termsAccepted: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (form.password !== form.repeatPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Save user credentials to local storage
    const userCredentials = {
      email: form.email,
      password: form.password,
    };
    localStorage.setItem('userCredentials', JSON.stringify(userCredentials));

    // Redirect to the sign-in page after successful registration
    alert('Registration successful! You can now sign in.');
    navigate('/sign-in'); // Adjust the route as needed
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row className="w-75"> {/* Adjust width here */}
        {/* Left Column: Form */}
        <Col md={6} className="d-flex align-items-center">
          <div className="p-4 shadow-sm border rounded w-100">
            <h2 className="text-left mb-4">Sign up</h2>
            <Form onSubmit={handleSubmit}>
              {/* Name Input */}
              <Form.Group className="mb-3" controlId="formName">
                <div className="d-flex align-items-center">
                  <FaUser className="me-2" />
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
              </Form.Group>

              {/* Email Input */}
              <Form.Group className="mb-3" controlId="formEmail">
                <div className="d-flex align-items-center">
                  <FaEnvelope className="me-2" />
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                  />
                </div>
              </Form.Group>

              {/* Password Input */}
              <Form.Group className="mb-3" controlId="formPassword">
                <div className="d-flex align-items-center">
                  <FaLock className="me-2" />
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </div>
              </Form.Group>

              {/* Repeat Password Input */}
              <Form.Group className="mb-3" controlId="formRepeatPassword">
                <div className="d-flex align-items-center">
                  <FaPen className="me-2" />
                  <Form.Control
                    type="password"
                    name="repeatPassword"
                    value={form.repeatPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    required
                  />
                </div>
              </Form.Group>

              {/* Terms and Conditions */}
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  name="termsAccepted"
                  checked={form.termsAccepted}
                  onChange={handleChange}
                  label="I agree to all statements in Terms of service"
                  required
                />
              </Form.Group>

              {/* Register Button */}
              <Button variant="primary" type="submit" className="w-100">
                Register
              </Button>
            </Form>
            <p className="mt-3">
              Already have an account? <Link to="/sign-in">Sign In here</Link>
            </p>
          </div>
        </Col>

        {/* Right Column: Image */}
        <Col md={6} className="d-none d-md-flex justify-content-center align-items-center">
          <img
            src="/Images/background.png"// Replace with your image path or import
            alt="Sign up illustration"
            className="img-fluid"
            style={{ maxHeight: '400px' }}  // Adjust size as needed
          />
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
