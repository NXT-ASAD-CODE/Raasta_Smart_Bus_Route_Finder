"use client";

import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    MenuItem,
    Select,
    Stack,
    Typography
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlagIcon from "@mui/icons-material/Flag";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
    getCities,
    getStops,
    searchRoutes
} from "../../services/api";

export default function FindRoutePage() {
    const [cities, setCities] = useState([]);
    const [stops, setStops] = useState([]);

    const [selectedCity, setSelectedCity] = useState(null);

    const [fromStop, setFromStop] = useState("");
    const [toStop, setToStop] = useState("");

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCities();
        loadStops();
    }, []);

    const loadCities = async () => {
        try {
            const response = await getCities();
            const cityData = response.data || [];

            setCities(cityData);

            if (cityData.length > 0) {
                setSelectedCity(cityData[0]);
            }
        } catch (error) {
            console.error(error);
            setError("Unable to load cities.");
        }
    };

    const loadStops = async () => {
        try {
            const response = await getStops();
            setStops(response.data || []);
        } catch (error) {
            console.error(error);
            setError("Unable to load bus stops.");
        }
    };

    const handleFindRoute = async () => {
        setError("");
        setResults(null);

        if (!fromStop || !toStop) {
            setError(
                "Please select both your starting point and destination."
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

            const response = await searchRoutes(
                fromStop,
                toStop
            );

            setResults(response);
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                    "Unable to find a route. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSwap = () => {
        setFromStop(toStop);
        setToStop(fromStop);
        setResults(null);
        setError("");
    };

    const cityStops = stops.filter(
        (stop) =>
            stop.city?._id === selectedCity?._id ||
            stop.city === selectedCity?._id
    );

    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 76px)",
                background:
                    "linear-gradient(135deg, #f8fbff 0%, #eef6ff 50%, #ffffff 100%)",
                position: "relative",
                overflow: "hidden",
                py: {
                    xs: 3,
                    sm: 5
                },
                px: {
                    xs: 2,
                    sm: 3
                }
            }}
        >
            {/* Background decoration */}

            <Box
                sx={{
                    position: "absolute",
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    background:
                        "rgba(25, 118, 210, 0.07)",
                    top: -150,
                    right: -100,
                    pointerEvents: "none"
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background:
                        "rgba(25, 118, 210, 0.05)",
                    bottom: -130,
                    left: -100,
                    pointerEvents: "none"
                }}
            />

            <Box
                sx={{
                    maxWidth: 1050,
                    mx: "auto",
                    position: "relative",
                    zIndex: 1
                }}
            >
                {/* Header */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center"
                        },
                        justifyContent: "space-between",
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
                                    xs: "2.5rem",
                                    sm: "3.5rem"
                                },
                                fontWeight: 800,
                                color: "#111827",
                                lineHeight: 1
                            }}
                        >
                            Find Your Route
                        </Typography>

                        <Typography
                            sx={{
                                color: "#64748b",
                                mt: 1,
                                fontSize: {
                                    xs: "0.95rem",
                                    sm: "1rem"
                                }
                            }}
                        >
                            Tell us where you are and where you
                            want to go. We'll explain the journey.
                        </Typography>
                    </Box>

                    {selectedCity && (
                        <Chip
                            icon={<LocationOnIcon />}
                            label={selectedCity.name}
                            sx={{
                                backgroundColor: "#e3f2fd",
                                color: "#1565c0",
                                fontWeight: 700,
                                px: 1,
                                py: 2.5,
                                borderRadius: "50px"
                            }}
                        />
                    )}
                </Box>

                {/* Search Form */}

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: "28px",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#ffffff",
                        boxShadow:
                            "0 20px 60px rgba(15,23,42,0.08)"
                    }}
                >
                    <CardContent
                        sx={{
                            p: {
                                xs: 2.5,
                                sm: 4
                            },
                            "&:last-child": {
                                pb: {
                                    xs: 2.5,
                                    sm: 4
                                }
                            }
                        }}
                    >
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "1.5rem",
                                        sm: "1.8rem"
                                    },
                                    fontWeight: 800,
                                    color: "#111827"
                                }}
                            >
                                Where do you want to go?
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748b",
                                    mt: 0.5
                                }}
                            >
                                Select your starting point and
                                destination.
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "1fr 70px 1fr"
                                },
                                alignItems: "center",
                                gap: {
                                    xs: 2,
                                    md: 1
                                }
                            }}
                        >
                            {/* Starting Point */}

                            <Box>
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color: "#334155",
                                        mb: 1
                                    }}
                                >
                                    Starting Point
                                </Typography>

                                <Select
                                    fullWidth
                                    value={fromStop}
                                    onChange={(e) =>
                                        setFromStop(e.target.value)
                                    }
                                    displayEmpty
                                    IconComponent={
                                        KeyboardArrowDownIcon
                                    }
                                    renderValue={(selectedId) => {
                                        if (!selectedId) {
                                            return (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                        color: "#64748b"
                                                    }}
                                                >
                                                    <LocationOnIcon
                                                        sx={{
                                                            color: "#1976d2"
                                                        }}
                                                    />

                                                    Choose your starting
                                                    stop
                                                </Box>
                                            );
                                        }

                                        const selectedStop =
                                            cityStops.find(
                                                (stop) =>
                                                    stop._id ===
                                                    selectedId
                                            );

                                        return selectedStop ? (
                                            <StopLabel
                                                stop={selectedStop}
                                            />
                                        ) : (
                                            ""
                                        );
                                    }}
                                    sx={{
                                        borderRadius: "16px",
                                        backgroundColor: "#f8fafc",

                                        "& .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "#dbe3ec"
                                            },

                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "#90caf9"
                                            },

                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "#1976d2"
                                            }
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1
                                            }}
                                        >
                                            <LocationOnIcon
                                                sx={{
                                                    color: "#1976d2"
                                                }}
                                            />

                                            Choose your starting stop
                                        </Box>
                                    </MenuItem>

                                    {cityStops.map((stop) => (
                                        <MenuItem
                                            key={stop._id}
                                            value={stop._id}
                                        >
                                            <StopLabel stop={stop} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>

                            {/* Swap */}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    pt: {
                                        xs: 0,
                                        md: 3.5
                                    }
                                }}
                            >
                                <IconButton
                                    onClick={handleSwap}
                                    disabled={
                                        !fromStop && !toStop
                                    }
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        backgroundColor: "#e3f2fd",
                                        color: "#1976d2",
                                        border:
                                            "1px solid #bbdefb",

                                        "&:hover": {
                                            backgroundColor:
                                                "#bbdefb"
                                        }
                                    }}
                                >
                                    <SwapVertIcon />
                                </IconButton>
                            </Box>

                            {/* Destination */}

                            <Box>
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color: "#334155",
                                        mb: 1
                                    }}
                                >
                                    Destination
                                </Typography>

                                <Select
                                    fullWidth
                                    value={toStop}
                                    onChange={(e) =>
                                        setToStop(e.target.value)
                                    }
                                    displayEmpty
                                    IconComponent={
                                        KeyboardArrowDownIcon
                                    }
                                    renderValue={(selectedId) => {
                                        if (!selectedId) {
                                            return (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                        color: "#64748b"
                                                    }}
                                                >
                                                    <FlagIcon
                                                        sx={{
                                                            color: "#1976d2"
                                                        }}
                                                    />

                                                    Choose your
                                                    destination
                                                </Box>
                                            );
                                        }

                                        const selectedStop =
                                            cityStops.find(
                                                (stop) =>
                                                    stop._id ===
                                                    selectedId
                                            );

                                        return selectedStop ? (
                                            <StopLabel
                                                stop={selectedStop}
                                            />
                                        ) : (
                                            ""
                                        );
                                    }}
                                    sx={{
                                        borderRadius: "16px",
                                        backgroundColor: "#f8fafc",

                                        "& .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "#dbe3ec"
                                            },

                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "#90caf9"
                                            },

                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "#1976d2"
                                            }
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1
                                            }}
                                        >
                                            <FlagIcon
                                                sx={{
                                                    color: "#1976d2"
                                                }}
                                            />

                                            Choose your destination
                                        </Box>
                                    </MenuItem>

                                    {cityStops.map((stop) => (
                                        <MenuItem
                                            key={stop._id}
                                            value={stop._id}
                                        >
                                            <StopLabel stop={stop} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>

                        {/* Error */}

                        {error && (
                            <Box
                                sx={{
                                    mt: 3,
                                    p: 2,
                                    borderRadius: "14px",
                                    backgroundColor: "#fff1f2",
                                    border:
                                        "1px solid #fecdd3"
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "#be123c",
                                        fontSize: "0.9rem",
                                        fontWeight: 600
                                    }}
                                >
                                    {error}
                                </Typography>
                            </Box>
                        )}

                        {/* Search Button */}

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleFindRoute}
                            disabled={loading || !selectedCity}
                            startIcon={
                                loading ? (
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            color: "#ffffff"
                                        }}
                                    />
                                ) : (
                                    <SearchIcon />
                                )
                            }
                            sx={{
                                mt: 4,
                                minHeight: 58,
                                borderRadius: "16px",
                                backgroundColor: "#1976d2",
                                textTransform: "none",
                                fontSize: "1rem",
                                fontWeight: 700,
                                boxShadow:
                                    "0 8px 25px rgba(25,118,210,0.25)",

                                "&:hover": {
                                    backgroundColor: "#1565c0"
                                }
                            }}
                        >
                            {loading
                                ? "Finding Your Route..."
                                : "Find My Route"}
                        </Button>

                        <Typography
                            sx={{
                                textAlign: "center",
                                mt: 2,
                                color: "#94a3b8",
                                fontSize: "0.85rem"
                            }}
                        >
                            We'll show you the bus route and
                            important stops along the way.
                        </Typography>
                    </CardContent>
                </Card>

                {/* Results */}

                {results && (
                    <Box sx={{ mt: 5 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "1.5rem",
                                        sm: "1.8rem"
                                    },
                                    fontWeight: 800,
                                    color: "#111827"
                                }}
                            >
                                Your Journey
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748b",
                                    mt: 0.5
                                }}
                            >
                                Here's how you can reach your
                                destination.
                            </Typography>
                        </Box>

                        {results.data &&
                        results.data.length > 0 ? (
                            <Stack spacing={3}>
                                {results.data.map(
                                    (route, index) =>
                                        results.type ===
                                        "direct" ? (
                                            <DirectRouteCard
                                                key={index}
                                                route={route}
                                            />
                                        ) : (
                                            <TransferRouteCard
                                                key={index}
                                                route={route}
                                            />
                                        )
                                )}
                            </Stack>
                        ) : (
                            <NoRouteCard />
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

/* =====================================================
   STOP LABEL
===================================================== */

function StopLabel({ stop }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5
            }}
        >
            {stop.nameUrdu && (
                <Typography
                    component="span"
                    lang="ur"
                    dir="rtl"
                    sx={{
                        fontSize: "1.4rem",
                        fontWeight: 600,
                        lineHeight: 1.8,
                        color: "#0f172a"
                    }}
                >
                    {stop.nameUrdu}
                </Typography>
            )}

            <Typography component="span">
                {stop.name}
            </Typography>
        </Box>
    );
}

/* =====================================================
   DIRECT ROUTE CARD
===================================================== */

function DirectRouteCard({ route }) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: "24px",
                border: "1px solid #dbeafe",
                backgroundColor: "#ffffff",
                overflow: "hidden",
                boxShadow:
                    "0 12px 35px rgba(15,23,42,0.06)"
            }}
        >
            <Box
                sx={{
                    height: 7,
                    background:
                        "linear-gradient(90deg, #1976d2, #64b5f6)"
                }}
            />

            <CardContent
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 4
                    }
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center"
                        },
                        gap: 2,
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        }
                    }}
                >
                    <Box>
                        <Chip
                            icon={<DirectionsBusIcon />}
                            label={`Bus ${route.routeNumber}`}
                            sx={{
                                backgroundColor: "#e3f2fd",
                                color: "#1565c0",
                                fontWeight: 800,
                                mb: 1
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: "1.25rem",
                                fontWeight: 800,
                                color: "#1e293b"
                            }}
                        >
                            {route.routeName}
                        </Typography>
                    </Box>

                    <Chip
                        icon={<CheckCircleIcon />}
                        label="Direct Route"
                        sx={{
                            backgroundColor: "#e8f5e9",
                            color: "#2e7d32",
                            fontWeight: 700
                        }}
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: "16px",
                        backgroundColor: "#f8fafc"
                    }}
                >
                    <Typography
                        sx={{
                            color: "#475569",
                            fontWeight: 600
                        }}
                    >
                        🚌 Take Bus {route.routeNumber} and
                        stay on the bus until your destination.
                    </Typography>
                </Box>

                <JourneyTimeline stops={route.stops} />
            </CardContent>
        </Card>
    );
}

/* =====================================================
   TRANSFER ROUTE CARD
===================================================== */

function TransferRouteCard({ route }) {
    const firstJourney = route.journey?.[0];
    const secondJourney = route.journey?.[1];

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                overflow: "hidden",
                boxShadow:
                    "0 12px 35px rgba(15,23,42,0.06)"
            }}
        >
            <Box
                sx={{
                    height: 7,
                    background:
                        "linear-gradient(90deg, #1976d2, #f59e0b)"
                }}
            />

            <CardContent
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 4
                    }
                }}
            >
                <Chip
                    icon={<TransferWithinAStationIcon />}
                    label="1 Bus Change Required"
                    sx={{
                        backgroundColor: "#fff8e1",
                        color: "#b45309",
                        fontWeight: 800,
                        mb: 3
                    }}
                />

                {firstJourney && (
                    <JourneySection
                        step="1"
                        routeNumber={firstJourney.routeNumber}
                        routeName={firstJourney.routeName}
                        stops={firstJourney.stops}
                    />
                )}

                {route.transferStop && (
                    <Box
                        sx={{
                            position: "relative",
                            my: 3
                        }}
                    >
                        <Box
                            sx={{
                                p: 2.5,
                                borderRadius: "18px",
                                backgroundColor: "#fff8e1",
                                border:
                                    "1px dashed #f59e0b"
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1
                                }}
                            >
                                <TransferWithinAStationIcon
                                    sx={{
                                        color: "#f59e0b"
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        color: "#92400e"
                                    }}
                                >
                                    Change Bus Here
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    columnGap: 1.5
                                }}
                            >
                                <Typography
                                    component="span"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: "1.05rem",
                                        color: "#78350f"
                                    }}
                                >
                                    {route.transferStop.name}
                                </Typography>

                                {route.transferStop.nameUrdu && (
                                    <Typography
                                        component="span"
                                        lang="ur"
                                        dir="rtl"
                                        sx={{
                                            color: "#78350f",
                                            fontSize: "1.4rem",
                                            fontWeight: 600,
                                            lineHeight: 1.8
                                        }}
                                    >
                                        {route.transferStop.nameUrdu}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}

                {secondJourney && (
                    <JourneySection
                        step="2"
                        routeNumber={secondJourney.routeNumber}
                        routeName={secondJourney.routeName}
                        stops={secondJourney.stops}
                    />
                )}
            </CardContent>
        </Card>
    );
}

/* =====================================================
   JOURNEY SECTION
===================================================== */

function JourneySection({
    step,
    routeNumber,
    routeName,
    stops
}) {
    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3
                }}
            >
                <Box
                    sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#e3f2fd",
                        color: "#1565c0",
                        fontWeight: 800
                    }}
                >
                    {step}
                </Box>

                <Box>
                    <Typography
                        sx={{
                            fontSize: "0.8rem",
                            color: "#64748b",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}
                    >
                        Take this bus
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 800,
                            color: "#1e293b"
                        }}
                    >
                        Bus {routeNumber}
                    </Typography>

                    <Typography
                        sx={{
                            color: "#64748b",
                            fontSize: "0.9rem"
                        }}
                    >
                        {routeName}
                    </Typography>
                </Box>
            </Box>

            <JourneyTimeline stops={stops} />
        </Box>
    );
}

/* =====================================================
   JOURNEY TIMELINE
===================================================== */

function JourneyTimeline({ stops = [] }) {
    return (
        <Box sx={{ position: "relative" }}>
            {stops.map((stop, index) => {
                const stopName =
                    typeof stop === "string"
                        ? stop
                        : stop?.name ||
                          stop?.stop?.name ||
                          "Unknown Stop";

                const stopUrdu =
                    typeof stop === "object"
                        ? stop?.nameUrdu ||
                          stop?.stop?.nameUrdu
                        : null;

                const isFirst = index === 0;
                const isLast = index === stops.length - 1;

                return (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            position: "relative",
                            minHeight: isLast ? 55 : 82
                        }}
                    >
                        {/* Timeline */}

                        <Box
                            sx={{
                                width: 36,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                flexShrink: 0
                            }}
                        >
                            <Box
                                sx={{
                                    width:
                                        isFirst || isLast
                                            ? 18
                                            : 12,
                                    height:
                                        isFirst || isLast
                                            ? 18
                                            : 12,
                                    borderRadius: "50%",
                                    backgroundColor: isFirst
                                        ? "#1976d2"
                                        : isLast
                                        ? "#1565c0"
                                        : "#90caf9",
                                    border:
                                        "3px solid #ffffff",
                                    boxShadow:
                                        "0 0 0 2px #bbdefb",
                                    zIndex: 2,
                                    mt: 0.5
                                }}
                            />

                            {!isLast && (
                                <Box
                                    sx={{
                                        width: 3,
                                        flex: 1,
                                        backgroundColor:
                                            "#cbdff5"
                                    }}
                                />
                            )}
                        </Box>

                        {/* Stop Information */}

                        <Box
                            sx={{
                                ml: 1,
                                pb: isLast ? 0 : 2.5
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    columnGap: 1.5
                                }}
                            >
                                <Typography
                                    component="span"
                                    sx={{
                                        fontWeight:
                                            isFirst || isLast
                                                ? 800
                                                : 500,
                                        fontSize:
                                            isFirst || isLast
                                                ? "1rem"
                                                : "0.95rem",
                                        color: isFirst
                                            ? "#1565c0"
                                            : isLast
                                            ? "#0f172a"
                                            : "#475569"
                                    }}
                                >
                                    {stopName}
                                </Typography>

                                {stopUrdu && (
                                    <Typography
                                        component="span"
                                        lang="ur"
                                        dir="rtl"
                                        sx={{
                                            color: "#0f172a",
                                            fontSize: "1.4rem",
                                            fontWeight: 600,
                                            lineHeight: 1.8
                                        }}
                                    >
                                        {stopUrdu}
                                    </Typography>
                                )}
                            </Box>

                            {isFirst && (
                                <Typography
                                    sx={{
                                        color: "#64748b",
                                        fontSize: "0.75rem",
                                        mt: 0.3
                                    }}
                                >
                                    Your starting point
                                </Typography>
                            )}

                            {isLast && (
                                <Typography
                                    sx={{
                                        color: "#64748b",
                                        fontSize: "0.75rem",
                                        mt: 0.3
                                    }}
                                >
                                    Your destination
                                </Typography>
                            )}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}

/* =====================================================
   NO ROUTE
===================================================== */

function NoRouteCard() {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: "22px",
                border: "1px solid #e2e8f0",
                textAlign: "center",
                p: 5
            }}
        >
            <DirectionsBusIcon
                sx={{
                    fontSize: 60,
                    color: "#94a3b8",
                    mb: 1
                }}
            />

            <Typography
                sx={{
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    color: "#334155"
                }}
            >
                No route found
            </Typography>

            <Typography
                sx={{
                    color: "#64748b",
                    mt: 1
                }}
            >
                Try selecting different starting and
                destination stops.
            </Typography>
        </Card>
    );
}