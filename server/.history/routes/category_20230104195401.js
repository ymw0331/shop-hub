import express from "express";
const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

//ontrollers


router.post( "/category", requireSignin, isAdmin, create );