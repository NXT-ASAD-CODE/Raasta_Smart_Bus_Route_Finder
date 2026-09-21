"use client";

import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import RouteIcon from "@mui/icons-material/Route";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
    getCities,
    getStops,
    searchRoutes
} from "../services/api";

export default function Home() {
    const [cities, setCities] = useState([]);
    const [stops, setStops] = useState([]);

    const [selectedCity, setSelectedCity] = useState(null);
    const [cityDialogOpen, setCityDialogOpen] = useState(false);

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
            setCities(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const loadStops = async () => {
        try {
            const response = await getStops();
            setStops(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setCityDialogOpen(false);

        setFromStop("");
        setToStop("");
        setResults(null);
        setError("");
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

    const handleBackHome = () => {
        setSelectedCity(null);
        setFromStop("");
        setToStop("");
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
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #f8fbff 0%, #eef6ff 50%, #ffffff 100%)",
                position: "relative",
                overflow: "hidden"
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

            {!selectedCity ? (
                /* =====================================================
                   LANDING PAGE
                ====================================================== */

                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 2,
                        py: 6,
                        position: "relative"
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 900,
                            width: "100%",
                            textAlign: "center"
                        }}
                    >
                        <Chip
                            icon={
                                <DirectionsBusIcon
                                    sx={{
                                        color:
                                            "#1976d2 !important"
                                    }}
                                />
                            }
                            label="SMART PUBLIC TRANSPORT"
                            sx={{
                                mb: 3,
                                px: 1,
                                py: 2.5,
                                borderRadius: "50px",
                                backgroundColor:
                                    "#e3f2fd",
                                color: "#1565c0",
                                fontWeight: 700,
                                letterSpacing: "1px"
                            }}
                        />

                        <Typography
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                fontSize: {
                                    xs: "3.4rem",
                                    sm: "5rem",
                                    md: "6.5rem"
                                },
                                lineHeight: 0.95,
                                letterSpacing: "-4px",
                                color: "#111827",
                                mb: 2
                            }}
                        >
                            Raasta
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "1.6rem",
                                    sm: "2.2rem"
                                },
                                fontWeight: 700,
                                color: "#1976d2",
                                mb: 2
                            }}
                        >
                            Your Journey Starts Here.
                        </Typography>

                        <Typography
                            sx={{
                                maxWidth: 650,
                                mx: "auto",
                                color: "#64748b",
                                fontSize: {
                                    xs: "1rem",
                                    sm: "1.15rem"
                                },
                                lineHeight: 1.8,
                                mb: 5
                            }}
                        >
                            Tell us where you are and where you
                            want to go. Raasta helps you understand
                            which bus route to take and how to reach
                            your destination.
                        </Typography>

                        {/* Journey visual */}

                        <Box
                            sx={{
                                maxWidth: 650,
                                mx: "auto",
                                mb: 5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Box
                                sx={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: "50%",
                                    backgroundColor:
                                        "#1976d2",
                                    boxShadow:
                                        "0 0 0 7px rgba(25,118,210,0.12)"
                                }}
                            />

                            <Box
                                sx={{
                                    height: 3,
                                    flex: 1,
                                    maxWidth: 220,
                                    background:
                                        "linear-gradient(90deg, #1976d2, #90caf9)"
                                }}
                            />

                            <DirectionsBusIcon
                                sx={{
                                    fontSize: 42,
                                    color: "#1976d2",
                                    mx: 1
                                }}
                            />

                            <Box
                                sx={{
                                    height: 3,
                                    flex: 1,
                                    maxWidth: 220,
                                    background:
                                        "linear-gradient(90deg, #90caf9, #1976d2)"
                                }}
                            />

                            <Box
                                sx={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: "50%",
                                    backgroundColor:
                                        "#1565c0",
                                    boxShadow:
                                        "0 0 0 7px rgba(21,101,192,0.12)"
                                }}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            onClick={() =>
                                setCityDialogOpen(true)
                            }
                            startIcon={<LocationOnIcon />}
                            sx={{
                                backgroundColor: "#1976d2",
                                color: "#ffffff",
                                borderRadius: "50px",
                                px: {
                                    xs: 3,
                                    sm: 5
                                },
                                py: 1.7,
                                textTransform: "none",
                                fontSize: {
                                    xs: "0.95rem",
                                    sm: "1.05rem"
                                },
                                fontWeight: 700,
                                boxShadow:
                                    "0 8px 25px rgba(25,118,210,0.28)",
                                animation:
                                    "raastaPulse 2s ease-in-out infinite",

                                "&:hover": {
                                    backgroundColor:
                                        "#1565c0",
                                    boxShadow:
                                        "0 10px 30px rgba(25,118,210,0.4)"
                                },

                                "@keyframes raastaPulse": {
                                    "0%": {
                                        transform: "scale(1)"
                                    },
                                    "50%": {
                                        transform:
                                            "scale(1.04)"
                                    },
                                    "100%": {
                                        transform: "scale(1)"
                                    }
                                }
                            }}
                        >
                            Select Your City to Check the Route
                        </Button>

                        {/* Feature cards */}

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(3, 1fr)"
                                },
                                gap: 2,
                                mt: 7
                            }}
                        >
                            <FeatureCard
                                icon="🚌"
                                title="Simple Routes"
                                text="Understand your bus route easily."
                            />

                            <FeatureCard
                                icon="🔄"
                                title="Easy Transfers"
                                text="Know where to change buses."
                            />

                            <FeatureCard
                                icon="اردو"
                                title="Urdu + English"
                                text="Understand stops in both languages."
                            />
                        </Box>
                    </Box>
                </Box>
            ) : (
                /* =====================================================
                   ROUTE FINDER
                ====================================================== */

                <Box
                    sx={{
                        minHeight: "100vh",
                        py: {
                            xs: 3,
                            sm: 5
                        },
                        px: {
                            xs: 2,
                            sm: 3
                        },
                        position: "relative"
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 1050,
                            mx: "auto"
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
                                justifyContent:
                                    "space-between",
                                gap: 2,
                                mb: 4,
                                flexDirection: {
                                    xs: "column",
                                    sm: "row"
                                }
                            }}
                        >
                            <Box>
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
                                        color: "#64748b",
                                        fontWeight: 600,
                                        px: 0,
                                        mb: 1,

                                        "&:hover": {
                                            background:
                                                "transparent",
                                            color: "#1976d2"
                                        }
                                    }}
                                >
                                    Back to Home
                                </Button>

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
                                    Raasta
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#64748b",
                                        mt: 1
                                    }}
                                >
                                    Find the easiest bus route
                                    to your destination.
                                </Typography>
                            </Box>

                            <Chip
                                icon={
                                    <LocationOnIcon />
                                }
                                label={
                                    selectedCity.name
                                }
                                sx={{
                                    backgroundColor:
                                        "#e3f2fd",
                                    color: "#1565c0",
                                    fontWeight: 700,
                                    px: 1,
                                    py: 2.5,
                                    borderRadius:
                                        "50px"
                                }}
                            />
                        </Box>

                        {/* =================================================
                           SEARCH FORM
                        ================================================== */}

                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: "28px",
                                border:
                                    "1px solid #e2e8f0",
                                backgroundColor:
                                    "#ffffff",
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
                                        Where do you want
                                        to go?
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: "#64748b",
                                            mt: 0.5
                                        }}
                                    >
                                        Select your starting
                                        point and destination.
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            {
                                                xs: "1fr",
                                                md: "1fr 70px 1fr"
                                            },
                                        alignItems:
                                            "center",
                                        gap: {
                                            xs: 2,
                                            md: 1
                                        }
                                    }}
                                >
                                    {/* Starting point */}

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color:
                                                    "#334155",
                                                mb: 1
                                            }}
                                        >
                                            Starting Point
                                        </Typography>

                                        <Select
                                            fullWidth
                                            value={
                                                fromStop
                                            }
                                            onChange={(e) =>
                                                setFromStop(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            displayEmpty
                                            IconComponent={
                                                KeyboardArrowDownIcon
                                            }
                                            sx={{
                                                borderRadius:
                                                    "16px",
                                                backgroundColor:
                                                    "#f8fafc",

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
                                            <MenuItem
                                                value=""
                                                disabled
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
                                                    <LocationOnIcon
                                                        sx={{
                                                            color:
                                                                "#1976d2"
                                                        }}
                                                    />

                                                    Choose your
                                                    starting
                                                    stop
                                                </Box>
                                            </MenuItem>

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
                                                        {stop.name}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </Box>

                                    {/* Swap */}

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent:
                                                "center",
                                            alignItems:
                                                "center",
                                            pt: {
                                                xs: 0,
                                                md: 3.5
                                            }
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
                                                width: 48,
                                                height: 48,
                                                backgroundColor:
                                                    "#e3f2fd",
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
                                                color:
                                                    "#334155",
                                                mb: 1
                                            }}
                                        >
                                            Destination
                                        </Typography>

                                        <Select
                                            fullWidth
                                            value={toStop}
                                            onChange={(e) =>
                                                setToStop(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            displayEmpty
                                            IconComponent={
                                                KeyboardArrowDownIcon
                                            }
                                            sx={{
                                                borderRadius:
                                                    "16px",
                                                backgroundColor:
                                                    "#f8fafc",

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
                                            <MenuItem
                                                value=""
                                                disabled
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
                                                    <FlagIcon
                                                        sx={{
                                                            color:
                                                                "#1976d2"
                                                        }}
                                                    />

                                                    Choose your
                                                    destination
                                                </Box>
                                            </MenuItem>

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
                                                        {stop.name}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </Box>
                                </Box>

                                {/* Error */}

                                {error && (
                                    <Box
                                        sx={{
                                            mt: 3,
                                            p: 2,
                                            borderRadius:
                                                "14px",
                                            backgroundColor:
                                                "#fff1f2",
                                            border:
                                                "1px solid #fecdd3"
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color:
                                                    "#be123c",
                                                fontSize:
                                                    "0.9rem",
                                                fontWeight: 600
                                            }}
                                        >
                                            {error}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Search */}

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={
                                        handleFindRoute
                                    }
                                    disabled={loading}
                                    startIcon={
                                        loading ? (
                                            <CircularProgress
                                                size={20}
                                                sx={{
                                                    color:
                                                        "#ffffff"
                                                }}
                                            />
                                        ) : (
                                            <SearchIcon />
                                        )
                                    }
                                    sx={{
                                        mt: 4,
                                        minHeight: 58,
                                        borderRadius:
                                            "16px",
                                        backgroundColor:
                                            "#1976d2",
                                        textTransform:
                                            "none",
                                        fontSize:
                                            "1rem",
                                        fontWeight: 700,
                                        boxShadow:
                                            "0 8px 25px rgba(25,118,210,0.25)",

                                        "&:hover": {
                                            backgroundColor:
                                                "#1565c0"
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
                                        fontSize:
                                            "0.85rem"
                                    }}
                                >
                                    We'll show you the bus
                                    route and important stops
                                    along the way.
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* =================================================
                           RESULTS
                        ================================================== */}

                        {results && (
                            <Box sx={{ mt: 5 }}>
                                <Box
                                    sx={{
                                        mb: 3
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: "1.5rem",
                                                sm: "1.8rem"
                                            },
                                            fontWeight: 800,
                                            color:
                                                "#111827"
                                        }}
                                    >
                                        Your Journey
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color:
                                                "#64748b",
                                            mt: 0.5
                                        }}
                                    >
                                        Here's how you can
                                        reach your destination.
                                    </Typography>
                                </Box>

                                {results.data &&
                                results.data.length >
                                    0 ? (
                                    <Stack spacing={3}>
                                        {results.data.map(
                                            (
                                                route,
                                                index
                                            ) =>
                                                results.type ===
                                                "direct" ? (
                                                    <DirectRouteCard
                                                        key={
                                                            index
                                                        }
                                                        route={
                                                            route
                                                        }
                                                    />
                                                ) : (
                                                    <TransferRouteCard
                                                        key={
                                                            index
                                                        }
                                                        route={
                                                            route
                                                        }
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
            )}

            {/* =====================================================
               CITY DIALOG
            ====================================================== */}

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
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        fontWeight: 800,
                        fontSize: "1.5rem"
                    }}
                >
                    Select Your City

                    <IconButton
                        onClick={() =>
                            setCityDialogOpen(false)
                        }
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pb: 3 }}>
                    <Typography
                        sx={{
                            color: "#64748b",
                            mb: 3
                        }}
                    >
                        Choose your city to find available
                        bus routes.
                    </Typography>

                    <Stack spacing={1.5}>
                        {cities.map((city) => (
                            <Button
                                key={city._id}
                                onClick={() =>
                                    handleCitySelect(
                                        city
                                    )
                                }
                                variant="outlined"
                                sx={{
                                    justifyContent:
                                        "flex-start",
                                    textAlign: "left",
                                    borderRadius:
                                        "14px",
                                    p: 2,
                                    borderColor:
                                        "#e2e8f0",
                                    color: "#1e293b",
                                    textTransform:
                                        "none",
                                    fontSize: "1rem",
                                    fontWeight: 600,

                                    "&:hover": {
                                        borderColor:
                                            "#1976d2",
                                        backgroundColor:
                                            "#f0f7ff"
                                    }
                                }}
                            >
                                <LocationOnIcon
                                    sx={{
                                        color:
                                            "#1976d2",
                                        mr: 1.5
                                    }}
                                />

                                {city.name}
                            </Button>
                        ))}
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

/* =====================================================
   FEATURE CARD
===================================================== */

function FeatureCard({ icon, title, text }) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                backgroundColor:
                    "rgba(255,255,255,0.8)",

                transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                        "0 15px 35px rgba(15,23,42,0.08)"
                }
            }}
        >
            <CardContent>
                <Typography
                    sx={{
                        fontSize: "1.8rem",
                        mb: 1
                    }}
                >
                    {icon}
                </Typography>

                <Typography
                    sx={{
                        fontWeight: 700,
                        color: "#1e293b",
                        mb: 0.5
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        color: "#64748b",
                        fontSize: "0.9rem"
                    }}
                >
                    {text}
                </Typography>
            </CardContent>
        </Card>
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
            {/* Top bar */}

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
                {/* Route header */}

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
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        }
                    }}
                >
                    <Box>
                        <Chip
                            icon={
                                <DirectionsBusIcon />
                            }
                            label={`Bus ${route.routeNumber}`}
                            sx={{
                                backgroundColor:
                                    "#e3f2fd",
                                color: "#1565c0",
                                fontWeight: 800,
                                mb: 1
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize:
                                    "1.25rem",
                                fontWeight: 800,
                                color: "#1e293b"
                            }}
                        >
                            {route.routeName}
                        </Typography>
                    </Box>

                    <Chip
                        icon={
                            <CheckCircleIcon />
                        }
                        label="Direct Route"
                        sx={{
                            backgroundColor:
                                "#e8f5e9",
                            color: "#2e7d32",
                            fontWeight: 700
                        }}
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Journey instruction */}

                <Box
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: "16px",
                        backgroundColor:
                            "#f8fafc"
                    }}
                >
                    <Typography
                        sx={{
                            color: "#475569",
                            fontWeight: 600
                        }}
                    >
                        🚌 Take Bus{" "}
                        {route.routeNumber} and
                        stay on the bus until your
                        destination.
                    </Typography>
                </Box>

                {/* Timeline */}

                <JourneyTimeline
                    stops={route.stops}
                />
            </CardContent>
        </Card>
    );
}

/* =====================================================
   TRANSFER ROUTE CARD
===================================================== */

function TransferRouteCard({ route }) {
    const firstJourney =
        route.journey?.[0];

    const secondJourney =
        route.journey?.[1];

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
                {/* Header */}

                <Chip
                    icon={
                        <TransferWithinAStationIcon />
                    }
                    label="1 Bus Change Required"
                    sx={{
                        backgroundColor:
                            "#fff8e1",
                        color: "#b45309",
                        fontWeight: 800,
                        mb: 3
                    }}
                />

                {/* Step 1 */}

                {firstJourney && (
                    <JourneySection
                        step="1"
                        routeNumber={
                            firstJourney.routeNumber
                        }
                        routeName={
                            firstJourney.routeName
                        }
                        stops={
                            firstJourney.stops
                        }
                    />
                )}

                {/* Transfer */}

                {route.transferStop && (
                    <Box
                        sx={{
                            position: "relative",
                            my: 3,
                            ml: {
                                xs: 0,
                                sm: 1
                            }
                        }}
                    >
                        <Box
                            sx={{
                                p: 2.5,
                                borderRadius:
                                    "18px",
                                backgroundColor:
                                    "#fff8e1",
                                border:
                                    "1px dashed #f59e0b"
                            }}
                        >
                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: 1,
                                    mb: 1
                                }}
                            >
                                <TransferWithinAStationIcon
                                    sx={{
                                        color:
                                            "#f59e0b"
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontWeight:
                                            800,
                                        color:
                                            "#92400e"
                                    }}
                                >
                                    Change Bus Here
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    fontWeight:
                                        800,
                                    fontSize:
                                        "1.05rem",
                                    color:
                                        "#78350f"
                                }}
                            >
                                {
                                    route
                                        .transferStop
                                        .name
                                }
                            </Typography>

                            {route.transferStop
                                .nameUrdu && (
                                <Typography
                                    sx={{
                                        color:
                                            "#92400e",
                                        mt: 0.5
                                    }}
                                >
                                    {
                                        route
                                            .transferStop
                                            .nameUrdu
                                    }
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}

                {/* Step 2 */}

                {secondJourney && (
                    <JourneySection
                        step="2"
                        routeNumber={
                            secondJourney.routeNumber
                        }
                        routeName={
                            secondJourney.routeName
                        }
                        stops={
                            secondJourney.stops
                        }
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
                        backgroundColor:
                            "#e3f2fd",
                        color: "#1565c0",
                        fontWeight: 800
                    }}
                >
                    {step}
                </Box>

                <Box>
                    <Typography
                        sx={{
                            fontSize:
                                "0.8rem",
                            color: "#64748b",
                            fontWeight: 700,
                            textTransform:
                                "uppercase",
                            letterSpacing:
                                "0.5px"
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
                            fontSize:
                                "0.9rem"
                        }}
                    >
                        {routeName}
                    </Typography>
                </Box>
            </Box>

            <JourneyTimeline
                stops={stops}
            />
        </Box>
    );
}

/* =====================================================
   JOURNEY TIMELINE
===================================================== */

function JourneyTimeline({ stops = [] }) {
    return (
        <Box
            sx={{
                position: "relative"
            }}
        >
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

                const isLast =
                    index === stops.length - 1;

                return (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            position:
                                "relative",
                            minHeight: isLast
                                ? 55
                                : 82
                        }}
                    >
                        {/* Timeline */}

                        <Box
                            sx={{
                                width: 36,
                                display: "flex",
                                flexDirection:
                                    "column",
                                alignItems:
                                    "center",
                                flexShrink: 0
                            }}
                        >
                            <Box
                                sx={{
                                    width: isFirst ||
                                        isLast
                                        ? 18
                                        : 12,
                                    height: isFirst ||
                                        isLast
                                        ? 18
                                        : 12,
                                    borderRadius:
                                        "50%",
                                    backgroundColor:
                                        isFirst
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

                        {/* Stop information */}

                        <Box
                            sx={{
                                ml: 1,
                                pb: isLast
                                    ? 0
                                    : 2.5
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight:
                                        isFirst ||
                                        isLast
                                            ? 800
                                            : 500,
                                    fontSize:
                                        isFirst ||
                                        isLast
                                            ? "1rem"
                                            : "0.95rem",
                                    color:
                                        isFirst
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
                                    sx={{
                                        color:
                                            "#94a3b8",
                                        fontSize:
                                            "0.82rem",
                                        mt: 0.2
                                    }}
                                >
                                    {stopUrdu}
                                </Typography>
                            )}

                            {isFirst && (
                                <Typography
                                    sx={{
                                        color:
                                            "#64748b",
                                        fontSize:
                                            "0.75rem",
                                        mt: 0.3
                                    }}
                                >
                                    Your starting point
                                </Typography>
                            )}

                            {isLast && (
                                <Typography
                                    sx={{
                                        color:
                                            "#64748b",
                                        fontSize:
                                            "0.75rem",
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
                border:
                    "1px solid #e2e8f0",
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
                Try selecting different starting
                and destination stops.
            </Typography>
        </Card>
    );
}