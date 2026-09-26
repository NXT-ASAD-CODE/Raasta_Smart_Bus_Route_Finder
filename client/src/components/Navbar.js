"use client";

import Link from "next/link";
import { keyframes } from "@emotion/react";

import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import CloseIcon from "@mui/icons-material/Close";

import { useState } from "react";

const navigationItems = [
    {
        label: "Home",
        href: "/"
    },
    {
        label: "Find Buses",
        href: "/buses"
    },
    {
        label: "Cities",
        href: "/cities"
    },
    {
        label: "About",
        href: "/about"
    }
];

/* =========================================================
   ANIMATIONS
========================================================= */

const slideDown = keyframes`
    from {
        opacity: 0;
        transform: translateY(-16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const busWiggle = keyframes`
    0%, 100% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(-8deg);
    }
    75% {
        transform: rotate(8deg);
    }
`;

const drawerItemIn = keyframes`
    from {
        opacity: 0;
        transform: translateX(16px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((previous) => !previous);
    };

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background:
                        "linear-gradient(135deg, #0d47a1 0%, #1976d2 55%, #42a5f5 100%)",
                    color: "#ffffff",
                    borderBottom:
                        "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow:
                        "0 4px 20px rgba(13, 71, 161, 0.25)",
                    animation: `${slideDown} 0.5s ease-out both`
                }}
            >
                <Toolbar
                    sx={{
                        minHeight: {
                            xs: 68,
                            md: 76
                        },
                        width: "100%",
                        maxWidth: "1250px",
                        mx: "auto",
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 4
                        }
                    }}
                >
                    {/* Logo */}

                    <Box
                        component={Link}
                        href="/"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            textDecoration: "none",
                            color: "#ffffff",
                            mr: {
                                xs: "auto",
                                md: 5
                            },
                            transition: "transform 0.2s ease",

                            "&:hover": {
                                transform: "scale(1.04)"
                            },

                            "&:hover .navbar-bus-icon": {
                                animation: `${busWiggle} 0.5s ease-in-out`
                            }
                        }}
                    >
                        <Box
                            className="navbar-bus-icon"
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                    "rgba(255, 255, 255, 0.16)",
                                color: "#ffffff",
                                border:
                                    "1px solid rgba(255, 255, 255, 0.2)",
                                boxShadow:
                                    "0 6px 18px rgba(0, 0, 0, 0.12)",
                                transition:
                                    "background-color 0.2s ease"
                            }}
                        >
                            <DirectionsBusIcon />
                        </Box>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "1.25rem",
                                    sm: "1.4rem"
                                },
                                fontWeight: 800,
                                letterSpacing: "-0.5px",
                                color: "#ffffff"
                            }}
                        >
                            Raasta
                        </Typography>
                    </Box>

                    {/* Desktop Navigation */}

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                md: "flex"
                            },
                            alignItems: "center",
                            gap: 0.5
                        }}
                    >
                        {navigationItems.map((item) => (
                            <Button
                                key={item.label}
                                component={Link}
                                href={item.href}
                                sx={{
                                    position: "relative",
                                    color:
                                        "rgba(255, 255, 255, 0.9)",
                                    textTransform: "none",
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    px: 1.8,
                                    py: 1,
                                    borderRadius: "10px",
                                    transition:
                                        "color 0.2s ease, background-color 0.2s ease",

                                    "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        left: "18%",
                                        right: "18%",
                                        bottom: 4,
                                        height: "2px",
                                        borderRadius: "2px",
                                        backgroundColor:
                                            "#ffffff",
                                        transform:
                                            "scaleX(0)",
                                        transformOrigin:
                                            "center",
                                        transition:
                                            "transform 0.25s ease"
                                    },

                                    "&:hover": {
                                        color: "#ffffff",
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.12)"
                                    },

                                    "&:hover::after": {
                                        transform:
                                            "scaleX(1)"
                                    }
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    {/* Desktop CTA */}

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                md: "block"
                            },
                            ml: "auto"
                        }}
                    >
                        <Button
                            component={Link}
                            href="/"
                            variant="contained"
                            startIcon={
                                <DirectionsBusIcon />
                            }
                            disableElevation
                            sx={{
                                backgroundColor: "#ffffff",
                                color: "#1565c0",
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: "12px",
                                px: 2.3,
                                py: 1.15,
                                boxShadow:
                                    "0 5px 15px rgba(0, 0, 0, 0.12)",
                                transition:
                                    "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease",

                                "&:hover": {
                                    backgroundColor: "#f5f9ff",
                                    color: "#0d47a1",
                                    transform:
                                        "translateY(-2px)",
                                    boxShadow:
                                        "0 7px 18px rgba(0, 0, 0, 0.16)"
                                }
                            }}
                        >
                            Find My Route
                        </Button>
                    </Box>

                    {/* Mobile Menu Button */}

                    <IconButton
                        onClick={handleDrawerToggle}
                        aria-label="open navigation menu"
                        sx={{
                            display: {
                                xs: "flex",
                                md: "none"
                            },
                            width: 44,
                            height: 44,
                            borderRadius: "12px",
                            color: "#ffffff",
                            transition:
                                "background-color 0.2s ease, transform 0.2s ease",

                            "&:hover": {
                                backgroundColor:
                                    "rgba(255, 255, 255, 0.12)",
                                transform: "rotate(90deg)"
                            }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                slotProps={{
                    paper: {
                        sx: {
                            width: {
                                xs: "82%",
                                sm: 360
                            },
                            maxWidth: 360,
                            borderRadius:
                                "20px 0 0 20px",
                            p: 2
                        }
                    }
                }}
            >
                {/* Drawer Header */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        px: 1,
                        py: 1
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: "11px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",
                                background:
                                    "linear-gradient(135deg, #1976d2, #42a5f5)",
                                color: "#ffffff"
                            }}
                        >
                            <DirectionsBusIcon
                                fontSize="small"
                            />
                        </Box>

                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: "1.2rem"
                            }}
                        >
                            Raasta
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={handleDrawerToggle}
                        aria-label="close navigation menu"
                        sx={{
                            transition: "transform 0.2s ease",

                            "&:hover": {
                                transform: "rotate(90deg)"
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Drawer Navigation */}

                <List sx={{ mt: 2 }}>
                    {navigationItems.map((item, index) => (
                        <ListItem
                            key={item.label}
                            disablePadding
                            sx={{
                                mb: 0.5,
                                animation: mobileOpen
                                    ? `${drawerItemIn} 0.35s ease-out ${index * 0.06
                                    }s both`
                                    : "none"
                            }}
                        >
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                onClick={
                                    handleDrawerToggle
                                }
                                sx={{
                                    borderRadius:
                                        "12px",
                                    py: 1.4,
                                    transition:
                                        "background-color 0.2s ease, transform 0.2s ease",

                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(25, 118, 210, 0.08)",
                                        transform:
                                            "translateX(4px)"
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={
                                        item.label
                                    }
                                    slotProps={{
                                        primary: {
                                            sx: {
                                                fontWeight: 600,
                                                color: "#334155"
                                            }
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {/* Mobile CTA */}

                <Box
                    sx={{
                        mt: "auto",
                        p: 1
                    }}
                >
                    <Button
                        component={Link}
                        href="/"
                        variant="contained"
                        fullWidth
                        startIcon={
                            <DirectionsBusIcon />
                        }
                        onClick={
                            handleDrawerToggle
                        }
                        disableElevation
                        sx={{
                            backgroundColor:
                                "#1976d2",
                            color: "#ffffff",
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: "12px",
                            py: 1.4,
                            transition:
                                "background-color 0.2s ease, transform 0.15s ease",

                            "&:hover": {
                                backgroundColor:
                                    "#1565c0"
                            },

                            "&:active": {
                                transform: "scale(0.98)"
                            }
                        }}
                    >
                        Find My Route
                    </Button>
                </Box>
            </Drawer>
        </>
    );
}