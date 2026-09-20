"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
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
      setError("Please select both starting and destination stops.");
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        py: { xs: 5, md: 8 }
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
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
              color: "text.primary",
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
            Tell us where you want to go, and Raasta
            will help you understand how to get there.
          </Typography>
        </Box>

        {/* Search Card */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
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
              sx={{ mb: 3 }}
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
                py: 4
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
                  setFromStop(event.target.value)
                }
                sx={{ mb: 3 }}
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
                  setToStop(event.target.value)
                }
                sx={{ mb: 3 }}
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

        {/* Results */}
        {results && (
          <Paper
            elevation={3}
            sx={{
              mt: 4,
              p: { xs: 3, sm: 4 },
              borderRadius: 3
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 1
              }}
            >
              Your Journey
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 3
              }}
            >
              {results.count === 0
                ? "No route found."
                : `${results.count} route option${results.count > 1
                  ? "s"
                  : ""
                } found`}
            </Typography>

            {results.count === 0 && (
              <Alert severity="info">
                We could not find a direct or
                one-transfer route between these
                stops.
              </Alert>
            )}

            {/* Direct Routes */}
            {results.type === "direct" &&
              results.data.map((route) => (
                <Box
                  key={route.routeId}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 3,
                    mb: 2
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600
                    }}
                  >
                    {route.routeNumber}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ mt: 0.5 }}
                  >
                    {route.routeName}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      mt: 1
                    }}
                  >
                    {route.startPoint} →{" "}
                    {route.endPoint}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    {route.stops.map((item) => (
                      <Typography
                        key={item.sequence}
                        variant="body2"
                        sx={{ mb: 0.5 }}
                      >
                        {item.sequence}.{" "}
                        {item.stop?.name}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}

            {/* One Transfer Routes */}
            {results.type === "one-transfer" &&
              results.data.map((route, index) => (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 3,
                    mb: 2
                  }}
                >
                  <Alert
                    severity="info"
                    sx={{ mb: 3 }}
                  >
                    Change bus at{" "}
                    <strong>
                      {
                        route.transferStop
                          .name
                      }
                    </strong>
                  </Alert>

                  {route.journey.map(
                    (journey, journeyIndex) => (
                      <Box
                        key={
                          journey.routeId.toString()
                        }
                        sx={{
                          mb:
                            journeyIndex ===
                              0
                              ? 3
                              : 0
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600
                          }}
                        >
                          Bus{" "}
                          {
                            journey.routeNumber
                          }
                        </Typography>

                        <Typography
                          variant="body1"
                          sx={{
                            mt: 0.5
                          }}
                        >
                          {
                            journey.routeName
                          }
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            mt: 1
                          }}
                        >
                          {journey.from}{" "}
                          →{" "}
                          {journey.to}
                        </Typography>

                        <Box
                          sx={{
                            mt: 2
                          }}
                        >
                          {journey.stops.map(
                            (
                              stop
                            ) => (
                              <Typography
                                key={
                                  stop.sequence
                                }
                                variant="body2"
                                sx={{
                                  mb: 0.5
                                }}
                              >
                                {
                                  stop.sequence
                                }
                                .{" "}
                                {
                                  stop.name
                                }
                              </Typography>
                            )
                          )}
                        </Box>
                      </Box>
                    )
                  )}
                </Box>
              ))}
          </Paper>
        )}
      </Container>
    </Box>
  );
}