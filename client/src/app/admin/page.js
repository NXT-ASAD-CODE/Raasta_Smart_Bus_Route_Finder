"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper
} from "@mui/material";

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();

        console.log({
            email,
            password,
            mobile
        });

        // Authentication will be connected later.
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8fafc",
                px: 2
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        p: {
                            xs: 3,
                            sm: 5
                        },
                        borderRadius: "24px",
                        border: "1px solid #dbe5f0"
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "2rem",
                            fontWeight: 900,
                            color: "#0f172a",
                            mb: 1
                        }}
                    >
                        Admin Login
                    </Typography>

                    <Typography
                        sx={{
                            color: "#64748b",
                            mb: 4
                        }}
                    >
                        Login to access the Raasta admin dashboard.
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleLogin}
                    >
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            sx={{ mb: 2 }}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            sx={{ mb: 2 }}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Mobile Number"
                            type="tel"
                            value={mobile}
                            onChange={(event) =>
                                setMobile(event.target.value)
                            }
                            sx={{ mb: 3 }}
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disableElevation
                            sx={{
                                py: 1.4,
                                borderRadius: "12px",
                                fontWeight: 800,
                                textTransform: "none",
                                backgroundColor: "#1976d2"
                            }}
                        >
                            Login
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}