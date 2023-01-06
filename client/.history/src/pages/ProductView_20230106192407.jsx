import { useState, useEffect } from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ProductView ()
{
  const [ product, setProduct ] = useState( {} );



  return (
    <div>

      Product View
    </div>
  );
}