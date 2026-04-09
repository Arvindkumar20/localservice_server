import express from "express";



import { getAllProfessionals, getAllServices } from "../controllers/customer.controller.js";


const router=express.Router();


router.get("/all-services",getAllServices);
router.get("/professionals", getAllProfessionals);

export const customerRouter=router;