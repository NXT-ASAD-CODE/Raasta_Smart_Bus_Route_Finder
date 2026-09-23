"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlagIcon from "@mui/icons-material/Flag";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import RouteIcon from "@mui/icons-material/Route";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  getCities,
  getStops,
  searchRoutes
} from "../services/api";

export default function Home() {
  const [cities, setCities] = useState([]);
  const [stops, setStops] = useState([]);

  const [selectedCity, setSelectedCity] = useState(null);
  const [cityDialogOpen, setCityDialogOpen] = useState(false);

  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");

  const [results, setResults] = useState(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [error, setError] = useState("");

  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const savedSearches =
      localStorage.getItem("raastaRecentSearches");

    if (savedSearches) {
      try {
        setRecentSearches(
          JSON.parse(savedSearches)
        );
      } catch (error) {
        console.error(
          "Failed to load recent searches:",
          error
        );
      }
    }

    const loadInitialData = async () => {
      try {
        setInitialLoading(true);

        await Promise.all([
          loadCities(),
          loadStops()
        ]);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const loadCities = async () => {
    try {
      const response = await getCities();

      setCities(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load cities:",
        error
      );
    }
  };

  const loadStops = async () => {
    try {
      const response = await getStops();

      setStops(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load stops:",
        error
      );
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);

    setCityDialogOpen(false);

    setFromStop("");
    setToStop("");

    setResults(null);
    setError("");
  };

  const saveRecentSearch = (fromId, toId) => {
    const from = cityStops.find(
      (stop) => stop._id === fromId
    );

    const to = cityStops.find(
      (stop) => stop._id === toId
    );

    if (!from || !to) {
      return;
    }

    const newSearch = {
      id: `${fromId}-${toId}`,
      fromId,
      toId,
      fromName: from.name,
      fromNameUrdu: from.nameUrdu || "",
      toName: to.name,
      toNameUrdu: to.nameUrdu || ""
    };

    const filteredSearches =
      recentSearches.filter(
        (search) =>
          search.fromId !== fromId ||
          search.toId !== toId
      );

    const updatedSearches = [
      newSearch,
      ...filteredSearches
    ].slice(0, 5);

    setRecentSearches(updatedSearches);

    localStorage.setItem(
      "raastaRecentSearches",
      JSON.stringify(updatedSearches)
    );
  };

  const handleRecentSearch = (search) => {
    setFromStop(search.fromId);
    setToStop(search.toId);

    setResults(null);
    setError("");
  };

  const handleFindRoute = async () => {
    setError("");
    setResults(null);

    if (!fromStop || !toStop) {
      setError(
        "Please select both your starting point and destination."
      );

      return;
    }

    if (fromStop === toStop) {
      setError(
        "Starting point and destination cannot be the same."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await searchRoutes(
        fromStop,
        toStop
      );

      setResults(response);

      saveRecentSearch(
        fromStop,
        toStop
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        "Unable to find a route. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setFromStop(toStop);
    setToStop(fromStop);

    setResults(null);
    setError("");
  };

  const handleBackHome = () => {
    setSelectedCity(null);

    setFromStop("");
    setToStop("");

    setResults(null);
    setError("");
  };

  const cityStops = stops.filter(
    (stop) =>
      stop.city?._id === selectedCity?._id ||
      stop.city === selectedCity?._id
  );

  if (initialLoading) {
    return (
      <Box
        sx={{
          minHeight:
            "calc(100svh - 76px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #f8fbff 0%, #eef6ff 50%, #ffffff 100%)"
        }}
      >
        <CircularProgress
          sx={{
            color: "#1976d2"
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100svh - 76px)",
        background:
          "linear-gradient(135deg, #f8fbff 0%, #eef6ff 50%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background decoration */}

      <Box
        sx={{
          position: "absolute",
          width: {
            xs: 220,
            sm: 300,
            md: 350
          },
          height: {
            xs: 220,
            sm: 300,
            md: 350
          },
          borderRadius: "50%",
          background:
            "rgba(25, 118, 210, 0.07)",
          top: {
            xs: -100,
            md: -150
          },
          right: {
            xs: -100,
            md: -100
          },
          pointerEvents: "none"
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: {
            xs: 200,
            sm: 260,
            md: 300
          },
          height: {
            xs: 200,
            sm: 260,
            md: 300
          },
          borderRadius: "50%",
          background:
            "rgba(25, 118, 210, 0.05)",
          bottom: -130,
          left: -100,
          pointerEvents: "none"
        }}
      />

      {!selectedCity ? (
        <Box
          sx={{
            height: {
              xs: "calc(100dvh - 68px)",
              md: "calc(100dvh - 76px)"
            },
            minHeight: {
              xs: "560px",
              md: "650px"
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            px: {
              xs: 2,
              sm: 3,
              md: 4
            },
            overflow: "hidden"
          }}
        >
          {/* Background circle */}

          <Box
            sx={{
              position: "absolute",
              width: {
                xs: 220,
                md: 360
              },
              height: {
                xs: 220,
                md: 360
              },
              borderRadius: "50%",
              backgroundColor:
                "rgba(25, 118, 210, 0.06)",
              top: {
                xs: -100,
                md: -150
              },
              right: {
                xs: -100,
                md: -80
              },
              pointerEvents: "none"
            }}
          />

          {/* Main content */}

          <Box
            sx={{
              width: "100%",
              maxWidth: 1200,
              mx: "auto",
              textAlign: "center",
              position: "relative",
              zIndex: 1,

              display: "flex",
              flexDirection: "column",
              alignItems: "center",

              transform: {
                xs: "none",
                sm: "translateY(-5px)",
                md: "translateY(-8px)"
              }
            }}
          >
            {/* Badge */}

            <Chip
              icon={
                <DirectionsBusIcon
                  sx={{
                    color:
                      "#1976d2 !important"
                  }}
                />
              }
              label="SMART PUBLIC TRANSPORT"
              sx={{
                mb: {
                  xs: 2,
                  sm: 2.2,
                  md: 2.5
                },
                px: {
                  xs: 0.5,
                  sm: 1
                },
                py: {
                  xs: 1.8,
                  sm: 2
                },
                height: "auto",
                marginTop: "-50px",
                borderRadius: "50px",
                backgroundColor: "#e3f2fd",
                color: "#1565c0",
                fontWeight: 700,
                letterSpacing: {
                  xs: "0.5px",
                  sm: "1px"
                },
                fontSize: {
                  xs: "0.72rem",
                  sm: "0.82rem",
                  md: "0.88rem"
                }
              }}
            />

            {/* Raasta */}

            <Typography
              component="h1"
              sx={{
                fontWeight: 900,
                fontSize: {
                  xs: "clamp(3.8rem, 15vw, 5rem)",
                  sm: "clamp(4.5rem, 10vw, 6.5rem)",
                  md: "clamp(5rem, 8vw, 7rem)"
                },
                lineHeight: 0.9,
                letterSpacing: {
                  xs: "-3px",
                  sm: "-4px",
                  md: "-6px"
                },
                color: "#111827",
                mb: {
                  xs: 1.5,
                  sm: 1.5,
                  md: 1.8
                }
              }}
            >
              Raasta
            </Typography>

            {/* Subtitle */}

            <Typography
              component="h2"
              sx={{
                fontSize: {
                  xs: "1.35rem",
                  sm: "1.9rem",
                  md: "2.5rem"
                },
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#1976d2",
                mb: {
                  xs: 1.5,
                  sm: 1.5,
                  md: 1.8
                }
              }}
            >
              Your Journey Starts Here.
            </Typography>

            {/* Description */}

            <Typography
              sx={{
                maxWidth: {
                  xs: 350,
                  sm: 650,
                  md: 850
                },
                mx: "auto",
                color: "#64748b",
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                  md: "1.08rem"
                },
                lineHeight: 1.65,
                mb: {
                  xs: 2,
                  sm: 2.3,
                  md: 2.5
                }
              }}
            >
              Tell us where you are and where you want to
              go. Raasta helps you understand which bus
              route to take and how to reach your
              destination.
            </Typography>

            {/* Route visual */}

            <Box
              sx={{
                width: {
                  xs: "88%",
                  sm: "75%",
                  md: 850
                },
                maxWidth: 850,
                mx: "auto",
                mb: {
                  xs: 2,
                  sm: 2.3,
                  md: 2.5
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {/* Starting point */}

              <Box
                sx={{
                  width: {
                    xs: 14,
                    sm: 17
                  },
                  height: {
                    xs: 14,
                    sm: 17
                  },
                  flexShrink: 0,
                  borderRadius: "50%",
                  backgroundColor: "#1976d2",
                  boxShadow:
                    "0 0 0 7px rgba(25,118,210,0.12)"
                }}
              />

              {/* Line */}

              <Box
                sx={{
                  height: 3,
                  flex: 1,
                  background:
                    "linear-gradient(90deg, #1976d2, #90caf9)"
                }}
              />

              {/* Bus */}

              <DirectionsBusIcon
                sx={{
                  flexShrink: 0,
                  fontSize: {
                    xs: 42,
                    sm: 48,
                    md: 54
                  },
                  color: "#1976d2",
                  mx: {
                    xs: 1,
                    sm: 1.5,
                    md: 2
                  }
                }}
              />

              {/* Line */}

              <Box
                sx={{
                  height: 3,
                  flex: 1,
                  background:
                    "linear-gradient(90deg, #90caf9, #1976d2)"
                }}
              />

              {/* Destination */}

              <Box
                sx={{
                  width: {
                    xs: 14,
                    sm: 17
                  },
                  height: {
                    xs: 14,
                    sm: 17
                  },
                  flexShrink: 0,
                  borderRadius: "50%",
                  backgroundColor: "#1565c0",
                  boxShadow:
                    "0 0 0 7px rgba(21,101,192,0.12)"
                }}
              />
            </Box>

            {/* MAIN BUTTON */}

            <Button
              variant="contained"
              onClick={() =>
                setCityDialogOpen(true)
              }
              startIcon={
                <LocationOnIcon />
              }
              disableElevation
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto"
                },
                maxWidth: {
                  xs: 400,
                  sm: "none"
                },
                minWidth: {
                  sm: 380,
                  md: 470
                },
                px: {
                  xs: 2,
                  sm: 4,
                  md: 5
                },
                py: {
                  xs: 1.25,
                  sm: 1.4,
                  md: 1.5
                },
                borderRadius: "50px",
                textTransform: "none",
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                  md: "1.05rem"
                },
                fontWeight: 700,
                whiteSpace: "nowrap",
                backgroundColor: "#1976d2",
                boxShadow:
                  "0 8px 25px rgba(25,118,210,0.28)",
                "&:hover": {
                  backgroundColor: "#1565c0",
                  boxShadow:
                    "0 10px 30px rgba(25,118,210,0.4)"
                }
              }}
            >
              Select Your City to Check the Route
            </Button>
          </Box>
        </Box>
      ) : (
        /* =====================================================
           ROUTE FINDER
        ====================================================== */

        <Box
          sx={{
            minHeight:
              "calc(100svh - 76px)",
            py: {
              xs: 3,
              sm: 5
            },
            px: {
              xs: 2,
              sm: 3
            },
            position: "relative"
          }}
        >
          <Box
            sx={{
              maxWidth: 1050,
              mx: "auto"
            }}
          >
            {/* Header */}

            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  sm: "center"
                },
                justifyContent:
                  "space-between",
                gap: 2,
                mb: 4,
                flexDirection: {
                  xs: "column",
                  sm: "row"
                }
              }}
            >
              <Box>
                <Button
                  startIcon={
                    <ArrowBackIcon />
                  }
                  onClick={
                    handleBackHome
                  }
                  sx={{
                    textTransform:
                      "none",
                    color: "#64748b",
                    fontWeight: 600,
                    px: 0,
                    mb: 1,
                    "&:hover": {
                      background:
                        "transparent",
                      color: "#1976d2"
                    }
                  }}
                >
                  Back to Home
                </Button>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "2.5rem",
                      sm: "3.5rem"
                    },
                    fontWeight: 800,
                    color: "#111827",
                    lineHeight: 1
                  }}
                >
                  Raasta
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    mt: 1
                  }}
                >
                  Find the best bus route for
                  your journey.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={
                  <LocationOnIcon />
                }
                onClick={() =>
                  setCityDialogOpen(
                    true
                  )
                }
                sx={{
                  textTransform:
                    "none",
                  borderRadius: "12px",
                  fontWeight: 700,
                  borderColor:
                    "#90caf9",
                  color: "#1565c0"
                }}
              >
                {selectedCity.name}
              </Button>
            </Box>

            {/* =====================================================
                           ROUTE SEARCH CARD
                        ====================================================== */}

            <Card
              elevation={0}
              sx={{
                borderRadius: "24px",
                border:
                  "1px solid #dbe5f0",
                backgroundColor:
                  "#ffffff",
                mb: 4,
                overflow: "hidden"
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 2.5,
                    sm: 4
                  },
                  "&:last-child": {
                    pb: {
                      xs: 2.5,
                      sm: 4
                    }
                  }
                }}
              >
                {/* Header */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 1.5,
                    mb: 3
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius:
                        "12px",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      backgroundColor:
                        "#e3f2fd",
                      color:
                        "#1976d2",
                      flexShrink: 0
                    }}
                  >
                    <RouteIcon />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize:
                          "1.25rem",
                        color:
                          "#0f172a"
                      }}
                    >
                      Plan Your Journey
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          "#64748b",
                        fontSize:
                          "0.85rem",
                        mt: 0.2
                      }}
                    >
                      Select where you are and where you want to go.
                    </Typography>
                  </Box>
                </Box>

                {/* Route selection */}

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                    {
                      xs: "1fr",
                      md: "1fr auto 1fr"
                    },
                    gap: {
                      xs: 2,
                      md: 2.5
                    },
                    alignItems:
                      "end"
                  }}
                >
                  {/* Starting Point */}

                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color:
                          "#334155",
                        mb: 1
                      }}
                    >
                      Starting Point
                    </Typography>

                    <Select
                      fullWidth
                      value={
                        fromStop
                      }
                      onChange={(
                        event
                      ) =>
                        setFromStop(
                          event
                            .target
                            .value
                        )
                      }
                      displayEmpty
                      IconComponent={
                        KeyboardArrowDownIcon
                      }
                      renderValue={(
                        selectedId
                      ) => {
                        if (
                          !selectedId
                        ) {
                          return (
                            <Box
                              sx={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: 1,
                                color:
                                  "#64748b"
                              }}
                            >
                              <LocationOnIcon
                                sx={{
                                  color:
                                    "#1976d2"
                                }}
                              />

                              <Typography
                                sx={{
                                  fontSize:
                                  {
                                    xs: "0.88rem",
                                    sm: "0.95rem"
                                  }
                                }}
                              >
                                Choose your starting stop
                              </Typography>
                            </Box>
                          );
                        }

                        const stop =
                          cityStops.find(
                            (
                              item
                            ) =>
                              item._id ===
                              selectedId
                          );

                        return stop ? (
                          <StopLabel
                            stop={
                              stop
                            }
                          />
                        ) : (
                          ""
                        );
                      }}
                      sx={{
                        ...selectStyles,
                        "& .MuiSelect-select":
                        {
                          py: 1.7
                        }
                      }}
                      MenuProps={{
                        slotProps: {
                          paper: {
                            sx: {
                              mt: 1,
                              borderRadius:
                                "16px",
                              border:
                                "1px solid #e2e8f0",
                              boxShadow:
                                "0 12px 30px rgba(15,23,42,0.12)",
                              maxHeight: 360
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem
                        value=""
                        disabled
                      >
                        Choose your starting stop
                      </MenuItem>

                      {cityStops.map(
                        (
                          stop
                        ) => (
                          <MenuItem
                            key={
                              stop._id
                            }
                            value={
                              stop._id
                            }
                            sx={{
                              py: 1.5,
                              px: 2,
                              borderRadius:
                                "10px",
                              mx: 0.5,
                              mb: 0.3,
                              "&:hover":
                              {
                                backgroundColor:
                                  "#f0f7ff"
                              },
                              "&.Mui-selected":
                              {
                                backgroundColor:
                                  "#e3f2fd"
                              },
                              "&.Mui-selected:hover":
                              {
                                backgroundColor:
                                  "#dbeafe"
                              }
                            }}
                          >
                            <Box
                              sx={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: 1.5,
                                width:
                                  "100%"
                              }}
                            >
                              <Box
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius:
                                    "10px",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  backgroundColor:
                                    "#eff6ff",
                                  color:
                                    "#1976d2",
                                  flexShrink: 0
                                }}
                              >
                                <LocationOnIcon
                                  sx={{
                                    fontSize:
                                      21
                                  }}
                                />
                              </Box>

                              <StopLabel
                                stop={
                                  stop
                                }
                              />
                            </Box>
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </Box>

                  {/* Swap */}

                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "center",
                      alignItems:
                        "center",
                      pb: {
                        xs: 0,
                        md: 0.3
                      }
                    }}
                  >
                    <IconButton
                      onClick={
                        handleSwap
                      }
                      disabled={
                        !fromStop &&
                        !toStop
                      }
                      aria-label="Swap starting point and destination"
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor:
                          "#e3f2fd",
                        color:
                          "#1976d2",
                        border:
                          "1px solid #bbdefb",
                        transition:
                          "all 0.2s ease",
                        "&:hover":
                        {
                          backgroundColor:
                            "#bbdefb",
                          transform:
                            "rotate(180deg)"
                        },
                        "&.Mui-disabled":
                        {
                          backgroundColor:
                            "#f1f5f9",
                          color:
                            "#94a3b8",
                          borderColor:
                            "#e2e8f0"
                        }
                      }}
                    >
                      <SwapVertIcon />
                    </IconButton>
                  </Box>

                  {/* Destination */}

                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color:
                          "#334155",
                        mb: 1
                      }}
                    >
                      Destination
                    </Typography>

                    <Select
                      fullWidth
                      value={
                        toStop
                      }
                      onChange={(
                        event
                      ) =>
                        setToStop(
                          event
                            .target
                            .value
                        )
                      }
                      displayEmpty
                      IconComponent={
                        KeyboardArrowDownIcon
                      }
                      renderValue={(
                        selectedId
                      ) => {
                        if (
                          !selectedId
                        ) {
                          return (
                            <Box
                              sx={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: 1,
                                color:
                                  "#64748b"
                              }}
                            >
                              <FlagIcon
                                sx={{
                                  color:
                                    "#1976d2"
                                }}
                              />

                              <Typography
                                sx={{
                                  fontSize:
                                  {
                                    xs: "0.88rem",
                                    sm: "0.95rem"
                                  }
                                }}
                              >
                                Choose your destination
                              </Typography>
                            </Box>
                          );
                        }

                        const stop =
                          cityStops.find(
                            (
                              item
                            ) =>
                              item._id ===
                              selectedId
                          );

                        return stop ? (
                          <StopLabel
                            stop={
                              stop
                            }
                          />
                        ) : (
                          ""
                        );
                      }}
                      sx={{
                        ...selectStyles,
                        "& .MuiSelect-select":
                        {
                          py: 1.7
                        }
                      }}
                      MenuProps={{
                        slotProps: {
                          paper: {
                            sx: {
                              mt: 1,
                              borderRadius:
                                "16px",
                              border:
                                "1px solid #e2e8f0",
                              boxShadow:
                                "0 12px 30px rgba(15,23,42,0.12)",
                              maxHeight: 360
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem
                        value=""
                        disabled
                      >
                        Choose your destination
                      </MenuItem>

                      {cityStops.map(
                        (
                          stop
                        ) => (
                          <MenuItem
                            key={
                              stop._id
                            }
                            value={
                              stop._id
                            }
                            sx={{
                              py: 1.5,
                              px: 2,
                              borderRadius:
                                "10px",
                              mx: 0.5,
                              mb: 0.3,
                              "&:hover":
                              {
                                backgroundColor:
                                  "#f0f7ff"
                              },
                              "&.Mui-selected":
                              {
                                backgroundColor:
                                  "#e3f2fd"
                              },
                              "&.Mui-selected:hover":
                              {
                                backgroundColor:
                                  "#dbeafe"
                              }
                            }}
                          >
                            <Box
                              sx={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: 1.5,
                                width:
                                  "100%"
                              }}
                            >
                              <Box
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius:
                                    "10px",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  backgroundColor:
                                    "#eff6ff",
                                  color:
                                    "#1976d2",
                                  flexShrink: 0
                                }}
                              >
                                <FlagIcon
                                  sx={{
                                    fontSize:
                                      21
                                  }}
                                />
                              </Box>

                              <StopLabel
                                stop={
                                  stop
                                }
                              />
                            </Box>
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </Box>
                </Box>

                {/* Selected route summary */}

                {(fromStop ||
                  toStop) && (
                    <Box
                      sx={{
                        mt: 2.5,
                        p: 1.5,
                        borderRadius:
                          "14px",
                        backgroundColor:
                          "#f8fafc",
                        border:
                          "1px solid #e2e8f0",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: 1,
                        flexWrap:
                          "wrap"
                      }}
                    >
                      <Typography
                        sx={{
                          color:
                            "#64748b",
                          fontSize:
                            "0.82rem",
                          fontWeight:
                            600
                        }}
                      >
                        Journey:
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            "#1976d2",
                          fontWeight:
                            800,
                          fontSize:
                            "0.88rem"
                        }}
                      >
                        {fromStop
                          ? cityStops.find(
                            (
                              stop
                            ) =>
                              stop._id ===
                              fromStop
                          )?.name
                          : "Starting point"}
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            "#94a3b8",
                          fontWeight:
                            800
                        }}
                      >
                        →
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            "#1565c0",
                          fontWeight:
                            800,
                          fontSize:
                            "0.88rem"
                        }}
                      >
                        {toStop
                          ? cityStops.find(
                            (
                              stop
                            ) =>
                              stop._id ===
                              toStop
                          )?.name
                          : "Destination"}
                      </Typography>
                    </Box>
                  )}

                {/* Error */}

                {error && (
                  <Alert
                    severity="error"
                    onClose={() =>
                      setError("")
                    }
                    sx={{
                      mt: 2.5,
                      borderRadius:
                        "14px"
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Search button */}

                <Button
                  fullWidth
                  variant="contained"
                  onClick={
                    handleFindRoute
                  }
                  disabled={
                    loading
                  }
                  startIcon={
                    loading ? (
                      <CircularProgress
                        size={20}
                        color="inherit"
                      />
                    ) : (
                      <SearchIcon />
                    )
                  }
                  disableElevation
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius:
                      "14px",
                    textTransform:
                      "none",
                    fontWeight: 800,
                    fontSize:
                      "1rem",
                    backgroundColor:
                      "#1976d2",
                    boxShadow:
                      "0 8px 20px rgba(25,118,210,0.18)",
                    "&:hover":
                    {
                      backgroundColor:
                        "#1565c0",
                      boxShadow:
                        "0 10px 25px rgba(25,118,210,0.28)"
                    }
                  }}
                >
                  {loading
                    ? "Finding Route..."
                    : "Find My Route"}
                </Button>
              </CardContent>
            </Card>

            {/* =====================================================
                           RECENT SEARCHES
                        ====================================================== */}

            {recentSearches.length >
              0 && (
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      mb: 1.5
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight:
                            800,
                          color:
                            "#0f172a",
                          fontSize:
                            "1.15rem"
                        }}
                      >
                        Recent Searches
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            "#64748b",
                          fontSize:
                            "0.82rem",
                          mt: 0.2
                        }}
                      >
                        Quickly use a previous journey.
                      </Typography>
                    </Box>
                  </Box>

                  <Stack spacing={1.2}>
                    {recentSearches.map(
                      (
                        search
                      ) => (
                        <Card
                          key={
                            search.id
                          }
                          elevation={
                            0
                          }
                          onClick={() =>
                            handleRecentSearch(
                              search
                            )
                          }
                          sx={{
                            borderRadius:
                              "16px",
                            border:
                              "1px solid #e2e8f0",
                            cursor:
                              "pointer",
                            transition:
                              "all 0.2s ease",
                            "&:hover":
                            {
                              borderColor:
                                "#90caf9",
                              backgroundColor:
                                "#f8fbff",
                              transform:
                                "translateY(-1px)",
                              boxShadow:
                                "0 6px 18px rgba(15,23,42,0.06)"
                            }
                          }}
                        >
                          <CardContent
                            sx={{
                              p: 2,
                              "&:last-child":
                              {
                                pb: 2
                              }
                            }}
                          >
                            <Box
                              sx={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: 1.5
                              }}
                            >
                              <Box
                                sx={{
                                  width: 38,
                                  height: 38,
                                  borderRadius:
                                    "10px",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  backgroundColor:
                                    "#e3f2fd",
                                  color:
                                    "#1976d2",
                                  flexShrink: 0
                                }}
                              >
                                <LocationOnIcon
                                  sx={{
                                    fontSize:
                                      21
                                  }}
                                />
                              </Box>

                              <Box
                                sx={{
                                  flex: 1,
                                  minWidth: 0
                                }}
                              >
                                <Box
                                  sx={{
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    gap: 1,
                                    flexWrap:
                                      "wrap"
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight:
                                        800,
                                      color:
                                        "#0f172a",
                                      fontSize:
                                        "0.92rem"
                                    }}
                                  >
                                    {
                                      search.fromName
                                    }
                                  </Typography>

                                  <Typography
                                    sx={{
                                      color:
                                        "#94a3b8",
                                      fontWeight:
                                        800
                                    }}
                                  >
                                    →
                                  </Typography>

                                  <Typography
                                    sx={{
                                      fontWeight:
                                        800,
                                      color:
                                        "#1565c0",
                                      fontSize:
                                        "0.92rem"
                                    }}
                                  >
                                    {
                                      search.toName
                                    }
                                  </Typography>
                                </Box>

                                {(search.fromNameUrdu ||
                                  search.toNameUrdu) && (
                                    <Typography
                                      lang="ur"
                                      dir="rtl"
                                      sx={{
                                        color:
                                          "#1976d2",
                                        fontSize:
                                          "0.82rem",
                                        fontWeight:
                                          700,
                                        mt: 0.3
                                      }}
                                    >
                                      {
                                        search.fromNameUrdu
                                      }{" "}
                                      →
                                      {" "}
                                      {
                                        search.toNameUrdu
                                      }
                                    </Typography>
                                  )}
                              </Box>

                              <ArrowBackIcon
                                sx={{
                                  transform:
                                    "rotate(180deg)",
                                  color:
                                    "#94a3b8",
                                  flexShrink: 0
                                }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </Stack>
                </Box>
              )}

            {/* Results */}

            {results && (
              <RouteResults
                results={results}
              />
            )}
          </Box>
        </Box>
      )}

      {/* =====================================================
               CITY SELECTION DIALOG
            ====================================================== */}

      <Dialog
        open={cityDialogOpen}
        onClose={() =>
          setCityDialogOpen(false)
        }
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: "24px",
              p: 1
            }
          }
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            fontWeight: 800,
            color: "#0f172a"
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.4rem"
              }}
            >
              Select Your City
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize:
                  "0.9rem",
                mt: 0.5
              }}
            >
              Choose a city to find bus routes.
            </Typography>
          </Box>

          <IconButton
            onClick={() =>
              setCityDialogOpen(
                false
              )
            }
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {cities.length === 0 ? (
            <Box
              sx={{
                py: 5,
                textAlign: "center"
              }}
            >
              <Typography
                sx={{
                  color: "#64748b"
                }}
              >
                No cities are available yet.
              </Typography>
            </Box>
          ) : (
            <Stack
              spacing={1.5}
              sx={{ pb: 2 }}
            >
              {cities.map((city) => (
                <Button
                  key={city._id}
                  onClick={() =>
                    handleCitySelect(
                      city
                    )
                  }
                  fullWidth
                  sx={{
                    justifyContent:
                      "flex-start",
                    textAlign:
                      "left",
                    textTransform:
                      "none",
                    p: 2,
                    borderRadius:
                      "14px",
                    border:
                      "1px solid #e2e8f0",
                    color:
                      "#0f172a",
                    "&:hover":
                    {
                      backgroundColor:
                        "#f0f7ff",
                      borderColor:
                        "#90caf9"
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius:
                        "12px",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      backgroundColor:
                        "#e3f2fd",
                      color:
                        "#1976d2",
                      mr: 2,
                      flexShrink: 0
                    }}
                  >
                    <LocationOnIcon />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontWeight:
                          800,
                        fontSize:
                          "1rem"
                      }}
                    >
                      {city.name}
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          "#64748b",
                        fontSize:
                          "0.85rem"
                      }}
                    >
                      {city.province
                        ? `${city.province}, `
                        : ""}
                      {city.country ||
                        "Pakistan"}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

/* =========================================================
   SELECT STYLES
========================================================= */

const selectStyles = {
  borderRadius: "16px",
  backgroundColor: "#f8fafc",

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#dbe3ec"
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#90caf9"
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1976d2"
  }
};

/* =========================================================
   STOP LABEL
========================================================= */

function StopLabel({ stop }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          color: "#334155"
        }}
      >
        {stop.name}
      </Typography>

      {stop.nameUrdu && (
        <Typography
          sx={{
            fontSize: {
              xs: "1.15rem",
              sm: "1.3rem",
              md: "1.45rem"
            },
            fontWeight: 800,
            color: "#1976d2",
            lineHeight: 1.7,
            direction: "rtl",
            textAlign: "left"
          }}
        >
          {stop.nameUrdu}
        </Typography>
      )}
    </Box>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({ icon, title, text }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "18px",
        border:
          "1px solid rgba(25,118,210,0.12)",
        backgroundColor:
          "rgba(255,255,255,0.72)"
      }}
    >
      <CardContent
        sx={{
          py: 2,
          "&:last-child": {
            pb: 2
          }
        }}
      >
        <Typography
          sx={{
            fontSize: "1.5rem",
            mb: 0.5
          }}
        >
          {icon}
        </Typography>

        <Typography
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            fontSize: "0.95rem"
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            fontSize: "0.78rem",
            mt: 0.5
          }}
        >
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   ROUTE RESULTS
========================================================= */

function RouteResults({ results }) {
  const [sortBy, setSortBy] = useState("default");

  if (!results || results.count === 0) {
    return <NoRouteCard />;
  }

  /*
  |--------------------------------------------------------------------------
  | Get stop count
  |--------------------------------------------------------------------------
  */
  const getStopCount = (route) => {
    if (typeof route.stopCount === "number") {
      return route.stopCount;
    }

    if (route.journey) {
      return route.journey.reduce(
        (total, leg) =>
          total + (leg.stops?.length || 0),
        0
      );
    }

    return route.stops?.length || 0;
  };


  /*
  |--------------------------------------------------------------------------
  | Get total travel time
  |--------------------------------------------------------------------------
  */
  const getTravelTime = (route) => {
    /*
    | Direct route
    */
    if (typeof route.totalTravelTime === "number") {
      return route.totalTravelTime;
    }

    if (typeof route.travelTime === "number") {
      return route.travelTime;
    }

    /*
    | One-transfer route
    */
    if (route.journey) {
      return route.journey.reduce(
        (total, leg) =>
          total + Number(leg.travelTime || 0),
        0
      );
    }

    return 0;
  };


  /*
  |--------------------------------------------------------------------------
  | Sort routes
  |--------------------------------------------------------------------------
  */
  const sortedRoutes = [...results.data].sort(
    (a, b) => {
      if (sortBy === "fewest") {
        return (
          getStopCount(a) -
          getStopCount(b)
        );
      }

      if (sortBy === "most") {
        return (
          getStopCount(b) -
          getStopCount(a)
        );
      }

      if (sortBy === "fastest") {
        return (
          getTravelTime(a) -
          getTravelTime(b)
        );
      }

      if (sortBy === "slowest") {
        return (
          getTravelTime(b) -
          getTravelTime(a)
        );
      }

      return 0;
    }
  );


  /*
  |--------------------------------------------------------------------------
  | Route summary
  |--------------------------------------------------------------------------
  */
  const routeSummary =
    results.type === "direct"
      ? `${results.count} ${
          results.count === 1
            ? "route"
            : "routes"
        } found · Direct routes`
      : `${results.count} ${
          results.count === 1
            ? "route"
            : "routes"
        } found · 1 bus change`;


  /*
  |--------------------------------------------------------------------------
  | Sort Control
  |--------------------------------------------------------------------------
  */
  const SortControl = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap"
      }}
    >
      <Typography
        sx={{
          color: "#64748b",
          fontSize: "0.85rem",
          fontWeight: 700
        }}
      >
        Sort by
      </Typography>

      <Select
        size="small"
        value={sortBy}
        onChange={(event) =>
          setSortBy(event.target.value)
        }
        sx={{
          minWidth: 170,
          height: 38,
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          fontSize: "0.85rem",
          fontWeight: 700,
          color: "#334155",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#dbe5f0"
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#90caf9"
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2"
          }
        }}
      >
        <MenuItem value="default">
          Default
        </MenuItem>

        <MenuItem value="fastest">
          Fastest Journey
        </MenuItem>

        <MenuItem value="slowest">
          Longest Journey
        </MenuItem>

        <MenuItem value="fewest">
          Fewest Stops
        </MenuItem>

        <MenuItem value="most">
          Most Stops
        </MenuItem>
      </Select>
    </Box>
  );


  /*
  |--------------------------------------------------------------------------
  | Direct Routes
  |--------------------------------------------------------------------------
  */
  if (results.type === "direct") {
    return (
      <Box>
        <Typography
          sx={{
            color: "#64748b",
            fontSize: "0.9rem",
            fontWeight: 600,
            mb: 1.5
          }}
        >
          {routeSummary}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center"
            },
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
            flexDirection: {
              xs: "column",
              sm: "row"
            }
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            <CheckCircleIcon
              sx={{
                color: "#16a34a"
              }}
            />

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.3rem",
                color: "#0f172a"
              }}
            >
              Direct Route Found
            </Typography>
          </Box>

          <SortControl />
        </Box>

        <Stack spacing={2}>
          {sortedRoutes.map(
            (route, index) => (
              <DirectRouteCard
                key={
                  route.routeId ||
                  index
                }
                route={route}
              />
            )
          )}
        </Stack>
      </Box>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | One Transfer Routes
  |--------------------------------------------------------------------------
  */
  if (results.type === "one-transfer") {
    return (
      <Box>
        <Typography
          sx={{
            color: "#64748b",
            fontSize: "0.9rem",
            fontWeight: 600,
            mb: 1.5
          }}
        >
          {routeSummary}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center"
            },
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
            flexDirection: {
              xs: "column",
              sm: "row"
            }
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            <TransferWithinAStationIcon
              sx={{
                color: "#f59e0b"
              }}
            />

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.3rem",
                color: "#0f172a"
              }}
            >
              1 Bus Change Required
            </Typography>
          </Box>

          <SortControl />
        </Box>

        <Stack spacing={2}>
          {sortedRoutes.map(
            (route, index) => (
              <TransferRouteCard
                key={
                  route.journeyKey ||
                  index
                }
                route={route}
              />
            )
          )}
        </Stack>
      </Box>
    );
  }


  return <NoRouteCard />;
}

/* =========================================================
   DIRECT ROUTE CARD
========================================================= */

function DirectRouteCard({ route }) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: "20px",
                border: "1px solid #dbe5f0",
                backgroundColor: "#ffffff",
                overflow: "hidden"
            }}
        >
            {/* Bus Header */}

            <Box
                sx={{
                    px: { xs: 2.5, sm: 3 },
                    py: 2,
                    background:
                        "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2"
                        }}
                    >
                        <DirectionsBusIcon />
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                color: "#64748b",
                                textTransform: "uppercase",
                                letterSpacing: "0.6px"
                            }}
                        >
                            Bus Route
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 900,
                                fontSize: "1.2rem",
                                color: "#0f172a"
                            }}
                        >
                            {route.routeName}
                        </Typography>
                    </Box>
                </Box>

                <Chip
                    label={`Bus ${route.routeNumber}`}
                    sx={{
                        backgroundColor: "#1976d2",
                        color: "#ffffff",
                        fontWeight: 800,
                        borderRadius: "10px"
                    }}
                />
            </Box>

            {/* Route Information */}

            <CardContent
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3
                    },
                    "&:last-child": {
                        pb: {
                            xs: 2.5,
                            sm: 3
                        }
                    }
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 800,
                            color: "#0f172a"
                        }}
                    >
                        Your Journey
                    </Typography>

                    <Chip
                        label={`${route.stopCount} stops`}
                        size="small"
                        sx={{
                            backgroundColor: "#f1f5f9",
                            color: "#475569",
                            fontWeight: 700
                        }}
                    />
                </Box>

                <Divider sx={{ mb: 2.5 }} />

                <JourneyTimeline
                    stops={route.stops || []}
                />
            </CardContent>
        </Card>
    );
}

/* =========================================================
   TRANSFER ROUTE CARD
========================================================= */

function TransferRouteCard({ route }) {
  const journey = route.journey || [];

  const firstLeg = journey[0];
  const lastLeg =
    journey[journey.length - 1];

  const firstLegStops =
    firstLeg?.stops || [];

  const lastLegStops =
    lastLeg?.stops || [];

  const firstStop =
    firstLegStops.length > 0
      ? firstLegStops[0]?.stop ||
      firstLegStops[0]
      : null;

  const lastStop =
    lastLegStops.length > 0
      ? lastLegStops[
        lastLegStops.length - 1
      ]?.stop ||
      lastLegStops[
      lastLegStops.length - 1
      ]
      : null;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "22px",
        border: "1px solid #dbe5f0",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "#90caf9",
          boxShadow:
            "0 10px 30px rgba(15, 23, 42, 0.08)"
        }
      }}
    >
      {/* Header */}

      <Box
        sx={{
          px: {
            xs: 2.5,
            sm: 3
          },
          pt: {
            xs: 2.5,
            sm: 3
          },
          pb: 2
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
          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1.5
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius:
                  "14px",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                backgroundColor:
                  "#fff7ed",
                color: "#d97706",
                flexShrink: 0
              }}
            >
              <TransferWithinAStationIcon
                sx={{
                  fontSize: 27
                }}
              />
            </Box>

            <Box>
              <Box
                sx={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: 1,
                  flexWrap:
                    "wrap"
                }}
              >
                <Typography
                  sx={{
                    fontWeight:
                      900,
                    color:
                      "#0f172a",
                    fontSize:
                      "1.1rem"
                  }}
                >
                  1 Bus Change
                </Typography>

                <Chip
                  label="TRANSFER ROUTE"
                  size="small"
                  sx={{
                    height: 24,
                    backgroundColor:
                      "#fff7ed",
                    color:
                      "#c2410c",
                    fontWeight:
                      800,
                    fontSize:
                      "0.68rem"
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color:
                    "#64748b",
                  fontSize:
                    "0.9rem",
                  mt: 0.3
                }}
              >
                Two buses are required
                for this journey.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              px: 1.5,
              py: 0.8,
              borderRadius:
                "10px",
              backgroundColor:
                "#f8fafc",
              border:
                "1px solid #e2e8f0"
            }}
          >
            <Typography
              sx={{
                fontSize:
                  "0.75rem",
                color:
                  "#64748b",
                fontWeight:
                  600,
                textAlign:
                  "center"
              }}
            >
              BUSES
            </Typography>

            <Typography
              sx={{
                fontSize:
                  "1rem",
                color:
                  "#0f172a",
                fontWeight:
                  800,
                textAlign:
                  "center"
              }}
            >
              {journey.length}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* JOURNEY OVERVIEW */}

      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 4 },
          backgroundColor: "#f8fbff",
          borderTop: "1px solid #e2e8f0",
          borderBottom: "1px solid #e2e8f0"
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1rem", sm: "1.15rem" },
            fontWeight: 800,
            color: "#64748b",
            letterSpacing: "1px",
            mb: 2
          }}
        >
          JOURNEY OVERVIEW
        </Typography>

        {/* Route Line */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            mb: 1.5
          }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "#1976d2",
              border: "5px solid #dbeafe",
              flexShrink: 0
            }}
          />

          <Box
            sx={{
              height: 3,
              flex: 1,
              background:
                "linear-gradient(90deg, #1976d2, #1565c0)"
            }}
          />

          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "#1565c0",
              border: "5px solid #dbeafe",
              flexShrink: 0
            }}
          />
        </Box>

        {/* Start and Destination */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%"
          }}
        >
          {/* STARTING POINT */}

          <Box
            sx={{
              textAlign: "left"
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.95rem"
                },
                fontWeight: 800,
                color: "#1976d2",
                letterSpacing: "0.5px",
                mb: 0.5
              }}
            >
              STARTING POINT
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "1.3rem",
                  sm: "1.5rem"
                },
                fontWeight: 900,
                color: "#0f172a",
                lineHeight: 1.2
              }}
            >
              {(() => {
                const firstStop =
                  journey[0]?.stops?.[0];

                const stop =
                  firstStop?.stop ||
                  firstStop;

                return stop?.name || "";
              })()}
            </Typography>

            {(() => {
              const firstStop =
                journey[0]?.stops?.[0];

              const stop =
                firstStop?.stop ||
                firstStop;

              return stop?.nameUrdu ? (
                <Typography
                  sx={{
                    fontSize: {
                      xs: "1.15rem",
                      sm: "1.3rem"
                    },
                    fontWeight: 800,
                    color: "#1976d2",
                    lineHeight: 1.6,
                    direction: "rtl",
                    textAlign: "left",
                    width: "fit-content",
                    mt: 0.3
                  }}
                >
                  {stop.nameUrdu}
                </Typography>
              ) : null;
            })()}
          </Box>

          {/* DESTINATION */}

          <Box
            sx={{
              textAlign: "right"
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.95rem"
                },
                fontWeight: 800,
                color: "#1976d2",
                letterSpacing: "0.5px",
                mb: 0.5
              }}
            >
              DESTINATION
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "1.3rem",
                  sm: "1.5rem"
                },
                fontWeight: 900,
                color: "#0f172a",
                lineHeight: 1.2
              }}
            >
              {(() => {
                const lastJourney =
                  journey[journey.length - 1];

                const lastStop =
                  lastJourney?.stops?.[
                  lastJourney.stops.length - 1
                  ];

                const stop =
                  lastStop?.stop ||
                  lastStop;

                return stop?.name || "";
              })()}
            </Typography>

            {(() => {
              const lastJourney =
                journey[journey.length - 1];

              const lastStop =
                lastJourney?.stops?.[
                lastJourney.stops.length - 1
                ];

              const stop =
                lastStop?.stop ||
                lastStop;

              return stop?.nameUrdu ? (
                <Typography
                  sx={{
                    fontSize: {
                      xs: "1.15rem",
                      sm: "1.3rem"
                    },
                    fontWeight: 800,
                    color: "#1976d2",
                    lineHeight: 1.6,
                    direction: "rtl",
                    textAlign: "right",
                    width: "100%",
                    mt: 0.3
                  }}
                >
                  {stop.nameUrdu}
                </Typography>
              ) : null;
            })()}
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Bus journeys */}

      <CardContent
        sx={{
          p: {
            xs: 2.5,
            sm: 3
          },
          "&:last-child": {
            pb: {
              xs: 2.5,
              sm: 3
            }
          }
        }}
      >
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 800,
            color: "#64748b",
            letterSpacing:
              "0.5px",
            mb: 2
          }}
        >
          BUS JOURNEY
        </Typography>

        {journey.map(
          (leg, index) => {
            const isLastLeg =
              index ===
              journey.length - 1;

            const nextLeg =
              journey[index + 1];

            return (
              <Box
                key={index}
              >
                {/* Bus header */}

                <Box
                  sx={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 1.5,
                    mb: 1.5,
                    flexWrap:
                      "wrap"
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius:
                        "12px",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      backgroundColor:
                        "#e3f2fd",
                      color:
                        "#1976d2",
                      flexShrink: 0
                    }}
                  >
                    <DirectionsBusIcon />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontWeight:
                          800,
                        color:
                          "#0f172a"
                      }}
                    >
                      Bus{" "}
                      {
                        leg.routeNumber
                      }
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          "#64748b",
                        fontSize:
                          "0.88rem"
                      }}
                    >
                      {
                        leg.routeName
                      }
                    </Typography>
                  </Box>
                </Box>

                <JourneyTimeline
                  stops={
                    leg.stops ||
                    []
                  }
                />

                {/* Transfer instruction */}

                {!isLastLeg && (
                  <>
                    <Box
                      sx={{
                        my: 3,
                        p: {
                          xs: 2,
                          sm: 2.5
                        },
                        borderRadius:
                          "16px",
                        backgroundColor:
                          "#fff8e1",
                        border:
                          "1px solid #fde68a",
                        display:
                          "flex",
                        alignItems:
                          "flex-start",
                        gap: 1.5
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius:
                            "12px",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          backgroundColor:
                            "#fef3c7",
                          color:
                            "#d97706",
                          flexShrink: 0
                        }}
                      >
                        <TransferWithinAStationIcon
                          sx={{
                            fontSize:
                              25
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontWeight:
                              800,
                            color:
                              "#92400e",
                            fontSize:
                              "1.05rem"
                          }}
                        >
                          Change Bus at
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight:
                              800,
                            color:
                              "#78350f",
                            fontSize:
                              "1.05rem",
                            mt: 0.3
                          }}
                        >
                          {getTransferStopName(
                            route.transferStop
                          )}
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              "#92400e",
                            fontSize:
                              "0.9rem",
                            mt: 0.7
                          }}
                        >
                          Get off here and
                          take the next bus.
                        </Typography>

                        {nextLeg && (
                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 0.7,
                              mt: 1
                            }}
                          >
                            <DirectionsBusIcon
                              sx={{
                                fontSize:
                                  18,
                                color:
                                  "#d97706"
                              }}
                            />

                            <Typography
                              sx={{
                                fontWeight:
                                  700,
                                color:
                                  "#92400e",
                                fontSize:
                                  "0.88rem"
                              }}
                            >
                              Next: Bus{" "}
                              {
                                nextLeg.routeNumber
                              }
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Divider
                      sx={{
                        mb: 3
                      }}
                    />
                  </>
                )}
              </Box>
            );
          }
        )}
      </CardContent>
    </Card>
  );
}

/* =========================================================
   JOURNEY TIMELINE
========================================================= */

function JourneyTimeline({
  stops = []
}) {
  if (!stops.length) {
    return (
      <Typography
        sx={{
          color: "#64748b"
        }}
      >
        No journey stops available.
      </Typography>
    );
  }

  return (
    <Box>
      {stops.map((item, index) => {
        const stop =
          item.stop || item;

        const isFirst =
          index === 0;

        const isLast =
          index ===
          stops.length - 1;

        return (
          <Box
            key={
              stop._id ||
              `${stop.name}-${index}`
            }
            sx={{
              display: "flex",
              gap: 2,
              minHeight: isLast
                ? "auto"
                : 58
            }}
          >
            {/* Timeline */}

            <Box
              sx={{
                width: 22,
                position:
                  "relative",
                display: "flex",
                justifyContent:
                  "center"
              }}
            >
              {!isLast && (
                <Box
                  sx={{
                    position:
                      "absolute",
                    top: 16,
                    bottom: -2,
                    width: 2,
                    backgroundColor:
                      "#bfdbfe"
                  }}
                />
              )}

              <Box
                sx={{
                  width:
                    isFirst ||
                      isLast
                      ? 16
                      : 10,
                  height:
                    isFirst ||
                      isLast
                      ? 16
                      : 10,
                  mt: 0.3,
                  borderRadius:
                    "50%",
                  backgroundColor:
                    isFirst
                      ? "#1976d2"
                      : isLast
                        ? "#1565c0"
                        : "#90caf9",
                  border:
                    "3px solid #ffffff",
                  boxShadow:
                    "0 0 0 1px #90caf9",
                  zIndex: 1
                }}
              />
            </Box>

            {/* Stop information */}

            <Box
              sx={{
                pb: isLast
                  ? 0
                  : 2
              }}
            >
              <Typography
                sx={{
                  fontWeight:
                    isFirst ||
                      isLast
                      ? 800
                      : 600,
                  color:
                    "#334155"
                }}
              >
                {stop.name}
              </Typography>

              {stop.nameUrdu && (
                <Typography
                  sx={{
                    fontSize: {
                      xs: "1.15rem",
                      sm: "1.3rem",
                      md: "1.45rem"
                    },
                    fontWeight: 800,
                    color:
                      "#1976d2",
                    lineHeight: 1.7,
                    direction:
                      "rtl",
                    textAlign:
                      "left"
                  }}
                >
                  {
                    stop.nameUrdu
                  }
                </Typography>
              )}

              {isFirst && (
                <Typography
                  sx={{
                    fontSize:
                      "0.75rem",
                    color:
                      "#1976d2",
                    fontWeight:
                      700,
                    mt: 0.3
                  }}
                >
                  START
                </Typography>
              )}

              {isLast && (
                <Typography
                  sx={{
                    fontSize:
                      "0.75rem",
                    color:
                      "#1565c0",
                    fontWeight:
                      700,
                    mt: 0.3
                  }}
                >
                  DESTINATION
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/* =========================================================
   TRANSFER STOP NAME
========================================================= */

function getTransferStopName(
  transferStop
) {
  if (!transferStop) {
    return "Transfer point";
  }

  if (
    typeof transferStop ===
    "string"
  ) {
    return transferStop;
  }

  return (
    transferStop.name ||
    transferStop.stop?.name ||
    "Transfer point"
  );
}

/* =========================================================
   NO ROUTE CARD
========================================================= */

function NoRouteCard() {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "20px",
        border:
          "1px solid #e2e8f0",
        backgroundColor:
          "#ffffff",
        textAlign: "center"
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 4,
            sm: 6
          }
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
            borderRadius:
              "18px",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            backgroundColor:
              "#eff6ff",
            color: "#1976d2"
          }}
        >
          <RouteIcon
            sx={{
              fontSize: 32
            }}
          />
        </Box>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize:
              "1.3rem",
            color: "#0f172a",
            mb: 1
          }}
        >
          No Route Found
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            maxWidth: 500,
            mx: "auto",
            lineHeight: 1.7
          }}
        >
          We couldn't find a direct or one-transfer
          route between these stops. Try choosing
          different locations.
        </Typography>
      </CardContent>
    </Card>
  );
}