"use client";

import Link from "next/link";

import {
    Box,
    Container,
    Typography,
    Button,
    Divider
} from "@mui/material";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const footerLinks = [
    {
        title: "Explore",
        links: [
            {
                label: "Home",
                href: "/"
            },
            {
                label: "Find Bus",
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
        ]
    },
    {
        title: "Transport",
        links: [
            {
                label: "Route Finder",
                href: "/"
            },
            {
                label: "Available Cities",
                href: "/cities"
            }
        ]
    }
];

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                background:
                    "linear-gradient(135deg, #071a33 0%, #0d2f5c 55%, #0f4078 100%)",
                color: "#ffffff",
                mt: "auto"
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        py: {
                            xs: 6,
                            md: 8
                        },
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "1.7fr 1fr 1fr"
                        },
                        gap: {
                            xs: 5,
                            md: 8
                        }
                    }}
                >
                    {/* Brand */}
                    <Box>
                        <Box
                            component={Link}
                            href="/"
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1.2,
                                textDecoration: "none",
                                color: "#ffffff",
                                mb: 2
                            }}
                        >
                            <Box
                                sx={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor:
                                        "rgba(255, 255, 255, 0.12)",
                                    border:
                                        "1px solid rgba(255, 255, 255, 0.15)"
                                }}
                            >
                                <DirectionsBusIcon />
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: "1.5rem",
                                    fontWeight: 900,
                                    letterSpacing: "-0.5px"
                                }}
                            >
                                Raasta
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                maxWidth: 440,
                                color:
                                    "rgba(255,255,255,0.72)",
                                lineHeight: 1.8,
                                mb: 3
                            }}
                        >
                            Your smart public transport route finder.
                            Tell us where you want to go, and Raasta
                            helps you understand how to get there.
                        </Typography>

                        <Button
                            component={Link}
                            href="/"
                            variant="contained"
                            endIcon={
                                <ArrowForwardIcon />
                            }
                            disableElevation
                            sx={{
                                backgroundColor: "#ffffff",
                                color: "#1565c0",
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: "11px",
                                px: 2.5,
                                py: 1.2,
                                "&:hover": {
                                    backgroundColor: "#f1f5f9"
                                }
                            }}
                        >
                            Find My Route
                        </Button>
                    </Box>

                    {/* Footer Links */}
                    {footerLinks.map((section) => (
                        <Box key={section.title}>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: "1rem",
                                    mb: 2.5
                                }}
                            >
                                {section.title}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: 1.3
                                }}
                            >
                                {section.links.map(
                                    (link) => (
                                        <Typography
                                            key={
                                                link.label
                                            }
                                            component={
                                                Link
                                            }
                                            href={
                                                link.href
                                            }
                                            sx={{
                                                color:
                                                    "rgba(255,255,255,0.68)",
                                                textDecoration:
                                                    "none",
                                                fontSize:
                                                    "0.95rem",
                                                transition:
                                                    "color 0.2s ease",
                                                "&:hover":
                                                    {
                                                        color:
                                                            "#ffffff"
                                                    }
                                            }}
                                        >
                                            {link.label}
                                        </Typography>
                                    )
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Divider
                    sx={{
                        borderColor:
                            "rgba(255,255,255,0.12)"
                    }}
                />

                {/* Bottom */}
                <Box
                    sx={{
                        py: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        }
                    }}
                >
                    <Typography
                        sx={{
                            color:
                                "rgba(255,255,255,0.55)",
                            fontSize: "0.85rem",
                            textAlign: {
                                xs: "center",
                                sm: "left"
                            }
                        }}
                    >
                        © {new Date().getFullYear()} Raasta.
                        All rights reserved.
                    </Typography>

                    <Typography
                        sx={{
                            color:
                                "rgba(255,255,255,0.55)",
                            fontSize: "0.85rem",
                            textAlign: "center"
                        }}
                    >
                        Know Your Route. Know Your Way.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}