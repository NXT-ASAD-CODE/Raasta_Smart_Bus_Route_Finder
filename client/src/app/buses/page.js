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
    CardContent,
    Chip,
    CircularProgress,
    Alert
} from "@mui/material";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

import { getCities, getRoutes } from "../../lib/api";

export default function BusesPage() {
    const router = useRouter();

    const [cities, setCities] = useState([]);
    const [routes, setRoutes] = useState([]);

    const [selectedCity, setSelectedCity] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    citiesResponse,
                    routesResponse
                ] = await Promise.all([
                    getCities(),
                    getRoutes()
                ]);

                const citiesData =
                    citiesResponse.data || [];

                const routesData =
                    routesResponse.data || [];

                setCities(citiesData);
                setRoutes(routesData);

                if (citiesData.length > 0) {
                    setSelectedCity(
                        citiesData[0]._id
                    );
                }
            } catch (err) {
                console.error(err);

                setError(
                    err.message ||
                    "Failed to load buses"
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Get routes for selected city
    |--------------------------------------------------------------------------
    */

    const filteredRoutes =
        routes.filter(
            (route) =>
                route.city?._id === selectedCity
        );

    /*
    |--------------------------------------------------------------------------
    | Remove duplicate route numbers
    |--------------------------------------------------------------------------
    |
    | If 11C has an UP route and DOWN route,
    | both may have routeNumber = 11C.
    |
    | We only want one 11C card.
    |
    */

    const buses = Array.from(
        new Map(
            filteredRoutes.map(
                (route) => [
                    route.routeNumber,
                    route
                ]
            )
        ).values()
    );

    const handleBusClick = (route) => {
        router.push(
            `/buses/${route._id}`
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
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
                py: 5
            }}
        >
            <Container maxWidth="lg">

                {/* Error */}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

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

                            {cities.map(
                                (city) => (
                                    <MenuItem
                                        key={city._id}
                                        value={city._id}
                                    >
                                        {city.name}
                                    </MenuItem>
                                )
                            )}

                        </Select>

                    </FormControl>

                </Box>

                {/* Bus Cards */}

                <Grid
                    container
                    spacing={3}
                >

                    {buses.map(
                        (bus) => (
                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 4
                                }}
                                key={
                                    bus.routeNumber
                                }
                            >

                                <Card
                                    onClick={() =>
                                        handleBusClick(
                                            bus
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

                                    {/* Bus visual */}

                                    <Box
                                        sx={{
                                            height: 190,
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            background:
                                                "linear-gradient(135deg, #0d47a1, #42a5f5)"
                                        }}
                                    >

                                        <DirectionsBusIcon
                                            sx={{
                                                fontSize:
                                                    90,
                                                color:
                                                    "#ffffff"
                                            }}
                                        />

                                    </Box>

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
                                                {
                                                    bus.routeNumber
                                                }
                                            </Typography>

                                        </Box>

                                        <Typography
                                            sx={{
                                                color:
                                                    "#64748b",
                                                mt: 0.7
                                            }}
                                        >
                                            {
                                                bus.name
                                            }
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

                {/* No buses */}

                {buses.length === 0 &&
                    !error && (
                        <Typography
                            sx={{
                                textAlign:
                                    "center",
                                color:
                                    "#64748b",
                                py: 8
                            }}
                        >
                            No buses found for
                            this city.
                        </Typography>
                    )}

            </Container>
        </Box>
    );
}