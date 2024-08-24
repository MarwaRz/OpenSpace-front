import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box, Grid, FormControl, InputLabel, Select, MenuItem,  } from '@mui/material';
import { Button, Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";
import Header from "components/Headers/Header.js";
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {  addSegmentToPlateau, getPlateaux, getSegmentsByPlateauId } from '../../api/plateauApi';
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
const Profile = () => {
  const [plateaux, setPlateaux] = useState([]);
  const [selectedPlateau, setSelectedPlateau] = useState('');
  const [segments, setSegments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPlateaux() {
      try {
        const plateauxData = await getPlateaux();
        setPlateaux(plateauxData);
      } catch (error) {
        console.error('Erreur lors de la récupération des plateaux:', error);
      }
    }
    fetchPlateaux();
  }, []);

  const fetchSegments = async (plateauId) => {
    try {
      const response = await getSegmentsByPlateauId(plateauId);
      setSegments(response.segments || []); 
    } catch (error) {
      console.error('Erreur lors de la récupération des segments:', error);
    }
  };

  const initialValues = {
    plateauId: '',
    segments: [{ code: '', numberOfPostes: '' }],
  };

  const validationSchema = Yup.object().shape({
    plateauId: Yup.string().required('champs obligatoire'),
    segments: Yup.array().of(
      Yup.object().shape({
        code: Yup.string().required('champs obligatoire'),
        numberOfPostes: Yup.number()
          .required('champs obligatoire')
          .integer('Doit être un nombre entier')
          .positive('Le nombre de postes doit être positif'),
      })
    ),
  });
  const handleSubmit = async (values, { resetForm }) => {
    try {
      setSubmitting(true);
      const newSegments = await addSegmentToPlateau(values.plateauId, values.segments);
      
      toast.success('Segments ajoutés avec succès !');
  
      resetForm();
      fetchSegments(values.plateauId); 
    } catch (error) {
      console.error('Erreur lors de l\'ajout des segments:', error);
  
      toast.error(` ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlateauChange = async (e) => {
    const plateauId = e.target.value;
    setSelectedPlateau(plateauId);
    await fetchSegments(plateauId); 
  };

  return (
    <>
      <Header />
      <Container className="mt--5" fluid>
        <Row>
        <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
  <Card className="card-profile shadow">
    <CardBody className="pt-0 pt-md-4">
      <div className="text-center">
        <h3>Segments du Plateau</h3>

        <div 
          style={{
            maxHeight: '420px', 
            overflowY: 'auto',  
            marginTop: '10px',  
          }}
        >
          {segments.length > 0 ? (
            segments.map((segment, index) => (
              <div 
                key={index} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 20px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography>
                  {segment.code}
                </Typography>

                <Typography>
                  {segment.numberOfPostes} poste(s)
                </Typography>
              </div>
            ))
          ) : (
            <Typography variant="body1">Aucun segment trouvé pour ce plateau</Typography>
          )}
        </div>
      </div>
    </CardBody>
  </Card>
</Col>

          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Ajouter des Segments</h3>
                  </Col>
                  <Col className="text-right" xs="4">

                    <Button color="info" size="sm" tag={Link} to={`/admin/plateaux`} >Voir la liste</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, touched, setFieldValue }) => (
                    <Form >
                      <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel   htmlFor="plateau-select">Plateau</InputLabel>
                        <Select
                          id="plateau-select"
                          value={values.plateauId}
                          onChange={(e) => {
                            handlePlateauChange(e);
                            setFieldValue('plateauId', e.target.value);
                          }}
                          label="Plateau"
                          error={touched.plateauId && Boolean(errors.plateauId)}
                        >
                          <MenuItem value="" disabled>Sélectionner un plateau</MenuItem>
                          {plateaux.map((plateau) => (
                            <MenuItem key={plateau._id} value={plateau._id}>{plateau.name}</MenuItem>
                          ))}
                        </Select>
                        <ErrorMessage 
        name="plateauId"
        component="div"
        style={{

          color: '#d32f2f', 
          fontSize: '0.715rem', 
          marginTop: '0.25rem',

        }}
      />
                                        
                      </FormControl>

                      <FieldArray name="segments">
                        
                        {({ push, remove }) => (
                            <><div className="text-right col-12 pr-0 pt-2">
                            <a onClick={() => push({ code: '', numberOfPostes: '' })} className="btn btn-info btn-sm">Ajouter Segment</a>
                          </div><div>

                              {values.segments.map((segment, index) => (


                                <Box key={index} className="box-shadow" p={2} mb={2} borderRadius={4}>

                                  <Typography variant="h7">Segment {index + 1}</Typography>
                                  <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={5}>
                                      <Field name={`segments.${index}.code`}>
                                        {({ field }) => (
                                          <TextField
                                            {...field}
                                            label="Code du Segment"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            error={touched.segments?.[index]?.code && Boolean(errors.segments?.[index]?.code)}
                                            helperText={touched.segments?.[index]?.code && errors.segments?.[index]?.code} />
                                        )}

                                      </Field>
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                      <Field name={`segments.${index}.numberOfPostes`}>
                                        {({ field }) => (
                                          <TextField
                                            {...field}
                                            label="Nombre de Postes"
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            error={touched.segments?.[index]?.numberOfPostes && Boolean(errors.segments?.[index]?.numberOfPostes)}
                                            helperText={touched.segments?.[index]?.numberOfPostes && errors.segments?.[index]?.numberOfPostes} />
                                        )}
                                      </Field>
                                    </Grid>






                                    <Grid item xs={12} md={2}>
                                      <Button color="secondary" onClick={() => remove(index)} size="sm">
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Box>
                              ))}
                             
                             
                            </div></>
                        )}
                      </FieldArray>
                      <Box mt={3} textAlign="center" padding={3} borderRadius={50}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                          disabled={submitting}
                          size="large"
                          sx={{ borderRadius: 50 }}
                        >
                         Enregistrer
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container><ToastContainer/>
    </>
  );
};

export default Profile;
