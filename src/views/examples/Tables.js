import { useState, useEffect } from "react";
import { DialogContent, DialogActions, DialogContentText, DialogTitle, Dialog, Box, TextField } from '@mui/material';
import { deletePlateau, getPlateaux, updatePlateau, addPlateau } from "api/plateauApi";

import {  useNavigate } from "react-router-dom";

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import {
  Card, Col, CardHeader, Media, Button, Table, Container, Row
} from "reactstrap";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "components/Headers/Header";

const Tables = () => {
  const [plateaux, setPlateaux] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [plateauToDelete, setPlateauToDelete] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [plateauToUpdate, setPlateauToUpdate] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDialogTable, setOpenDialogTable] = useState(false);
  const [navigateTo, setNavigateTo] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(plateaux.length / itemsPerPage);
  const indexOfLastPlateau = currentPage * itemsPerPage;
  const indexOfFirstPlateau = indexOfLastPlateau - itemsPerPage;
  const currentPlateaux = plateaux.slice(indexOfFirstPlateau, indexOfLastPlateau);
 const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleViewPostsClick = (plateau) => {

    if (plateau.segments && plateau.segments.length > 0) {
      navigate(`/admin/${plateau._id}/postes`);
    } else {
      setNavigateTo('/admin/segments');
      setOpenDialogTable(true);
    }
  };

  const handleCloseDialogTable = () => {
    setOpenDialogTable(false);
  };

  const handleNavigate = () => {
    navigate(navigateTo);
    handleCloseDialogTable();
  };



  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenUpdateDialog = (plateau) => {
    setPlateauToUpdate(plateau);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setPlateauToUpdate(null);
  };

  const listPlateaux = async () => {
    try {
      const data = await getPlateaux();
      setPlateaux(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des plateaux:', error);
    }
  };

  useEffect(() => {
    listPlateaux();
  }, []);

  


  const formik = useFormik({
    initialValues: {
      name: plateauToUpdate?.name || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Le nom du plateau est requis'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (plateauToUpdate) { 
          await updatePlateau(plateauToUpdate._id, values);
          listPlateaux();
          handleCloseUpdateDialog();
          toast.success('Plateau modifié avec succès !');
        } else {
          const newPlateau = await addPlateau(values);
          resetForm();
          setPlateaux([...plateaux, newPlateau]);
          handleCloseDialog();
          listPlateaux();
          toast.success('Plateau ajouté avec succès !');
        }
      } catch (error) {
        if (plateauToUpdate) {
          toast.error(` ${error.message}`);
        } else {
          toast.error(` ${error.message}`);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });
  



 
  const handleDeleteClick = (plateau) => {
    setPlateauToDelete(plateau);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePlateau(plateauToDelete._id);
      setPlateaux(plateaux.filter(p => p._id !== plateauToDelete._id));
      setOpenDeleteDialog(false);
      setPlateauToDelete(null);
      listPlateaux();
      toast.success('Plateau supprimé avec succès !');

    } catch (error) {
      console.error('Erreur lors de la suppression du plateau:', error);
    }
  };

  return (
    <>



      <Header />
      <Container className="mt--5" fluid>
      <Row>
      <div className="col-8 mx-auto">
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col >
                <h3 className="mb-0">PLATEAUX</h3>
                
              </Col>
              <Col className="text-center" xs="4">
                <Button
                  color="info"
                  onClick={handleOpenDialog}
                  size="sm"
                >
                  Ajouter un plateau
                </Button>
              </Col>
            </Row>
          </CardHeader>

          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">CODE</th>

                <th scope="col">ACTION</th>
                
              </tr>
            </thead>
            <tbody>
              {currentPlateaux.map((plateau) => (
                <tr key={plateau._id}>
                  <th scope="row">
                    <Media className="align-items-center">
                      <Media>
                        <span className="mb-0 text-sm">
                          {plateau.name}
                        </span>
                      </Media>
                    </Media>
                  </th>
                  <td>
                    <Button onClick={() => handleViewPostsClick(plateau)} color="info" size="sm">
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </Button>
                    <Button onClick={() => handleDeleteClick(plateau)} color="info" size="sm">
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                    <Button onClick={() => handleOpenUpdateDialog(plateau)} color="info" size="sm">
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

         
        </Card>
        <nav style={{ paddingTop: '10px' }}>
  <ul className="pagination justify-content-end">
    {[...Array(totalPages).keys()].map(number => (
      <li 
        key={number + 1} 
        className={`page-item ${number + 1 === currentPage ? 'active' : ''}`}
      >
        <Button
          style={{
            margin: '0 5px',
            backgroundColor: number + 1 === currentPage ? '#11cdef' : '', 
            color: number + 1 === currentPage ? 'white' : '', 
          }}
          size="sm" 
          onClick={() => paginate(number + 1)}
        >
          {number + 1}
        </Button>
      </li>
    ))}
  </ul>
</nav>
      </div>
      
    </Row>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer le plateau {plateauToDelete?.name} ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
              Annuler
            </Button>
            <Button onClick={handleDeleteConfirm} color="danger">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Ajouter un Plateau</DialogTitle>
          <DialogContent>
            <form onSubmit={formik.handleSubmit} style={{ width: '500px', maxWidth: '100%' , padding:'10px' }}>
              <Box mb={3} width="100%">
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Nom du Plateau"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Box>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="secondary">
                  Annuler
                </Button>
                <Button
                  color="info"
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Ajouter
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
          <DialogTitle>Modifier le Plateau</DialogTitle>
          <DialogContent>
            <form onSubmit={formik.handleSubmit} style={{ width: '500px', maxWidth: '100%', padding:'10px'  }}>
              <Box mb={3} width="100%">
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Nom du Plateau"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Box>
              <DialogActions>
                <Button onClick={handleCloseUpdateDialog} color="secondary">
                  Annuler
                </Button>
                <Button
                  color="info"
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Enregistrer
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={openDialogTable} onClose={handleCloseDialogTable}   sx={{ 
          '& .MuiDialog-paper': {
            padding: '20px', 
          }
        }}
  fullWidth >
        <DialogTitle>Information</DialogTitle>
        <DialogContent>
          <p>Veuillez ajouter des postes/segments.</p>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleCloseDialogTable} color="secondary">
            OK
          </Button>
          <Button onClick={handleNavigate} color="info">
          Gérer les segments          </Button>
        </DialogActions>
      </Dialog>
      </Container><ToastContainer/>
    </>
  );
};

export default Tables;
