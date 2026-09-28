"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";

import {
    getCities,
    getStops,
    getRoutes,
    createRoute,
    updateRoute,
    deactivateRoute,
    reactivateRoute
} from "../../../services/api";
import Link from "next/link";

export default function RoutesPage() {
    const [cities, setCities] = useState([]);
    const [stops, setStops] = useState([]);
    const [routes, setRoutes] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);

    const [city, setCity] = useState("");
    const [name, setName] = useState("");
    const [routeNumber, setRouteNumber] = useState("");
    const [startPoint, setStartPoint] = useState("");
    const [endPoint, setEndPoint] = useState("");

    const [selectedStop, setSelectedStop] = useState("");
    const [routeStops, setRouteStops] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================
    // Load data
    // =========================

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                citiesResponse,
                stopsResponse,
                routesResponse
            ] = await Promise.all([
                getCities(),
                getStops(),
                getRoutes()
            ]);

            setCities(citiesResponse.data || []);
            setStops(stopsResponse.data || []);
            setRoutes(routesResponse.data || []);
        } catch (error) {
            setError(
                error.message ||
                "Failed to load route data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // =========================
    // City stops
    // =========================

    const cityStops = useMemo(() => {
        if (!city) {
            return [];
        }

        return stops.filter(
            (stop) =>
                stop.city?._id === city ||
                stop.city === city
        );
    }, [stops, city]);

    // =========================
    // Reset form
    // =========================

    const resetForm = () => {
        setCity("");
        setName("");
        setRouteNumber("");
        setStartPoint("");
        setEndPoint("");
        setSelectedStop("");
        setRouteStops([]);
        setEditingRoute(null);
    };

    // =========================
    // Open Add
    // =========================

    const handleAddRoute = () => {
        resetForm();
        setError("");
        setDialogOpen(true);
    };

    // =========================
    // Open Edit
    // =========================

    const handleEditRoute = (route) => {
        setEditingRoute(route);

        setCity(
            route.city?._id ||
            route.city ||
            ""
        );

        setName(route.name || "");
        setRouteNumber(route.routeNumber || "");
        setStartPoint(route.startPoint || "");
        setEndPoint(route.endPoint || "");

        setRouteStops(
            (route.stops || [])
                .sort(
                    (a, b) =>
                        a.sequence - b.sequence
                )
                .map((item) => ({
                    stop:
                        item.stop?._id ||
                        item.stop,
                    name:
                        item.stop?.name ||
                        getStopName(
                            item.stop?._id ||
                            item.stop
                        ),
                    sequence: item.sequence,
                    travelTime:
                        item.travelTime || 0
                }))
        );

        setSelectedStop("");
        setError("");
        setDialogOpen(true);
    };

    // =========================
    // Stop name
    // =========================

    const getStopName = (stopId) => {
        const stop = stops.find(
            (item) => item._id === stopId
        );

        return stop?.name || "Unknown stop";
    };

    // =========================
    // City name
    // =========================

    const getCityName = (cityValue) => {
        if (!cityValue) {
            return "Unknown";
        }

        if (typeof cityValue === "object") {
            return cityValue.name || "Unknown";
        }

        const foundCity = cities.find(
            (item) => item._id === cityValue
        );

        return foundCity?.name || "Unknown";
    };

    // =========================
    // Add stop
    // =========================

    const handleAddStop = () => {
        if (!selectedStop) {
            setError("Please select a stop.");
            return;
        }

        if (
            routeStops.some(
                (item) =>
                    item.stop === selectedStop
            )
        ) {
            setError(
                "This stop is already added."
            );
            return;
        }

        const stop = stops.find(
            (item) =>
                item._id === selectedStop
        );

        if (!stop) {
            return;
        }

        setRouteStops((current) => [
            ...current,
            {
                stop: selectedStop,
                name: stop.name,
                sequence:
                    current.length + 1,
                travelTime: 0
            }
        ]);

        setSelectedStop("");
        setError("");
    };

    // =========================
    // Remove stop
    // =========================

    const handleRemoveStop = (stopId) => {
        setRouteStops((current) =>
            current
                .filter(
                    (item) =>
                        item.stop !== stopId
                )
                .map((item, index) => ({
                    ...item,
                    sequence: index + 1
                }))
        );
    };

    // =========================
    // Move stop
    // =========================

    const moveStop = (index, direction) => {
        const newIndex =
            direction === "up"
                ? index - 1
                : index + 1;

        if (
            newIndex < 0 ||
            newIndex >= routeStops.length
        ) {
            return;
        }

        setRouteStops((current) => {
            const updated = [...current];

            [
                updated[index],
                updated[newIndex]
            ] = [
                    updated[newIndex],
                    updated[index]
                ];

            return updated.map(
                (item, index) => ({
                    ...item,
                    sequence: index + 1
                })
            );
        });
    };

    // =========================
    // City change
    // =========================

    const handleCityChange = (event) => {
        setCity(event.target.value);
        setSelectedStop("");

        // Don't keep stops from another city
        setRouteStops([]);
    };

    // =========================
    // Save route
    // =========================

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (
                !city ||
                !name.trim() ||
                !routeNumber.trim() ||
                !startPoint.trim() ||
                !endPoint.trim()
            ) {
                setError(
                    "Please fill in all required fields."
                );
                return;
            }

            if (routeStops.length === 0) {
                setError(
                    "Please add at least one stop."
                );
                return;
            }

            const routeData = {
                city,
                name: name.trim(),
                routeNumber:
                    routeNumber.trim(),
                startPoint:
                    startPoint.trim(),
                endPoint:
                    endPoint.trim(),

                stops: routeStops.map(
                    (item) => ({
                        stop: item.stop,
                        sequence: item.sequence,
                        travelTime:
                            Number(
                                item.travelTime
                            ) || 0
                    })
                )
            };

            if (editingRoute) {
                await updateRoute(
                    editingRoute._id,
                    routeData
                );

                setSuccess(
                    "Route updated successfully."
                );
            } else {
                await createRoute(
                    routeData
                );

                setSuccess(
                    "Route created successfully."
                );
            }

            setDialogOpen(false);
            resetForm();

            await loadData();
        } catch (error) {
            setError(
                error.message ||
                "Failed to save route."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // Deactivate
    // =========================

    const handleDeactivate = async (
        routeId
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to deactivate this route?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deactivateRoute(
                routeId
            );

            setSuccess(
                "Route deactivated successfully."
            );

            await loadData();
        } catch (error) {
            setError(
                error.message ||
                "Failed to deactivate route."
            );
        }
    };

    // =========================
    // Reactivate
    // =========================

    const handleReactivate = async (
        routeId
    ) => {
        try {
            setError("");

            await reactivateRoute(
                routeId
            );

            setSuccess(
                "Route reactivated successfully."
            );

            await loadData();
        } catch (error) {
            setError(
                error.message ||
                "Failed to reactivate route."
            );
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fa",
                py: 5
            }}
        >
            <Button
                component={Link}
                href="/admin/dashboard"
                startIcon={<ArrowBackIcon />}
                sx={{
                    mb: 2,
                    marginLeft: "50px",
                    textTransform: "none",
                    color: "#64748b",
                    fontWeight: 600,
                    px: 0,
                    "&:hover": {
                        background: "transparent",
                        color: "#1976d2"
                    }
                }}
            >
                Back to Dashboard
            </Button>
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
                            variant="h4"
                            fontWeight={700}
                        >
                            Routes
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Manage your bus routes
                            and their stops.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={
                            handleAddRoute
                        }
                        sx={{
                            borderRadius: 2,
                            textTransform:
                                "none"
                        }}
                    >
                        Add Route
                    </Button>
                </Box>

                {/* Alerts */}

                {success && (
                    <Alert
                        severity="success"
                        sx={{ mb: 3 }}
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
                        sx={{ mb: 3 }}
                        onClose={() =>
                            setError("")
                        }
                    >
                        {error}
                    </Alert>
                )}

                {/* Loading */}

                {loading ? (
                    <Paper
                        sx={{
                            p: 5,
                            textAlign: "center"
                        }}
                    >
                        <Typography>
                            Loading routes...
                        </Typography>
                    </Paper>
                ) : routes.length === 0 ? (
                    <Paper
                        sx={{
                            p: 6,
                            textAlign: "center"
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            No routes found
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 1, mb: 3 }}
                        >
                            Create your first bus
                            route.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={
                                <AddIcon />
                            }
                            onClick={
                                handleAddRoute
                            }
                        >
                            Add Route
                        </Button>
                    </Paper>
                ) : (
                    <Stack spacing={2}>

                        {routes.map((route) => (
                            <Paper
                                key={
                                    route._id
                                }
                                sx={{
                                    p: 3,
                                    borderRadius: 3
                                }}
                            >
                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        gap: 2,
                                        flexDirection: {
                                            xs: "column",
                                            md: "row"
                                        }
                                    }}
                                >

                                    {/* Route information */}

                                    <Box>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            flexWrap="wrap"
                                            sx={{
                                                alignItems: "center"
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                            >
                                                {
                                                    route.routeNumber
                                                }
                                            </Typography>

                                            <Chip
                                                label={
                                                    route.isActive
                                                        ? "Active"
                                                        : "Inactive"
                                                }
                                                color={
                                                    route.isActive
                                                        ? "success"
                                                        : "default"
                                                }
                                                size="small"
                                            />
                                        </Stack>

                                        <Typography
                                            variant="h6"
                                            sx={{
                                                mt: 1
                                            }}
                                        >
                                            {
                                                route.name
                                            }
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                            sx={{
                                                mt: 1
                                            }}
                                        >
                                            {
                                                getCityName(
                                                    route.city
                                                )
                                            }
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 1
                                            }}
                                        >
                                            <strong>
                                                {
                                                    route.startPoint
                                                }
                                            </strong>

                                            {" → "}

                                            <strong>
                                                {
                                                    route.endPoint
                                                }
                                            </strong>
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                            sx={{
                                                mt: 1
                                            }}
                                        >
                                            {(
                                                route.stops ||
                                                []
                                            ).length}{" "}
                                            stops
                                        </Typography>
                                    </Box>

                                    {/* Actions */}

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{
                                            alignItems: "center"
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            startIcon={
                                                <EditIcon />
                                            }
                                            onClick={() =>
                                                handleEditRoute(
                                                    route
                                                )
                                            }
                                            sx={{
                                                textTransform:
                                                    "none"
                                            }}
                                        >
                                            Edit
                                        </Button>

                                        {route.isActive ? (
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                startIcon={
                                                    <DeleteIcon />
                                                }
                                                onClick={() =>
                                                    handleDeactivate(
                                                        route._id
                                                    )
                                                }
                                                sx={{
                                                    textTransform:
                                                        "none"
                                                }}
                                            >
                                                Deactivate
                                            </Button>
                                        ) : (
                                            <Button
                                                color="success"
                                                variant="outlined"
                                                startIcon={
                                                    <RestoreIcon />
                                                }
                                                onClick={() =>
                                                    handleReactivate(
                                                        route._id
                                                    )
                                                }
                                                sx={{
                                                    textTransform:
                                                        "none"
                                                }}
                                            >
                                                Reactivate
                                            </Button>
                                        )}
                                    </Stack>
                                </Box>

                                {/* Stops */}

                                {route.stops?.length >
                                    0 && (
                                        <Box
                                            sx={{
                                                mt: 3
                                            }}
                                        >
                                            <Typography
                                                fontWeight={
                                                    600
                                                }
                                                sx={{
                                                    mb: 1
                                                }}
                                            >
                                                Route Stops
                                            </Typography>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                flexWrap="wrap"
                                                useFlexGap
                                            >
                                                {[
                                                    ...route.stops
                                                ]
                                                    .sort(
                                                        (
                                                            a,
                                                            b
                                                        ) =>
                                                            a.sequence -
                                                            b.sequence
                                                    )
                                                    .map(
                                                        (
                                                            item
                                                        ) => (
                                                            <Chip
                                                                key={`${route._id}-${item.sequence}`}
                                                                label={`${item.sequence}. ${item.stop
                                                                    ?.name ||
                                                                    getStopName(
                                                                        item.stop
                                                                    )
                                                                    }`}
                                                                variant="outlined"
                                                            />
                                                        )
                                                    )}
                                            </Stack>
                                        </Box>
                                    )}
                            </Paper>
                        ))}
                    </Stack>
                )}

                {/* Add / Edit Dialog */}

                <Dialog
                    open={dialogOpen}
                    onClose={() => {
                        if (!saving) {
                            setDialogOpen(
                                false
                            );
                        }
                    }}
                    fullWidth
                    maxWidth="md"
                >
                    <DialogTitle>
                        {editingRoute
                            ? "Edit Route"
                            : "Add Route"}
                    </DialogTitle>

                    <DialogContent>
                        <Stack
                            spacing={3}
                            sx={{ mt: 1 }}
                        >

                            {/* City */}

                            <FormControl fullWidth>
                                <InputLabel>
                                    City *
                                </InputLabel>

                                <Select
                                    value={city}
                                    label="City *"
                                    onChange={
                                        handleCityChange
                                    }
                                    disabled={
                                        saving
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
                                label="Route Name"
                                required
                                fullWidth
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target
                                            .value
                                    )
                                }
                            />

                            <TextField
                                label="Route Number"
                                required
                                fullWidth
                                value={
                                    routeNumber
                                }
                                onChange={(e) =>
                                    setRouteNumber(
                                        e.target
                                            .value
                                    )
                                }
                            />

                            <TextField
                                label="Starting Point"
                                required
                                fullWidth
                                value={
                                    startPoint
                                }
                                onChange={(e) =>
                                    setStartPoint(
                                        e.target
                                            .value
                                    )
                                }
                            />

                            <TextField
                                label="Ending Point"
                                required
                                fullWidth
                                value={
                                    endPoint
                                }
                                onChange={(e) =>
                                    setEndPoint(
                                        e.target
                                            .value
                                    )
                                }
                            />

                            {/* Stops */}

                            <Box>
                                <Typography
                                    fontWeight={700}
                                    sx={{
                                        mb: 1.5
                                    }}
                                >
                                    Route Stops
                                </Typography>

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row"
                                    }}
                                    spacing={2}
                                >
                                    <FormControl
                                        fullWidth
                                    >
                                        <InputLabel>
                                            Select Stop
                                        </InputLabel>

                                        <Select
                                            value={
                                                selectedStop
                                            }
                                            label="Select Stop"
                                            onChange={(
                                                e
                                            ) =>
                                                setSelectedStop(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            disabled={
                                                !city ||
                                                saving
                                            }
                                        >
                                            {cityStops.map(
                                                (
                                                    stop
                                                ) => (
                                                    <MenuItem
                                                        key={
                                                            stop._id
                                                        }
                                                        value={
                                                            stop._id
                                                        }
                                                    >
                                                        {
                                                            stop.name
                                                        }
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>

                                    <Button
                                        variant="outlined"
                                        onClick={
                                            handleAddStop
                                        }
                                        disabled={
                                            !selectedStop ||
                                            saving
                                        }
                                        sx={{
                                            minWidth:
                                                140
                                        }}
                                    >
                                        Add Stop
                                    </Button>
                                </Stack>
                            </Box>

                            {/* Selected stops */}

                            {routeStops.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <Paper
                                        key={
                                            item.stop
                                        }
                                        variant="outlined"
                                        sx={{
                                            p: 2
                                        }}
                                    >
                                        <Stack
                                            direction={{
                                                xs: "column",
                                                sm: "row"
                                            }}
                                            spacing={2}
                                            sx={{
                                                alignItems: {
                                                    sm: "center"
                                                }
                                            }}
                                        >
                                            <Chip
                                                label={
                                                    item.sequence
                                                }
                                                color="primary"
                                            />

                                            <Typography
                                                sx={{
                                                    flex: 1
                                                }}
                                            >
                                                {
                                                    item.name
                                                }
                                            </Typography>

                                            <TextField
                                                label="Travel time (min)"
                                                type="number"
                                                size="small"
                                                value={
                                                    item.travelTime
                                                }
                                                onChange={(
                                                    e
                                                ) => {
                                                    const value =
                                                        e
                                                            .target
                                                            .value;

                                                    setRouteStops(
                                                        (
                                                            current
                                                        ) =>
                                                            current.map(
                                                                (
                                                                    stop
                                                                ) =>
                                                                    stop.stop ===
                                                                        item.stop
                                                                        ? {
                                                                            ...stop,
                                                                            travelTime:
                                                                                value
                                                                        }
                                                                        : stop
                                                            )
                                                    );
                                                }}
                                                sx={{
                                                    width: 170
                                                }}
                                            />

                                            <Stack
                                                direction="row"
                                            >
                                                <IconButton
                                                    onClick={() =>
                                                        moveStop(
                                                            index,
                                                            "up"
                                                        )
                                                    }
                                                    disabled={
                                                        index ===
                                                        0
                                                    }
                                                >
                                                    ↑
                                                </IconButton>

                                                <IconButton
                                                    onClick={() =>
                                                        moveStop(
                                                            index,
                                                            "down"
                                                        )
                                                    }
                                                    disabled={
                                                        index ===
                                                        routeStops.length -
                                                        1
                                                    }
                                                >
                                                    ↓
                                                </IconButton>

                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleRemoveStop(
                                                            item.stop
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                    </Paper>
                                )
                            )}
                        </Stack>
                    </DialogContent>

                    <DialogActions
                        sx={{ p: 2 }}
                    >
                        <Button
                            onClick={() => {
                                setDialogOpen(
                                    false
                                );
                                resetForm();
                            }}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={
                                handleSubmit
                            }
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingRoute
                                    ? "Update Route"
                                    : "Create Route"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}