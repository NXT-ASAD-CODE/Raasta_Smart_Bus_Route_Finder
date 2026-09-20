"use client";

import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Container,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import {
    createStop,
    getCities
} from "../../../services/api";

export default function AddStopPage() {
    const [cities, setCities] = useState([]);

    const [city, setCity] = useState("");
    const [name, setName] = useState("");
    const [nameUrdu, setNameUrdu] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [landmarks, setLandmarks] = useState("");

    const [loadingCities, setLoadingCities] =
        useState(true);

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // =========================
    // Load Cities
    // =========================

    useEffect(() => {
        const loadCities = async () => {
            try {
                setLoadingCities(true);
                setError("");

                const response = await getCities();

                setCities(response.data || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoadingCities(false);
            }
        };

        loadCities();
    }, []);

    // =========================
    // Submit Stop
    // =========================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSuccess("");
        setError("");

        if (!city) {
            setError("Please select a city.");
            return;
        }

        if (!name.trim()) {
            setError("Stop name is required.");
            return;
        }

        if (!latitude || !longitude) {
            setError(
                "Latitude and longitude are required."
            );
            return;
        }

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            setError(
                "Latitude and longitude must be valid numbers."
            );
            return;
        }

        if (lat < -90 || lat > 90) {
            setError(
                "Latitude must be between -90 and 90."
            );
            return;
        }

        if (lng < -180 || lng > 180) {
            setError(
                "Longitude must be between -180 and 180."
            );
            return;
        }

        try {
            setLoading(true);

            const landmarkList = landmarks
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            await createStop({
                city,
                name: name.trim(),
                nameUrdu: nameUrdu.trim(),
                location: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                landmarks: landmarkList
            });

            setSuccess(
                `${name.trim()} was added successfully.`
            );

            setName("");
            setNameUrdu("");
            setLatitude("");
            setLongitude("");
            setLandmarks("");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fa",
                py: {
                    xs: 4,
                    md: 7
                }
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        p: {
                            xs: 3,
                            sm: 4
                        },
                        borderRadius: 3
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 1
                        }}
                    >
                        Add Stop
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 4
                        }}
                    >
                        Add a bus stop to the Raasta
                        transport system.
                    </Typography>

                    {/* Success */}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3
                            }}
                            onClose={() =>
                                setSuccess("")
                            }
                        >
                            {success}
                        </Alert>
                    )}

                    {/* Error */}

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3
                            }}
                            onClose={() =>
                                setError("")
                            }
                        >
                            {error}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        {/* City */}

                        <TextField
                            select
                            fullWidth
                            required
                            label="City"
                            value={city}
                            onChange={(event) =>
                                setCity(
                                    event.target.value
                                )
                            }
                            disabled={loadingCities}
                            helperText={
                                loadingCities
                                    ? "Loading cities..."
                                    : "Select the city where this stop is located."
                            }
                            sx={{
                                mb: 3
                            }}
                        >
                            <MenuItem value="">
                                Select city
                            </MenuItem>

                            {cities.map((item) => (
                                <MenuItem
                                    key={item._id}
                                    value={item._id}
                                >
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Stop Name */}

                        <TextField
                            fullWidth
                            required
                            label="Stop Name"
                            placeholder="NIPA"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            sx={{
                                mb: 3
                            }}
                        />

                        {/* Urdu Name */}

                        <TextField
                            fullWidth
                            label="Urdu Name"
                            placeholder="نیپا"
                            value={nameUrdu}
                            onChange={(event) =>
                                setNameUrdu(
                                    event.target.value
                                )
                            }
                            sx={{
                                mb: 3
                            }}
                        />

                        {/* Latitude */}

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Latitude"
                            placeholder="24.9180"
                            value={latitude}
                            onChange={(event) =>
                                setLatitude(
                                    event.target.value
                                )
                            }
                            helperText="Example: 24.9180"
                            sx={{
                                mb: 3
                            }}
                        />

                        {/* Longitude */}

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Longitude"
                            placeholder="67.0976"
                            value={longitude}
                            onChange={(event) =>
                                setLongitude(
                                    event.target.value
                                )
                            }
                            helperText="Example: 67.0976"
                            sx={{
                                mb: 3
                            }}
                        />

                        {/* Landmarks */}

                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            label="Landmarks"
                            placeholder="NIPA Chowrangi, University Road"
                            value={landmarks}
                            onChange={(event) =>
                                setLandmarks(
                                    event.target.value
                                )
                            }
                            helperText="Separate multiple landmarks with commas."
                            sx={{
                                mb: 3
                            }}
                        />

                        {/* Submit */}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={
                                loading ||
                                loadingCities
                            }
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: "none",
                                fontSize: "1rem"
                            }}
                        >
                            {loading
                                ? "Adding Stop..."
                                : "Add Stop"}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}