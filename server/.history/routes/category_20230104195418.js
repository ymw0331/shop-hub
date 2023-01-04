import express from "express";
const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

//Controllers
import {create} from '../controllers/'


router.post( "/category", requireSignin, isAdmin, create );