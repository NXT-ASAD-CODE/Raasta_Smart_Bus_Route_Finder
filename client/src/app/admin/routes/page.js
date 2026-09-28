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
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import RouteIcon from "@mui/icons-material/Route";
import PlaceIcon from "@mui/icons-material/Place";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import {
    getCities,
    getStops,
    getRoutes,
    createRoute,
    updateRoute,
    deactivateRoute,
    reactivateRoute,
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
                routesResponse,
            ] = await Promise.all([
                getCities(),
                getStops(),
                getRoutes(),
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
    // Add route
    // =========================

    const handleAddRoute = () => {
        resetForm();
        setError("");
        setSuccess("");
        setDialogOpen(true);
    };

    // =========================
    // Edit route
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
                        item.travelTime || 0,
                }))
        );

        setSelectedStop("");
        setError("");
        setSuccess("");
        setDialogOpen(true);
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
                travelTime: 0,
            },
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
                    sequence: index + 1,
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
                updated[newIndex],
            ] = [
                updated[newIndex],
                updated[index],
            ];

            return updated.map(
                (item, index) => ({
                    ...item,
                    sequence: index + 1,
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
                        sequence:
                            item.sequence,
                        travelTime:
                            Number(
                                item.travelTime
                            ) || 0,
                    })
                ),
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
        const confirmed =
            window.confirm(
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
                background:
                    "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                py: { xs: 3, md: 5 },
            }}
        >
            <Container maxWidth="lg">

                {/* =========================
                    Back Button
                ========================= */}

                <Button
                    component={Link}
                    href="/admin/dashboard"
                    startIcon={
                        <ArrowBackIcon />
                    }
                    sx={{
                        mb: 3,
                        textTransform:
                            "none",
                        color: "#475569",
                        fontWeight: 600,
                        px: 0,

                        "&:hover": {
                            background:
                                "transparent",
                            color: "#1976d2",
                        },
                    }}
                >
                    Back to Dashboard
                </Button>

                {/* =========================
                    Header
                ========================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        gap: 3,
                        mb: 4,
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                    }}
                >
                    <Box>
                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >
                            <RouteIcon
                                sx={{
                                    color: "#1976d2",
                                    fontSize: 34,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "2rem",
                                        sm: "2.5rem",
                                    },
                                    lineHeight: 1.1,
                                    fontWeight: 800,
                                    color: "#0f172a",
                                    letterSpacing:
                                        "-0.5px",
                                }}
                            >
                                Routes
                            </Typography>
                        </Stack>

                        <Typography
                            sx={{
                                color: "#64748b",
                                fontSize:
                                    "1rem",
                                maxWidth: 600,
                            }}
                        >
                            Manage your bus
                            routes, stops,
                            destinations and
                            route status.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={
                            <AddIcon />
                        }
                        onClick={
                            handleAddRoute
                        }
                        sx={{
                            borderRadius: 2.5,
                            textTransform:
                                "none",
                            fontWeight: 700,
                            px: 2.5,
                            py: 1.25,
                            boxShadow:
                                "0 6px 16px rgba(25,118,210,0.22)",
                        }}
                    >
                        Add Route
                    </Button>
                </Box>

                {/* =========================
                    Alerts
                ========================= */}

                {success && (
                    <Alert
                        severity="success"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
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
                            mb: 3,
                            borderRadius: 2,
                        }}
                        onClose={() =>
                            setError("")
                        }
                    >
                        {error}
                    </Alert>
                )}

                {/* =========================
                    Loading
                ========================= */}

                {loading ? (
                    <Paper
                        sx={{
                            p: 6,
                            textAlign:
                                "center",
                            borderRadius: 3,
                            border:
                                "1px solid #e2e8f0",
                        }}
                    >
                        <Typography
                            color="text.secondary"
                        >
                            Loading routes...
                        </Typography>
                    </Paper>
                ) : routes.length === 0 ? (
                    <Paper
                        sx={{
                            p: 7,
                            textAlign:
                                "center",
                            borderRadius: 3,
                            border:
                                "1px solid #e2e8f0",
                        }}
                    >
                        <RouteIcon
                            sx={{
                                fontSize: 55,
                                color: "#94a3b8",
                                mb: 1,
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#0f172a"
                        >
                            No routes found
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 1,
                                mb: 3,
                            }}
                        >
                            Create your
                            first bus
                            route to get
                            started.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={
                                <AddIcon />
                            }
                            onClick={
                                handleAddRoute
                            }
                            sx={{
                                textTransform:
                                    "none",
                                borderRadius: 2,
                            }}
                        >
                            Add Route
                        </Button>
                    </Paper>
                ) : (
                    <Stack spacing={2.5}>

                        {routes.map(
                            (route) => (
                                <Paper
                                    key={
                                        route._id
                                    }
                                    elevation={0}
                                    sx={{
                                        overflow:
                                            "hidden",
                                        borderRadius: 3,
                                        border:
                                            "1px solid #e2e8f0",
                                        backgroundColor:
                                            "#ffffff",
                                        transition:
                                            "all 0.2s ease",

                                        "&:hover":
                                            {
                                                borderColor:
                                                    "#bfdbfe",
                                                boxShadow:
                                                    "0 12px 30px rgba(15,23,42,0.08)",
                                                transform:
                                                    "translateY(-1px)",
                                            },
                                    }}
                                >
                                    {/* Card top accent */}
                                    <Box
                                        sx={{
                                            height: 4,
                                            background:
                                                route.isActive
                                                    ? "linear-gradient(90deg, #1976d2, #42a5f5)"
                                                    : "#94a3b8",
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            p: {
                                                xs: 2.5,
                                                md: 3,
                                            },
                                        }}
                                    >

                                        {/* =====================
                                            Card Header
                                        ===================== */}

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    {
                                                        xs: "flex-start",
                                                        md: "center",
                                                    },
                                                gap: 3,
                                                flexDirection:
                                                    {
                                                        xs: "column",
                                                        md: "row",
                                                    },
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                }}
                                            >

                                                {/* Route Number + Status */}

                                                <Stack
                                                    direction="row"
                                                    spacing={
                                                        1
                                                    }
                                                    alignItems="center"
                                                    sx={{
                                                        flexWrap:
                                                            "wrap",
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Chip
                                                        icon={
                                                            <RouteIcon />
                                                        }
                                                        label={
                                                            route.routeNumber
                                                        }
                                                        size="small"
                                                        sx={{
                                                            fontWeight:
                                                                700,
                                                            color:
                                                                "#1d4ed8",
                                                            backgroundColor:
                                                                "#eff6ff",
                                                            border:
                                                                "1px solid #bfdbfe",
                                                        }}
                                                    />

                                                    <Chip
                                                        label={
                                                            route.isActive
                                                                ? "Active"
                                                                : "Inactive"
                                                        }
                                                        size="small"
                                                        sx={{
                                                            fontWeight:
                                                                700,
                                                            backgroundColor:
                                                                route.isActive
                                                                    ? "#dcfce7"
                                                                    : "#f1f5f9",
                                                            color:
                                                                route.isActive
                                                                    ? "#15803d"
                                                                    : "#64748b",
                                                        }}
                                                    />
                                                </Stack>

                                                {/* Route Name */}

                                                <Typography
                                                    sx={{
                                                        fontSize:
                                                            {
                                                                xs: "1.35rem",
                                                                md: "1.55rem",
                                                            },
                                                        fontWeight:
                                                            800,
                                                        color:
                                                            "#0f172a",
                                                        mb: 1,
                                                    }}
                                                >
                                                    {
                                                        route.name
                                                    }
                                                </Typography>

                                                {/* City */}

                                                <Stack
                                                    direction="row"
                                                    spacing={
                                                        1
                                                    }
                                                    alignItems="center"
                                                >
                                                    <LocationCityIcon
                                                        sx={{
                                                            fontSize: 19,
                                                            color: "#64748b",
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            color:
                                                                "#64748b",
                                                            fontWeight:
                                                                600,
                                                        }}
                                                    >
                                                        {
                                                            getCityName(
                                                                route.city
                                                            )
                                                        }
                                                    </Typography>
                                                </Stack>
                                            </Box>

                                            {/* =====================
                                                Actions
                                            ===================== */}

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{
                                                    flexWrap:
                                                        "wrap",
                                                    alignItems:
                                                        "center",
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
                                                            "none",
                                                        borderRadius: 2,
                                                        fontWeight:
                                                            700,
                                                        minWidth:
                                                            95,
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
                                                                "none",
                                                            borderRadius: 2,
                                                            fontWeight:
                                                                700,
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
                                                                "none",
                                                            borderRadius: 2,
                                                            fontWeight:
                                                                700,
                                                        }}
                                                    >
                                                        Reactivate
                                                    </Button>
                                                )}
                                            </Stack>
                                        </Box>

                                        {/* =====================
                                            Route Direction
                                        ===================== */}

                                        <Box
                                            sx={{
                                                mt: 3,
                                                p: 2,
                                                borderRadius: 2.5,
                                                backgroundColor:
                                                    "#f8fafc",
                                                border:
                                                    "1px solid #e2e8f0",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        "0.78rem",
                                                    fontWeight:
                                                        700,
                                                    color:
                                                        "#94a3b8",
                                                    textTransform:
                                                        "uppercase",
                                                    letterSpacing:
                                                        "0.7px",
                                                    mb: 1,
                                                }}
                                            >
                                                Route Direction
                                            </Typography>

                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    sm: "row",
                                                }}
                                                spacing={1}
                                                alignItems={{
                                                    xs: "flex-start",
                                                    sm: "center",
                                                }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={
                                                        1
                                                    }
                                                    alignItems="center"
                                                >
                                                    <PlaceIcon
                                                        sx={{
                                                            color:
                                                                "#1976d2",
                                                            fontSize: 20,
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            fontWeight:
                                                                700,
                                                            color:
                                                                "#1e293b",
                                                        }}
                                                    >
                                                        {
                                                            route.startPoint
                                                        }
                                                    </Typography>
                                                </Stack>

                                                <ArrowForwardIcon
                                                    sx={{
                                                        display:
                                                            {
                                                                xs: "none",
                                                                sm: "block",
                                                            },
                                                        color:
                                                            "#1976d2",
                                                    }}
                                                />

                                                <Typography
                                                    sx={{
                                                        display:
                                                            {
                                                                xs: "block",
                                                                sm: "none",
                                                            },
                                                        color:
                                                            "#1976d2",
                                                        fontWeight:
                                                            700,
                                                    }}
                                                >
                                                    ↓
                                                </Typography>

                                                <Stack
                                                    direction="row"
                                                    spacing={
                                                        1
                                                    }
                                                    alignItems="center"
                                                >
                                                    <PlaceIcon
                                                        sx={{
                                                            color:
                                                                "#16a34a",
                                                            fontSize: 20,
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            fontWeight:
                                                                700,
                                                            color:
                                                                "#1e293b",
                                                        }}
                                                    >
                                                        {
                                                            route.endPoint
                                                        }
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Box>

                                        {/* =====================
                                            Stop Section
                                        ===================== */}

                                        {route.stops?.length >
                                            0 && (
                                            <Box
                                                sx={{
                                                    mt: 3,
                                                    pt: 2.5,
                                                    borderTop:
                                                        "1px solid #e2e8f0",
                                                }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                    sx={{
                                                        mb: 1.5,
                                                    }}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        spacing={
                                                            1
                                                        }
                                                        alignItems="center"
                                                    >
                                                        <PlaceIcon
                                                            sx={{
                                                                fontSize: 20,
                                                                color:
                                                                    "#1976d2",
                                                            }}
                                                        />

                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    "0.95rem",
                                                                fontWeight:
                                                                    800,
                                                                color:
                                                                    "#334155",
                                                            }}
                                                        >
                                                            Route Stops
                                                        </Typography>
                                                    </Stack>

                                                    <Chip
                                                        label={`${route.stops.length} stops`}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor:
                                                                "#f1f5f9",
                                                            color:
                                                                "#64748b",
                                                            fontWeight:
                                                                600,
                                                        }}
                                                    />
                                                </Stack>

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{
                                                        flexWrap:
                                                            "wrap",
                                                        gap: 1,
                                                    }}
                                                >
                                                    {[
                                                        ...route.stops,
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
                                                                    label={`${item.sequence}. ${
                                                                        item
                                                                            .stop
                                                                            ?.name ||
                                                                        getStopName(
                                                                            item.stop
                                                                        )
                                                                    }`}
                                                                    variant="outlined"
                                                                    sx={{
                                                                        borderColor:
                                                                            "#cbd5e1",
                                                                        color:
                                                                            "#334155",
                                                                        backgroundColor:
                                                                            "#ffffff",
                                                                        fontWeight:
                                                                            600,
                                                                        borderRadius:
                                                                            2,

                                                                        "&:hover":
                                                                            {
                                                                                borderColor:
                                                                                    "#90caf9",
                                                                                backgroundColor:
                                                                                    "#eff6ff",
                                                                            },
                                                                    }}
                                                                />
                                                            )
                                                        )}
                                                </Stack>
                                            </Box>
                                        )}
                                    </Box>
                                </Paper>
                            )
                        )}
                    </Stack>
                )}

                {/* =========================
                    Add / Edit Dialog
                ========================= */}

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
                    <DialogTitle
                        sx={{
                            fontWeight: 800,
                            color: "#0f172a",
                        }}
                    >
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
                                    fontWeight={800}
                                    sx={{
                                        mb: 1.5,
                                        color:
                                            "#0f172a",
                                    }}
                                >
                                    Route Stops
                                </Typography>

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
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
                                                140,
                                            textTransform:
                                                "none",
                                            fontWeight:
                                                700,
                                            borderRadius:
                                                2,
                                        }}
                                    >
                                        Add Stop
                                    </Button>
                                </Stack>
                            </Box>

                            {/* Selected Stops */}

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
                                            p: 2,
                                            borderRadius:
                                                2,
                                            borderColor:
                                                "#e2e8f0",
                                        }}
                                    >
                                        <Stack
                                            direction={{
                                                xs: "column",
                                                sm: "row",
                                            }}
                                            spacing={2}
                                            sx={{
                                                alignItems:
                                                    {
                                                        sm: "center",
                                                    },
                                            }}
                                        >
                                            <Chip
                                                label={
                                                    item.sequence
                                                }
                                                color="primary"
                                                sx={{
                                                    fontWeight:
                                                        700,
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    flex: 1,
                                                    fontWeight:
                                                        600,
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
                                                                                value,
                                                                        }
                                                                        : stop
                                                            )
                                                    );
                                                }}
                                                sx={{
                                                    width: {
                                                        xs: "100%",
                                                        sm: 170,
                                                    },
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
                        sx={{
                            p: 2.5,
                            gap: 1,
                        }}
                    >
                        <Button
                            onClick={() => {
                                setDialogOpen(
                                    false
                                );
                                resetForm();
                            }}
                            disabled={saving}
                            sx={{
                                textTransform:
                                    "none",
                                fontWeight: 600,
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={
                                handleSubmit
                            }
                            disabled={saving}
                            sx={{
                                textTransform:
                                    "none",
                                fontWeight: 700,
                                borderRadius: 2,
                            }}
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