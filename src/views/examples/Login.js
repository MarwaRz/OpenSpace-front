import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Row,
  Container,
  Col,
} from 'reactstrap';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Header from 'components/Headers/Header';
import { loginUser } from 'api/userApi';
import { Link } from 'react-router-dom';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validationSchema = Yup.object({
  email: Yup.string()

  .matches(emailRegex, 'Adresse email invalide')

  .required('L\'email est obligatoire'),

password: Yup.string()

  .required('Le mot de passe est obligatoire'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await loginUser(values);      if (response) {


        localStorage.setItem('isAuthenticated', 'true');

        window.location.href = '/admin/plateaux';

      }    } catch (error) {
      setErrors({password: 'Échec de la connexion. Veuillez vérifier vos identifiants.' });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="collapse-brand" xs="9">
            <Link to="/">
              <img
                style={{ marginTop: '-100px' }}
                src={require('../../assets/img/brand/logo_0.png')}
                alt="Logo"
              />
            </Link>
          </Col>
        </Row>
        <Row>
          <Col lg="5" md="7" className="mx-auto">
            <Card className="bg-secondary shadow border-0">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <h2
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    Connexion
                  </h2>
                </div>
                <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    values,
                    handleChange,
                    handleBlur,
                    touched,
                    errors,
                    isSubmitting,
                  }) => (
                    <Form>
                      <FormGroup className="mb-3">
                        <Field
                          as={TextField}
                          name="email"
                          label="Email"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Field
                          as={TextField}
                          name="password"
                          label="Password"
                          variant="outlined"
                          type={showPassword ? 'text' : 'password'}
                          fullWidth
                          margin="normal"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon fontSize="small" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <div  
                                  onClick={togglePasswordVisibility}
                                  style={{ cursor:'pointer' }}
                                >
                                  {showPassword ? (
                                    <VisibilityIcon fontSize="small" />
                                  ) : (
                                    <VisibilityOffIcon fontSize="small" />
                                  )}
                                </div>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormGroup>
                      <div className="text-center">
                        <Button
                          className="my-4"
                          color="info"
                          type="submit"
                          disabled={isSubmitting}
                          style={{ width: '100%' }}
                        >
                          Se Connecter
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
