"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
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
  const [cities, setCities] = useState([]);
  const [stops, setStops] = useState([]);

  const [selectedCity, setSelectedCity] =
    useState("");

  const [fromStop, setFromStop] =
    useState("");

  const [toStop, setToStop] =
    useState("");

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
  | Filter Stops by Selected City
  |--------------------------------------------------------------------------
  */

  const cityStops = stops.filter(
    (stop) =>
      stop.city?._id === selectedCity ||
      stop.city === selectedCity
  );

  /*
  |--------------------------------------------------------------------------
  | City Change
  |--------------------------------------------------------------------------
  */

  const handleCityChange = (event) => {
    const cityId = event.target.value;

    setSelectedCity(cityId);

    // Clear old stops when city changes
    setFromStop("");
    setToStop("");

    // Clear old search results
    setResults(null);
    setError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Search Routes
  |--------------------------------------------------------------------------
  */

  const handleSearch = async () => {
    if (!selectedCity) {
      setError(
        "Please select a city first."
      );

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
  | Render Stop Name
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
        <Typography
          color="text.secondary"
        >
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
        backgroundColor: "#f5f7fa",
        py: {
          xs: 4,
          md: 7
        }
      }}
    >
      <Container maxWidth="md">

        {/* =========================================================
            HERO SECTION
        ========================================================= */}

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
              }
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
            Tell us where you want to go,
            and Raasta will explain how to
            get there.
          </Typography>
        </Box>

        {/* =========================================================
            SEARCH CARD
        ========================================================= */}

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

          {loadingData ? (
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
              {/* =================================================
                  CITY
              ================================================= */}

              <TextField
                select
                fullWidth
                required
                label="Select City"
                value={selectedCity}
                onChange={
                  handleCityChange
                }
                sx={{
                  mb: 3
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

              {/* =================================================
                  STARTING STOP
              ================================================= */}

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
                disabled={!selectedCity}
                helperText={
                  !selectedCity
                    ? "Select a city first."
                    : cityStops.length === 0
                    ? "No stops available for this city."
                    : ""
                }
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

              {/* =================================================
                  SWAP BUTTON
              ================================================= */}

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

              {/* =================================================
                  DESTINATION STOP
              ================================================= */}

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
                disabled={!selectedCity}
                helperText={
                  !selectedCity
                    ? "Select a city first."
                    : cityStops.length === 0
                    ? "No stops available for this city."
                    : ""
                }
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

              {/* =================================================
                  SEARCH BUTTON
              ================================================= */}

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={
                  handleSearch
                }
                disabled={
                  searching ||
                  !selectedCity ||
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
            </>
          )}
        </Paper>

        {/* =========================================================
            SEARCH RESULTS
        ========================================================= */}

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

            {/* =====================================================
                NO RESULTS
            ===================================================== */}

            {results.count === 0 && (
              <Alert severity="info">
                We could not find a direct
                or one-transfer route
                between these stops.
              </Alert>
            )}

            {/* =====================================================
                DIRECT ROUTES
            ===================================================== */}

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
                        route.route
                          .routeNumber
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
                        route.route
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

            {/* =====================================================
                ONE TRANSFER ROUTES
            ===================================================== */}

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

                    {/* =================================================
                        FIRST BUS
                    ================================================= */}

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

                    {/* =================================================
                        TRANSFER ALERT
                    ================================================= */}

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
                              ?.name
                          }
                        </strong>

                        {route
                          .transferStop
                          ?.nameUrdu && (
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
                        and take the
                        next bus.
                      </Typography>

                      {route
                        .transferStop
                        ?.nameUrdu && (
                        <Typography
                          variant="body1"
                          sx={{
                            mt: 1,
                            fontSize: {
                              xs: "1rem",
                              sm: "1.15rem"
                            },
                            fontWeight: 600,
                            direction:
                              "rtl",
                            textAlign:
                              "left"
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

                    {/* =================================================
                        SECOND BUS
                    ================================================= */}

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
  );
}