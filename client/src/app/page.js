"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import RouteIcon from "@mui/icons-material/Route";
import SwapVertIcon from "@mui/icons-material/SwapVert";

import {
    getCities,
    getStops,
    searchRoutes
} from "../services/api";

/* =========================================================
   STOP LABEL
========================================================= */

function StopLabel({ stop }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Typography
                sx={{
                    fontWeight: 700,
                    color: "#334155"
                }}
            >
                {stop.name}
            </Typography>

            {stop.nameUrdu && (
                <Typography
                    sx={{
                        fontSize: {
                            xs: "1.15rem",
                            sm: "1.3rem",
                            md: "1.45rem"
                        },
                        fontWeight: 800,
                        color: "#1976d2",
                        lineHeight: 1.7,
                        direction: "rtl",
                        textAlign: "left"
                    }}
                >
                    {stop.nameUrdu}
                </Typography>
            )}
        </Box>
    );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
    icon,
    title,
    description
}) {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                transition: "0.3s",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                        "0 15px 35px rgba(15, 23, 42, 0.08)"
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box
                    sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#eff6ff",
                        color: "#1976d2",
                        mb: 2
                    }}
                >
                    {icon}
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 800,
                        mb: 1
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        lineHeight: 1.7
                    }}
                >
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
}

/* =========================================================
   JOURNEY TIMELINE
========================================================= */

function JourneyTimeline({ stops }) {
    return (
        <Box sx={{ mt: 3 }}>
            {stops.map((stop, index) => {
                const isFirst = index === 0;
                const isLast =
                    index === stops.length - 1;

                return (
                    <Box
                        key={`${stop._id}-${index}`}
                        sx={{
                            display: "flex",
                            position: "relative"
                        }}
                    >
                        <Box
                            sx={{
                                width: 36,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                        >
                            <Box
                                sx={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: "50%",
                                    bgcolor:
                                        isFirst || isLast
                                            ? "#1976d2"
                                            : "#94a3b8",
                                    border:
                                        isFirst || isLast
                                            ? "3px solid #dbeafe"
                                            : "3px solid #f1f5f9",
                                    zIndex: 1
                                }}
                            />

                            {!isLast && (
                                <Box
                                    sx={{
                                        width: 2,
                                        flex: 1,
                                        minHeight: 50,
                                        bgcolor: "#cbd5e1"
                                    }}
                                />
                            )}
                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                                pb: isLast ? 0 : 3,
                                pl: 1
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight:
                                        isFirst || isLast
                                            ? 800
                                            : 600,
                                    color:
                                        isFirst || isLast
                                            ? "#0f172a"
                                            : "#475569"
                                }}
                            >
                                {stop.name}
                            </Typography>

                            {stop.nameUrdu && (
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "1.15rem",
                                            sm: "1.3rem",
                                            md: "1.45rem"
                                        },
                                        fontWeight: 800,
                                        color: "#1976d2",
                                        lineHeight: 1.7,
                                        direction: "rtl",
                                        textAlign: "left"
                                    }}
                                >
                                    {stop.nameUrdu}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}

/* =========================================================
   DIRECT ROUTE CARD
========================================================= */

function DirectRouteCard({ route }) {
    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid #dbeafe",
                borderRadius: "20px",
                overflow: "hidden"
            }}
        >
            <Box
                sx={{
                    bgcolor: "#eff6ff",
                    px: { xs: 2, sm: 3 },
                    py: 2
                }}
            >
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    justifyContent="space-between"
                    spacing={1}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 900,
                                color: "#0f172a"
                            }}
                        >
                            {route.routeName}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Route {route.routeNumber}
                        </Typography>
                    </Box>

                    <Chip
                        icon={<CheckCircleIcon />}
                        label="Direct Route"
                        color="success"
                        size="small"
                    />
                </Stack>
            </Box>

            <CardContent
                sx={{
                    p: {
                        xs: 2,
                        sm: 3
                    }
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
                            xs: "stretch",
                            sm: "center"
                        }
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Start
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 800
                            }}
                        >
                            {route.startPoint}
                        </Typography>
                    </Box>

                    <ArrowForwardIcon
                        sx={{
                            color: "#1976d2",
                            display: {
                                xs: "none",
                                sm: "block"
                            }
                        }}
                    />

                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Destination
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 800
                            }}
                        >
                            {route.endPoint}
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Typography
                    sx={{
                        fontWeight: 800,
                        mb: 1
                    }}
                >
                    Your Journey
                </Typography>

                <JourneyTimeline
                    stops={route.stops}
                />
            </CardContent>
        </Card>
    );
}

/* =========================================================
   TRANSFER ROUTE CARD
========================================================= */

function TransferRouteCard({ route }) {
    const transferStop =
        route.transferStop?.name ||
        "Transfer Stop";

    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                overflow: "hidden"
            }}
        >
            <Box
                sx={{
                    bgcolor: "#f8fafc",
                    px: { xs: 2, sm: 3 },
                    py: 2
                }}
            >
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row"
                    }}
                    justifyContent="space-between"
                    spacing={1}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 900
                            }}
                        >
                            One Transfer Journey
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Change buses once to reach
                            your destination.
                        </Typography>
                    </Box>

                    <Chip
                        label="1 Transfer"
                        color="warning"
                        size="small"
                    />
                </Stack>
            </Box>

            <CardContent
                sx={{
                    p: {
                        xs: 2,
                        sm: 3
                    }
                }}
            >
                <Stack spacing={3}>
                    {route.journey?.map(
                        (journey, index) => (
                            <Box
                                key={
                                    journey.routeId
                                }
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        alignItems:
                                            "center",
                                        mb: 2
                                    }}
                                >
                                    <DirectionsBusIcon
                                        sx={{
                                            color: "#1976d2"
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 800
                                            }}
                                        >
                                            {
                                                journey.routeName
                                            }
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Route{" "}
                                            {
                                                journey.routeNumber
                                            }
                                        </Typography>
                                    </Box>
                                </Stack>

                                <JourneyTimeline
                                    stops={
                                        journey.stops
                                    }
                                />

                                {index === 0 && (
                                    <Box
                                        sx={{
                                            mt: 3,
                                            p: 2,
                                            bgcolor:
                                                "#fff7ed",
                                            border:
                                                "1px solid #fed7aa",
                                            borderRadius:
                                                "14px"
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                color:
                                                    "#9a3412"
                                            }}
                                        >
                                            Transfer at
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color:
                                                    "#7c2d12"
                                            }}
                                        >
                                            {
                                                transferStop
                                            }
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

/* =========================================================
   NO ROUTE CARD
========================================================= */

function NoRouteCard() {
    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                textAlign: "center"
            }}
        >
            <CardContent sx={{ py: 6 }}>
                <RouteIcon
                    sx={{
                        fontSize: 55,
                        color: "#94a3b8",
                        mb: 2
                    }}
                />

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 800,
                        mb: 1
                    }}
                >
                    No route found
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        maxWidth: 500,
                        mx: "auto"
                    }}
                >
                    We could not find a direct or
                    one-transfer route between these
                    stops.
                </Typography>
            </CardContent>
        </Card>
    );
}

/* =========================================================
   ROUTE RESULTS
========================================================= */

function RouteResults({ results }) {
    if (!results) {
        return null;
    }

    if (!results.data?.length) {
        return <NoRouteCard />;
    }

    return (
        <Stack spacing={3}>
            {results.type === "direct"
                ? results.data.map((route) => (
                      <DirectRouteCard
                          key={route.routeId}
                          route={route}
                      />
                  ))
                : results.data.map(
                      (route, index) => (
                          <TransferRouteCard
                              key={`${route.fromStop}-${index}`}
                              route={route}
                          />
                      )
                  )}
        </Stack>
    );
}

/* =========================================================
   HOME PAGE
========================================================= */

export default function Home() {
    const [cities, setCities] = useState([]);
    const [stops, setStops] = useState([]);

    const [selectedCity, setSelectedCity] =
        useState(null);

    const [cityDialogOpen, setCityDialogOpen] =
        useState(false);

    const [fromStop, setFromStop] =
        useState("");

    const [toStop, setToStop] =
        useState("");

    const [results, setResults] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [initialLoading, setInitialLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    /* =====================================================
       LOAD DATA
    ===================================================== */

    useEffect(() => {
        const loadData = async () => {
            try {
                setInitialLoading(true);
                setError("");

                const [
                    citiesResponse,
                    stopsResponse
                ] = await Promise.all([
                    getCities(),
                    getStops()
                ]);

                setCities(
                    citiesResponse?.data || []
                );

                setStops(
                    stopsResponse?.data || []
                );
            } catch (error) {
                console.error(error);

                setError(
                    error.message ||
                        "Unable to load route data."
                );
            } finally {
                setInitialLoading(false);
            }
        };

        loadData();
    }, []);

    /* =====================================================
       CITY STOPS
    ===================================================== */

    const cityStops = useMemo(() => {
        if (!selectedCity) {
            return [];
        }

        return stops.filter((stop) => {
            const cityId =
                typeof stop.city === "object"
                    ? stop.city?._id
                    : stop.city;

            return (
                cityId === selectedCity._id
            );
        });
    }, [stops, selectedCity]);

    /* =====================================================
       SELECT CITY
    ===================================================== */

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setCityDialogOpen(false);

        setFromStop("");
        setToStop("");
        setResults(null);
        setError("");
    };

    /* =====================================================
       FIND ROUTE
    ===================================================== */

    const handleFindRoute = async () => {
        if (!fromStop || !toStop) {
            setError(
                "Please select both starting point and destination."
            );
            return;
        }

        if (fromStop === toStop) {
            setError(
                "Starting point and destination cannot be the same."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResults(null);

            const response =
                await searchRoutes(
                    fromStop,
                    toStop
                );

            setResults(response);
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                    "Unable to find a route."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       SWAP STOPS
    ===================================================== */

    const handleSwap = () => {
        setFromStop(toStop);
        setToStop(fromStop);
        setResults(null);
        setError("");
    };

    /* =====================================================
       BACK HOME
    ===================================================== */

    const handleBackHome = () => {
        setSelectedCity(null);
        setFromStop("");
        setToStop("");
        setResults(null);
        setError("");
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (initialLoading) {
        return (
            <Box
                sx={{
                    minHeight:
                        "calc(100dvh - 76px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Stack
                    spacing={2}
                    sx={{
                        alignItems: "center"
                    }}
                >
                    <CircularProgress />

                    <Typography color="text.secondary">
                        Loading Raasta...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    /* =====================================================
       LANDING PAGE
    ===================================================== */

    if (!selectedCity) {
        return (
            <Box
                sx={{
                    height: {
                        xs: "calc(100dvh - 68px)",
                        md: "calc(100dvh - 76px)"
                    },
                    minHeight: {
                        xs: "560px",
                        md: "650px"
                    },
                    overflow: "hidden",
                    bgcolor: "#f8fafc"
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            textAlign: "center"
                        }}
                    >
                        <Chip
                            icon={
                                <DirectionsBusIcon />
                            }
                            label="Smart Bus Route Finder"
                            sx={{
                                mb: 2,
                                mt: "-50px",
                                fontWeight: 700,
                                bgcolor: "#eff6ff",
                                color: "#1976d2"
                            }}
                        />

                        <Typography
                            component="h1"
                            sx={{
                                fontSize: {
                                    xs: "2.4rem",
                                    sm: "3.5rem",
                                    md: "5rem"
                                },
                                fontWeight: 900,
                                lineHeight: 1.05,
                                letterSpacing:
                                    "-0.04em",
                                color: "#0f172a"
                            }}
                        >
                            Know Your Route.
                            <br />
                            Know Your Way.
                        </Typography>

                        <Typography
                            sx={{
                                mt: 2,
                                maxWidth: 700,
                                mx: "auto",
                                color: "#64748b",
                                fontSize: {
                                    xs: "1rem",
                                    sm: "1.1rem",
                                    md: "1.2rem"
                                },
                                lineHeight: 1.7
                            }}
                        >
                            Tell us where you want
                            to go, and Raasta
                            explains which bus to
                            take and where to get
                            on and off.
                        </Typography>

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row"
                            }}
                            spacing={2}
                            justifyContent="center"
                            sx={{ mt: 4 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={
                                    <LocationCityIcon />
                                }
                                onClick={() =>
                                    setCityDialogOpen(
                                        true
                                    )
                                }
                                sx={{
                                    borderRadius:
                                        "14px",
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 800,
                                    textTransform:
                                        "none"
                                }}
                            >
                                Select Your City
                            </Button>
                        </Stack>

                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mt: 3,
                                    maxWidth: 600,
                                    mx: "auto",
                                    borderRadius:
                                        "12px"
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(3, 1fr)"
                                },
                                gap: 2,
                                mt: 5,
                                maxWidth: 850,
                                mx: "auto"
                            }}
                        >
                            <FeatureCard
                                icon={
                                    <DirectionsBusIcon />
                                }
                                title="Find Your Bus"
                                description="Choose your starting point and destination to find suitable bus routes."
                            />

                            <FeatureCard
                                icon={
                                    <RouteIcon />
                                }
                                title="Understand the Route"
                                description="See the stops and journey path instead of only getting a bus number."
                            />

                            <FeatureCard
                                icon={
                                    <LocationCityIcon />
                                }
                                title="Multiple Cities"
                                description="The platform is designed to support public transport information for different cities."
                            />
                        </Box>
                    </Box>
                </Container>

                {/* =================================================
                   CITY DIALOG
                ================================================= */}

                <Dialog
                    open={cityDialogOpen}
                    onClose={() =>
                        setCityDialogOpen(false)
                    }
                    fullWidth
                    maxWidth="sm"
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: "24px",
                                p: 1
                            }
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontWeight: 900
                        }}
                    >
                        Select Your City
                    </DialogTitle>

                    <DialogContent>
                        <Typography
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Select a city to see its
                            available bus routes.
                        </Typography>

                        <Stack spacing={1.5}>
                            {cities.length === 0 ? (
                                <Alert severity="info">
                                    No cities are
                                    available yet.
                                </Alert>
                            ) : (
                                cities.map((city) => (
                                    <Button
                                        key={city._id}
                                        variant="outlined"
                                        fullWidth
                                        onClick={() =>
                                            handleCitySelect(
                                                city
                                            )
                                        }
                                        sx={{
                                            justifyContent:
                                                "space-between",
                                            textTransform:
                                                "none",
                                            borderRadius:
                                                "14px",
                                            px: 2,
                                            py: 1.5
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                textAlign:
                                                    "left"
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: 800
                                                }}
                                            >
                                                {city.name}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {city.province ||
                                                    city.country ||
                                                    "Pakistan"}
                                            </Typography>
                                        </Box>

                                        <ArrowForwardIcon />
                                    </Button>
                                ))
                            )}
                        </Stack>
                    </DialogContent>

                    <DialogActions
                        sx={{ p: 2 }}
                    >
                        <Button
                            onClick={() =>
                                setCityDialogOpen(
                                    false
                                )
                            }
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }

    /* =====================================================
       ROUTE FINDER PAGE
    ===================================================== */

    return (
        <Box
            sx={{
                minHeight:
                    "calc(100dvh - 76px)",
                bgcolor: "#f8fafc",
                py: {
                    xs: 3,
                    md: 5
                }
            }}
        >
            <Container maxWidth="md">
                <Stack spacing={3}>
                    {/* HEADER */}

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                            alignItems: "center"
                        }}
                    >
                        <Button
                            startIcon={
                                <ArrowBackIcon />
                            }
                            onClick={
                                handleBackHome
                            }
                            sx={{
                                textTransform:
                                    "none",
                                fontWeight: 700
                            }}
                        >
                            Change City
                        </Button>

                        <Chip
                            icon={
                                <LocationCityIcon />
                            }
                            label={
                                selectedCity.name
                            }
                            color="primary"
                            variant="outlined"
                        />
                    </Stack>

                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 900,
                                color: "#0f172a"
                            }}
                        >
                            Where do you want to go?
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 1,
                                lineHeight: 1.7
                            }}
                        >
                            Select your starting point
                            and destination. Raasta
                            will find the available
                            bus journey.
                        </Typography>
                    </Box>

                    {/* ROUTE FORM */}

                    <Card
                        elevation={0}
                        sx={{
                            border:
                                "1px solid #e2e8f0",
                            borderRadius: "22px"
                        }}
                    >
                        <CardContent
                            sx={{
                                p: {
                                    xs: 2,
                                    sm: 3
                                }
                            }}
                        >
                            <Stack spacing={2}>
                                <FormControl fullWidth>
                                    <InputLabel>
                                        Starting Point
                                    </InputLabel>

                                    <Select
                                        value={fromStop}
                                        label="Starting Point"
                                        onChange={(
                                            event
                                        ) =>
                                            setFromStop(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        renderValue={(
                                            value
                                        ) => {
                                            const stop =
                                                cityStops.find(
                                                    (
                                                        item
                                                    ) =>
                                                        item._id ===
                                                        value
                                                );

                                            return stop ? (
                                                <StopLabel
                                                    stop={
                                                        stop
                                                    }
                                                />
                                            ) : (
                                                "Select starting point"
                                            );
                                        }}
                                        sx={{
                                            borderRadius:
                                                "14px"
                                        }}
                                    >
                                        {cityStops.map(
                                            (stop) => (
                                                <MenuItem
                                                    key={
                                                        stop._id
                                                    }
                                                    value={
                                                        stop._id
                                                    }
                                                >
                                                    <StopLabel
                                                        stop={
                                                            stop
                                                        }
                                                    />
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>

                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "center"
                                    }}
                                >
                                    <IconButton
                                        onClick={
                                            handleSwap
                                        }
                                        disabled={
                                            !fromStop &&
                                            !toStop
                                        }
                                        sx={{
                                            border:
                                                "1px solid #cbd5e1",
                                            bgcolor:
                                                "#fff",
                                            "&:hover":
                                                {
                                                    bgcolor:
                                                        "#f8fafc"
                                                }
                                        }}
                                    >
                                        <SwapVertIcon />
                                    </IconButton>
                                </Box>

                                <FormControl fullWidth>
                                    <InputLabel>
                                        Destination
                                    </InputLabel>

                                    <Select
                                        value={toStop}
                                        label="Destination"
                                        onChange={(
                                            event
                                        ) =>
                                            setToStop(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        renderValue={(
                                            value
                                        ) => {
                                            const stop =
                                                cityStops.find(
                                                    (
                                                        item
                                                    ) =>
                                                        item._id ===
                                                        value
                                                );

                                            return stop ? (
                                                <StopLabel
                                                    stop={
                                                        stop
                                                    }
                                                />
                                            ) : (
                                                "Select destination"
                                            );
                                        }}
                                        sx={{
                                            borderRadius:
                                                "14px"
                                        }}
                                    >
                                        {cityStops.map(
                                            (stop) => (
                                                <MenuItem
                                                    key={
                                                        stop._id
                                                    }
                                                    value={
                                                        stop._id
                                                    }
                                                >
                                                    <StopLabel
                                                        stop={
                                                            stop
                                                        }
                                                    />
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>

                                {error && (
                                    <Alert
                                        severity="error"
                                        sx={{
                                            borderRadius:
                                                "12px"
                                        }}
                                    >
                                        {error}
                                    </Alert>
                                )}

                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    onClick={
                                        handleFindRoute
                                    }
                                    startIcon={
                                        loading ? (
                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />
                                        ) : (
                                            <RouteIcon />
                                        )
                                    }
                                    sx={{
                                        borderRadius:
                                            "14px",
                                        py: 1.5,
                                        fontWeight: 800,
                                        textTransform:
                                            "none"
                                    }}
                                >
                                    {loading
                                        ? "Finding Route..."
                                        : "Find My Route"}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* RESULTS */}

                    {results && (
                        <Box>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                sx={{
                                    alignItems:
                                        "center",
                                    mb: 2
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 900
                                        }}
                                    >
                                        Your Route
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        {results.count ||
                                            0}{" "}
                                        route
                                        {results.count ===
                                        1
                                            ? ""
                                            : "s"}{" "}
                                        found
                                    </Typography>
                                </Box>

                                <IconButton
                                    onClick={
                                        handleFindRoute
                                    }
                                    disabled={loading}
                                    title="Search again"
                                >
                                    <AutorenewIcon />
                                </IconButton>
                            </Stack>

                            <RouteResults
                                results={results}
                            />
                        </Box>
                    )}
                </Stack>
            </Container>
        </Box>
    );
}