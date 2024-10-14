import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Container, Row, Col, InputGroup, FormControl, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AiOutlineFile, AiOutlineUser, 
  AiOutlineComment, AiOutlineTags,
  AiOutlineMenu, AiOutlineDownload, AiOutlinePlus, 
  AiOutlineFilter, AiOutlineDelete } from 'react-icons/ai';

const PostDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    isCommentable: false,
    id: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [alertMessage, setAlertMessage] = useState('');
  const [filterModal, setFilterModal] = useState(false); // State for filter modal
  const [filters, setFilters] = useState({
    category: '',
    isCommentable: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated');
    if (!isAuthenticated) {
      navigate('/sign-in'); // Redirect to sign-in page if not authenticated
    }

    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    setPosts(savedPosts);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get the current date
    const currentDate = new Date().toLocaleDateString(); // Format as needed (e.g., MM/DD/YYYY)
    
    // Create new post with the current date as published date
    const newPost = { 
      ...form, 
      publishedDate: currentDate, // Set published date to current date
      id: posts.length + 1 // Generate ID based on posts length
    };
    
    const updatedPosts = [...posts, newPost];

    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setForm({
      title: '',
      content: '',
      category: '',
      isCommentable: false,
      id: null
    });
    setAlertMessage('Post added successfully!');
    setShowModal(false); // Close modal after submission
    setTimeout(() => setAlertMessage(''), 3000); // Clear message after 3 seconds
  };

  const handleBulkDelete = () => {
    if (window.confirm('Are you sure you want to delete the selected posts?')) {
      const updatedPosts = posts.filter((post) => !selectedPosts.includes(post.id));
      setPosts(updatedPosts);
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      setSelectedPosts([]); // Clear selected posts after deletion
      setAlertMessage('Selected posts deleted successfully!');
      setTimeout(() => setAlertMessage(''), 3000); // Clear message after 3 seconds
    }
  };

  const handleSelectPost = (id) => {
    setSelectedPosts((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((pid) => pid !== id) : [...prevSelected, id]
    );
  };

  const filteredPosts = posts.filter((post) => {
    // Apply search filter
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply category filter
    const matchesCategory = filters.category ? post.category === filters.category : true;

    // Apply commentable filter
    const matchesCommentable = filters.isCommentable ? post.isCommentable : true;

    return matchesSearch && matchesCategory && matchesCommentable;
  });

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenFilterModal = () => {
    setFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setFilterModal(false);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="bg-light p-3">
          <div className="d-flex flex-column">
            <h5>Dashboard</h5>
            <ul className="nav flex-column">
              <li className="nav-item">
                <a href="#posts" className="nav-link">
                  <AiOutlineFile className="me-2" /> Posts
                </a>
              </li>
              <li className="nav-item">
                <a href="#users" className="nav-link">
                  <AiOutlineUser className="me-2" /> Users
                </a>
              </li>
              <li className="nav-item">
                <a href="#comments" className="nav-link">
                  <AiOutlineComment className="me-2" /> Comments
                </a>
              </li>
              <li className="nav-item">
                <a href="#tags" className="nav-link">
                  <AiOutlineTags className="me-2" /> Tags
                </a>
              </li>
            </ul>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={10}>
          <Row className="mt-3">
            {/* Search Bar */}
            <Col md={3}>
              <InputGroup>
                <FormControl
                  placeholder="Search posts"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </Col>
            {/* Top Right Options */}
            <Col md={9} className="text-end">
              <Button variant="link-offset-2 link-underline link-underline-opacity-0" className="me-2">
                <AiOutlineMenu className="me-1" /> Columns
              </Button>
              <Button variant="link-offset-2 link-underline link-underline-opacity-0" className="me-2">
                <AiOutlineDownload className="me-1" /> Export
              </Button>
              <Button variant="link-offset-2 link-underline link-underline-opacity-0" className="me-2" onClick={handleOpenModal}>
                <AiOutlinePlus className="me-1" /> Create
              </Button>
              <Button variant="link-offset-2 link-underline link-underline-opacity-0" className="me-2" onClick={handleOpenFilterModal}>
                <AiOutlineFilter className="me-1" /> Add Filter
              </Button>
              <Button variant="link-offset-2 link-underline link-underline-opacity-0" className="me-2" onClick={handleBulkDelete}>
                <AiOutlineDelete className="me-1" /> Delete
              </Button>
            </Col>
          </Row>

          {/* Alert Message */}
          {alertMessage && <Alert variant="success">{alertMessage}</Alert>}

          {/* Posts Table */}
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedPosts(e.target.checked ? posts.map((post) => post.id) : [])
                    }
                  />
                </th>
                <th style={{ width: 'auto' }}>ID</th>
                <th style={{ width: '50%' }}>Title</th> {/* Allow Title column to be wider */}
                <th style={{ width: '150px' }}>Published Date</th>
                <th style={{ width: '150px' }}>Category</th>
                <th style={{ width: '100px' }}>Commentable</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handleSelectPost(post.id)}
                      />
                    </td>
                    <td>{post.id}</td> {/* Display ID */}
                    <td>{post.title}</td>
                    <td>{post.publishedDate}</td> {/* Display published date */}
                    <td>{post.category}</td>
                    <td>{post.isCommentable ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No posts found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Create Post Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Business">Business</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={3}
                placeholder="Content"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formIsCommentable">
              <Form.Check
                type="checkbox"
                label="Commentable"
                name="isCommentable"
                checked={form.isCommentable}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Filter Modal */}
      <Modal show={filterModal} onHide={handleCloseFilterModal}>
        <Modal.Header closeButton>
          <Modal.Title>Filter Posts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="filterCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Business">Business</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="filterIsCommentable">
              <Form.Check
                type="checkbox"
                label="Show Only Commentable Posts"
                name="isCommentable"
                checked={filters.isCommentable}
                onChange={handleFilterChange}
              />
            </Form.Group>

            <Button variant="primary" onClick={() => setFilterModal(false)}>
              Apply Filters
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PostDashboard;
