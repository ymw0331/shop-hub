import express from "express";
const router = express.Router();

//Middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';

router.post( "/category", requireSignin, isAdmin );