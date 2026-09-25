"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    CircularProgress
} from "@mui/material";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import RouteIcon from "@mui/icons-material/AltRoute";
import PlaceIcon from "@mui/icons-material/Place";

import Link from "next/link";

const dashboardItems = [
    {
        title: "Manage Cities",
        description: "Add, edit and manage cities.",
        value: "Cities",
        icon: <LocationCityIcon />,
        href: "/admin/cities"
    },
    {
        title: "Manage Routes",
        description: "Manage bus routes and route information.",
        value: "Routes",
        icon: <RouteIcon />,
        href: "/admin/routes"
    },
    {
        title: "Manage Stops",
        description: "Add and manage bus stops.",
        value: "Stops",
        icon: <PlaceIcon />,
        href: "/admin/stops"
    }
];

export default function AdminDashboardPage() {
    const router = useRouter();

    const [checkingAuth, setCheckingAuth] =
        useState(true);

    useEffect(() => {
        const verifyAdmin = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/admin/verify",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    router.replace("/admin");
                    return;
                }

                const data = await response.json();

                if (!data.success) {
                    router.replace("/admin");
                    return;
                }

                setCheckingAuth(false);

            } catch (error) {
                console.error(
                    "Admin verification failed:",
                    error
                );

                router.replace("/admin");
            }
        };

        verifyAdmin();
    }, [router]);

    // Show loading while checking authentication
    if (checkingAuth) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                    backgroundColor: "#f8fafc"
                }}
            >
                <CircularProgress />

                <Typography
                    sx={{
                        color: "#64748b",
                        fontWeight: 600
                    }}
                >
                    Verifying admin access...
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                py: {
                    xs: 4,
                    md: 6
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
                            sm: "center"
                        },
                        gap: 2,
                        mb: 5,
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
                                    xs: "2rem",
                                    md: "2.5rem"
                                },
                                fontWeight: 900,
                                color: "#0f172a"
                            }}
                        >
                            Admin Dashboard
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.7,
                                color: "#64748b"
                            }}
                        >
                            Manage Raasta cities, routes and stops.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 52,
                            height: 52,
                            borderRadius: "15px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2"
                        }}
                    >
                        <DirectionsBusIcon
                            sx={{
                                fontSize: 30
                            }}
                        />
                    </Box>
                </Box>

                {/* Management Cards */}

                <Grid
                    container
                    spacing={3}
                >
                    {dashboardItems.map((item) => (
                        <Grid
                            key={item.title}
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >
                            <Card
                                elevation={0}
                                sx={{
                                    height: "100%",
                                    borderRadius: "20px",
                                    border: "1px solid #dbe5f0",
                                    backgroundColor: "#ffffff",
                                    transition: "all 0.2s ease",

                                    "&:hover": {
                                        transform:
                                            "translateY(-5px)",
                                        boxShadow:
                                            "0 15px 35px rgba(15,23,42,0.10)"
                                    }
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
                                            borderRadius: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor:
                                                "#e3f2fd",
                                            color: "#1976d2",
                                            mb: 2
                                        }}
                                    >
                                        {item.icon}
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontSize: "1.2rem",
                                            fontWeight: 900,
                                            color: "#0f172a"
                                        }}
                                    >
                                        {item.title}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: "#64748b",
                                            mt: 0.8,
                                            minHeight: 45
                                        }}
                                    >
                                        {item.description}
                                    </Typography>

                                    <Button
                                        component={Link}
                                        href={item.href}
                                        variant="contained"
                                        disableElevation
                                        sx={{
                                            mt: 2,
                                            borderRadius: "10px",
                                            textTransform: "none",
                                            fontWeight: 700
                                        }}
                                    >
                                        Open {item.value}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </Container>
        </Box>
    );
}