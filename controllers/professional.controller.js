// controllers/professional.controller.js

import { Professional } from "../models/professional.model.js";
import { Service } from "../models/service.model.js";

export const createProfessionalWithService = async (req, res) => {
  try {
    const { name, phone, categoryName, experience, pricing } = req.body;

    // 1️⃣ Create Professional
    const professional = await Professional.create({
      name,
      phone,
      categoryName,
    });

    // 2️⃣ Create Service
    const service = await Service.create({
      professional: professional._id,
      experience,
      pricing,
    });

    // 3️⃣ Link service to professional
    professional.services.push(service._id);
    await professional.save();

    res.status(201).json({
      success: true,
      data: {
        professional,
        service,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};