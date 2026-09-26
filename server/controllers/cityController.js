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
// Update city
const updateCity = async (req, res, next) => {
    try {
        const { cityId } = req.params;

        const {
            name,
            slug,
            country,
            province,
            isActive
        } = req.body;

        const city = await City.findById(cityId);

        if (!city) {
            return res.status(404).json({
                success: false,
                message: "City not found"
            });
        }

        if (name !== undefined) {
            city.name = name.trim();
        }

        if (slug !== undefined) {
            city.slug = slug
                .toLowerCase()
                .trim();
        }

        if (country !== undefined) {
            city.country = country.trim();
        }

        if (province !== undefined) {
            city.province = province.trim();
        }

        if (isActive !== undefined) {
            city.isActive = isActive;
        }

        await city.save();

        res.status(200).json({
            success: true,
            message: "City updated successfully",
            data: city
        });
    } catch (error) {
        next(error);
    }
};
// Deactivate city
const deactivateCity = async (req, res, next) => {
    try {
        const { cityId } = req.params;

        const city = await City.findById(cityId);

        if (!city) {
            return res.status(404).json({
                success: false,
                message: "City not found"
            });
        }

        city.isActive = false;

        await city.save();

        res.status(200).json({
            success: true,
            message: "City deactivated successfully",
            data: city
        });
    } catch (error) {
        next(error);
    }
};
// Reactivate city
const reactivateCity = async (req, res, next) => {
    try {
        const { cityId } = req.params;

        const city = await City.findById(cityId);

        if (!city) {
            return res.status(404).json({
                success: false,
                message: "City not found"
            });
        }

        city.isActive = true;

        await city.save();

        res.status(200).json({
            success: true,
            message: "City reactivated successfully",
            data: city
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getCities,
    getCityById,
    createCity,
    updateCity,
    deactivateCity,
    reactivateCity
};