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
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import PlaceIcon from "@mui/icons-material/Place";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    getStops,
    createStop,
    updateStop,
    deactivateStop,
    getCities
} from "../../../services/api";

export default function AdminStopsPage() {
    const [stops, setStops] = useState([]);
    const [cities, setCities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [editingStop, setEditingStop] =
        useState(null);

    const [city, setCity] = useState("");
    const [name, setName] = useState("");
    const [nameUrdu, setNameUrdu] =
        useState("");

    const [latitude, setLatitude] =
        useState("");

    const [longitude, setLongitude] =
        useState("");

    const [landmarks, setLandmarks] =
        useState("");

    // =========================
    // Load Data
    // =========================

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                stopsResponse,
                citiesResponse
            ] = await Promise.all([
                getStops(),
                getCities()
            ]);

            setStops(
                stopsResponse.data || []
            );

            setCities(
                citiesResponse.data || []
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // =========================
    // Reset Form
    // =========================

    const resetForm = () => {
        setCity("");
        setName("");
        setNameUrdu("");
        setLatitude("");
        setLongitude("");
        setLandmarks("");
        setEditingStop(null);
    };

    // =========================
    // Open Add Dialog
    // =========================

    const handleAdd = () => {
        resetForm();
        setDialogOpen(true);
    };

    // =========================
    // Open Edit Dialog
    // =========================

    const handleEdit = (stop) => {
        setEditingStop(stop);

        setCity(
            stop.city?._id ||
            stop.city ||
            ""
        );

        setName(stop.name || "");

        setNameUrdu(
            stop.nameUrdu || ""
        );

        setLatitude(
            stop.location?.coordinates?.[1]
                ?.toString() || ""
        );

        setLongitude(
            stop.location?.coordinates?.[0]
                ?.toString() || ""
        );

        setLandmarks(
            stop.landmarks?.join(", ") || ""
        );

        setDialogOpen(true);
    };

    // =========================
    // Close Dialog
    // =========================

    const handleClose = () => {
        if (saving) {
            return;
        }

        setDialogOpen(false);
        resetForm();
    };

    // =========================
    // Submit
    // =========================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !city ||
            !name.trim() ||
            !latitude ||
            !longitude
        ) {
            setError(
                "City, stop name, latitude and longitude are required."
            );

            return;
        }

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (
            Number.isNaN(lat) ||
            Number.isNaN(lng)
        ) {
            setError(
                "Latitude and longitude must be valid numbers."
            );

            return;
        }

        if (
            lat < -90 ||
            lat > 90
        ) {
            setError(
                "Latitude must be between -90 and 90."
            );

            return;
        }

        if (
            lng < -180 ||
            lng > 180
        ) {
            setError(
                "Longitude must be between -180 and 180."
            );

            return;
        }

        const landmarkArray = landmarks
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        const stopData = {
            city,
            name: name.trim(),
            nameUrdu: nameUrdu.trim(),
            location: {
                type: "Point",
                coordinates: [
                    lng,
                    lat
                ]
            },
            landmarks: landmarkArray
        };

        try {
            setSaving(true);

            if (editingStop) {
                await updateStop(
                    editingStop._id,
                    stopData
                );

                setSuccess(
                    `${name.trim()} updated successfully.`
                );
            } else {
                await createStop(stopData);

                setSuccess(
                    `${name.trim()} added successfully.`
                );
            }

            handleClose();

            await loadData();
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // Deactivate
    // =========================

    const handleDeactivate = async (
        stop
    ) => {
        const confirmed =
            window.confirm(
                `Are you sure you want to deactivate ${stop.name}?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await deactivateStop(
                stop._id
            );

            setSuccess(
                `${stop.name} was deactivated successfully.`
            );

            await loadData();
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
                        justifyContent:
                            "space-between",
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
                            Manage Stops
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.7,
                                color: "#64748b"
                            }}
                        >
                            Add and manage bus
                            stops in Raasta.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={
                            <PlaceIcon />
                        }
                        onClick={handleAdd}
                        sx={{
                            borderRadius: "10px",
                            textTransform:
                                "none",
                            fontWeight: 700
                        }}
                    >
                        Add Stop
                    </Button>
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
                            justifyContent:
                                "center",
                            py: 8
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : stops.length === 0 ? (
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
                                textAlign:
                                    "center",
                                py: 7
                            }}
                        >
                            <PlaceIcon
                                sx={{
                                    fontSize: 50,
                                    color:
                                        "#94a3b8"
                                }}
                            />

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    mt: 1
                                }}
                            >
                                No stops found
                            </Typography>

                            <Typography
                                sx={{
                                    color:
                                        "#64748b",
                                    mt: 0.5
                                }}
                            >
                                Add a stop to see
                                it here.
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid
                        container
                        spacing={3}
                    >
                        {stops.map((stop) => (
                            <Grid
                                key={stop._id}
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 4
                                }}
                            >
                                <Card
                                    elevation={0}
                                    sx={{
                                        height:
                                            "100%",
                                        borderRadius:
                                            "20px",
                                        border:
                                            "1px solid #dbe5f0"
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            p: 3
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                borderRadius:
                                                    "14px",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                backgroundColor:
                                                    "#e3f2fd",
                                                color:
                                                    "#1976d2",
                                                mb: 2
                                            }}
                                        >
                                            <PlaceIcon />
                                        </Box>

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
                                            {stop.name}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color:
                                                    "#64748b",
                                                mt: 0.5
                                            }}
                                        >
                                            {stop.city
                                                ?.name ||
                                                "Unknown city"}
                                        </Typography>

                                        {stop.nameUrdu && (
                                            <Typography
                                                sx={{
                                                    mt: 1,
                                                    color:
                                                        "#475569"
                                                }}
                                            >
                                                {stop.nameUrdu}
                                            </Typography>
                                        )}

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize:
                                                    "0.85rem",
                                                color:
                                                    "#94a3b8"
                                            }}
                                        >
                                            Lat:{" "}
                                            {
                                                stop.location
                                                    ?.coordinates?.[1]
                                            }
                                            {" • "}
                                            Lng:{" "}
                                            {
                                                stop.location
                                                    ?.coordinates?.[0]
                                            }
                                        </Typography>

                                        {stop.landmarks
                                            ?.length >
                                            0 && (
                                            <Typography
                                                sx={{
                                                    mt: 1,
                                                    fontSize:
                                                        "0.85rem",
                                                    color:
                                                        "#64748b"
                                                }}
                                            >
                                                Landmarks:{" "}
                                                {stop.landmarks.join(
                                                    ", "
                                                )}
                                            </Typography>
                                        )}

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{
                                                mt: 2
                                            }}
                                        >
                                            <Button
                                                variant="outlined"
                                                startIcon={
                                                    <EditIcon />
                                                }
                                                onClick={() =>
                                                    handleEdit(
                                                        stop
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
                                                        stop
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
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Add / Edit Dialog */}

            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <DialogTitle
                        sx={{
                            fontWeight: 900
                        }}
                    >
                        {editingStop
                            ? "Edit Stop"
                            : "Add Stop"}
                    </DialogTitle>

                    <DialogContent>

                        <FormControl
                            fullWidth
                            sx={{
                                mt: 1,
                                mb: 2
                            }}
                        >
                            <InputLabel>
                                City
                            </InputLabel>

                            <Select
                                value={city}
                                label="City"
                                onChange={(event) =>
                                    setCity(
                                        event.target
                                            .value
                                    )
                                }
                            >
                                {cities.map(
                                    (item) => (
                                        <MenuItem
                                            key={
                                                item._id
                                            }
                                            value={
                                                item._id
                                            }
                                        >
                                            {
                                                item.name
                                            }
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            required
                            label="Stop Name"
                            placeholder="Saddar"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target
                                        .value
                                )
                            }
                            sx={{
                                mb: 2
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Stop Name in Urdu"
                            placeholder="صدر"
                            value={nameUrdu}
                            onChange={(event) =>
                                setNameUrdu(
                                    event.target
                                        .value
                                )
                            }
                            sx={{
                                mb: 2
                            }}
                        />

                        <Grid
                            container
                            spacing={2}
                            sx={{
                                mb: 2
                            }}
                        >
                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6
                                }}
                            >
                                <TextField
                                    fullWidth
                                    required
                                    label="Latitude"
                                    placeholder="24.8607"
                                    type="number"
                                    value={
                                        latitude
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setLatitude(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6
                                }}
                            >
                                <TextField
                                    fullWidth
                                    required
                                    label="Longitude"
                                    placeholder="67.0011"
                                    type="number"
                                    value={
                                        longitude
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setLongitude(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            label="Landmarks"
                            placeholder="Saddar Market, Empress Market"
                            value={landmarks}
                            onChange={(event) =>
                                setLandmarks(
                                    event.target
                                        .value
                                )
                            }
                            helperText="Separate multiple landmarks with commas."
                        />
                    </DialogContent>

                    <DialogActions
                        sx={{
                            px: 3,
                            pb: 2.5
                        }}
                    >
                        <Button
                            onClick={handleClose}
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
                                : editingStop
                                    ? "Save Changes"
                                    : "Add Stop"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
}