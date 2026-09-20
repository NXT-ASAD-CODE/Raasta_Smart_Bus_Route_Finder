"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from "@mui/material";

import { getStops, searchRoutes } from "../services/api";

export default function Home() {
  const [stops, setStops] = useState([]);

  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");

  const [loadingStops, setLoadingStops] = useState(true);
  const [searching, setSearching] = useState(false);

  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  useEffect(() => {
    const loadStops = async () => {
      try {
        setLoadingStops(true);
        setError("");

        const response = await getStops();

        setStops(response.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingStops(false);
      }
    };

    loadStops();
  }, []);

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

  const renderStops = (journeyStops) => {
    if (!journeyStops || journeyStops.length === 0) {
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
            stop.name || stop.stop?.name;

          const urduName =
            stop.nameUrdu || stop.stop?.nameUrdu;

          return (
            <Step
              key={`${stop.id || stop.stop?._id}-${index}`}
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
                          journeyStops.length -
                          1
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

        {/* Hero Section */}

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
            Tell us where you want to go, and
            Raasta will explain how to get there.
          </Typography>
        </Box>

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
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {loadingStops ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
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
                onChange={(event) =>
                  setFromStop(
                    event.target.value
                  )
                }
                sx={{
                  mb: 3
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

              {/* Destination Stop */}

              <TextField
                select
                fullWidth
                label="Where do you want to go?"
                value={toStop}
                onChange={(event) =>
                  setToStop(
                    event.target.value
                  )
                }
                sx={{
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

              {/* Search Button */}

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSearch}
                disabled={searching}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem"
                }}
              >
                {searching ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                ) : (
                  "Find My Route"
                )}
              </Button>
            </>
          )}
        </Paper>

        {/* Search Results */}

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
                We could not find a direct or
                one-transfer route between these
                stops.
              </Alert>
            )}

            {/* Direct Route */}

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

            {/* One Transfer Route */}

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

                    {/* Transfer Alert */}

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
                        🔄 Change Bus — بس
                        تبدیل کریں
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