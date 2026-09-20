"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  const [cities, setCities] = useState([]);
  const [stops, setStops] = useState([]);

  const [selectedCity, setSelectedCity] =
    useState("");

  const [fromStop, setFromStop] =
    useState("");

  const [toStop, setToStop] =
    useState("");

  const [cityDialogOpen, setCityDialogOpen] =
    useState(false);

  const [loadingData, setLoadingData] =
    useState(true);

  const [searching, setSearching] =
    useState(false);

  const [error, setError] =
    useState("");

  const [results, setResults] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load Cities and Stops
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [
          citiesResponse,
          stopsResponse
        ] = await Promise.all([
          getCities(),
          getStops()
        ]);

        setCities(
          citiesResponse.data || []
        );

        setStops(
          stopsResponse.data || []
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Filter Stops According To City
  |--------------------------------------------------------------------------
  */

  const cityStops = stops.filter(
    (stop) =>
      stop.city?._id === selectedCity ||
      stop.city === selectedCity
  );

  /*
  |--------------------------------------------------------------------------
  | Selected City Name
  |--------------------------------------------------------------------------
  */

  const selectedCityData =
    cities.find(
      (city) =>
        city._id === selectedCity
    );

  /*
  |--------------------------------------------------------------------------
  | Open City Dialog
  |--------------------------------------------------------------------------
  */

  const handleOpenCityDialog = () => {
    setCityDialogOpen(true);
    setError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Continue After City Selection
  |--------------------------------------------------------------------------
  */

  const handleCityContinue = () => {
    if (!selectedCity) {
      setError(
        "Please select a city first."
      );

      return;
    }

    setCityDialogOpen(false);

    setFromStop("");
    setToStop("");
    setResults(null);
    setError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Search Route
  |--------------------------------------------------------------------------
  */

  const handleSearch = async () => {
    if (!selectedCity) {
      setCityDialogOpen(true);

      return;
    }

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

  /*
  |--------------------------------------------------------------------------
  | Swap Stops
  |--------------------------------------------------------------------------
  */

  const handleSwap = () => {
    setFromStop(toStop);
    setToStop(fromStop);

    setResults(null);
    setError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Change City
  |--------------------------------------------------------------------------
  */

  const handleChangeCity = () => {
    setSelectedCity("");
    setFromStop("");
    setToStop("");
    setResults(null);
    setError("");
    setCityDialogOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Render Stop
  |--------------------------------------------------------------------------
  */

  const renderStopName = (
    stop,
    index,
    total
  ) => {
    if (!stop) {
      return null;
    }

    const englishName =
      stop.name ||
      stop.stop?.name ||
      "Unknown stop";

    const urduName =
      stop.nameUrdu ||
      stop.stop?.nameUrdu;

    return (
      <Step
        key={`${
          stop._id ||
          stop.id ||
          stop.stop?._id
        }-${index}`}
        active
        completed={
          index < total - 1
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
                  index === total - 1
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
  };

  /*
  |--------------------------------------------------------------------------
  | Render Stops Timeline
  |--------------------------------------------------------------------------
  */

  const renderStops = (
    journeyStops
  ) => {
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
        {journeyStops.map(
          (stop, index) =>
            renderStopName(
              stop,
              index,
              journeyStops.length
            )
        )}
      </Stepper>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eaf7ff 0%, #ffffff 50%, #eef8ff 100%)"
      }}
    >
      {/* =========================================================
          LANDING PAGE
      ========================================================= */}

      <Box
        sx={{
          minHeight: {
            xs: "90vh",
            md: "92vh"
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          textAlign: "center"
        }}
      >
        <Container maxWidth="md">
          <Typography
            sx={{
              fontSize: {
                xs: "3.2rem",
                sm: "4.5rem",
                md: "5.5rem"
              },
              fontWeight: 800,
              letterSpacing: "-2px",
              color: "#111827"
            }}
          >
            Raasta
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "1.8rem",
                sm: "2.4rem",
                md: "3rem"
              },
              fontWeight: 700,
              color: "#1976d2",
              mt: 1
            }}
          >
            Welcome to Raasta
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "1.2rem",
                sm: "1.5rem"
              },
              color: "#4b5563",
              mt: 1
            }}
          >
            The Smart Bus Route Finder
          </Typography>

          <Typography
            sx={{
              maxWidth: 650,
              mx: "auto",
              mt: 3,
              color: "#6b7280",
              fontSize: {
                xs: "1rem",
                sm: "1.15rem"
              },
              lineHeight: 1.8
            }}
          >
            Tell us where you want to go,
            and Raasta will explain exactly
            how to get there.
          </Typography>

          {/* =====================================================
              ANIMATED CITY BUTTON
          ===================================================== */}

          <Box
            sx={{
              mt: 6,
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Button
              onClick={
                handleOpenCityDialog
              }
              variant="contained"
              sx={{
                backgroundColor: "#90caf9",
                color: "#0d47a1",
                px: {
                  xs: 3,
                  sm: 5
                },
                py: {
                  xs: 1.8,
                  sm: 2
                },
                borderRadius: "50px",
                fontSize: {
                  xs: "0.95rem",
                  sm: "1.1rem"
                },
                fontWeight: 700,
                textTransform: "none",
                boxShadow:
                  "0 8px 25px rgba(33, 150, 243, 0.25)",

                animation:
                  "raastaPulse 1.8s ease-in-out infinite",

                "@keyframes raastaPulse": {
                  "0%": {
                    transform:
                      "scale(1)"
                  },

                  "50%": {
                    transform:
                      "scale(1.08)"
                  },

                  "100%": {
                    transform:
                      "scale(1)"
                  }
                },

                "&:hover": {
                  backgroundColor:
                    "#64b5f6",
                  color: "#ffffff",
                  animationPlayState:
                    "paused"
                }
              }}
            >
              Select Your City to Check
              the Route
            </Button>
          </Box>

          <Typography
            sx={{
              mt: 3,
              color: "#9ca3af",
              fontSize: "0.9rem"
            }}
          >
            Find buses • Understand routes
            • Reach your destination
          </Typography>
        </Container>
      </Box>

      {/* =========================================================
          CITY SELECTION DIALOG
      ========================================================= */}

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
            fontWeight: 700,
            fontSize: "1.5rem"
          }}
        >
          Select Your City
        </DialogTitle>

        <DialogContent>
          <Typography
            color="text.secondary"
            sx={{
              mb: 3
            }}
          >
            Select your city to find
            available bus routes.
          </Typography>

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

          {loadingData ? (
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "center",
                py: 3
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <TextField
              select
              fullWidth
              label="City"
              value={selectedCity}
              onChange={(event) => {
                setSelectedCity(
                  event.target.value
                );
                setError("");
              }}
            >
              <MenuItem value="">
                Select city
              </MenuItem>

              {cities.map((city) => (
                <MenuItem
                  key={city._id}
                  value={city._id}
                >
                  {city.name}

                  {city.province
                    ? `, ${city.province}`
                    : ""}
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
              handleCityContinue
            }
            disabled={
              loadingData ||
              !selectedCity
            }
            sx={{
              textTransform: "none",
              borderRadius: 2
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* =========================================================
          ROUTE SEARCH SECTION
      ========================================================= */}

      {selectedCity && (
        <Box
          sx={{
            py: {
              xs: 5,
              md: 8
            },
            backgroundColor:
              "#f5f7fa"
          }}
        >
          <Container maxWidth="md">

            {/* Selected City */}

            <Paper
              elevation={2}
              sx={{
                p: {
                  xs: 3,
                  sm: 4
                },
                mb: 4,
                borderRadius: 3
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: {
                    xs: "flex-start",
                    sm: "center"
                  },
                  gap: 2,
                  flexDirection: {
                    xs: "column",
                    sm: "row"
                  }
                }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    color="primary"
                    sx={{
                      fontWeight: 700
                    }}
                  >
                    Selected City
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700
                    }}
                  >
                    {selectedCityData?.name}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  onClick={
                    handleChangeCity
                  }
                  sx={{
                    textTransform:
                      "none",
                    borderRadius: 2
                  }}
                >
                  Change City
                </Button>
              </Box>
            </Paper>

            {/* Search Card */}

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

                {cityStops.map((stop) => (
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
                      sx={{
                        border: "1px solid",
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

              {/* Destination Stop */}

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

                {cityStops.map((stop) => (
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
                disabled={
                  searching ||
                  cityStops.length === 0
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform:
                    "none",
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

                    Finding your
                    route...
                  </>
                ) : (
                  "Find My Route"
                )}
              </Button>
            </Paper>

            {/* =====================================================
                RESULTS
            ===================================================== */}

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

                {results.count ===
                  0 && (
                  <Alert severity="info">
                    We could not find a
                    direct or one-transfer
                    route between these
                    stops.
                  </Alert>
                )}

                {/* Direct Routes */}

                {results.type ===
                  "direct" &&
                  results.data.map(
                    (route) => (
                      <Paper
                        key={
                          route.route
                            ._id
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
                            route
                              .route
                              .routeNumber
                          }
                        </Typography>

                        <Typography
                          color="text.secondary"
                          sx={{
                            mt: 0.5
                          }}
                        >
                          {
                            route
                              .route
                              .name
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
                        key={`${route.firstRoute._id}-${route.secondRoute._id}-${index}`}
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
                                .firstRoute
                                .routeNumber
                            }
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {
                              route
                                .firstRoute
                                .name
                            }
                          </Typography>

                          {renderStops(
                            route
                              .firstJourneyStops
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
                            sx={{
                              mt: 0.5
                            }}
                          >
                            Get off at{" "}
                            <strong>
                              {
                                route
                                  .transferStop
                                  ?.name
                              }
                            </strong>

                            {route
                              .transferStop
                              ?.nameUrdu &&
                              ` (${route.transferStop.nameUrdu})`}{" "}
                            and take the
                            next bus.
                          </Typography>

                          {route
                            .transferStop
                            ?.nameUrdu && (
                            <Typography
                              sx={{
                                mt: 1,
                                fontWeight: 600,
                                direction:
                                  "rtl"
                              }}
                            >
                              {
                                route
                                  .transferStop
                                  .nameUrdu
                              }{" "}
                              پر اتریں اور
                              اگلی بس لیں۔
                            </Typography>
                          )}
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
                                .secondRoute
                                .routeNumber
                            }
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {
                              route
                                .secondRoute
                                .name
                            }
                          </Typography>

                          {renderStops(
                            route
                              .secondJourneyStops
                          )}
                        </Box>
                      </Paper>
                    )
                  )}
              </Box>
            )}
          </Container>
        </Box>
      )}
    </Box>
  );
}