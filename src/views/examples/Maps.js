import { useState, useEffect } from "react";
import { DialogContent, DialogActions,DialogContentText,DialogTitle ,Dialog ,Box,TextField} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { getSegmentsByPlateauId } from '../../api/plateauApi';
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import DetailsIcon from '@mui/icons-material/Details';
import Header from "components/Headers/Header.js";
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import * as Yup from 'yup';
import {  Grid, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem,  } from '@mui/material';

import { useFormik } from 'formik';
import  {faInfoCircle, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import {
  
  Card,Col,
  CardHeader,
 
  Media, Button,
 
  Table,
  Container,
  Row,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader";
const Tables =  () => {
  

  return (
    <>
    

 


    </>
  );
};

export default Tables;
