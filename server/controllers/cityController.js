const City = require("../models/city");

// Get all cities
const getCities = async (req, res, next) => {
    try {
        const cities = await City.find({ isActive: true }).sort({
            name: 1
        });

        res.status(200).json({
            success: true,
            data: cities,
            count: cities.length
        });
    } catch (error) {
        next(error);
    }
};

// Get one city
const getCityById = async (req, res, next) => {
    try {
        const city = await City.findById(req.params.cityId);

        if (!city) {
            return res.status(404).json({
                success: false,
                message: "City not found"
            });
        }

        res.status(200).json({
            success: true,
            data: city
        });
    } catch (error) {
        next(error);
    }
};

// Create city
const createCity = async (req, res, next) => {
    try {
        const { name, slug, country, province } = req.body;

        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                message: "Name and slug are required"
            });
        }

        const city = await City.create({
            name,
            slug,
            country,
            province
        });

        res.status(201).json({
            success: true,
            data: city
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCities,
    getCityById,
    createCity
};