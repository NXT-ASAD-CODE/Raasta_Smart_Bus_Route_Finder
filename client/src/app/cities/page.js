"use client";

import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Stack,
    Typography
} from "@mui/material";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";

import Link from "next/link";

import { getCities } from "../../services/api";

export default function CitiesPage() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCities = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getCities();

            setCities(response.data || []);
        } catch (error) {
            console.error(
                "Failed to load cities:",
                error
            );

            setError(
                error.message ||
                    "Unable to load cities. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCities();
    }, []);

    return (
        <Box
            sx={{
                minHeight: "calc(100svh - 76px)",
                background:
                    "linear-gradient(135deg, #f8fbff 0%, #eef6ff 50%, #ffffff 100%)",
                py: {
                    xs: 5,
                    sm: 7,
                    md: 9
                }
            }}
        >
            <Container maxWidth="lg">
                {/* HEADER */}

                <Box
                    sx={{
                        textAlign: "center",
                        mb: {
                            xs: 5,
                            md: 7
                        }
                    }}
                >
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            mx: "auto",
                            mb: 2.5,
                            borderRadius: "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2"
                        }}
                    >
                        <LocationCityIcon
                            sx={{
                                fontSize: 36
                            }}
                        />
                    </Box>

                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: 900,
                            fontSize: {
                                xs: "2.7rem",
                                sm: "3.7rem",
                                md: "4.5rem"
                            },
                            lineHeight: 1,
                            letterSpacing: "-2px",
                            color: "#111827",
                            mb: 2
                        }}
                    >
                        Cities
                    </Typography>

                    <Typography
                        sx={{
                            maxWidth: 650,
                            mx: "auto",
                            color: "#64748b",
                            fontSize: {
                                xs: "0.95rem",
                                sm: "1.05rem"
                            },
                            lineHeight: 1.8
                        }}
                    >
                        Explore the cities currently supported
                        by Raasta and find public transport
                        routes for your journey.
                    </Typography>
                </Box>

                {/* ERROR */}

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            maxWidth: 700,
                            mx: "auto",
                            mb: 4,
                            borderRadius: "14px"
                        }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                startIcon={
                                    <RefreshIcon />
                                }
                                onClick={loadCities}
                                sx={{
                                    textTransform:
                                        "none",
                                    fontWeight: 700
                                }}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {/* LOADING */}

                {loading ? (
                    <Box
                        sx={{
                            minHeight: 300,
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center"
                        }}
                    >
                        <CircularProgress
                            sx={{
                                color: "#1976d2"
                            }}
                        />
                    </Box>
                ) : cities.length === 0 ? (
                    /* EMPTY STATE */

                    <Card
                        elevation={0}
                        sx={{
                            maxWidth: 650,
                            mx: "auto",
                            borderRadius: "24px",
                            border:
                                "1px solid #dbe5f0",
                            backgroundColor:
                                "#ffffff",
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
                                    width: 70,
                                    height: 70,
                                    mx: "auto",
                                    mb: 2,
                                    borderRadius:
                                        "20px",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    backgroundColor:
                                        "#f1f5f9",
                                    color: "#64748b"
                                }}
                            >
                                <LocationCityIcon
                                    sx={{
                                        fontSize: 38
                                    }}
                                />
                            </Box>

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize:
                                        "1.5rem",
                                    color: "#0f172a",
                                    mb: 1
                                }}
                            >
                                No Cities Available
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748b",
                                    lineHeight: 1.7
                                }}
                            >
                                There are currently no
                                cities available in the
                                Raasta transport system.
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    /* CITY CARDS */

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)"
                            },
                            gap: {
                                xs: 2,
                                sm: 2.5,
                                md: 3
                            }
                        }}
                    >
                        {cities.map((city) => (
                            <CityCard
                                key={city._id}
                                city={city}
                            />
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
}

/* =========================================================
   CITY CARD
========================================================= */

function CityCard({ city }) {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                borderRadius: "22px",
                border:
                    "1px solid #dbe5f0",
                backgroundColor: "#ffffff",
                transition:
                    "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",

                "&:hover": {
                    transform:
                        "translateY(-5px)",
                    borderColor:
                        "#90caf9",
                    boxShadow:
                        "0 15px 35px rgba(25,118,210,0.12)"
                }
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
                {/* Icon */}

                <Box
                    sx={{
                        width: 54,
                        height: 54,
                        borderRadius: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            "linear-gradient(135deg, #e3f2fd, #f1f8ff)",
                        color: "#1976d2",
                        mb: 2.5
                    }}
                >
                    <DirectionsBusIcon
                        sx={{
                            fontSize: 30
                        }}
                    />
                </Box>

                {/* City */}

                <Typography
                    sx={{
                        fontWeight: 800,
                        fontSize: "1.45rem",
                        color: "#0f172a",
                        mb: 0.7
                    }}
                >
                    {city.name}
                </Typography>

                {/* Location */}

                <Typography
                    sx={{
                        color: "#64748b",
                        fontSize: "0.9rem",
                        mb: 2.5
                    }}
                >
                    {city.province
                        ? `${city.province}, `
                        : ""}
                    {city.country ||
                        "Pakistan"}
                </Typography>

                {/* Divider */}

                <Box
                    sx={{
                        height: "1px",
                        backgroundColor:
                            "#e2e8f0",
                        mb: 2
                    }}
                />

                {/* Route button */}

                <Button
                    component={Link}
                    href="/"
                    fullWidth
                    variant="contained"
                    endIcon={
                        <ArrowForwardIcon />
                    }
                    disableElevation
                    sx={{
                        textTransform:
                            "none",
                        borderRadius:
                            "12px",
                        py: 1.2,
                        fontWeight: 700,
                        backgroundColor:
                            "#1976d2",
                        "&:hover": {
                            backgroundColor:
                                "#1565c0"
                        }
                    }}
                >
                    Find Routes
                </Button>
            </CardContent>
        </Card>
    );
}