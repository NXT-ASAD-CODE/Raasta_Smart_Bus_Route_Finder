"use client";

import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationCityIcon from "@mui/icons-material/LocationCity";

import {
    getCities,
    updateCity,
    deactivateCity
} from "../../../services/api";

export default function AdminCitiesPage() {
    const [cities, setCities] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editOpen, setEditOpen] = useState(false);

    const [selectedCity, setSelectedCity] =
        useState(null);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [country, setCountry] = useState("");
    const [province, setProvince] = useState("");

    const [saving, setSaving] = useState(false);

    // =========================
    // Load Cities
    // =========================

    const loadCities = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getCities();

            setCities(response.data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCities();
    }, []);

    // =========================
    // Open Edit Dialog
    // =========================

    const handleEdit = (city) => {
        setSelectedCity(city);

        setName(city.name || "");
        setSlug(city.slug || "");
        setCountry(city.country || "");
        setProvince(city.province || "");

        setEditOpen(true);
    };

    // =========================
    // Close Edit Dialog
    // =========================

    const handleCloseEdit = () => {
        if (saving) {
            return;
        }

        setEditOpen(false);
        setSelectedCity(null);

        setName("");
        setSlug("");
        setCountry("");
        setProvince("");
    };

    // =========================
    // Update City
    // =========================

    const handleUpdate = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim() || !slug.trim()) {
            setError(
                "City name and slug are required."
            );

            return;
        }

        try {
            setSaving(true);

            await updateCity(
                selectedCity._id,
                {
                    name: name.trim(),
                    slug: slug
                        .toLowerCase()
                        .trim(),
                    country: country.trim(),
                    province: province.trim()
                }
            );

            setSuccess(
                `${name.trim()} updated successfully.`
            );

            handleCloseEdit();

            await loadCities();
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // Deactivate City
    // =========================

    const handleDeactivate = async (city) => {
        const confirmed = window.confirm(
            `Are you sure you want to deactivate ${city.name}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await deactivateCity(city._id);

            setSuccess(
                `${city.name} was deactivated successfully.`
            );

            await loadCities();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                py: {
                    xs: 4,
                    md: 6
                }
            }}
        >
            <Container maxWidth="lg">

                {/* Header */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center"
                        },
                        gap: 2,
                        mb: 4,
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        }
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "2rem",
                                    md: "2.5rem"
                                },
                                fontWeight: 900,
                                color: "#0f172a"
                            }}
                        >
                            Manage Cities
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.7,
                                color: "#64748b"
                            }}
                        >
                            View and manage cities
                            available in Raasta.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 52,
                            height: 52,
                            borderRadius: "15px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2"
                        }}
                    >
                        <LocationCityIcon
                            sx={{
                                fontSize: 30
                            }}
                        />
                    </Box>
                </Box>

                {/* Alerts */}

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

                {/* Loading */}

                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 8
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : cities.length === 0 ? (
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: "20px",
                            border:
                                "1px solid #dbe5f0"
                        }}
                    >
                        <CardContent
                            sx={{
                                textAlign: "center",
                                py: 7
                            }}
                        >
                            <LocationCityIcon
                                sx={{
                                    fontSize: 50,
                                    color: "#94a3b8",
                                    mb: 1
                                }}
                            />

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    color: "#0f172a"
                                }}
                            >
                                No cities found
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748b",
                                    mt: 0.5
                                }}
                            >
                                Add a city to see it here.
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Stack spacing={2}>
                        {cities.map((city) => (
                            <Card
                                key={city._id}
                                elevation={0}
                                sx={{
                                    borderRadius: "18px",
                                    border:
                                        "1px solid #dbe5f0",
                                    backgroundColor:
                                        "#ffffff"
                                }}
                            >
                                <CardContent
                                    sx={{
                                        p: {
                                            xs: 2,
                                            sm: 2.5
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: {
                                                xs:
                                                    "flex-start",
                                                sm:
                                                    "center"
                                            },
                                            justifyContent:
                                                "space-between",
                                            gap: 2,
                                            flexDirection: {
                                                xs:
                                                    "column",
                                                sm:
                                                    "row"
                                            }
                                        }}
                                    >
                                        {/* City Info */}

                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        "1.2rem",
                                                    fontWeight:
                                                        900,
                                                    color:
                                                        "#0f172a"
                                                }}
                                            >
                                                {city.name}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    mt: 0.5,
                                                    color:
                                                        "#64748b"
                                                }}
                                            >
                                                {city.province
                                                    ? `${city.province}, `
                                                    : ""}
                                                {city.country}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    mt: 0.5,
                                                    fontSize:
                                                        "0.85rem",
                                                    color:
                                                        "#94a3b8"
                                                }}
                                            >
                                                Slug:{" "}
                                                {city.slug}
                                            </Typography>
                                        </Box>

                                        {/* Actions */}

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                gap: 1
                                            }}
                                        >
                                            <Button
                                                variant="outlined"
                                                startIcon={
                                                    <EditIcon />
                                                }
                                                onClick={() =>
                                                    handleEdit(
                                                        city
                                                    )
                                                }
                                                sx={{
                                                    textTransform:
                                                        "none",
                                                    borderRadius:
                                                        "10px",
                                                    fontWeight:
                                                        700
                                                }}
                                            >
                                                Edit
                                            </Button>

                                            <IconButton
                                                onClick={() =>
                                                    handleDeactivate(
                                                        city
                                                    )
                                                }
                                                sx={{
                                                    color:
                                                        "#dc2626",
                                                    border:
                                                        "1px solid #fecaca",
                                                    borderRadius:
                                                        "10px"
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                )}

            </Container>

            {/* Edit City Dialog */}

            <Dialog
                open={editOpen}
                onClose={handleCloseEdit}
                fullWidth
                maxWidth="sm"
            >
                <Box
                    component="form"
                    onSubmit={handleUpdate}
                >
                    <DialogTitle
                        sx={{
                            fontWeight: 900
                        }}
                    >
                        Edit City
                    </DialogTitle>

                    <DialogContent>
                        <TextField
                            fullWidth
                            label="City Name"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            sx={{
                                mt: 1,
                                mb: 2
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Slug"
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
                            sx={{
                                mb: 2
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
                                mb: 2
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Province / State"
                            value={province}
                            onChange={(event) =>
                                setProvince(
                                    event.target.value
                                )
                            }
                        />
                    </DialogContent>

                    <DialogActions
                        sx={{
                            px: 3,
                            pb: 2.5
                        }}
                    >
                        <Button
                            onClick={handleCloseEdit}
                            disabled={saving}
                            sx={{
                                textTransform:
                                    "none"
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                            disableElevation
                            sx={{
                                textTransform:
                                    "none",
                                borderRadius:
                                    "10px",
                                fontWeight: 700
                            }}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
}