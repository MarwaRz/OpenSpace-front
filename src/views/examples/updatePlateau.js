import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSegmentsByPlateauId,delete_email_plateau } from '../../api/plateauApi';
import { addPoste, updateSegment, deleteSegment } from '../../api/segmentApi';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';
import { addEmailsToPlateau } from '../../api/plateauApi';
import { updatePoste, deletePoste,} from '../../api/posteApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare,} from '@fortawesome/free-solid-svg-icons';
import {  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField,Select, MenuItem,  FormControl, InputLabel  } from '@mui/material';
import { Button, Col,Table,Container, Card, CardHeader, Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "components/Headers/Header.js";
import  {faTrashAlt, faEdit,faPlus } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UpdatePlateau = () => {
  const { plateauId } = useParams();
  const [plateau, setPlateau] = useState(null); 
  const [postCounts, setPostCounts] = useState({
    'Poste Manager': 0,
    'Poste DEV': 0,
    'Salle de réunion': 0,
  
  });
  const [segments , setSegments] = useState([]);
  const [postes, setPostes] = useState([]);
  const [dialog, setDialog] = useState({ type: '', open: false });
  const [selectedPoste, setSelectedPoste] = useState(null);
  const [newPosteData, setNewPosteData] = useState({ code: '', type: '' });
  const [segmentIdForNewPoste, setSegmentIdForNewPoste] = useState(null);
  const [emails, setEmails] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [emailToDelete, setEmailToDelete] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenPost, setDropdownOpenPost] = useState(false);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 6; 
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const totalPages = Math.ceil(plateau?.emails?.length / emailsPerPage) || 1;

  const currentEmails = plateau?.emails?.sort((a, b) => a.localeCompare(b)).slice(indexOfFirstEmail, indexOfLastEmail);

  const handlePostClick = (postId) => {
    if (selectedPostId === postId) {
      setDropdownOpenPost(!dropdownOpenPost); 
    } else {
      setSelectedPostId(postId); 
      setDropdownOpenPost(true); 
    }
  };
  
  const togglePostDropdown = () => {
    setDropdownOpenPost(!dropdownOpenPost); 
  };







  

  const validationSchema = Yup.object({
    code: Yup.string()
      .required('Le code est requis')
  });
      const formik = useFormik({
      initialValues: {
        code: selectedSegment?.code || ''
      },
      enableReinitialize: true,

      validationSchema,
      onSubmit: async (values) => {
        try {
          if (!selectedSegment || !selectedSegment.id) return;
  
          await updateSegment(selectedSegment.id, values);
  
          setSegments(segments.map(segment => 
            segment.id === selectedSegment.id ? { ...segment, ...values } : segment
          ));
  
          setDialog({ type: '', open: false });
          setSelectedSegment(null);
          formik.resetForm();
  
          getSegmentsAndPostes();
          toast.success('Segment modifié avec succès !');
        } catch (error) {
          toast.error(` ${error.message}`);
        }
      }
    });
  





  const handleSegmentClick = (segmentId) => {
    if (selectedSegment === segmentId) {
      setDropdownOpen(!dropdownOpen); 
    } else {
      setSelectedSegment(segmentId); 
      setDropdownOpen(true);
    }
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    
  };
  
  const [iconsData] = useState([
    { icon:  faSquare, title: 'Poste Manager', color: '#054996' },
    { icon:  faSquare, title: 'Poste DEV', color: '#FF8C00' },
    { icon:  faSquare, title: 'Salle de réunion', color: '#ffd600' },
  ]);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const  OpenAddEmailsDialog = () => {
    setDialog({ type: 'addEmails', open: true });
  };


 

  const AddEmails = async () => {
    try {
      await addEmailsToPlateau(plateauId, emails);
      setDialog({ type: '', open: false });
      setEmails([]);
      getSegmentsAndPostes();
      toast.success('E-mails ajoutés avec succès !');
    } catch (error) {
      console.error( error.message);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`${error.response.data.error}`);
      } else {
        toast.error('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };
  const  OpenDeleteDialoge = (email) => {
    setEmailToDelete(email);
    setDialogOpen(true);
  };

  const  CloseDialog = () => {
    setEmailToDelete('');
    setDialogOpen(false);
  };


  
  const OpenDeleteSegmentDialog = (segment) => {
    if (!segment) return;
    setSelectedSegment(segment);
    setDialog({ type: 'deleteSegment', open: true });
  };
  
  
 
  
  
  
  const DeleteSegment = async () => {
    try {
      if (!selectedSegment || !selectedSegment.id) return;
      await deleteSegment(selectedSegment.id);
      setSegments(segments.filter(segment => segment.id !== selectedSegment.id));
      setDialog({ type: '', open: false });
      setSelectedSegment(null);
      setDialog({ type: '', open: false });
  
      getSegmentsAndPostes();
      toast.success('Segment supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression du segment:', error);
  
      const errorMessage = error.response?.data?.message ;
      toast.error(errorMessage);
    }
  };
  
  useEffect(() => {
 
    getSegmentsAndPostes();
  }, [plateauId]);
  
  const getSegmentsAndPostes = async () => {
    try {
      const data = await getSegmentsByPlateauId(plateauId);
      setPlateau(data);
  
      const postesList = data.segments.reduce((acc, segment) => acc.concat(segment.postes), []);
      setSegments(data.segments);
      setPostes(postesList);
  
      const counts = data.segments.reduce((acc, segment) => {
        segment.postes.forEach((poste) => {
          if (acc[poste.type]) {
            acc[poste.type]++;
          } else {
            acc[poste.type] = 1;
          }
        });
        return acc;
      }, {});
  
      setPostCounts(counts);
    } catch (error) {
      console.error('Erreur lors de la récupération des donnée:', error);
    }
  };
  
  const  DeleteEmail = async () => {
    try {
      await delete_email_plateau(plateauId, emailToDelete);
      setEmails(emails.filter(email => email !== emailToDelete));
       CloseDialog();
      getSegmentsAndPostes();
      toast.success('E-mail supprimé avec succès !');

    } catch (error) {
      console.error('Erreur lors de la suppression:', error.message);
    }
  };
  const getPostcolor = (postTitle) => {
    const iconData = iconsData.find((data) => data.title === postTitle);
    return iconData ? iconData.color : '';
  };


 
  
  const  DeletePoste = async () => {
    try {
      if (!selectedPoste || !selectedPoste.id) {
        return;
      }
      await deletePoste(selectedPoste.id);
      setPostes(postes.filter(poste => poste.id !== selectedPoste.id));
      setDialog({ type: '', open: false });
      setSelectedPoste(null);
      setSelectedPostId(null); 
      getSegmentsAndPostes();
      toast.success('Poste supprimé avec succès !');


    } catch (error) {
      console.error( error.message);
    }
  };
  
  const  EditPoste = async () => {
    try {
      if (!selectedPoste || !selectedPoste.id) {
        return;
      }
      await updatePoste(selectedPoste.id, newPosteData);
      setPostes(postes.map(poste => poste.id === selectedPoste.id ? { ...poste, ...newPosteData } : poste));
      setDialog({ type: '', open: false });
      setSelectedPoste(null);
      setNewPosteData({ code: '', type: '' });
      setSelectedPostId(null);
      getSegmentsAndPostes();
 
      toast.success('Poste modifié avec succès !');

    } catch (error) {
      console.error('Erreur :', error);
      if (error.message) {
          toast.error(` ${error.message}`);
      } else {
          toast.error('Erreur');
      }}
  };
  
  const  OpenEditDialog = (poste) => {
    if (!poste) {
      return;
    }
    setSelectedPoste(poste);
    setNewPosteData({ code: poste.code, type: poste.type });
    setDialog({ type: 'edit', open: true });
  };
  
  const  OpenDeleteDialog = (poste) => {
    if (!poste) {
      return;
    }
    setSelectedPoste(poste);
    setDialog({ type: 'delete', open: true });
  };
  
 
  
  const  OpenAddPosteDialog = (segmentId) => {

    setSegmentIdForNewPoste(segmentId);
    setDialog({ type: 'addPoste', open: true });
  };

  const  ChangePoste = (e) => {
    const { name, value } = e.target;
    setNewPosteData({ ...newPosteData, [name]: value });
  };

 
  const AddPoste = async () => {
    try {
        const addedPoste = await addPoste(segmentIdForNewPoste, newPosteData); 
        setPostes([...postes, addedPoste]);

        setDialog({ type: '', open: false });
        setSegmentIdForNewPoste(null);
        setNewPosteData({ code: '', type: '' });
        getSegmentsAndPostes();
      
  

        toast.success('Poste ajouté avec succès !');

    } catch (error) {
      console.error('Erreur lors de l\'ajout du poste:', error);
      if (error.message) {
          toast.error(` ${error.message}`);
      } else {
          toast.error('Erreur lors de l\'ajout du poste.');
      }}
};
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          
        <Col xl="8">

  <Card className="shadow">
    <CardHeader className="border-0">
      <h3 className="mb-0">LISTE DES POSTES DU PLATEAU ' {plateau?.name} '</h3>
    </CardHeader>
    <CardHeader>
    <Row className="justify-content-center">
      {plateau && plateau.segments && plateau.segments.sort((a, b) => a.code.localeCompare(b.code)) .map((segment) => (
        <div key={segment.id} style={{ marginRight: '17px' ,  marginTop: '10px', position: 'relative'}}>
          <div className="segment text-center" >

          <div style={{position: 'relative', cursor: 'pointer'}} onClick={() => handleSegmentClick(segment.id)}
            >
  {selectedSegment === segment.id ? (
    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} >
     <DropdownToggle tag="div" style={{ cursor: 'pointer' }}>
  <h5 >{segment.code}</h5>
</DropdownToggle>
      <DropdownMenu> 
       
        <DropdownItem onClick={() => OpenDeleteSegmentDialog(segment)}>
         <FontAwesomeIcon icon={faTrashAlt} /> Supprimer
        </DropdownItem>
        <DropdownItem onClick={() => OpenAddPosteDialog(segment.id)} >
       <FontAwesomeIcon icon={faPlus} /> Ajouter poste
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>  
  ) : (
    <h5  >{segment.code}</h5>
  )} 
 
</div>  
            <div>
            <div className="post-list">
  {segment.postes && segment.postes.map((poste) => (
    <div
      key={poste.id}
      className={`poste-item ${getPostcolor(poste.type)}`}
      style={{ marginTop: '10px', position: 'relative' }}
    >
        <div onClick={() => handlePostClick(poste.id)}>
         
      {selectedPostId === poste.id ? (
        <div className="d-flex justify-content-center" style={{ marginTop: '10px' }}>
          <Dropdown isOpen={dropdownOpenPost} toggle={togglePostDropdown}>
            <DropdownToggle tag="div" style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon
            icon={poste.type === 'Salle de réunion' ? faSquare : faSquare}
            style={{ color: getPostcolor(poste.type), fontSize: '1.5em', cursor: 'pointer' }}
          />    <h6>{poste.code}</h6>   </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => OpenEditDialog(poste)}>
                <FontAwesomeIcon icon={faEdit}/> Modifier
              </DropdownItem>
              <DropdownItem onClick={() => OpenDeleteDialog(poste)}>
                <FontAwesomeIcon icon={faTrashAlt} /> Supprimer
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>  ) : ( <div><FontAwesomeIcon
            icon={poste.type === 'Salle de réunion' ? faSquare : faSquare}
            style={{ color: getPostcolor(poste.type), fontSize: '1.5em', cursor: 'pointer' }}
          /><h6>{poste.code}</h6></div>                      

 
      )}        </div>

    </div>
  ))}
</div>

            </div>
          </div>
        </div>
      ))}
    </Row>       </CardHeader>

  </Card>
</Col>

          <Col xl="4">
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
                    <th scope="col">Informations liées aux postes</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {iconsData.map((iconData, index) => (
                    <tr key={index}>
                      <td>
                        <div className="icon-container">
                          <FontAwesomeIcon icon={iconData.icon} style={{ marginTop: '15px', marginRight: '15px', fontSize: '1.7em', color: iconData.color }} />
                          <span className="icon-title">{iconData.title}</span>
                        </div>
                      </td>
                      <td>{postCounts[iconData.title] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Row >

        <Col xl="8"  style={{ marginTop: '20px' }}>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                 <Col>
                    <h3 className="mb-0">Affectation des collaborateurs</h3>
                 </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="info"
                      href="#pablo"
                     onClick={ OpenAddEmailsDialog}
                      size="sm"
                    >
                      Ajouter des Emails
                    </Button>
                  </Col>
                </Row>
           
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Email du collaborateur</th>
                    <th scope="col"> Actions</th>
                  </tr>
                </thead>
                <tbody>
                {currentEmails?.sort((a, b) => a.localeCompare(b)).map((email, index) => (
          <tr key={index}>
            <td>
              <div className="icon-container">
                {email}
              </div>
            </td>
            <td> <Button color="info" size="sm"  onClick={() =>  OpenDeleteDialoge(email)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                        
                      </Button></td>
          </tr>
        ))}
          
        </tbody>
              </Table>
            </Card>

            {totalPages > 0 && (
  <nav style={{ paddingTop: '10px' }}>
    <ul className="pagination justify-content-end">
      {[...Array(totalPages).keys()].map(number => (
        <li key={number + 1} className={`page-item ${number + 1 === currentPage ? 'active' : ''}`}>
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
)}



          </Col>
        </Row>
        <Dialog open={dialog.open && dialog.type === 'details'} onClose={() => setDialog({ type: '', open: false })}>
          <DialogTitle>Détails du poste</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedPoste && (
                <>
                  <strong>Code:</strong> {selectedPoste.code} <br />
                  <strong>Type:</strong> {selectedPoste.type}
                </>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog({ type: '', open: false })} color="primary">Fermer</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={dialog.open && dialog.type === 'delete'} onClose={() => setDialog({ type: '', open: false })}>
          <DialogTitle>Supprimer le poste</DialogTitle>
          <DialogContent>
            <DialogContentText>Voulez-vous vraiment supprimer ce poste?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog({ type: '', open: false })} color="secondary">Annuler</Button>
            <Button onClick={ DeletePoste} color="danger">Supprimer</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={dialog.open && dialog.type === 'edit'} onClose={() => setDialog({ type: '', open: false })}  sx={{
          '& .MuiDialog-paper': {
            width: '70%',
            padding: '10px', }
        }}>
          <DialogTitle>Modifier le poste</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="code"
              label="Code"
              type="text"
              fullWidth
              value={newPosteData.code}
              onChange={ ChangePoste}
            />
            <Select
              label="Type"
              name="type"
              value={newPosteData.type}
              onChange={ ChangePoste}
              fullWidth
            >
              {iconsData.map((icon) => (
                <MenuItem key={icon.title} value={icon.title}>{icon.title}</MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog({ type: '', open: false })} color="secondary">Annuler</Button>
            <Button onClick={ EditPoste} color="info">Sauvegarder</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={dialog.open && dialog.type === 'addPoste'} onClose={() => setDialog({ type: '', open: false })}    sx={{
          '& .MuiDialog-paper': {
            width: '70%',
            padding: '10px', }
        }}>
          <DialogTitle>Ajouter un poste</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="code"
              label="Code"
              type="text"
              fullWidth
              value={newPosteData.code}
              onChange={ ChangePoste}
            />
          <FormControl fullWidth sx={{ paddingTop: '10px' }} >
  <InputLabel id="type-select-label" sx={{ paddingTop: '10px' }} >Type</InputLabel>
  <Select
    labelId="type-select-label"
    id="type-select"
    label="Type"
    name="type"
    value={newPosteData.type}
    onChange={ChangePoste}
    fullWidth
  >
    <MenuItem value="" disabled>Sélectionner un Type</MenuItem>
    {iconsData.map((icon) => (
      <MenuItem key={icon.title} value={icon.title}>
        {icon.title}
      </MenuItem>
    ))}
  </Select>
</FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog({ type: '', open: false })} color="secondary">Annuler</Button>
            <Button onClick={ AddPoste} color="info">Ajouter</Button>
          </DialogActions>
        </Dialog>







        <Dialog open={dialogOpen} onClose={ CloseDialog}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet email ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ CloseDialog} color="secondary">
            Annuler
          </Button>
          <Button onClick={ DeleteEmail} color="danger">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>




        <Dialog
  open={dialog.open && dialog.type === 'addEmails'}
  onClose={() => setDialog({ type: '', open: false })}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Ajouter des Emails</DialogTitle>
  <DialogContent>
   
    <br/>
    <ReactMultiEmail fullWidth  style={{height:'155px'}}
      placeholder="Entrez les emails des collaborateurs."
      emails={emails}
      onChange={setEmails}
      validateEmail={(email) => isEmail(email)}
      getLabel={(email, index, removeEmail) => (
        <div data-tag key={index}>
          {email}
          <span    data-tag-handle onClick={() => removeEmail(index)} >X</span>
        </div>
      )}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDialog({ type: '', open: false })} color="secondary">
      Annuler
    </Button>
    <Button onClick={ AddEmails} color="info">
      Ajouter
    </Button>
  </DialogActions>
</Dialog>
<Dialog  open={dialog.open && dialog.type === 'editSegment'} onClose={() => setDialog({ type: '', open: false })}  maxWidth="sm"
  fullWidth>
      <DialogTitle>Modifier le segment</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            margin="dense"
            name="code"
            label="Code"
            type="text"
            fullWidth
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
          />
          <DialogActions>
            <Button onClick={() => setDialog({ type: '', open: false })} color="secondary">Annuler</Button>
            <Button type="submit" color="info">Sauvegarder</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>

<Dialog open={dialog.open && dialog.type === 'deleteSegment'} onClose={() => setDialog({ type: '', open: false })}>
  <DialogTitle>Supprimer le segment</DialogTitle>
  <DialogContent>
    <DialogContentText>Voulez-vous vraiment supprimer ce segment?</DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDialog({ type: '', open: false })} color="secondary">Annuler</Button>
    <Button onClick={DeleteSegment} color="danger">Supprimer</Button>
  </DialogActions>
</Dialog><ToastContainer/>
      </Container>
    </>
  );
};

export default UpdatePlateau;
