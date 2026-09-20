"use client";

import { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import { createCity } from "../../../services/api";

export default function AddCityPage() {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [country, setCountry] = useState("Pakistan");
    const [province, setProvince] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSuccess("");
        setError("");

        if (!name.trim() || !slug.trim()) {
            setError(
                "City name and slug are required."
            );

            return;
        }

        try {
            setLoading(true);

            await createCity({
                name: name.trim(),
                slug: slug.trim().toLowerCase(),
                country: country.trim(),
                province: province.trim()
            });

            setSuccess(
                `${name.trim()} was added successfully.`
            );

            setName("");
            setSlug("");
            setCountry("Pakistan");
            setProvince("");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = (event) => {
        const value = event.target.value;

        setName(value);

        setSlug(
            value
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
        );
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
                        Add City
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 4
                        }}
                    >
                        Add a city that will be available
                        in the Raasta transport system.
                    </Typography>

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
                        <TextField
                            fullWidth
                            required
                            label="City Name"
                            placeholder="Karachi"
                            value={name}
                            onChange={handleNameChange}
                            sx={{
                                mb: 3
                            }}
                        />

                        <TextField
                            fullWidth
                            required
                            label="Slug"
                            placeholder="karachi"
                            value={slug}
                            onChange={(event) =>
                                setSlug(
                                    event.target.value
                                        .toLowerCase()
                                        .trim()
                                        .replace(
                                            /\s+/g,
                                            "-"
                                        )
                                )
                            }
                            helperText="Used internally in URLs and API data."
                            sx={{
                                mb: 3
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Country"
                            value={country}
                            onChange={(event) =>
                                setCountry(
                                    event.target.value
                                )
                            }
                            sx={{
                                mb: 3
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Province / State"
                            placeholder="Sindh"
                            value={province}
                            onChange={(event) =>
                                setProvince(
                                    event.target.value
                                )
                            }
                            sx={{
                                mb: 3
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: "none",
                                fontSize: "1rem"
                            }}
                        >
                            {loading
                                ? "Adding City..."
                                : "Add City"}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}