"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Alert
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");

    const [error, setError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");

        if (!email || !password || !mobile) {
            setError(
                "Email, password and mobile number are required."
            );
            return;
        }

        /*
         * Backend authentication will be connected here.
         *
         * The backend will check:
         * 1. Email
         * 2. Password
         * 3. Mobile number stored in the database
         */

        console.log({
            email,
            password,
            mobile
        });

        // Temporary navigation for testing only.
        // We will replace this after backend authentication.
        router.push("/admin/dashboard");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #e0f2fe 100%)",
                px: 2,
                py: 5
            }}
        >
            <Container
                maxWidth="sm"
                sx={{
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <Card
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 480,
                        borderRadius: "24px",
                        border: "1px solid #dbe5f0",
                        backgroundColor: "#ffffff",
                        boxShadow:
                            "0 20px 50px rgba(15, 23, 42, 0.10)"
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
                        {/* Logo */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mb: 2
                            }}
                        >
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: "18px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background:
                                        "linear-gradient(135deg, #1976d2, #42a5f5)",
                                    color: "#ffffff",
                                    boxShadow:
                                        "0 10px 25px rgba(25, 118, 210, 0.25)"
                                }}
                            >
                                <DirectionsBusIcon
                                    sx={{
                                        fontSize: 34
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Heading */}

                        <Typography
                            sx={{
                                textAlign: "center",
                                fontSize: {
                                    xs: "1.8rem",
                                    sm: "2rem"
                                },
                                fontWeight: 900,
                                color: "#0f172a"
                            }}
                        >
                            Admin Login
                        </Typography>

                        <Typography
                            sx={{
                                textAlign: "center",
                                color: "#64748b",
                                mt: 0.7,
                                mb: 3
                            }}
                        >
                            Sign in to manage the Raasta system.
                        </Typography>

                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 2.5,
                                    borderRadius: "12px"
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <Box
                            component="form"
                            onSubmit={handleLogin}
                        >
                            {/* Email */}

                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                sx={{
                                    mb: 2
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon
                                                sx={{
                                                    color: "#64748b"
                                                }}
                                            />
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {/* Password */}

                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                sx={{
                                    mb: 2
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon
                                                sx={{
                                                    color: "#64748b"
                                                }}
                                            />
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {/* Mobile */}

                            <TextField
                                fullWidth
                                label="Mobile Number"
                                type="tel"
                                value={mobile}
                                onChange={(event) =>
                                    setMobile(event.target.value)
                                }
                                sx={{
                                    mb: 3
                                }}
                                placeholder="03XXXXXXXXX"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon
                                                sx={{
                                                    color: "#64748b"
                                                }}
                                            />
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {/* Login button */}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disableElevation
                                sx={{
                                    py: 1.4,
                                    borderRadius: "12px",
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: 800,
                                    backgroundColor: "#1976d2",

                                    "&:hover": {
                                        backgroundColor: "#1565c0"
                                    }
                                }}
                            >
                                Login to Admin
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}