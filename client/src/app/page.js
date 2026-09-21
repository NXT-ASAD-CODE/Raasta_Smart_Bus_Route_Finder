"use client";

import { useEffect, useState } from "react";

import {
    Alert,
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
    const [initialLoading, setInitialLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setInitialLoading(true);

                await Promise.all([
                    loadCities(),
                    loadStops()
                ]);
            } finally {
                setInitialLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const loadCities = async () => {
        try {
            const response = await getCities();

            setCities(response.data || []);
        } catch (error) {
            console.error(
                "Failed to load cities:",
                error
            );
        }
    };

    const loadStops = async () => {
        try {
            const response = await getStops();

            setStops(response.data || []);
        } catch (error) {
            console.error(
                "Failed to load stops:",
                error
            );
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

    if (initialLoading) {
        return (
            <Box
                sx={{
                    minHeight:
                        "calc(100svh - 76px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                        "linear-gradient(135deg, #f8fbff 0%, #eef6ff 50%, #ffffff 100%)"
                }}
            >
                <CircularProgress
                    sx={{
                        color: "#1976d2"
                    }}
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "calc(100svh - 76px)",
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
                    width: {
                        xs: 220,
                        sm: 300,
                        md: 350
                    },
                    height: {
                        xs: 220,
                        sm: 300,
                        md: 350
                    },
                    borderRadius: "50%",
                    background:
                        "rgba(25, 118, 210, 0.07)",
                    top: {
                        xs: -100,
                        md: -150
                    },
                    right: {
                        xs: -100,
                        md: -100
                    },
                    pointerEvents: "none"
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    width: {
                        xs: 200,
                        sm: 260,
                        md: 300
                    },
                    height: {
                        xs: 200,
                        sm: 260,
                        md: 300
                    },
                    borderRadius: "50%",
                    background:
                        "rgba(25, 118, 210, 0.05)",
                    bottom: -130,
                    left: -100,
                    pointerEvents: "none"
                }}
            />

            {!selectedCity ? (
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 4
                        },
                        overflow: "hidden"
                    }}
                >
                    {/* Background circle */}

                    <Box
                        sx={{
                            position: "absolute",
                            width: {
                                xs: 220,
                                md: 360
                            },
                            height: {
                                xs: 220,
                                md: 360
                            },
                            borderRadius: "50%",
                            backgroundColor:
                                "rgba(25, 118, 210, 0.06)",
                            top: {
                                xs: -100,
                                md: -150
                            },
                            right: {
                                xs: -100,
                                md: -80
                            },
                            pointerEvents: "none"
                        }}
                    />

                    {/* Main content */}

                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1200,
                            mx: "auto",
                            textAlign: "center",
                            position: "relative",
                            zIndex: 1,

                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",

                            transform: {
                                xs: "none",
                                sm: "translateY(-5px)",
                                md: "translateY(-8px)"
                            }
                        }}
                    >
                        {/* Badge */}

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
                                mb: {
                                    xs: 2,
                                    sm: 2.2,
                                    md: 2.5
                                },
                                px: {
                                    xs: 0.5,
                                    sm: 1
                                },
                                py: {
                                    xs: 1.8,
                                    sm: 2
                                },
                                height: "auto",
                                marginTop: "-50px",
                                borderRadius: "50px",
                                backgroundColor: "#e3f2fd",
                                color: "#1565c0",
                                fontWeight: 700,
                                letterSpacing: {
                                    xs: "0.5px",
                                    sm: "1px"
                                },
                                fontSize: {
                                    xs: "0.72rem",
                                    sm: "0.82rem",
                                    md: "0.88rem"
                                }
                            }}
                        />

                        {/* Raasta */}

                        <Typography
                            component="h1"
                            sx={{
                                fontWeight: 900,
                                fontSize: {
                                    xs: "clamp(3.8rem, 15vw, 5rem)",
                                    sm: "clamp(4.5rem, 10vw, 6.5rem)",
                                    md: "clamp(5rem, 8vw, 7rem)"
                                },
                                lineHeight: 0.9,
                                letterSpacing: {
                                    xs: "-3px",
                                    sm: "-4px",
                                    md: "-6px"
                                },
                                color: "#111827",
                                mb: {
                                    xs: 1.5,
                                    sm: 1.5,
                                    md: 1.8
                                }
                            }}
                        >
                            Raasta
                        </Typography>

                        {/* Subtitle */}

                        <Typography
                            component="h2"
                            sx={{
                                fontSize: {
                                    xs: "1.35rem",
                                    sm: "1.9rem",
                                    md: "2.5rem"
                                },
                                fontWeight: 800,
                                lineHeight: 1.15,
                                color: "#1976d2",

                                mb: {
                                    xs: 1.5,
                                    sm: 1.5,
                                    md: 1.8
                                }
                            }}
                        >
                            Your Journey Starts Here.
                        </Typography>

                        {/* Description */}

                        <Typography
                            sx={{
                                maxWidth: {
                                    xs: 350,
                                    sm: 650,
                                    md: 850
                                },
                                mx: "auto",
                                color: "#64748b",

                                fontSize: {
                                    xs: "0.9rem",
                                    sm: "1rem",
                                    md: "1.08rem"
                                },

                                lineHeight: 1.65,

                                mb: {
                                    xs: 2,
                                    sm: 2.3,
                                    md: 2.5
                                }
                            }}
                        >
                            Tell us where you are and where you want to
                            go. Raasta helps you understand which bus
                            route to take and how to reach your
                            destination.
                        </Typography>

                        {/* Route visual */}

                        <Box
                            sx={{
                                width: {
                                    xs: "88%",
                                    sm: "75%",
                                    md: 850
                                },
                                maxWidth: 850,
                                mx: "auto",

                                mb: {
                                    xs: 2,
                                    sm: 2.3,
                                    md: 2.5
                                },

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {/* Starting point */}

                            <Box
                                sx={{
                                    width: {
                                        xs: 14,
                                        sm: 17
                                    },
                                    height: {
                                        xs: 14,
                                        sm: 17
                                    },
                                    flexShrink: 0,
                                    borderRadius: "50%",
                                    backgroundColor: "#1976d2",
                                    boxShadow:
                                        "0 0 0 7px rgba(25,118,210,0.12)"
                                }}
                            />

                            {/* Line */}

                            <Box
                                sx={{
                                    height: 3,
                                    flex: 1,
                                    background:
                                        "linear-gradient(90deg, #1976d2, #90caf9)"
                                }}
                            />

                            {/* Bus */}

                            <DirectionsBusIcon
                                sx={{
                                    flexShrink: 0,
                                    fontSize: {
                                        xs: 42,
                                        sm: 48,
                                        md: 54
                                    },
                                    color: "#1976d2",
                                    mx: {
                                        xs: 1,
                                        sm: 1.5,
                                        md: 2
                                    }
                                }}
                            />

                            {/* Line */}

                            <Box
                                sx={{
                                    height: 3,
                                    flex: 1,
                                    background:
                                        "linear-gradient(90deg, #90caf9, #1976d2)"
                                }}
                            />

                            {/* Destination */}

                            <Box
                                sx={{
                                    width: {
                                        xs: 14,
                                        sm: 17
                                    },
                                    height: {
                                        xs: 14,
                                        sm: 17
                                    },
                                    flexShrink: 0,
                                    borderRadius: "50%",
                                    backgroundColor: "#1565c0",
                                    boxShadow:
                                        "0 0 0 7px rgba(21,101,192,0.12)"
                                }}
                            />
                        </Box>

                        {/* MAIN BUTTON */}

                        <Button
                            variant="contained"
                            onClick={() =>
                                setCityDialogOpen(true)
                            }
                            startIcon={<LocationOnIcon />}
                            disableElevation
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "auto"
                                },

                                maxWidth: {
                                    xs: 400,
                                    sm: "none"
                                },

                                minWidth: {
                                    sm: 380,
                                    md: 470
                                },

                                px: {
                                    xs: 2,
                                    sm: 4,
                                    md: 5
                                },

                                py: {
                                    xs: 1.25,
                                    sm: 1.4,
                                    md: 1.5
                                },

                                borderRadius: "50px",

                                textTransform: "none",

                                fontSize: {
                                    xs: "0.9rem",
                                    sm: "1rem",
                                    md: "1.05rem"
                                },

                                fontWeight: 700,

                                whiteSpace: "nowrap",

                                backgroundColor: "#1976d2",

                                boxShadow:
                                    "0 8px 25px rgba(25,118,210,0.28)",

                                "&:hover": {
                                    backgroundColor: "#1565c0",
                                    boxShadow:
                                        "0 10px 30px rgba(25,118,210,0.4)"
                                }
                            }}
                        >
                            Select Your City to Check the Route
                        </Button>
                    </Box>
                </Box>
            ) : (
                /* =====================================================
                   ROUTE FINDER
                ====================================================== */

                <Box
                    sx={{
                        minHeight: "calc(100svh - 76px)",
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
                                    Find the best bus route for
                                    your journey.
                                </Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                startIcon={
                                    <LocationOnIcon />
                                }
                                onClick={() =>
                                    setCityDialogOpen(true)
                                }
                                sx={{
                                    textTransform:
                                        "none",
                                    borderRadius: "12px",
                                    fontWeight: 700,
                                    borderColor:
                                        "#90caf9",
                                    color: "#1565c0"
                                }}
                            >
                                {selectedCity.name}
                            </Button>
                        </Box>

                        {/* Route search card */}

                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: "24px",
                                border:
                                    "1px solid #dbe5f0",
                                backgroundColor:
                                    "#ffffff",
                                mb: 4
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
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        gap: 1,
                                        mb: 3
                                    }}
                                >
                                    <RouteIcon
                                        sx={{
                                            color: "#1976d2"
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            fontSize:
                                                "1.25rem",
                                            color: "#0f172a"
                                        }}
                                    >
                                        Plan Your Journey
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            md: "1fr auto 1fr"
                                        },
                                        gap: 2,
                                        alignItems: "end"
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
                                            value={fromStop}
                                            onChange={(event) =>
                                                setFromStop(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            displayEmpty
                                            IconComponent={
                                                KeyboardArrowDownIcon
                                            }
                                            renderValue={(
                                                selectedId
                                            ) => {
                                                if (
                                                    !selectedId
                                                ) {
                                                    return (
                                                        <Box
                                                            sx={{
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 1,
                                                                color:
                                                                    "#64748b"
                                                            }}
                                                        >
                                                            <LocationOnIcon
                                                                sx={{
                                                                    color:
                                                                        "#1976d2"
                                                                }}
                                                            />

                                                            Choose
                                                            your
                                                            starting
                                                            stop
                                                        </Box>
                                                    );
                                                }

                                                const stop =
                                                    cityStops.find(
                                                        (
                                                            item
                                                        ) =>
                                                            item._id ===
                                                            selectedId
                                                    );

                                                return stop ? (
                                                    <StopLabel
                                                        stop={
                                                            stop
                                                        }
                                                    />
                                                ) : (
                                                    ""
                                                );
                                            }}
                                            sx={selectStyles}
                                        >
                                            <MenuItem
                                                value=""
                                                disabled
                                            >
                                                Choose your
                                                starting stop
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
                                                        <StopLabel
                                                            stop={
                                                                stop
                                                            }
                                                        />
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
                                            pb: {
                                                xs: 0,
                                                md: 0.3
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
                                            onChange={(event) =>
                                                setToStop(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            displayEmpty
                                            IconComponent={
                                                KeyboardArrowDownIcon
                                            }
                                            renderValue={(
                                                selectedId
                                            ) => {
                                                if (
                                                    !selectedId
                                                ) {
                                                    return (
                                                        <Box
                                                            sx={{
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 1,
                                                                color:
                                                                    "#64748b"
                                                            }}
                                                        >
                                                            <FlagIcon
                                                                sx={{
                                                                    color:
                                                                        "#1976d2"
                                                                }}
                                                            />

                                                            Choose
                                                            your
                                                            destination
                                                        </Box>
                                                    );
                                                }

                                                const stop =
                                                    cityStops.find(
                                                        (
                                                            item
                                                        ) =>
                                                            item._id ===
                                                            selectedId
                                                    );

                                                return stop ? (
                                                    <StopLabel
                                                        stop={
                                                            stop
                                                        }
                                                    />
                                                ) : (
                                                    ""
                                                );
                                            }}
                                            sx={selectStyles}
                                        >
                                            <MenuItem
                                                value=""
                                                disabled
                                            >
                                                Choose your
                                                destination
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
                                                        <StopLabel
                                                            stop={
                                                                stop
                                                            }
                                                        />
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </Box>
                                </Box>

                                {/* Error */}

                                {error && (
                                    <Alert
                                        severity="error"
                                        onClose={() =>
                                            setError("")
                                        }
                                        sx={{
                                            mt: 3,
                                            borderRadius:
                                                "14px"
                                        }}
                                    >
                                        {error}
                                    </Alert>
                                )}

                                {/* Search button */}

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
                                                color="inherit"
                                            />
                                        ) : (
                                            <SearchIcon />
                                        )
                                    }
                                    disableElevation
                                    sx={{
                                        mt: 3,
                                        py: 1.5,
                                        borderRadius:
                                            "14px",
                                        textTransform:
                                            "none",
                                        fontWeight: 800,
                                        fontSize: "1rem",
                                        backgroundColor:
                                            "#1976d2",
                                        "&:hover": {
                                            backgroundColor:
                                                "#1565c0"
                                        }
                                    }}
                                >
                                    {loading
                                        ? "Finding Route..."
                                        : "Find My Route"}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Results */}

                        {results && (
                            <RouteResults
                                results={results}
                            />
                        )}
                    </Box>
                </Box>
            )}

            {/* City Selection Dialog */}

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
                        color: "#0f172a"
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: "1.4rem"
                            }}
                        >
                            Select Your City
                        </Typography>

                        <Typography
                            sx={{
                                color: "#64748b",
                                fontSize:
                                    "0.9rem",
                                mt: 0.5
                            }}
                        >
                            Choose a city to find bus routes.
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={() =>
                            setCityDialogOpen(false)
                        }
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    {cities.length === 0 ? (
                        <Box
                            sx={{
                                py: 5,
                                textAlign: "center"
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#64748b"
                                }}
                            >
                                No cities are available yet.
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={1.5} sx={{ pb: 2 }}>
                            {cities.map((city) => (
                                <Button
                                    key={city._id}
                                    onClick={() =>
                                        handleCitySelect(
                                            city
                                        )
                                    }
                                    fullWidth
                                    sx={{
                                        justifyContent:
                                            "flex-start",
                                        textAlign: "left",
                                        textTransform:
                                            "none",
                                        p: 2,
                                        borderRadius:
                                            "14px",
                                        border:
                                            "1px solid #e2e8f0",
                                        color: "#0f172a",
                                        "&:hover": {
                                            backgroundColor:
                                                "#f0f7ff",
                                            borderColor:
                                                "#90caf9"
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius:
                                                "12px",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            backgroundColor:
                                                "#e3f2fd",
                                            color: "#1976d2",
                                            mr: 2,
                                            flexShrink: 0
                                        }}
                                    >
                                        <LocationOnIcon />
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize:
                                                    "1rem"
                                            }}
                                        >
                                            {city.name}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color:
                                                    "#64748b",
                                                fontSize:
                                                    "0.85rem"
                                            }}
                                        >
                                            {city.province
                                                ? `${city.province}, `
                                                : ""}
                                            {city.country ||
                                                "Pakistan"}
                                        </Typography>
                                    </Box>
                                </Button>
                            ))}
                        </Stack>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}

/* =========================================================
   SELECT STYLES
========================================================= */

const selectStyles = {
    borderRadius: "16px",
    backgroundColor: "#f8fafc",

    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#dbe3ec"
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#90caf9"
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1976d2"
    }
};

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
                    lang="ur"
                    dir="rtl"
                    sx={{
                        fontSize: {
                            xs: "1.15rem",
                            sm: "1.3rem",
                            md: "1.45rem"
                        },
                        fontWeight: 800,
                        color: "#1976d2",
                        lineHeight: 1.7,
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

function FeatureCard({ icon, title, text }) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: "18px",
                border:
                    "1px solid rgba(25,118,210,0.12)",
                backgroundColor:
                    "rgba(255,255,255,0.72)"
            }}
        >
            <CardContent
                sx={{
                    py: 2,
                    "&:last-child": {
                        pb: 2
                    }
                }}
            >
                <Typography
                    sx={{
                        fontSize: "1.5rem",
                        mb: 0.5
                    }}
                >
                    {icon}
                </Typography>

                <Typography
                    sx={{
                        fontWeight: 800,
                        color: "#0f172a",
                        fontSize: "0.95rem"
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        color: "#64748b",
                        fontSize: "0.78rem",
                        mt: 0.5
                    }}
                >
                    {text}
                </Typography>
            </CardContent>
        </Card>
    );
}

/* =========================================================
   ROUTE RESULTS
========================================================= */

function RouteResults({ results }) {
    if (!results || results.count === 0) {
        return <NoRouteCard />;
    }

    if (results.type === "direct") {
        return (
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2
                    }}
                >
                    <CheckCircleIcon
                        sx={{
                            color: "#16a34a"
                        }}
                    />

                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: "1.3rem",
                            color: "#0f172a"
                        }}
                    >
                        Direct Route Found
                    </Typography>
                </Box>

                <Stack spacing={2}>
                    {results.data.map((route, index) => (
                        <DirectRouteCard
                            key={
                                route.routeId ||
                                index
                            }
                            route={route}
                        />
                    ))}
                </Stack>
            </Box>
        );
    }

    if (results.type === "one-transfer") {
        return (
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2
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
                            fontSize: "1.3rem",
                            color: "#0f172a"
                        }}
                    >
                        1 Bus Change Required
                    </Typography>
                </Box>

                <Stack spacing={2}>
                    {results.data.map((route, index) => (
                        <TransferRouteCard
                            key={index}
                            route={route}
                        />
                    ))}
                </Stack>
            </Box>
        );
    }

    return <NoRouteCard />;
}

/* =========================================================
   DIRECT ROUTE CARD
========================================================= */

function DirectRouteCard({ route }) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: "20px",
                border:
                    "1px solid #dbe5f0",
                backgroundColor: "#ffffff"
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3
                    },
                    "&:last-child": {
                        pb: {
                            xs: 2.5,
                            sm: 3
                        }
                    }
                }}
            >
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
                        mb: 2,
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        }
                    }}
                >
                    <Box>
                        <Chip
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
                                fontWeight: 800,
                                fontSize: "1.2rem",
                                color: "#0f172a"
                            }}
                        >
                            {route.routeName}
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            color: "#64748b",
                            fontSize: "0.9rem"
                        }}
                    >
                        {route.stopCount} stops
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2.5 }} />

                <JourneyTimeline
                    stops={route.stops || []}
                />
            </CardContent>
        </Card>
    );
}

/* =========================================================
   TRANSFER ROUTE CARD
========================================================= */

/* =========================================================
   TRANSFER ROUTE CARD
========================================================= */

function TransferRouteCard({ route }) {
    const journey = route.journey || [];

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: "20px",
                border: "1px solid #dbe5f0",
                backgroundColor: "#ffffff"
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3
                    },
                    "&:last-child": {
                        pb: {
                            xs: 2.5,
                            sm: 3
                        }
                    }
                }}
            >
                {journey.map((leg, index) => (
                    <Box key={index}>
                        {/* Bus heading */}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1.5
                            }}
                        >
                            <DirectionsBusIcon
                                sx={{
                                    color: "#1976d2"
                                }}
                            />

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    color: "#0f172a"
                                }}
                            >
                                Bus {leg.routeNumber}
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748b"
                                }}
                            >
                                — {leg.routeName}
                            </Typography>
                        </Box>

                        {/* This bus's journey */}

                        <JourneyTimeline
                            stops={leg.stops || []}
                        />

                        {/* 
                            CHANGE BUS ALERT
                            Appears AFTER the current bus journey
                            and BEFORE the next bus journey.
                        */}

                        {index < journey.length - 1 && (
                            <>
                                <Box
                                    sx={{
                                        my: 3,
                                        p: 2,
                                        borderRadius: "14px",
                                        backgroundColor: "#fff8e1",
                                        border: "1px solid #fde68a",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 1.5
                                    }}
                                >
                                    <TransferWithinAStationIcon
                                        sx={{
                                            color: "#d97706",
                                            mt: 0.2
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                color: "#92400e"
                                            }}
                                        >
                                            Change Bus at
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: "#78350f",
                                                mt: 0.3,
                                                fontSize: "1rem"
                                            }}
                                        >
                                            {getTransferStopName(
                                                route.transferStop
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider
                                    sx={{
                                        mb: 3
                                    }}
                                />
                            </>
                        )}
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
}

/* =========================================================
   JOURNEY TIMELINE
========================================================= */

function JourneyTimeline({ stops = [] }) {
    if (!stops.length) {
        return (
            <Typography
                sx={{
                    color: "#64748b"
                }}
            >
                No journey stops available.
            </Typography>
        );
    }

    return (
        <Box>
            {stops.map((item, index) => {
                const stop =
                    item.stop || item;

                const isFirst = index === 0;
                const isLast =
                    index === stops.length - 1;

                return (
                    <Box
                        key={
                            stop._id ||
                            `${stop.name}-${index}`
                        }
                        sx={{
                            display: "flex",
                            gap: 2,
                            minHeight: isLast
                                ? "auto"
                                : 58
                        }}
                    >
                        {/* Timeline */}

                        <Box
                            sx={{
                                width: 22,
                                position: "relative",
                                display: "flex",
                                justifyContent:
                                    "center"
                            }}
                        >
                            {!isLast && (
                                <Box
                                    sx={{
                                        position:
                                            "absolute",
                                        top: 16,
                                        bottom: -2,
                                        width: 2,
                                        backgroundColor:
                                            "#bfdbfe"
                                    }}
                                />
                            )}

                            <Box
                                sx={{
                                    width:
                                        isFirst ||
                                        isLast
                                            ? 16
                                            : 10,
                                    height:
                                        isFirst ||
                                        isLast
                                            ? 16
                                            : 10,
                                    mt: 0.3,
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
                                        "0 0 0 1px #90caf9",
                                    zIndex: 1
                                }}
                            />
                        </Box>

                        {/* Stop information */}

                        <Box
                            sx={{
                                pb: isLast ? 0 : 2
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight:
                                        isFirst ||
                                        isLast
                                            ? 800
                                            : 600,
                                    color: "#334155"
                                }}
                            >
                                {stop.name}
                            </Typography>

                            {stop.nameUrdu && (
                                <Typography
                                    lang="ur"
                                    dir="rtl"
                                    sx={{
                                        fontSize: {
                                            xs: "1.15rem",
                                            sm: "1.3rem",
                                            md: "1.45rem"
                                        },
                                        fontWeight: 800,
                                        color: "#1976d2",
                                        lineHeight: 1.7,
                                        textAlign: "left"
                                    }}
                                >
                                    {stop.nameUrdu}
                                </Typography>
                            )}

                            {isFirst && (
                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.75rem",
                                        color:
                                            "#1976d2",
                                        fontWeight:
                                            700,
                                        mt: 0.3
                                    }}
                                >
                                    START
                                </Typography>
                            )}

                            {isLast && (
                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.75rem",
                                        color:
                                            "#1565c0",
                                        fontWeight:
                                            700,
                                        mt: 0.3
                                    }}
                                >
                                    DESTINATION
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
   TRANSFER STOP NAME
========================================================= */

function getTransferStopName(transferStop) {
    if (!transferStop) {
        return "Transfer point";
    }

    if (typeof transferStop === "string") {
        return transferStop;
    }

    return (
        transferStop.name ||
        transferStop.stop?.name ||
        "Transfer point"
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
                borderRadius: "20px",
                border:
                    "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                textAlign: "center"
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 4,
                        sm: 6
                    }
                }}
            >
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        mx: "auto",
                        mb: 2,
                        borderRadius: "18px",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        backgroundColor:
                            "#eff6ff",
                        color: "#1976d2"
                    }}
                >
                    <RouteIcon
                        sx={{
                            fontSize: 32
                        }}
                    />
                </Box>

                <Typography
                    sx={{
                        fontWeight: 800,
                        fontSize: "1.3rem",
                        color: "#0f172a",
                        mb: 1
                    }}
                >
                    No Route Found
                </Typography>

                <Typography
                    sx={{
                        color: "#64748b",
                        maxWidth: 500,
                        mx: "auto",
                        lineHeight: 1.7
                    }}
                >
                    We couldn't find a direct or one-transfer
                    route between these stops. Try choosing
                    different locations.
                </Typography>
            </CardContent>
        </Card>
    );
}