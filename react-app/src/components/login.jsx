import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegistering) {
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            console.log('Registering:', formData);
        } else {
            console.log('Logging in:', formData);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow">
                <Card.Body>
                    <h2 className="text-center mb-4">{isRegistering ? 'Register' : 'Login'}</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                required
                            />
                        </Form.Group>
                        {isRegistering && (
                            <Form.Group className="mb-3" controlId="formConfirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your password"
                                    required
                                />
                            </Form.Group>
                        )}
                        <Button variant="primary" type="submit" className="w-100">
                            {isRegistering ? 'Register' : 'Login'}
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <Button
                            variant="link"
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-decoration-none"
                        >
                            {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;