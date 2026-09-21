"use client";

import Link from "next/link";

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
        label: "Find Route",
        href: "/find-route"
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
                    backgroundColor: "rgba(255, 255, 255, 0.92)",
                    backdropFilter: "blur(12px)",
                    borderBottom:
                        "1px solid rgba(15, 23, 42, 0.08)",
                    color: "#0f172a"
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
                            color: "inherit",
                            mr: {
                                xs: "auto",
                                md: 5
                            }
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background:
                                    "linear-gradient(135deg, #1976d2, #42a5f5)",
                                color: "#fff",
                                boxShadow:
                                    "0 6px 18px rgba(25, 118, 210, 0.25)"
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
                                color: "#0f172a"
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
                                key={item.href}
                                component={Link}
                                href={item.href}
                                sx={{
                                    color: "#475569",
                                    textTransform: "none",
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    px: 1.8,
                                    py: 1,
                                    borderRadius: "10px",

                                    "&:hover": {
                                        color: "#1976d2",
                                        backgroundColor:
                                            "rgba(25, 118, 210, 0.07)"
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
                            href="/find-route"
                            variant="contained"
                            startIcon={
                                <DirectionsBusIcon />
                            }
                            disableElevation
                            sx={{
                                backgroundColor: "#1976d2",
                                color: "#fff",
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: "12px",
                                px: 2.3,
                                py: 1.15,

                                "&:hover": {
                                    backgroundColor: "#1565c0"
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
                            color: "#0f172a",

                            "&:hover": {
                                backgroundColor:
                                    "rgba(15, 23, 42, 0.06)"
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
                        justifyContent: "space-between",
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
                                justifyContent: "center",
                                background:
                                    "linear-gradient(135deg, #1976d2, #42a5f5)",
                                color: "#fff"
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
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Mobile Navigation */}
                <List
                    sx={{
                        mt: 2
                    }}
                >
                    {navigationItems.map((item) => (
                        <ListItem
                            key={item.href}
                            disablePadding
                            sx={{
                                mb: 0.5
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

                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(25, 118, 210, 0.08)"
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={
                                        item.label
                                    }
                                    primaryTypographyProps={{
                                        fontWeight: 600,
                                        color: "#334155"
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
                        href="/find-route"
                        variant="contained"
                        fullWidth
                        startIcon={
                            <DirectionsBusIcon />
                        }
                        onClick={handleDrawerToggle}
                        disableElevation
                        sx={{
                            backgroundColor: "#1976d2",
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: "12px",
                            py: 1.4,

                            "&:hover": {
                                backgroundColor: "#1565c0"
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