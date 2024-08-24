import React, { useState, useEffect,useCallback } from 'react';
import { useParams, useLocation,useNavigate  } from 'react-router-dom';
import { getSegmentsByPlateauId, getReservationsForPlateau } from '../api/plateauApi';
import { reservePoste,cancelReservation, reserveSalle, getReservationsForPost
  ,getReservedSalle,getReservedPosts,cancelReservationSalle } from '../api/posteApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faSquare} from '@fortawesome/free-solid-svg-icons';
import { Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, } from "@mui/material";
import { Button, Card, CardHeader, Container, Row, Col, Table,  } from "reactstrap";
import Header from "components/Headers/Header.js";
import io from 'socket.io-client';
import moment from 'moment-timezone';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link } from "react-router-dom";
import CancelIcon from '@mui/icons-material/Cancel';

const Index = () => {
  const { plateauId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const encryptedEmail = queryParams.get('email');

  const [segments, setSegments] = useState([]);
 
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [userReservedSalle, setUserReservedSalle] = useState([]);
  const [openDialogSalle, setOpenDialogSalle] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPoste, setSelectedPoste] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
 
  const [reservations, setReservations] = useState([]);
  const [plateauReservations, setPlateauReservations] = useState([]);
  const [userReservedPosts, setUserReservedPosts] = useState([]);
  const navigate = useNavigate(); 
 
  const [iconsData] = useState([

    { icon:  faSquare, title: 'Mon Poste Réservé', color: '#02a406' },

    { icon:  faSquare, title: 'Poste Manager', color: '#054996' },
    { icon:  faSquare, title: 'Poste DEV', color: '#FF8C00' },
    { icon:  faSquare, title: 'Salle de réunion', color: '#ffd600' },
    { icon:  faSquare, title: 'Non disponible', color: '#C8C8C8' },
  ]);



  const getUserReservedPosts = useCallback(async () => {
    try {
      const data = await getReservedPosts(encryptedEmail);
      setUserReservedPosts(data.map(post => post._id));
    } catch (error) {
      console.error('Erreur lors de la récupération des postes réservés:', error);
    }
  }, [encryptedEmail]);

  const getSegmentsAndPostes = useCallback(async () => {
    try {
      const data = await getSegmentsByPlateauId(plateauId);
      setSegments(data.segments);

     

    } catch (error) {
      console.error('Erreur lors de la récupération des segments et des postes:', error);
    }
  }, [plateauId]);

  const getPlateauReservations = useCallback(async () => {
    try {
      const data = await getReservationsForPlateau(plateauId);
      setPlateauReservations(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations de plateau:', error);
    }
  }, [plateauId]);

  const getUserReservedSalle = useCallback(async () => {
    try {
      const data = await getReservedSalle(encryptedEmail);
      setUserReservedSalle(data.map(reservation => reservation._id));
    } catch (error) {
      console.error('Erreur lors de la récupération des salles réservées:', error);
    }
  }, [encryptedEmail]);

  const checkExpiration = useCallback(() => {
    if (encryptedEmail) {
      const [encryptedEmailPart, dateStr] = encryptedEmail.split('/');    
        const expirationTimestamp = Number(dateStr);

      const expirationDate = new Date(expirationTimestamp);
      const currentDate = moment.tz('Africa/Tunis').toDate();

      expirationDate.setHours(expirationDate.getHours() + 24);

      if (expirationDate < currentDate) {
        navigate('/expired');
      } 
    } else {
      navigate('/404');
    }
  }, [encryptedEmail, navigate]);

 
  const openDialogForReservation = (reservation) => {
    setSelectedReservation(reservation);
    setOpenDialogSalle(true);
  };
 
  const getReservations = async (posteId) => {
    try {
      const data = await getReservationsForPost(posteId);
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
    }
  };


  useEffect(() => {
    checkExpiration();
    getPlateauReservations();
    getSegmentsAndPostes();
    getUserReservedPosts();
    getUserReservedSalle();

    const socket = io('http://localhost:8081', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected ');
    });

    const updateData = () => {
      getPlateauReservations();
      getSegmentsAndPostes();
      getUserReservedPosts();
      getUserReservedSalle();
    };

    socket.on('update', updateData);

    return () => {
      socket.off('update', updateData);
      socket.disconnect();
    };
  }, [checkExpiration, getPlateauReservations, getSegmentsAndPostes, getUserReservedPosts, getUserReservedSalle]);
  

  const handleCancelReservation = async () => {
    if (selectedReservation) {
      try {
        await cancelReservationSalle(selectedReservation._id, encryptedEmail);
        getSegmentsAndPostes();
        getPlateauReservations();
        getUserReservedPosts();
        setOpenDialog(false);
   
          toast.success('Réservation annulée avec succès!');
      } catch (error) {
        toast.error('Une erreur est survenue lors de l\'annulation.');
      }
      setOpenDialogSalle(false);
      setSelectedReservation(null);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialogSalle(false);
    setOpenDialog(false);

    setSelectedReservation(null);
  };

  
  

  const getPostColor = (poste) => {
    if (userReservedPosts.includes(poste.id)) {
      return '#02a406'; 
    }
    if (poste.availability === false) {
      return '#C8C8C8';
    }
    const iconData = iconsData.find((data) => data.title === poste.type);
    return iconData ? iconData.color : '';
  };


  
  

  
  

  const OpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };

  const CancelReservation = async () => {
    if (selectedPoste) {
      try {
        await cancelReservation(selectedPoste.id, encryptedEmail);
        getSegmentsAndPostes();
        getPlateauReservations();
        toast.success('Réservation annulée avec succès!');
      } catch (error) {
        toast.error('Une erreur est survenue lors de l\'annulation.');
      }
    }
    setOpenCancelDialog(false);
    setSelectedPoste(null);

  };

  const CloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

 

 

  const ConfirmReserve = async () => {
    if (selectedPoste) {
      try {
        if (selectedPoste.type !== 'Salle de réunion') {
          const now = new Date();
        
          const startTime = new Date();
          startTime.setHours(18, 0, 0, 0); 
        
          const endTime = new Date(startTime);
          endTime.setDate(startTime.getDate() + 1);
          endTime.setHours(10, 0, 0, 0); 
        
          if ((now >= startTime && now <= endTime) || (now < startTime && now.getHours() < 10)) {
            await ReservePost(selectedPoste.id);
            toast.success('Réservation effectuée avec succès!');
          Cancel();
          } else {
            const startTimeString = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTimeString = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
            toast.error(`Les réservations ne sont autorisées que de ${startTimeString} jusqu'à ${endTimeString} .`);
            return;
          }
        }
         else {
          const now = new Date();
          const reservationStart = new Date();
          const [startHours, startMinutes] = startTime.split(':').map(Number);
          reservationStart.setHours(startHours, startMinutes, 0, 0);
    
          const reservationEnd = new Date();
          const [endHours, endMinutes] = endTime.split(':').map(Number);
          reservationEnd.setHours(endHours, endMinutes, 0, 0);
    
          if (reservationStart <= now) {
            toast.error('La date est antérieure. Veuillez choisir une date future.');
            return;
          }
          

          try {
                await ReserveSalle(selectedPoste.id);
                Cancel()
                toast.success('Réservation effectuée avec succès!'); 
        } catch (error) {
            toast.error(`${error.message}`); 
        }
        }
  
        getSegmentsAndPostes();
        getPlateauReservations();
      } catch (error) {
        toast.error('Une erreur est survenue.');
      }
    }
    
  };
  
  

  const  Cancel = () => {
    setOpenDialog(false);
    setSelectedPoste(null);
    setStartTime('');
    setEndTime('');
  };

  const  ReservePost = async (posteId) => {
    await reservePoste(posteId, encryptedEmail);
  };

  const  ReserveSalle = async (posteId) => {
    await reserveSalle(posteId, encryptedEmail, startTime, endTime);
  };



  const getCursorStyle = (poste) => {
    const currentTime = new Date();
  const currentHour = currentTime.getHours();
 
    if (userReservedPosts.includes(poste.id)) {
      return 'pointer';
    }
    if (userReservedPosts.length > 0 && poste.type !== 'Salle de réunion') {
      return 'not-allowed'; 
    }
    
    if (poste.availability !== false) {
      return 'pointer'; 
    }
    return 'default'; 
  };
  

  const IconClick = (poste) => {
    const currentTime = new Date();
  const currentHour = currentTime.getHours();
  
  if (poste.type === 'Salle de réunion') {
    if (currentHour < 6 || currentHour >= 18) {
      toast.error("Les réservations ne sont autorisées que de 06:00 jusqu'à 18:00 "); 
      return;
    }
  }
    if (userReservedPosts.length > 0 && !userReservedPosts.includes(poste.id) && poste.type !== 'Salle de réunion') {
      return;
    }
  
    if (userReservedPosts.includes(poste.id)) {
      setSelectedPoste(poste);
      OpenCancelDialog();
    } else if (poste.availability !== false) {
      setSelectedPoste(poste);
      setReservations([]);
      if (poste.type === 'Salle de réunion') {
        getReservations(poste.id);
      }
      setOpenDialog(true);
    }
  };
  
  

  const Ongoing = (startTime, endTime) => {
    const now = moment().tz('Africa/Tunis');
    const start = moment(startTime, 'HH:mm').tz('Africa/Tunis');
    const end = moment(endTime, 'HH:mm').tz('Africa/Tunis');
    return now.isBetween(start, end);
  };
  const currentTime = moment().tz('Africa/Tunis');

  return (
    <>
   
      
      
      <Header />
    
      <Container className="mt--7" fluid >
 

      <Row >
                <Col className="collapse-brand" xs="9" >
                    <img style={{marginTop:'-100px'}}
                      alt="..."
                      src={require("../assets/img/brand/logo_0.png")}
                    />
                </Col></Row>
      


        <Row className="mt-4"  >
        <Col xl="3"  className="mb-4 mb-xl-0 pr-0 "  >
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Réservations du Plateau</h3>
              </CardHeader>
              <div style={{ maxHeight: '420px', overflowY: 'auto' }}>

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Salle</th>
                    <th scope="col">Heure Début</th>
                    <th scope="col">Heure Fin</th>
                    <th scope="col"></th>

                  </tr>
                </thead>
                <tbody>
  {plateauReservations
    .filter((reservation) => moment(reservation.endTime, 'HH:mm').isAfter(currentTime))
    .sort((a, b) => moment(a.startTime, 'HH:mm').diff(moment(b.startTime, 'HH:mm')))
    .map((reservation) => (
      <tr
        key={reservation.id}
        style={{
          backgroundColor: Ongoing(reservation.startTime, reservation.endTime) ? 'red' : '',
          color: Ongoing(reservation.startTime, reservation.endTime) ? 'white' : 'inherit'
        }} 
      >
        <td >{reservation.poste.code}</td>
        <td>{reservation.startTime}</td>
        <td>{reservation.endTime}</td>
        {userReservedSalle.includes(reservation._id) && (
          <td>
            <Tooltip title="Annuler la réservation" arrow>
              <span>
                <Button onClick={() => openDialogForReservation(reservation)} style={{ padding: 0, minWidth: 'auto' }}>
                  <CancelIcon style={{ fontSize: 20, cursor: 'pointer' }} />
                </Button>
              </span>
            </Tooltip>
          </td>
        )}
      </tr>
    ))}
</tbody>


              </Table>
              </div>
            </Card>
          </Col>
          <Col xl="6" className="mb-4 mb-xl-0 pr-0 ">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">LISTE DES POSTES</h3>
              </CardHeader>
              <CardHeader>
                <Row className="justify-content-center">
                  {segments.sort((a, b) => a.code.localeCompare(b.code)).map((segment) => (
                    <div key={segment.id} style={{ marginRight: '15px' }}>
                      <div className="segment text-center">
                        <h5>{segment.code}</h5>
                        {segment.postes && segment.postes.map((poste) => (
                          <div
                            key={poste.id}
                            className={`poste-item ${getPostColor(poste)}`}
                            style={{ marginTop: '10px' }}
                          > 
                              
                              <FontAwesomeIcon
                                icon={poste.type === 'Salle de réunion' ?  faSquare : faSquare}
                                style={{
                                  color: getPostColor(poste),
                                  fontSize: '1.5em',
                                  cursor: getCursorStyle(poste),
                                }}
                                onClick={() =>  IconClick(poste)}
                              /> 

                            <h6>{poste.code}</h6>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </Row>
              </CardHeader>
            </Card>
          </Col>
          <Col xl="3">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">DETAILS</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col"> Informations liées aux postes</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {iconsData.map((iconData, index) => (
                    <tr key={index}>
                      <td>
                        <div className="icon-container">
                          <FontAwesomeIcon
                            icon={iconData.icon}
                            style={{
                              marginTop: '15px',
                              marginRight: '15px',
                              fontSize: '1.7em',
                              color: iconData.color,
                            }}
                          />
                          <span className="icon-title">{iconData.title}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>

        

        <Dialog open={openDialog} onClose={ Cancel}
        sx={{
          '& .MuiDialog-paper': {
            width: '70%',  
            padding: '20px',
          }
        }}>
        <DialogTitle>Confirmation de réservation</DialogTitle>
        <DialogContent>
          {selectedPoste?.type === 'Salle de réunion' ? (
            <>
              <p>
                Vous voulez réserver la salle de réunion <strong>{selectedPoste?.code}</strong> ?
              </p>
              <Box display="flex" justifyContent="space-between" margin="normal">
                <TextField
                  sx={{
                    width: '45%',
                    '& input': {
                      fontSize: '1.5rem',
                    },
                  }}
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Heure  début"

                 
                />
                <TextField
                  sx={{
                    width: '45%',
                    '& input': {
                      fontSize: '1.5rem',
                    },
                  }}
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Heure fin"
                />




              </Box>
              <div style={{marginTop:'20px'}}>
                <br></br>
                <h4>Réservations existantes:</h4>
               
                <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Salle</th>
                    <th scope="col">Heure Début</th>
                    <th scope="col">Heure Fin</th>
                    <th scope="col"></th>

                  </tr>
                </thead>
                <tbody>
                {reservations.filter((reservation) => moment(reservation.endTime, 'HH:mm').isAfter(currentTime)).sort((a, b) => moment(a.startTime, 'HH:mm').diff(moment(b.startTime, 'HH:mm'))).map((reservation) => (

                           <tr
                        key={reservation.id}
                        style={{
                          backgroundColor: Ongoing(reservation.startTime, reservation.endTime) ? 'red' : '',
                          color: Ongoing(reservation.startTime, reservation.endTime) ? 'white' : 'inherit'
                        }}
                      >
                               <td>{reservation.poste.code}</td>
                        <td>{reservation.startTime}</td>
                        <td>{reservation.endTime}</td>
                        {userReservedSalle.includes(reservation._id) && (
          <td>
            <Tooltip title="Annuler la réservation" arrow>
              <span>
                <Button onClick={() => openDialogForReservation(reservation)} style={{ padding: 0, minWidth: 'auto' }}>
                  <CancelIcon style={{ fontSize: 20, cursor: 'pointer' }} />
                </Button>
              </span>
            </Tooltip>
          </td>
        )}
                      </tr>
                    ))}
                </tbody>
              </Table>
               
               </div>
            </>
          ) : (
            <p>
              Vous voulez réserver le poste <strong>{selectedPoste?.code}</strong> ?
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={ Cancel} color="secondary">Annuler</Button>
          <Button onClick={ ConfirmReserve} color="info">Confirmer</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCancelDialog} onClose={CloseCancelDialog}>
        <DialogTitle>Annuler la réservation</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir annuler la réservation pour ce poste ?
        </DialogContent>
        <DialogActions>
          <Button onClick={CloseCancelDialog}>Annuler</Button>
          <Button onClick={CancelReservation} color="danger">Confirmer</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialogSalle} onClose={handleCloseDialog}>
        <DialogTitle>Annulation de Réservation</DialogTitle>
        <DialogContent>
          <p>Êtes-vous sûr de vouloir annuler cette réservation ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Annuler</Button>
          <Button onClick={handleCancelReservation} color="danger">Confirmer</Button>
        </DialogActions>
      </Dialog>
     <ToastContainer/>

      </Container><div style={{padding:'30px'}}>      
      </div> 
    </>
  );
};

export default Index;
