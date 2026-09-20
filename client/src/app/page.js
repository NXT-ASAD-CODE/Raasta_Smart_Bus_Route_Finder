"use client";

import { Box, Button, Container, Typography } from "@mui/material";

export default function Home() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f7fa"
            }}
        >
            <Container maxWidth="md">
                <Box
                    sx={{
                        textAlign: "center",
                        backgroundColor: "#ffffff",
                        padding: { xs: 4, sm: 6 },
                        borderRadius: 4,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            fontSize: {
                                xs: "2.5rem",
                                sm: "3.5rem"
                            }
                        }}
                    >
                        Raasta
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            color: "text.secondary",
                            mb: 2
                        }}
                    >
                        Smart Bus Route Finder
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "text.secondary",
                            maxWidth: 600,
                            mx: "auto",
                            mb: 4
                        }}
                    >
                        Tell us where you want to go, and Raasta
                        will help you understand how to get there.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "1rem"
                        }}
                    >
                        Find My Route
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}