"use client";

import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Chip
} from "@mui/material";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

const cities = [
    {
        id: "karachi",
        name: "Karachi"
    },
    {
        id: "lahore",
        name: "Lahore"
    }
];

const buses = [
    {
        id: "11c",
        number: "11C",
        city: "karachi",
        name: "11C Bus",
        image: "/buses/11c.jpg"
    },
    {
        id: "9c",
        number: "9C",
        city: "karachi",
        name: "9C Bus",
        image: "/buses/9c.jpg"
    }
];

export default function BusesPage() {
    const [selectedCity, setSelectedCity] =
        useState("karachi");

    const filteredBuses = buses.filter(
        (bus) => bus.city === selectedCity
    );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                py: 5
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
                            md: "center"
                        },
                        gap: 3,
                        flexDirection: {
                            xs: "column",
                            md: "row"
                        },
                        mb: 4
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
                            Find a Bus
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.7,
                                color: "#64748b",
                                fontSize: "1rem"
                            }}
                        >
                            Find bus routes, stops and
                            complete journey information.
                        </Typography>
                    </Box>

                    {/* City selector */}

                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 190,
                            backgroundColor: "#ffffff"
                        }}
                    >
                        <InputLabel>
                            Select City
                        </InputLabel>

                        <Select
                            value={selectedCity}
                            label="Select City"
                            onChange={(event) =>
                                setSelectedCity(
                                    event.target.value
                                )
                            }
                        >
                            {cities.map((city) => (
                                <MenuItem
                                    key={city.id}
                                    value={city.id}
                                >
                                    {city.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </Box>

                {/* Bus Cards */}

                <Grid
                    container
                    spacing={3}
                >
                    {filteredBuses.map((bus) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={bus.id}
                        >
                            <Card
                                sx={{
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    border:
                                        "1px solid #dbe5f0",
                                    transition:
                                        "all 0.2s ease",
                                    "&:hover": {
                                        transform:
                                            "translateY(-5px)",
                                        boxShadow:
                                            "0 15px 35px rgba(15,23,42,0.12)"
                                    }
                                }}
                            >

                                <CardMedia
                                    component="img"
                                    height="190"
                                    image={bus.image}
                                    alt={`Bus ${bus.number}`}
                                />

                                <CardContent
                                    sx={{ p: 2.5 }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            gap: 1
                                        }}
                                    >
                                        <DirectionsBusIcon
                                            sx={{
                                                color: "#1976d2"
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight: 900,
                                                fontSize:
                                                    "1.3rem"
                                            }}
                                        >
                                            {bus.number}
                                        </Typography>

                                    </Box>

                                    <Typography
                                        sx={{
                                            color: "#64748b",
                                            mt: 0.7
                                        }}
                                    >
                                        View complete
                                        route information
                                    </Typography>

                                    <Chip
                                        label="View Route"
                                        size="small"
                                        sx={{
                                            mt: 2,
                                            backgroundColor:
                                                "#e3f2fd",
                                            color: "#1565c0",
                                            fontWeight: 700
                                        }}
                                    />

                                </CardContent>

                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </Container>
        </Box>
    );
}