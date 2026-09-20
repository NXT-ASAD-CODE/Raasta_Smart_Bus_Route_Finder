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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

import {
  getCities,
  getStops,
  searchRoutes
} from "../services/api";

export default function Home() {
  // =========================
  // Page State
  // =========================

  const [showRouteForm, setShowRouteForm] =
    useState(false);

  const [cityDialogOpen, setCityDialogOpen] =
    useState(false);

  const [selectedCity, setSelectedCity] =
    useState(null);

  // =========================
  // Cities
  // =========================

  const [cities, setCities] = useState([]);

  const [loadingCities, setLoadingCities] =
    useState(false);

  const [selectedCityId, setSelectedCityId] =
    useState("");

  // =========================
  // Stops
  // =========================

  const [stops, setStops] = useState([]);

  const [loadingStops, setLoadingStops] =
    useState(false);

  // =========================
  // Route Search
  // =========================

  const [fromStop, setFromStop] =
    useState("");

  const [toStop, setToStop] =
    useState("");

  const [searching, setSearching] =
    useState(false);

  const [results, setResults] =
    useState(null);

  // =========================
  // Errors
  // =========================

  const [error, setError] = useState("");

  // =========================
  // Load Cities
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
  // Open City Dialog
  // =========================

  const handleOpenCityDialog = () => {
    setCityDialogOpen(true);
    setError("");
  };

  // =========================
  // Close City Dialog
  // =========================

  const handleCloseCityDialog = () => {
    setCityDialogOpen(false);
  };

  // =========================
  // Continue With City
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
      const cityStops = allStops.filter(
        (stop) => {
          const cityId =
            stop.city?._id || stop.city;

          return cityId === selectedCityId;
        }
      );

      setStops(cityStops);

      setSelectedCity(city);

      setFromStop("");
      setToStop("");
      setResults(null);

      setCityDialogOpen(false);

      // Change landing page into route form
      setShowRouteForm(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingStops(false);
    }
  };

  // =========================
  // Back To Home
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
  // Search Route
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
  // Swap Stops
  // =========================

  const handleSwap = () => {
    setFromStop(toStop);
    setToStop(fromStop);

    setResults(null);
    setError("");
  };

  // =========================
  // Render Stops
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
              key={`${
                stop.id ||
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
                        color:
                          "text.secondary"
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
                        color:
                          "text.secondary"
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

  // =========================
  // LANDING PAGE
  // =========================

  if (!showRouteForm) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 5
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: "center"
            }}
          >
            {/* Logo / Name */}

            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: {
                  xs: "3.5rem",
                  sm: "5rem",
                  md: "6rem"
                },
                letterSpacing: "-2px",
                color: "primary.main"
              }}
            >
              Raasta
            </Typography>

            {/* Heading */}

            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mt: 1,
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.3rem",
                  md: "2.6rem"
                }
              }}
            >
              Welcome to Raasta
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                mt: 1
              }}
            >
              The Smart Bus Route Finder
            </Typography>

            {/* Description */}

            <Typography
              sx={{
                maxWidth: 650,
                mx: "auto",
                mt: 3,
                color: "text.secondary",
                fontSize: {
                  xs: "1rem",
                  sm: "1.1rem"
                },
                lineHeight: 1.8
              }}
            >
              Tell us where you want to go,
              and Raasta will explain how to
              get there using public transport.
            </Typography>

            {/* City Button */}

            <Box
              sx={{
                mt: 5
              }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={
                  <LocationCityIcon />
                }
                onClick={
                  handleOpenCityDialog
                }
                sx={{
                  px: {
                    xs: 3,
                    sm: 5
                  },
                  py: 1.7,
                  borderRadius: 50,
                  textTransform: "none",
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1.05rem"
                  },
                  backgroundColor:
                    "#e3f2fd",
                  color: "primary.main",
                  border:
                    "1px solid #90caf9",
                  boxShadow:
                    "0 5px 20px rgba(25,118,210,0.15)",
                  animation:
                    "raastaPulse 2.2s ease-in-out infinite",

                  "&:hover": {
                    backgroundColor:
                      "#bbdefb"
                  },

                  "@keyframes raastaPulse": {
                    "0%": {
                      transform:
                        "scale(1)"
                    },
                    "50%": {
                      transform:
                        "scale(1.05)"
                    },
                    "100%": {
                      transform:
                        "scale(1)"
                    }
                  }
                }}
              >
                Select Your City to Check
                the Route
              </Button>
            </Box>

            {/* Small Information */}

            <Typography
              variant="body2"
              sx={{
                mt: 4,
                color: "text.secondary"
              }}
            >
              Find your bus. Understand
              your journey.
            </Typography>
          </Box>
        </Container>

        {/* CITY DIALOG */}

        <Dialog
          open={cityDialogOpen}
          onClose={
            handleCloseCityDialog
          }
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              fontWeight: 700
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
              pb: 3
            }}
          >
            <Button
              onClick={
                handleCloseCityDialog
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
                textTransform: "none",
                borderRadius: 2
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

  // =========================
  // ROUTE FORM PAGE
  // =========================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        py: {
          xs: 3,
          md: 6
        }
      }}
    >
      <Container maxWidth="md">

        {/* Back Button */}

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToHome}
          sx={{
            mb: 3,
            textTransform: "none",
            fontWeight: 600
          }}
        >
          Back to Home
        </Button>

        {/* Header */}

        <Box
          sx={{
            textAlign: "center",
            mb: 4
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: "2.8rem",
                sm: "4rem"
              },
              color: "primary.main"
            }}
          >
            Raasta
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mt: 1
            }}
          >
            Find Your Bus Route
          </Typography>

          {/* Selected City */}

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              px: 2,
              py: 1,
              borderRadius: 50,
              backgroundColor:
                "#e3f2fd",
              color: "primary.main"
            }}
          >
            <LocationCityIcon
              fontSize="small"
            />

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600
              }}
            >
              {selectedCity?.name}
            </Typography>
          </Box>
        </Box>

        {/* Error */}

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

        {/* Route Form */}

        <Paper
          elevation={3}
          sx={{
            p: {
              xs: 2.5,
              sm: 4
            },
            borderRadius: 3
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3
            }}
          >
            <DirectionsBusIcon
              color="primary"
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600
              }}
            >
              Where do you want to go?
            </Typography>
          </Box>

          {/* Loading Stops */}

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
              {/* Starting Stop */}

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

              {/* Swap */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "center",
                  my: 1
                }}
              >
                <Tooltip
                  title="Swap starting point and destination"
                >
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

              {/* Destination */}

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

              {/* Search */}

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

        {/* =========================
            SEARCH RESULTS
        ========================= */}

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

            {/* No Results */}

            {results.count === 0 && (
              <Alert severity="info">
                We could not find a direct
                or one-transfer route
                between these stops.
              </Alert>
            )}

            {/* Direct Route */}

            {results.type === "direct" &&
              results.data.map(
                (route) => (
                  <Paper
                    key={
                      route.routeId
                    }
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
                      {
                        route.routeNumber
                      }
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        mt: 0.5
                      }}
                    >
                      {
                        route.routeName
                      }
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
                )
              )}

            {/* One Transfer */}

            {results.type ===
              "one-transfer" &&
              results.data.map(
                (
                  route,
                  index
                ) => (
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

                    {/* First Bus */}

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

                    {/* Transfer */}

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
                          textAlign:
                            "left"
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

                    {/* Second Bus */}

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