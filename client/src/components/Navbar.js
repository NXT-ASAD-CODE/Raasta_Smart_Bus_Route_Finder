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
    { label: "Home", href: "/" },
    { label: "Find Route", href: "/find-route" },
    { label: "Cities", href: "/cities" },
    { label: "About", href: "/about" }
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
                    background:
                        "linear-gradient(135deg, #0d47a1 0%, #1976d2 55%, #42a5f5 100%)",
                    color: "#ffffff",
                    borderBottom:
                        "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow:
                        "0 4px 20px rgba(13, 71, 161, 0.25)"
                }}
            >
                <Toolbar
                    sx={{
                        minHeight: { xs: 68, md: 76 },
                        width: "100%",
                        maxWidth: "1250px",
                        mx: "auto",
                        px: { xs: 2, sm: 3, md: 4 }
                    }}
                >
                    <Box
                        component={Link}
                        href="/"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            textDecoration: "none",
                            color: "#ffffff",
                            mr: { xs: "auto", md: 5 }
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
                                backgroundColor:
                                    "rgba(255, 255, 255, 0.16)",
                                color: "#ffffff",
                                border:
                                    "1px solid rgba(255, 255, 255, 0.2)",
                                boxShadow:
                                    "0 6px 18px rgba(0, 0, 0, 0.12)"
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
                                    color: "rgba(255, 255, 255, 0.9)",
                                    textTransform: "none",
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    px: 1.8,
                                    py: 1,
                                    borderRadius: "10px",
                                    "&:hover": {
                                        color: "#ffffff",
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.12)"
                                    }
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>

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
                            startIcon={<DirectionsBusIcon />}
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
                                "&:hover": {
                                    backgroundColor: "#f5f9ff",
                                    color: "#0d47a1",
                                    boxShadow:
                                        "0 7px 18px rgba(0, 0, 0, 0.16)"
                                }
                            }}
                        >
                            Find My Route
                        </Button>
                    </Box>

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
                            "&:hover": {
                                backgroundColor:
                                    "rgba(255, 255, 255, 0.12)"
                            }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

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
                            borderRadius: "20px 0 0 20px",
                            p: 2
                        }
                    }
                }}
            >
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
                                color: "#ffffff"
                            }}
                        >
                            <DirectionsBusIcon fontSize="small" />
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

                <List sx={{ mt: 2 }}>
                    {navigationItems.map((item) => (
                        <ListItem
                            key={item.href}
                            disablePadding
                            sx={{ mb: 0.5 }}
                        >
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                onClick={handleDrawerToggle}
                                sx={{
                                    borderRadius: "12px",
                                    py: 1.4,
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(25, 118, 210, 0.08)"
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: 600,
                                        color: "#334155"
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

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
                        startIcon={<DirectionsBusIcon />}
                        onClick={handleDrawerToggle}
                        disableElevation
                        sx={{
                            backgroundColor: "#1976d2",
                            color: "#ffffff",
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