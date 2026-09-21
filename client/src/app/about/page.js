"use client";

import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Stack,
    Typography
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import RouteIcon from "@mui/icons-material/Route";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Link from "next/link";

export default function AboutPage() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #f8fbff 0%, #eef6ff 50%, #ffffff 100%)",
                overflow: "hidden"
            }}
        >
            {/* HERO */}

            <Box
                sx={{
                    position: "relative",
                    py: {
                        xs: 7,
                        sm: 9,
                        md: 12
                    },
                    px: 2,
                    overflow: "hidden"
                }}
            >
                {/* Background decoration */}

                <Box
                    sx={{
                        position: "absolute",
                        width: {
                            xs: 220,
                            md: 420
                        },
                        height: {
                            xs: 220,
                            md: 420
                        },
                        borderRadius: "50%",
                        backgroundColor:
                            "rgba(25, 118, 210, 0.07)",
                        top: {
                            xs: -100,
                            md: -180
                        },
                        right: {
                            xs: -100,
                            md: -120
                        }
                    }}
                />

                <Container
                    maxWidth="md"
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        textAlign: "center"
                    }}
                >
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            mx: "auto",
                            mb: 3,
                            borderRadius: "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2"
                        }}
                    >
                        <DirectionsBusIcon
                            sx={{
                                fontSize: 36
                            }}
                        />
                    </Box>

                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: {
                                xs: "2.8rem",
                                sm: "4rem",
                                md: "5rem"
                            },
                            lineHeight: 1,
                            letterSpacing: "-3px",
                            color: "#111827",
                            mb: 2
                        }}
                    >
                        About Raasta
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: {
                                xs: "1.15rem",
                                sm: "1.4rem"
                            },
                            fontWeight: 700,
                            color: "#1976d2",
                            mb: 2
                        }}
                    >
                        Know Your Route. Know Your Way.
                    </Typography>

                    <Typography
                        sx={{
                            maxWidth: 720,
                            mx: "auto",
                            color: "#64748b",
                            fontSize: {
                                xs: "0.95rem",
                                sm: "1.1rem"
                            },
                            lineHeight: 1.8
                        }}
                    >
                        Raasta is a smart public transport route
                        finder designed to make bus journeys easier
                        to understand. Instead of making users
                        search through complicated route information,
                        Raasta explains how they can travel from one
                        stop to another.
                    </Typography>
                </Container>
            </Box>

            {/* WHAT IS RAASTA */}

            <Container
                maxWidth="lg"
                sx={{
                    pb: {
                        xs: 6,
                        md: 9
                    }
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr 1fr"
                        },
                        gap: {
                            xs: 3,
                            md: 5
                        },
                        alignItems: "stretch"
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: "24px",
                            border:
                                "1px solid #dbe5f0",
                            backgroundColor:
                                "#ffffff"
                        }}
                    >
                        <CardContent
                            sx={{
                                p: {
                                    xs: 3,
                                    sm: 4
                                }
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "1.8rem",
                                    fontWeight: 800,
                                    color: "#0f172a",
                                    mb: 2
                                }}
                            >
                                What is Raasta?
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748b",
                                    lineHeight: 1.8
                                }}
                            >
                                Raasta is a web-based public
                                transport platform that helps
                                people understand bus routes.
                                Users can select their city,
                                choose where they are starting
                                from, choose their destination,
                                and receive route information.
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748b",
                                    lineHeight: 1.8,
                                    mt: 2
                                }}
                            >
                                The goal is to make public
                                transport information simple,
                                clear, and easier to follow.
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: "24px",
                            border:
                                "1px solid #dbe5f0",
                            backgroundColor:
                                "#ffffff"
                        }}
                    >
                        <CardContent
                            sx={{
                                p: {
                                    xs: 3,
                                    sm: 4
                                }
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "1.8rem",
                                    fontWeight: 800,
                                    color: "#0f172a",
                                    mb: 2
                                }}
                            >
                                The Problem We Solve
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748b",
                                    lineHeight: 1.8
                                }}
                            >
                                Public transport users may know
                                their destination but may not
                                know which bus to take, where to
                                get on, or where they need to
                                change buses.
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748b",
                                    lineHeight: 1.8,
                                    mt: 2
                                }}
                            >
                                Raasta organizes this information
                                into a simple journey so users
                                can understand their route before
                                starting their trip.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Container>

            {/* HOW IT WORKS */}

            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    py: {
                        xs: 6,
                        md: 9
                    }
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            textAlign: "center",
                            mb: 5
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#1976d2",
                                fontWeight: 700,
                                fontSize: "0.9rem",
                                letterSpacing: "1px",
                                mb: 1
                            }}
                        >
                            HOW IT WORKS
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 900,
                                fontSize: {
                                    xs: "2rem",
                                    sm: "2.7rem"
                                },
                                color: "#111827"
                            }}
                        >
                            Your Journey in Simple Steps
                        </Typography>

                        <Typography
                            sx={{
                                maxWidth: 650,
                                mx: "auto",
                                mt: 1.5,
                                color: "#64748b",
                                lineHeight: 1.7
                            }}
                        >
                            Raasta turns route information into
                            a simple journey that is easier to
                            understand.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(4, 1fr)"
                            },
                            gap: 2
                        }}
                    >
                        <StepCard
                            number="01"
                            icon={<LocationOnIcon />}
                            title="Choose Your City"
                            text="Select the city where you want to travel."
                        />

                        <StepCard
                            number="02"
                            icon={<LocationOnIcon />}
                            title="Choose Starting Point"
                            text="Select the bus stop where your journey begins."
                        />

                        <StepCard
                            number="03"
                            icon={<FlagIcon />}
                            title="Choose Destination"
                            text="Select the stop where you want to go."
                        />

                        <StepCard
                            number="04"
                            icon={<RouteIcon />}
                            title="Get Your Route"
                            text="See the bus route and journey stops."
                        />
                    </Box>
                </Container>
            </Box>

            {/* FEATURES */}

            <Container
                maxWidth="lg"
                sx={{
                    py: {
                        xs: 6,
                        md: 9
                    }
                }}
            >
                <Box
                    sx={{
                        textAlign: "center",
                        mb: 5
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: {
                                xs: "2rem",
                                sm: "2.7rem"
                            },
                            color: "#111827"
                        }}
                    >
                        What Raasta Provides
                    </Typography>

                    <Typography
                        sx={{
                            maxWidth: 650,
                            mx: "auto",
                            mt: 1.5,
                            color: "#64748b",
                            lineHeight: 1.7
                        }}
                    >
                        The platform is designed around the
                        information passengers need during a
                        bus journey.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)"
                        },
                        gap: 2.5
                    }}
                >
                    <FeatureCard
                        icon={<DirectionsBusIcon />}
                        title="Bus Routes"
                        text="View available bus routes and understand where they travel."
                    />

                    <FeatureCard
                        icon={<RouteIcon />}
                        title="Journey Stops"
                        text="See the stops included in your selected journey."
                    />

                    <FeatureCard
                        icon={
                            <TransferWithinAStationIcon />
                        }
                        title="Transfer Guidance"
                        text="Understand when a journey requires changing buses."
                    />

                    <FeatureCard
                        icon={<LocationOnIcon />}
                        title="City Based"
                        text="Routes can be organized according to different cities."
                    />

                    <FeatureCard
                        icon={<SearchIcon />}
                        title="Simple Search"
                        text="Choose your starting point and destination instead of memorizing routes."
                    />

                    <FeatureCard
                        icon={<DirectionsBusIcon />}
                        title="Passenger Focused"
                        text="Route information is presented in a way that is easier to follow."
                    />
                </Box>
            </Container>

            {/* VISION */}

            <Box
                sx={{
                    backgroundColor: "#0d47a1",
                    color: "#ffffff",
                    py: {
                        xs: 6,
                        md: 8
                    }
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        textAlign: "center"
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: {
                                xs: "2rem",
                                sm: "2.8rem"
                            },
                            mb: 2
                        }}
                    >
                        The Vision Behind Raasta
                    </Typography>

                    <Typography
                        sx={{
                            color:
                                "rgba(255,255,255,0.82)",
                            lineHeight: 1.8,
                            fontSize: {
                                xs: "0.95rem",
                                sm: "1.05rem"
                            }
                        }}
                    >
                        Raasta aims to become a useful digital
                        layer for public transportation by
                        organizing route information in one
                        accessible platform. The project can
                        expand with more cities, more routes,
                        better location information, and
                        additional tools for passengers.
                    </Typography>
                </Container>
            </Box>

            {/* CTA */}

            <Container
                maxWidth="md"
                sx={{
                    py: {
                        xs: 6,
                        md: 8
                    }
                }}
            >
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: "28px",
                        background:
                            "linear-gradient(135deg, #e3f2fd 0%, #f5f9ff 100%)",
                        border:
                            "1px solid #bbdefb"
                    }}
                >
                    <CardContent
                        sx={{
                            p: {
                                xs: 3,
                                sm: 5,
                                md: 6
                            },
                            textAlign: "center"
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 900,
                                fontSize: {
                                    xs: "1.8rem",
                                    sm: "2.4rem"
                                },
                                color: "#0f172a",
                                mb: 1.5
                            }}
                        >
                            Ready to Find Your Route?
                        </Typography>

                        <Typography
                            sx={{
                                color: "#64748b",
                                lineHeight: 1.7,
                                maxWidth: 550,
                                mx: "auto",
                                mb: 3
                            }}
                        >
                            Choose your city and discover how
                            to travel from your starting point
                            to your destination.
                        </Typography>

                        <Button
                            component={Link}
                            href="/"
                            variant="contained"
                            size="large"
                            endIcon={
                                <ArrowForwardIcon />
                            }
                            disableElevation
                            sx={{
                                textTransform: "none",
                                borderRadius: "14px",
                                px: 3.5,
                                py: 1.4,
                                fontWeight: 800,
                                backgroundColor:
                                    "#1976d2",
                                "&:hover": {
                                    backgroundColor:
                                        "#1565c0"
                                }
                            }}
                        >
                            Find My Route
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

/* =========================================================
   STEP CARD
========================================================= */

function StepCard({
    number,
    icon,
    title,
    text
}) {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                borderRadius: "20px",
                border:
                    "1px solid #dbe5f0",
                backgroundColor: "#f8fbff"
            }}
        >
            <CardContent
                sx={{
                    p: 3
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "space-between",
                        mb: 2
                    }}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius:
                                "14px",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            backgroundColor:
                                "#e3f2fd",
                            color: "#1976d2"
                        }}
                    >
                        {icon}
                    </Box>

                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: "#bfdbfe",
                            fontSize: "1.4rem"
                        }}
                    >
                        {number}
                    </Typography>
                </Box>

                <Typography
                    sx={{
                        fontWeight: 800,
                        color: "#0f172a",
                        mb: 1
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        color: "#64748b",
                        fontSize: "0.9rem",
                        lineHeight: 1.7
                    }}
                >
                    {text}
                </Typography>
            </CardContent>
        </Card>
    );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
    icon,
    title,
    text
}) {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                borderRadius: "20px",
                border:
                    "1px solid #dbe5f0",
                backgroundColor: "#ffffff"
            }}
        >
            <CardContent
                sx={{
                    p: 3
                }}
            >
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius:
                            "14px",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        backgroundColor:
                            "#e3f2fd",
                        color: "#1976d2",
                        mb: 2
                    }}
                >
                    {icon}
                </Box>

                <Typography
                    sx={{
                        fontWeight: 800,
                        color: "#0f172a",
                        mb: 1
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        color: "#64748b",
                        fontSize: "0.9rem",
                        lineHeight: 1.7
                    }}
                >
                    {text}
                </Typography>
            </CardContent>
        </Card>
    );
}