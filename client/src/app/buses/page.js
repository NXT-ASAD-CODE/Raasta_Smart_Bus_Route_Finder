"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    Box,
    Container,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Chip,
    CircularProgress,
    Alert
} from "@mui/material";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

import { getRoutes } from "../../services/api";

export default function BusesPage() {
    const router = useRouter();

    const [routes, setRoutes] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadRoutes = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getRoutes();

                const routeData = response?.data || [];

                setRoutes(routeData);

                if (routeData.length > 0) {
                    const firstCity =
                        routeData[0]?.city?._id ||
                        routeData[0]?.city;

                    setSelectedCity(firstCity || "");
                }
            } catch (err) {
                console.error("Failed to load routes:", err);

                setError(
                    err.message ||
                    "Unable to load bus routes."
                );
            } finally {
                setLoading(false);
            }
        };

        loadRoutes();
    }, []);

    const cities = Array.from(
        new Map(
            routes
                .filter((route) => route.city)
                .map((route) => [
                    route.city._id,
                    route.city
                ])
        ).values()
    );

    const filteredRoutes = routes.filter(
        (route) => {
            const cityId =
                route.city?._id ||
                route.city;

            return cityId === selectedCity;
        }
    );

    const handleRouteClick = (route) => {
        router.push(
            `/buses/${route._id}`
        );
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8fafc"
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                py: {
                    xs: 3,
                    md: 5
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
                            md: "center"
                        },
                        gap: 3,
                        flexDirection: {
                            xs: "column",
                            md: "row"
                        },
                        mb: 4
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
                            Find a Bus
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.7,
                                color: "#64748b",
                                fontSize: "1rem"
                            }}
                        >
                            Find bus routes, stops and
                            complete journey information.
                        </Typography>
                    </Box>

                    {/* City Selector */}

                    {cities.length > 0 && (
                        <FormControl
                            size="small"
                            sx={{
                                minWidth: 190,
                                backgroundColor: "#ffffff"
                            }}
                        >
                            <InputLabel>
                                Select City
                            </InputLabel>

                            <Select
                                value={selectedCity}
                                label="Select City"
                                onChange={(event) =>
                                    setSelectedCity(
                                        event.target.value
                                    )
                                }
                            >
                                {cities.map((city) => (
                                    <MenuItem
                                        key={city._id}
                                        value={city._id}
                                    >
                                        {city.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>

                {/* Error */}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Routes */}

                <Grid
                    container
                    spacing={3}
                >
                    {filteredRoutes.map(
                        (route) => (
                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 4
                                }}
                                key={route._id}
                            >
                                <Card
                                    onClick={() =>
                                        handleRouteClick(
                                            route
                                        )
                                    }
                                    sx={{
                                        borderRadius:
                                            "20px",
                                        overflow:
                                            "hidden",
                                        cursor:
                                            "pointer",
                                        border:
                                            "1px solid #dbe5f0",
                                        transition:
                                            "all 0.2s ease",

                                        "&:hover": {
                                            transform:
                                                "translateY(-5px)",
                                            boxShadow:
                                                "0 15px 35px rgba(15,23,42,0.12)"
                                        }
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="190"
                                        image="/buses/11c.jpg"
                                        alt={`Bus ${route.routeNumber}`}
                                    />

                                    <CardContent
                                        sx={{
                                            p: 2.5
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap: 1
                                            }}
                                        >
                                            <DirectionsBusIcon
                                                sx={{
                                                    color:
                                                        "#1976d2"
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        900,
                                                    fontSize:
                                                        "1.3rem"
                                                }}
                                            >
                                                {route.routeNumber}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontWeight:
                                                    700,
                                                mt: 0.5,
                                                color:
                                                    "#334155"
                                            }}
                                        >
                                            {route.name}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color:
                                                    "#64748b",
                                                mt: 0.7
                                            }}
                                        >
                                            {route.startPoint}
                                            {" → "}
                                            {route.endPoint}
                                        </Typography>

                                        <Chip
                                            label="View Route"
                                            size="small"
                                            sx={{
                                                mt: 2,
                                                backgroundColor:
                                                    "#e3f2fd",
                                                color:
                                                    "#1565c0",
                                                fontWeight:
                                                    700
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    )}
                </Grid>

                {/* No Routes */}

                {!error &&
                    filteredRoutes.length === 0 && (
                        <Box
                            sx={{
                                textAlign: "center",
                                py: 8
                            }}
                        >
                            <DirectionsBusIcon
                                sx={{
                                    fontSize: 60,
                                    color: "#94a3b8"
                                }}
                            />

                            <Typography
                                sx={{
                                    mt: 2,
                                    fontWeight: 800,
                                    color: "#334155"
                                }}
                            >
                                No buses found
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    color: "#64748b"
                                }}
                            >
                                There are no active routes
                                for this city.
                            </Typography>
                        </Box>
                    )}

            </Container>
        </Box>
    );
} 