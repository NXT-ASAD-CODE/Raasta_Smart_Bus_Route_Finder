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
    createRoute,
    getCities,
    getStops
} from "../../../services/api";

export default function AddRoutePage() {
    const [cities, setCities] = useState([]);
    const [stops, setStops] = useState([]);

    const [city, setCity] = useState("");
    const [name, setName] = useState("");
    const [routeNumber, setRouteNumber] = useState("");
    const [startPoint, setStartPoint] = useState("");
    const [endPoint, setEndPoint] = useState("");

    const [selectedStop, setSelectedStop] = useState("");
    const [routeStops, setRouteStops] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingData(true);
                setError("");

                const [citiesResponse, stopsResponse] =
                    await Promise.all([
                        getCities(),
                        getStops()
                    ]);

                setCities(citiesResponse.data || []);
                setStops(stopsResponse.data || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, []);

    const cityStops = stops.filter(
        (stop) =>
            stop.city?._id === city ||
            stop.city === city
    );

    const addStop = () => {
        if (!selectedStop) {
            setError("Please select a stop.");
            return;
        }

        const alreadyAdded = routeStops.some(
            (item) => item.stop === selectedStop
        );

        if (alreadyAdded) {
            setError("This stop has already been added.");
            return;
        }

        setError("");

        setRouteStops([
            ...routeStops,
            {
                stop: selectedStop,
                sequence: routeStops.length + 1
            }
        ]);

        setSelectedStop("");
    };

    const removeStop = (stopId) => {
        const updatedStops = routeStops
            .filter((item) => item.stop !== stopId)
            .map((item, index) => ({
                ...item,
                sequence: index + 1
            }));

        setRouteStops(updatedStops);
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);

        setRouteStops([]);
        setSelectedStop("");
    };

    const getStopName = (stopId) => {
        const stop = stops.find(
            (item) => item._id === stopId
        );

        return stop?.name || "Unknown stop";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSuccess("");
        setError("");

        if (!city) {
            setError("Please select a city.");
            return;
        }

        if (!name.trim()) {
            setError("Route name is required.");
            return;
        }

        if (!routeNumber.trim()) {
            setError("Route number is required.");
            return;
        }

        if (!startPoint.trim()) {
            setError("Starting point is required.");
            return;
        }

        if (!endPoint.trim()) {
            setError("Ending point is required.");
            return;
        }

        if (routeStops.length < 2) {
            setError(
                "Please add at least two stops to the route."
            );
            return;
        }

        try {
            setLoading(true);

            await createRoute({
                city,
                name: name.trim(),
                routeNumber: routeNumber.trim(),
                startPoint: startPoint.trim(),
                endPoint: endPoint.trim(),
                stops: routeStops
            });

            setSuccess(
                `${name.trim()} was created successfully.`
            );

            setName("");
            setRouteNumber("");
            setStartPoint("");
            setEndPoint("");
            setRouteStops([]);
            setSelectedStop("");
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
            <Container maxWidth="md">
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
                        Add Route
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mb: 4
                        }}
                    >
                        Create a bus route by adding stops in
                        travel order.
                    </Typography>

                    {success && (
                        <Alert
                            severity="success"
                            sx={{ mb: 3 }}
                            onClose={() => setSuccess("")}
                        >
                            {success}
                        </Alert>
                    )}

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                            onClose={() => setError("")}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            select
                            fullWidth
                            required
                            label="City"
                            value={city}
                            onChange={handleCityChange}
                            disabled={loadingData}
                            sx={{ mb: 3 }}
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

                        <TextField
                            fullWidth
                            required
                            label="Route Name"
                            placeholder="University Road Route"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            fullWidth
                            required
                            label="Route Number"
                            placeholder="R-01"
                            value={routeNumber}
                            onChange={(event) =>
                                setRouteNumber(
                                    event.target.value
                                )
                            }
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            fullWidth
                            required
                            label="Starting Point"
                            placeholder="NIPA"
                            value={startPoint}
                            onChange={(event) =>
                                setStartPoint(
                                    event.target.value
                                )
                            }
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            fullWidth
                            required
                            label="Ending Point"
                            placeholder="Gulshan Stop"
                            value={endPoint}
                            onChange={(event) =>
                                setEndPoint(
                                    event.target.value
                                )
                            }
                            sx={{ mb: 4 }}
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mb: 2
                            }}
                        >
                            Route Stops
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                mb: 3,
                                flexDirection: {
                                    xs: "column",
                                    sm: "row"
                                }
                            }}
                        >
                            <TextField
                                select
                                fullWidth
                                label="Select Stop"
                                value={selectedStop}
                                onChange={(event) =>
                                    setSelectedStop(
                                        event.target.value
                                    )
                                }
                                disabled={!city}
                            >
                                <MenuItem value="">
                                    Select stop
                                </MenuItem>

                                {cityStops.map((stop) => (
                                    <MenuItem
                                        key={stop._id}
                                        value={stop._id}
                                    >
                                        {stop.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Button
                                variant="outlined"
                                onClick={addStop}
                                sx={{
                                    minWidth: {
                                        xs: "100%",
                                        sm: 130
                                    }
                                }}
                            >
                                Add Stop
                            </Button>
                        </Box>

                        {routeStops.length > 0 && (
                            <Box sx={{ mb: 4 }}>
                                {routeStops.map(
                                    (item, index) => (
                                        <Paper
                                            key={item.stop}
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                mb: 1,
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center"
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {index + 1}.{" "}
                                                    {getStopName(
                                                        item.stop
                                                    )}
                                                </Typography>
                                            </Box>

                                            <Button
                                                color="error"
                                                size="small"
                                                onClick={() =>
                                                    removeStop(
                                                        item.stop
                                                    )
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </Paper>
                                    )
                                )}
                            </Box>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={
                                loading ||
                                loadingData
                            }
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: "none",
                                fontSize: "1rem"
                            }}
                        >
                            {loading
                                ? "Creating Route..."
                                : "Create Route"}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}