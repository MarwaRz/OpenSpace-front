import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import Header from "components/Headers/Header.js";
import { getPlateaux, deletePlateau } from "api/plateauApi";

const Icons = () => {
  const [plateaux, setPlateaux] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [plateauToDelete, setPlateauToDelete] = useState(null);

  useEffect(() => {
    const fetchPlateaux = async () => {
      try {
        const data = await getPlateaux();
        setPlateaux(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des plateaux:', error);
      }
    };
    fetchPlateaux();
  }, []);

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
    } catch (error) {
      console.error('Erreur lors de la suppression du plateau:', error);
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">PLATEAUX</h3>
              </CardHeader>
              <CardBody>
                <Row className="icon-examples">
                  {plateaux.map((plateau) => (
                    <Col key={plateau._id} lg="3" md="6">
                      <Link to={`/admin/p/plateaux/${plateau._id}`} style={{ textDecoration: 'none', marginTop: 'auto' }}>
                
                      <button
                        className="btn-icon-clipboard"
                        type="button"
                       >

                        <div>
                          <i className="icon-class-name" />
                          <span>{plateau.name}</span>
                        </div>
                      </button>                               </Link>

                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
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
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
              Annuler
            </Button>
            <Button onClick={handleDeleteConfirm} color="secondary">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Icons;
