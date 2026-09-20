"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";

import SwapVertIcon from "@mui/icons-material/SwapVert";

import {
  getCities,
  getStops,
  searchRoutes
} from "../services/api";

export default function Home() {
  // =========================
  // PAGE STATE
  // =========================

  const [showRouteForm, setShowRouteForm] =
    useState(false);

  const [cityDialogOpen, setCityDialogOpen] =
    useState(false);

  // =========================
  // CITIES
  // =========================

  const [cities, setCities] = useState([]);

  const [selectedCityId, setSelectedCityId] =
    useState("");

  const [selectedCity, setSelectedCity] =
    useState(null);

  const [loadingCities, setLoadingCities] =
    useState(true);

  // =========================
  // STOPS
  // =========================

  const [stops, setStops] = useState([]);

  const [loadingStops, setLoadingStops] =
    useState(false);

  // =========================
  // SEARCH
  // =========================

  const [fromStop, setFromStop] =
    useState("");

  const [toStop, setToStop] =
    useState("");

  const [searching, setSearching] =
    useState(false);

  const [results, setResults] =
    useState(null);

  const [error, setError] = useState("");

  // =========================
  // LOAD CITIES
  // =========================

  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true);
        setError("");

        const response = await getCities();

        setCities(response.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, []);

  // =========================
  // OPEN CITY DIALOG
  // =========================

  const handleOpenCityDialog = () => {
    setCityDialogOpen(true);
    setError("");
  };

  // =========================
  // CONTINUE WITH CITY
  // =========================

  const handleContinueCity = async () => {
    if (!selectedCityId) {
      setError("Please select a city first.");
      return;
    }

    const city = cities.find(
      (item) => item._id === selectedCityId
    );

    if (!city) {
      setError("Selected city could not be found.");
      return;
    }

    try {
      setLoadingStops(true);
      setError("");

      const response = await getStops();

      const allStops = response.data || [];

      // Only show stops belonging to selected city
      const cityStops = allStops.filter((stop) => {
        const stopCityId =
          stop.city?._id || stop.city;

        return (
          stopCityId?.toString() ===
          selectedCityId.toString()
        );
      });

      setStops(cityStops);
      setSelectedCity(city);

      setFromStop("");
      setToStop("");
      setResults(null);

      setCityDialogOpen(false);

      // Replace landing page with route form
      setShowRouteForm(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingStops(false);
    }
  };

  // =========================
  // BACK TO HOME
  // =========================

  const handleBackToHome = () => {
    setShowRouteForm(false);

    setSelectedCity(null);
    setSelectedCityId("");

    setFromStop("");
    setToStop("");

    setResults(null);
    setError("");
  };

  // =========================
  // SEARCH ROUTE
  // =========================

  const handleSearch = async () => {
    if (!fromStop || !toStop) {
      setError(
        "Please select both your starting stop and destination."
      );
      return;
    }

    if (fromStop === toStop) {
      setError(
        "Starting stop and destination stop cannot be the same."
      );
      return;
    }

    try {
      setSearching(true);
      setError("");
      setResults(null);

      const response = await searchRoutes(
        fromStop,
        toStop
      );

      setResults(response);
    } catch (error) {
      setError(error.message);
    } finally {
      setSearching(false);
    }
  };

  // =========================
  // SWAP
  // =========================

  const handleSwap = () => {
    setFromStop(toStop);
    setToStop(fromStop);

    setResults(null);
    setError("");
  };

  // =========================
  // RENDER STOPS
  // =========================

  const renderStops = (journeyStops) => {
    if (
      !journeyStops ||
      journeyStops.length === 0
    ) {
      return (
        <Typography color="text.secondary">
          No stop information available.
        </Typography>
      );
    }

    return (
      <Stepper
        orientation="vertical"
        sx={{
          mt: 2
        }}
      >
        {journeyStops.map((stop, index) => {
          const englishName =
            stop.name ||
            stop.stop?.name;

          const urduName =
            stop.nameUrdu ||
            stop.stop?.nameUrdu;

          return (
            <Step
              key={`${stop.id ||
                stop._id ||
                stop.stop?._id ||
                index
                }-${index}`}
              active
              completed={
                index <
                journeyStops.length - 1
              }
            >
              <StepLabel>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap"
                  }}
                >
                  {urduName && (
                    <Typography
                      component="span"
                      sx={{
                        fontSize: {
                          xs: "1.2rem",
                          sm: "1.4rem"
                        },
                        fontWeight: 600,
                        direction: "rtl"
                      }}
                    >
                      {urduName}
                    </Typography>
                  )}

                  {urduName && (
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "1.1rem",
                        color: "text.secondary"
                      }}
                    >
                      (
                    </Typography>
                  )}

                  <Typography
                    component="span"
                    sx={{
                      fontSize: {
                        xs: "1rem",
                        sm: "1.1rem"
                      },
                      fontWeight:
                        index ===
                          journeyStops.length - 1
                          ? 600
                          : 400
                    }}
                  >
                    {englishName}
                  </Typography>

                  {urduName && (
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "1.1rem",
                        color: "text.secondary"
                      }}
                    >
                      )
                    </Typography>
                  )}
                </Box>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    );
  };

  // ==========================================================
  // LANDING PAGE
  // ==========================================================

  if (!showRouteForm) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f8fbff 0%, #eef7ff 50%, #ffffff 100%)",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          py: {
            xs: 5,
            md: 8
          }
        }}
      >
        {/* Decorative Circle */}

        <Box
          sx={{
            position: "absolute",
            width: {
              xs: 220,
              md: 380
            },
            height: {
              xs: 220,
              md: 380
            },
            borderRadius: "50%",
            background:
              "rgba(25, 118, 210, 0.07)",
            top: {
              xs: -80,
              md: -130
            },
            right: {
              xs: -80,
              md: -100
            }
          }}
        />

        {/* Decorative Circle */}

        <Box
          sx={{
            position: "absolute",
            width: {
              xs: 180,
              md: 280
            },
            height: {
              xs: 180,
              md: 280
            },
            borderRadius: "50%",
            background:
              "rgba(25, 118, 210, 0.05)",
            bottom: -100,
            left: -80
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1
          }}
        >
          {/* HERO */}

          <Box
            sx={{
              textAlign: "center",
              maxWidth: 850,
              mx: "auto"
            }}
          >
            {/* Badge */}

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.8,
                borderRadius: 50,
                backgroundColor: "#ffffff",
                border: "1px solid #dbeafe",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.05)",
                mb: 3
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#1976d2"
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#1976d2",
                  letterSpacing: 1
                }}
              >
                SMART PUBLIC TRANSPORT
              </Typography>
            </Box>

            {/* Main Raasta Heading */}

            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: {
                  xs: "3.4rem",
                  sm: "5rem",
                  md: "6.5rem"
                },
                lineHeight: 0.95,
                letterSpacing: "-4px",
                color: "#111827"
              }}
            >
              Raasta
            </Typography>

            {/* Subtitle */}

            <Typography
              sx={{
                mt: 2,
                fontWeight: 600,
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "2.4rem"
                },
                color: "#374151"
              }}
            >
              Your Journey Starts Here.
            </Typography>

            {/* Description */}

            <Typography
              sx={{
                mt: 2,
                maxWidth: 650,
                mx: "auto",
                color: "#6b7280",
                fontSize: {
                  xs: "1rem",
                  sm: "1.1rem"
                },
                lineHeight: 1.8
              }}
            >
              Tell us where you want to go,
              and Raasta will explain which bus
              to take, where to get off, and how
              to complete your journey.
            </Typography>

            {/* Route Visual */}

            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 650,
                height: 100,
                mx: "auto",
                my: 4
              }}
            >
              {/* Route Line */}

              <Box
                sx={{
                  position: "absolute",
                  left: "8%",
                  right: "8%",
                  top: "50%",
                  height: 3,
                  backgroundColor: "#90caf9",
                  transform:
                    "translateY(-50%)"
                }}
              />

              {/* Start */}

              <Box
                sx={{
                  position: "absolute",
                  left: "5%",
                  top: "50%",
                  transform:
                    "translate(-50%, -50%)",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  border:
                    "5px solid #1976d2",
                  zIndex: 2
                }}
              />

              {/* Middle */}

              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform:
                    "translate(-50%, -50%)",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: "#1976d2",
                  border:
                    "5px solid #ffffff",
                  boxShadow:
                    "0 0 0 3px #90caf9",
                  zIndex: 2
                }}
              />

              {/* Destination */}

              <Box
                sx={{
                  position: "absolute",
                  right: "5%",
                  top: "50%",
                  transform:
                    "translate(50%, -50%)",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  border:
                    "5px solid #1976d2",
                  zIndex: 2
                }}
              />

              {/* Start Label */}

              <Typography
                sx={{
                  position: "absolute",
                  left: "1%",
                  top: "75%",
                  fontSize: "0.8rem",
                  color: "#6b7280"
                }}
              >
                Start
              </Typography>

              {/* Journey Label */}

              <Typography
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "75%",
                  transform:
                    "translateX(-50%)",
                  fontSize: "0.8rem",
                  color: "#1976d2",
                  fontWeight: 600
                }}
              >
                Your Journey
              </Typography>

              {/* Destination Label */}

              <Typography
                sx={{
                  position: "absolute",
                  right: "0%",
                  top: "75%",
                  fontSize: "0.8rem",
                  color: "#6b7280"
                }}
              >
                Destination
              </Typography>
            </Box>

            {/* CITY BUTTON */}

            <Button
              variant="contained"
              onClick={
                handleOpenCityDialog
              }
              sx={{
                backgroundColor: "#1976d2",
                color: "#ffffff",
                borderRadius: "50px",
                px: {
                  xs: 3,
                  sm: 4
                },
                py: 1.5,
                textTransform: "none",
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem"
                },
                fontWeight: 600,
                boxShadow:
                  "0 6px 20px rgba(25, 118, 210, 0.3)",

                animation:
                  "raastaPulse 2s ease-in-out infinite",

                "&:hover": {
                  backgroundColor: "#1565c0",
                  color: "#ffffff",
                  boxShadow:
                    "0 8px 25px rgba(25, 118, 210, 0.4)"
                },

                "@keyframes raastaPulse": {
                  "0%": {
                    transform: "scale(1)"
                  },
                  "50%": {
                    transform: "scale(1.05)"
                  },
                  "100%": {
                    transform: "scale(1)"
                  }
                }
              }}
            >
              Select Your City to Check the Route
            </Button>
          </Box>

          {/* FEATURE CARDS */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)"
              },
              gap: 2,
              maxWidth: 850,
              mx: "auto",
              mt: 7
            }}
          >
            {/* Feature 1 */}

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                textAlign: "center",
                backgroundColor:
                  "rgba(255,255,255,0.8)",
                border:
                  "1px solid #e5e7eb",
                transition: "0.3s",

                "&:hover": {
                  transform:
                    "translateY(-5px)",
                  boxShadow:
                    "0 12px 30px rgba(0,0,0,0.08)"
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  mb: 1
                }}
              >
                🚌
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700
                }}
              >
                Simple Routes
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5
                }}
              >
                Find the bus you need
                without confusion.
              </Typography>
            </Paper>

            {/* Feature 2 */}

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                textAlign: "center",
                backgroundColor:
                  "rgba(255,255,255,0.8)",
                border:
                  "1px solid #e5e7eb",
                transition: "0.3s",

                "&:hover": {
                  transform:
                    "translateY(-5px)",
                  boxShadow:
                    "0 12px 30px rgba(0,0,0,0.08)"
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  mb: 1
                }}
              >
                🔄
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700
                }}
              >
                Easy Transfers
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5
                }}
              >
                Know when to change
                from one bus to another.
              </Typography>
            </Paper>

            {/* Feature 3 */}

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                textAlign: "center",
                backgroundColor:
                  "rgba(255,255,255,0.8)",
                border:
                  "1px solid #e5e7eb",
                transition: "0.3s",

                "&:hover": {
                  transform:
                    "translateY(-5px)",
                  boxShadow:
                    "0 12px 30px rgba(0,0,0,0.08)"
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  mb: 1
                }}
              >
                اردو
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700
                }}
              >
                Urdu + English
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5
                }}
              >
                Understand your journey
                in your preferred language.
              </Typography>
            </Paper>
          </Box>
        </Container>

        {/* CITY DIALOG */}

        <Dialog
          open={cityDialogOpen}
          onClose={() =>
            setCityDialogOpen(false)
          }
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              fontWeight: 600
            }}
          >
            Select Your City
          </DialogTitle>

          <DialogContent>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2
                }}
                onClose={() =>
                  setError("")
                }
              >
                {error}
              </Alert>
            )}

            {loadingCities ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "center",
                  py: 4
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <TextField
                select
                fullWidth
                label="City"
                value={selectedCityId}
                onChange={(event) => {
                  setSelectedCityId(
                    event.target.value
                  );

                  setError("");
                }}
                sx={{
                  mt: 1
                }}
              >
                <MenuItem value="">
                  Select your city
                </MenuItem>

                {cities.map((city) => (
                  <MenuItem
                    key={city._id}
                    value={city._id}
                  >
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 2
            }}
          >
            <Button
              onClick={() =>
                setCityDialogOpen(false)
              }
              sx={{
                textTransform: "none"
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={
                handleContinueCity
              }
              disabled={
                !selectedCityId ||
                loadingStops
              }
              sx={{
                textTransform: "none"
              }}
            >
              {loadingStops ? (
                <>
                  <CircularProgress
                    size={20}
                    color="inherit"
                    sx={{
                      mr: 1
                    }}
                  />

                  Loading...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // ==========================================================
  // ROUTE FORM PAGE
  // ==========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        py: {
          xs: 4,
          md: 7
        }
      }}
    >
      <Container maxWidth="md">

        {/* BACK TO HOME */}

        <Button
          onClick={handleBackToHome}
          sx={{
            mb: 3,
            textTransform: "none"
          }}
        >
          ← Back to Home
        </Button>

        {/* HERO */}

        <Box
          sx={{
            textAlign: "center",
            mb: 5
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "2.5rem",
                sm: "3.5rem"
              },
              color: "#111827"
            }}
          >
            Raasta
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: "text.secondary",
              mt: 1
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
              mt: 2
            }}
          >
            Selected city:{" "}
            <strong>
              {selectedCity?.name}
            </strong>
          </Typography>
        </Box>

        {/* SEARCH CARD */}

        <Paper
          elevation={3}
          sx={{
            p: {
              xs: 3,
              sm: 4
            },
            borderRadius: 3
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3
            }}
          >
            Find Your Route
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3
              }}
              onClose={() =>
                setError("")
              }
            >
              {error}
            </Alert>
          )}

          {loadingStops ? (
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "center",
                py: 5
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* STARTING STOP */}

              <TextField
                select
                fullWidth
                label="Where are you starting?"
                value={fromStop}
                onChange={(event) => {
                  setFromStop(
                    event.target.value
                  );

                  setResults(null);
                  setError("");
                }}
                sx={{
                  mb: 2
                }}
              >
                <MenuItem value="">
                  Select starting stop
                </MenuItem>

                {stops.map((stop) => (
                  <MenuItem
                    key={stop._id}
                    value={stop._id}
                  >
                    {stop.name}

                    {stop.nameUrdu
                      ? ` (${stop.nameUrdu})`
                      : ""}
                  </MenuItem>
                ))}
              </TextField>

              {/* SWAP */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 1
                }}
              >
                <Tooltip title="Swap starting point and destination">
                  <span>
                    <IconButton
                      onClick={
                        handleSwap
                      }
                      disabled={
                        !fromStop &&
                        !toStop
                      }
                      color="primary"
                      aria-label="Swap starting point and destination"
                      sx={{
                        border:
                          "1px solid",
                        borderColor:
                          "primary.main",
                        width: 48,
                        height: 48,

                        "&:hover": {
                          backgroundColor:
                            "primary.main",
                          color: "white"
                        }
                      }}
                    >
                      <SwapVertIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              {/* DESTINATION */}

              <TextField
                select
                fullWidth
                label="Where do you want to go?"
                value={toStop}
                onChange={(event) => {
                  setToStop(
                    event.target.value
                  );

                  setResults(null);
                  setError("");
                }}
                sx={{
                  mt: 1,
                  mb: 3
                }}
              >
                <MenuItem value="">
                  Select destination stop
                </MenuItem>

                {stops.map((stop) => (
                  <MenuItem
                    key={stop._id}
                    value={stop._id}
                  >
                    {stop.name}

                    {stop.nameUrdu
                      ? ` (${stop.nameUrdu})`
                      : ""}
                  </MenuItem>
                ))}
              </TextField>

              {/* SEARCH BUTTON */}

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={
                  handleSearch
                }
                disabled={searching}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem"
                }}
              >
                {searching ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{
                        mr: 1
                      }}
                    />

                    Finding your route...
                  </>
                ) : (
                  "Find My Route"
                )}
              </Button>
            </>
          )}
        </Paper>

        {/* ==================================================
            SEARCH RESULTS
        ================================================== */}

        {results && (
          <Box
            sx={{
              mt: 4
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2
              }}
            >
              Your Journey
            </Typography>

            {/* NO RESULTS */}

            {results.count === 0 && (
              <Alert severity="info">
                We could not find a direct
                or one-transfer route between
                these stops.
              </Alert>
            )}

            {/* DIRECT ROUTE */}

            {results.type === "direct" &&
              results.data.map((route) => (
                <Paper
                  key={route.routeId}
                  elevation={2}
                  sx={{
                    p: {
                      xs: 3,
                      sm: 4
                    },
                    mb: 3,
                    borderRadius: 3
                  }}
                >
                  <Typography
                    variant="overline"
                    color="primary"
                    sx={{
                      fontWeight: 700
                    }}
                  >
                    Direct Route
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mt: 0.5
                    }}
                  >
                    Bus{" "}
                    {route.routeNumber}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      mt: 0.5
                    }}
                  >
                    {route.routeName}
                  </Typography>

                  <Divider
                    sx={{
                      my: 3
                    }}
                  />

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600
                    }}
                  >
                    Your stops
                  </Typography>

                  {renderStops(
                    route.stops
                  )}
                </Paper>
              ))}

            {/* ONE TRANSFER ROUTE */}

            {results.type ===
              "one-transfer" &&
              results.data.map(
                (route, index) => (
                  <Paper
                    key={index}
                    elevation={2}
                    sx={{
                      p: {
                        xs: 3,
                        sm: 4
                      },
                      mb: 3,
                      borderRadius: 3
                    }}
                  >
                    <Typography
                      variant="overline"
                      color="primary"
                      sx={{
                        fontWeight: 700
                      }}
                    >
                      One Transfer
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mt: 0.5
                      }}
                    >
                      Your Journey
                    </Typography>

                    {/* FIRST BUS */}

                    <Box
                      sx={{
                        mt: 3
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        1. Take Bus{" "}
                        {
                          route
                            .journey[0]
                            .routeNumber
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {
                          route
                            .journey[0]
                            .routeName
                        }
                      </Typography>

                      {renderStops(
                        route
                          .journey[0]
                          .stops
                      )}
                    </Box>

                    {/* TRANSFER */}

                    <Alert
                      severity="warning"
                      sx={{
                        my: 3,
                        borderRadius: 2
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700
                        }}
                      >
                        🔄 Change Bus —
                        بس تبدیل کریں
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          mt: 0.5
                        }}
                      >
                        Get off at{" "}
                        <strong>
                          {
                            route
                              .transferStop
                              .name
                          }
                        </strong>

                        {route
                          .transferStop
                          .nameUrdu && (
                            <>
                              {" "}
                              (
                              {
                                route
                                  .transferStop
                                  .nameUrdu
                              }
                              )
                            </>
                          )}{" "}
                        and take the next
                        bus.
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          mt: 1,
                          fontSize: {
                            xs: "1rem",
                            sm: "1.15rem"
                          },
                          fontWeight: 600,
                          direction: "rtl",
                          textAlign: "left"
                        }}
                      >
                        {
                          route
                            .transferStop
                            .nameUrdu
                        }{" "}
                        پر اتریں اور اگلی
                        بس لیں۔
                      </Typography>
                    </Alert>

                    {/* SECOND BUS */}

                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        2. Take Bus{" "}
                        {
                          route
                            .journey[1]
                            .routeNumber
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {
                          route
                            .journey[1]
                            .routeName
                        }
                      </Typography>

                      {renderStops(
                        route
                          .journey[1]
                          .stops
                      )}
                    </Box>
                  </Paper>
                )
              )}
          </Box>
        )}
      </Container>
    </Box>
  );
}