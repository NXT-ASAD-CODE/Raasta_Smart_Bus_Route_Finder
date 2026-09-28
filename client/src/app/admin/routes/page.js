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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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

    // =========================================================
    // LOAD DATA
    // =========================================================

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
                error.message || "Failed to load route data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // =========================================================
    // CITY STOPS
    // =========================================================

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

    // =========================================================
    // STOP NAME
    // =========================================================

    const getStopName = (stopId) => {
        const stop = stops.find(
            (item) => item._id === stopId
        );

        return stop?.name || "Unknown stop";
    };

    // =========================================================
    // CITY NAME
    // =========================================================

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

    // =========================================================
    // RESET FORM
    // =========================================================

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

    // =========================================================
    // ADD ROUTE
    // =========================================================

    const handleAddRoute = () => {
        resetForm();
        setError("");
        setSuccess("");
        setDialogOpen(true);
    };

    // =========================================================
    // EDIT ROUTE
    // =========================================================

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

        const sortedStops = [...(route.stops || [])]
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
            }));

        setRouteStops(sortedStops);
        setSelectedStop("");
        setError("");
        setSuccess("");
        setDialogOpen(true);
    };

    // =========================================================
    // CITY CHANGE
    // =========================================================

    const handleCityChange = (event) => {
        setCity(event.target.value);
        setSelectedStop("");
        setRouteStops([]);
    };

    // =========================================================
    // ADD STOP
    // =========================================================

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

    // =========================================================
    // REMOVE STOP
    // =========================================================

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

    // =========================================================
    // MOVE STOP
    // =========================================================

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

    // =========================================================
    // SAVE ROUTE
    // =========================================================

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
                await createRoute(routeData);

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

    // =========================================================
    // DEACTIVATE
    // =========================================================

    const handleDeactivate = async (routeId) => {
        const confirmed = window.confirm(
            "Are you sure you want to deactivate this route?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deactivateRoute(routeId);

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

    // =========================================================
    // REACTIVATE
    // =========================================================

    const handleReactivate = async (routeId) => {
        try {
            setError("");

            await reactivateRoute(routeId);

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
                py: 5,
            }}
        >
            {/* BACK TO DASHBOARD */}

            <Button
                component={Link}
                href="/admin/dashboard"
                startIcon={<ArrowBackIcon />}
                sx={{
                    mb: 3,
                    ml: {
                        xs: 2,
                        sm: 5,
                    },
                    textTransform: "none",
                    color: "#64748b",
                    fontWeight: 600,
                    px: 0,

                    "&:hover": {
                        background: "transparent",
                        color: "#1976d2",
                    },
                }}
            >
                Back to Dashboard
            </Button>

            <Container maxWidth="lg">

                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        gap: 2,
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h3"
                            fontWeight={800}
                            sx={{
                                color: "#0f172a",
                                fontSize: {
                                    xs: "2rem",
                                    sm: "2.5rem",
                                },
                            }}
                        >
                            Routes
                        </Typography>

                        <Typography
                            sx={{
                                color: "#64748b",
                                mt: 0.5,
                                fontSize: "1rem",
                            }}
                        >
                            Manage your bus routes
                            and their stops.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddRoute}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            px: 2.5,
                            py: 1.2,
                            boxShadow:
                                "0 4px 12px rgba(25,118,210,0.25)",
                        }}
                    >
                        Add Route
                    </Button>
                </Box>

                {/* =================================================
                    ALERTS
                ================================================= */}

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

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (
                    <Paper
                        sx={{
                            p: 6,
                            textAlign: "center",
                            borderRadius: 3,
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
                            textAlign: "center",
                            borderRadius: 3,
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
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
                            Create your first
                            bus route.
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

                    /* =================================================
                       ROUTE CARDS
                    ================================================= */

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2.5,
                        }}
                    >
                        {routes.map((route) => (
                            <Paper
                                key={route._id}
                                elevation={0}
                                sx={{
                                    p: {
                                        xs: 2,
                                        sm: 3,
                                    },
                                    borderRadius: 3,
                                    border:
                                        "1px solid #e2e8f0",
                                    backgroundColor:
                                        "#ffffff",
                                    transition:
                                        "all 0.2s ease",

                                    "&:hover": {
                                        boxShadow:
                                            "0 12px 30px rgba(15,23,42,0.08)",
                                        borderColor:
                                            "#cbd5e1",
                                        transform:
                                            "translateY(-2px)",
                                    },
                                }}
                            >
                                {/* TOP */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems: {
                                            xs: "flex-start",
                                            md: "center",
                                        },
                                        flexDirection: {
                                            xs: "column",
                                            md: "row",
                                        },
                                        gap: 3,
                                    }}
                                >
                                    {/* INFORMATION */}

                                    <Box
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                        }}
                                    >
                                        {/* ROUTE NUMBER */}

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                flexWrap:
                                                    "wrap",
                                                gap: 1,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        "0.9rem",
                                                    fontWeight:
                                                        800,
                                                    color:
                                                        "#64748b",
                                                    letterSpacing:
                                                        "0.5px",
                                                }}
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
                                                size="small"
                                                sx={{
                                                    height: 26,
                                                    fontWeight:
                                                        700,
                                                    backgroundColor:
                                                        route.isActive
                                                            ? "#dcfce7"
                                                            : "#e2e8f0",
                                                    color:
                                                        route.isActive
                                                            ? "#15803d"
                                                            : "#475569",
                                                }}
                                            />
                                        </Box>

                                        {/* ROUTE NAME */}

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: {
                                                    xs:
                                                        "1.3rem",
                                                    sm:
                                                        "1.5rem",
                                                },
                                                fontWeight:
                                                    800,
                                                color:
                                                    "#0f172a",
                                            }}
                                        >
                                            {
                                                route.name
                                            }
                                        </Typography>

                                        {/* CITY */}

                                        <Typography
                                            sx={{
                                                mt: 0.5,
                                                fontSize:
                                                    "0.95rem",
                                                fontWeight:
                                                    600,
                                                color:
                                                    "#64748b",
                                            }}
                                        >
                                            {
                                                getCityName(
                                                    route.city
                                                )
                                            }
                                        </Typography>

                                        {/* DIRECTION */}

                                        <Box
                                            sx={{
                                                display:
                                                    "inline-flex",
                                                alignItems:
                                                    "center",
                                                gap: 1,
                                                mt: 2,
                                                px: 1.5,
                                                py: 1,
                                                borderRadius:
                                                    2,
                                                backgroundColor:
                                                    "#f1f5f9",
                                            }}
                                        >
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

                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        "1.2rem",
                                                    fontWeight:
                                                        800,
                                                    color:
                                                        "#1976d2",
                                                }}
                                            >
                                                →
                                            </Typography>

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
                                        </Box>

                                        {/* STOP COUNT */}

                                        <Typography
                                            sx={{
                                                mt: 1.5,
                                                fontSize:
                                                    "0.9rem",
                                                color:
                                                    "#64748b",
                                                fontWeight:
                                                    600,
                                            }}
                                        >
                                            {
                                                (
                                                    route.stops ||
                                                    []
                                                ).length
                                            }{" "}
                                            stops
                                        </Typography>
                                    </Box>

                                    {/* ACTIONS */}

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            flexWrap:
                                                "wrap",
                                            gap: 1,
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
                                                borderRadius:
                                                    2,
                                                fontWeight:
                                                    700,
                                                minWidth:
                                                    100,
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
                                                    borderRadius:
                                                        2,
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
                                                    borderRadius:
                                                        2,
                                                    fontWeight:
                                                        700,
                                                }}
                                            >
                                                Reactivate
                                            </Button>
                                        )}
                                    </Box>
                                </Box>

                                {/* =================================================
                                   STOPS
                                ================================================= */}

                                {route.stops?.length > 0 && (
                                    <Box
                                        sx={{
                                            mt: 3,
                                            pt: 2.5,
                                            borderTop:
                                                "1px solid #e2e8f0",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center",
                                                mb: 1.5,
                                            }}
                                        >
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

                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        "0.8rem",
                                                    color:
                                                        "#94a3b8",
                                                }}
                                            >
                                                {
                                                    route
                                                        .stops
                                                        .length
                                                }{" "}
                                                total
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
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
                                                                    "#f8fafc",
                                                                fontWeight:
                                                                    600,
                                                                borderRadius:
                                                                    2,
                                                            }}
                                                        />
                                                    )
                                                )}
                                        </Box>
                                    </Box>
                                )}
                            </Paper>
                        ))}
                    </Box>
                )}

                {/* =================================================
                    ADD / EDIT DIALOG
                ================================================= */}

                <Dialog
                    open={dialogOpen}
                    onClose={() => {
                        if (!saving) {
                            setDialogOpen(false);
                        }
                    }}
                    fullWidth
                    maxWidth="md"
                >
                    <DialogTitle
                        sx={{
                            fontWeight: 800,
                        }}
                    >
                        {editingRoute
                            ? "Edit Route"
                            : "Add Route"}
                    </DialogTitle>

                    <DialogContent>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection:
                                    "column",
                                gap: 3,
                                mt: 1,
                            }}
                        >
                            {/* CITY */}

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
                                        (
                                            item
                                        ) => (
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

                            {/* ROUTE NAME */}

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

                            {/* ROUTE NUMBER */}

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

                            {/* START */}

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

                            {/* END */}

                            <TextField
                                label="Ending Point"
                                required
                                fullWidth
                                value={endPoint}
                                onChange={(e) =>
                                    setEndPoint(
                                        e.target
                                            .value
                                    )
                                }
                            />

                            {/* =================================================
                               SELECT STOP
                            ================================================= */}

                            <Box>
                                <Typography
                                    fontWeight={800}
                                    sx={{
                                        mb: 1.5,
                                    }}
                                >
                                    Route Stops
                                </Typography>

                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        flexDirection: {
                                            xs:
                                                "column",
                                            sm:
                                                "row",
                                        },
                                        gap: 2,
                                    }}
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
                                        }}
                                    >
                                        Add Stop
                                    </Button>
                                </Box>
                            </Box>

                            {/* =================================================
                               SELECTED STOPS
                            ================================================= */}

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
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                alignItems: {
                                                    xs:
                                                        "flex-start",
                                                    sm:
                                                        "center",
                                                },
                                                flexDirection: {
                                                    xs:
                                                        "column",
                                                    sm:
                                                        "row",
                                                },
                                                gap: 2,
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
                                                        xs:
                                                            "100%",
                                                        sm:
                                                            170,
                                                    },
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                }}
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
                                                    <KeyboardArrowUpIcon />
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
                                                    <KeyboardArrowDownIcon />
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
                                            </Box>
                                        </Box>
                                    </Paper>
                                )
                            )}
                        </Box>
                    </DialogContent>

                    {/* =================================================
                        DIALOG ACTIONS
                    ================================================= */}

                    <DialogActions
                        sx={{
                            p: 2,
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