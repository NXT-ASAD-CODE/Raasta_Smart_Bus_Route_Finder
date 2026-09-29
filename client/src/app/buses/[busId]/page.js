
import {
    Box,
    Container,
    Typography,
    Card,
    Chip,
    Divider,
    Button,
    Alert
} from "@mui/material";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getRouteById } from "../../../services/api";


function getTotalTravelTime(stops) {
    if (!stops || stops.length < 2) {
        return 0;
    }

    return stops.reduce(
        (total, item, index) => {
            if (index === stops.length - 1) {
                return total;
            }

            return total + (Number(item.travelTime) || 0);
        },
        0
    );
}


function RouteSection({ route }) {
    const stops = [...(route.stops || [])].sort(
        (a, b) => a.sequence - b.sequence
    );

    const totalTravelTime =
        getTotalTravelTime(stops);

    const firstStop =
        stops[0]?.stop?.name ||
        route.startPoint ||
        "Starting Point";

    const lastStop =
        stops[stops.length - 1]?.stop?.name ||
        route.endPoint ||
        "Destination";

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: "20px",
                border: "1px solid #dbe5f0",
                overflow: "hidden"
            }}
        >

            {/* Route Header */}

            <Box
                sx={{
                    px: {
                        xs: 2.5,
                        sm: 3
                    },
                    py: 2.5,
                    backgroundColor: "#f8fbff"
                }}
            >

                <Typography
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        color: "#1976d2",
                        letterSpacing: "1px"
                    }}
                >
                    ROUTE
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 1
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: {
                                xs: "1rem",
                                sm: "1.2rem"
                            },
                            fontWeight: 900,
                            color: "#0f172a"
                        }}
                    >
                        {firstStop}
                    </Typography>

                    <ArrowDownwardIcon
                        sx={{
                            color: "#1976d2"
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: {
                                xs: "1rem",
                                sm: "1.2rem"
                            },
                            fontWeight: 900,
                            color: "#0f172a"
                        }}
                    >
                        {lastStop}
                    </Typography>

                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        mt: 2
                    }}
                >

                    <Chip
                        size="small"
                        label={`${stops.length} Stops`}
                        sx={{
                            backgroundColor:
                                "#e3f2fd",
                            color: "#1565c0",
                            fontWeight: 700
                        }}
                    />

                    <Chip
                        size="small"
                        label={`${totalTravelTime} min`}
                        sx={{
                            backgroundColor:
                                "#ecfdf5",
                            color: "#047857",
                            fontWeight: 700
                        }}
                    />

                </Box>

            </Box>

            <Divider />

            {/* Stops */}

            <Box
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3
                    }
                }}
            >

                <Typography
                    sx={{
                        fontWeight: 800,
                        color: "#334155",
                        mb: 2
                    }}
                >
                    Stops
                </Typography>

                <Box>

                    {stops.map(
                        (routeStop, index) => {

                            const stop =
                                routeStop.stop;

                            const isFirst =
                                index === 0;

                            const isLast =
                                index ===
                                stops.length - 1;

                            const travelTime =
                                Number(
                                    routeStop.travelTime
                                ) || 0;

                            return (
                                <Box
                                    key={
                                        stop?._id ||
                                        index
                                    }
                                    sx={{
                                        display: "flex",
                                        gap: 2
                                    }}
                                >

                                    {/* Timeline */}

                                    <Box
                                        sx={{
                                            width: 24,
                                            display:
                                                "flex",
                                            flexDirection:
                                                "column",
                                            alignItems:
                                                "center",
                                            flexShrink: 0
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius:
                                                    "50%",
                                                backgroundColor:
                                                    isFirst ||
                                                        isLast
                                                        ? "#1976d2"
                                                        : "#90caf9",
                                                border:
                                                    "4px solid #dbeafe",
                                                flexShrink: 0
                                            }}
                                        />

                                        {!isLast && (
                                            <Box
                                                sx={{
                                                    width: 3,
                                                    flex: 1,
                                                    minHeight: 50,
                                                    backgroundColor:
                                                        "#bfdbfe"
                                                }}
                                            />
                                        )}

                                    </Box>

                                    {/* Stop Information */}

                                    <Box
                                        sx={{
                                            pb: isLast
                                                ? 0
                                                : 3,
                                            minWidth: 0,
                                            flex: 1
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "space-between",
                                                gap: 2,
                                                flexWrap:
                                                    "wrap"
                                            }}
                                        >

                                            <Box>

                                                <Typography
                                                    sx={{
                                                        fontWeight:
                                                            isFirst ||
                                                                isLast
                                                                ? 800
                                                                : 600,
                                                        color:
                                                            "#0f172a"
                                                    }}
                                                >
                                                    {stop?.name ||
                                                        "Unknown Stop"}
                                                </Typography>

                                                {stop?.nameUrdu && (
                                                    <Typography
                                                        lang="ur"
                                                        dir="rtl"
                                                        sx={{
                                                            fontSize:
                                                                "1.1rem",
                                                            fontWeight:
                                                                700,
                                                            color:
                                                                "#1976d2",
                                                            lineHeight:
                                                                1.6,
                                                            mt: 0.2
                                                        }}
                                                    >
                                                        {
                                                            stop.nameUrdu
                                                        }
                                                    </Typography>
                                                )}

                                            </Box>

                                            {!isLast &&
                                                travelTime >
                                                0 && (
                                                    <Chip
                                                        size="small"
                                                        label={`${travelTime} min`}
                                                        sx={{
                                                            backgroundColor:
                                                                "#f1f5f9",
                                                            color:
                                                                "#475569",
                                                            fontWeight:
                                                                700
                                                        }}
                                                    />
                                                )}

                                        </Box>

                                        {isFirst && (
                                            <Typography
                                                sx={{
                                                    color:
                                                        "#1976d2",
                                                    fontSize:
                                                        "0.75rem",
                                                    fontWeight:
                                                        700,
                                                    mt: 0.3
                                                }}
                                            >
                                                FIRST STOP
                                            </Typography>
                                        )}

                                        {isLast && (
                                            <Typography
                                                sx={{
                                                    color:
                                                        "#1976d2",
                                                    fontSize:
                                                        "0.75rem",
                                                    fontWeight:
                                                        700,
                                                    mt: 0.3
                                                }}
                                            >
                                                LAST STOP
                                            </Typography>
                                        )}

                                    </Box>

                                </Box>
                            );
                        }
                    )}

                </Box>

            </Box>

        </Card>
    );
}


export default async function BusDetailsPage({
    params
}) {

    const { busId } = await params;

    let route = null;
    let errorMessage = "";

    try {

        const response =
            await getRouteById(busId);

        route = response?.data;

    } catch (error) {

        console.error(
            "Failed to load route:",
            error
        );

        errorMessage =
            error.message ||
            "Failed to load route";

    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (errorMessage) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor:
                        "#f8fafc",
                    py: {
                        xs: 4,
                        md: 6
                    }
                }}
            >

                <Container maxWidth="lg">
                    <Alert severity="error">
                        {errorMessage}
                    </Alert>

                </Container>

            </Box>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Route not found
    |--------------------------------------------------------------------------
    */

    if (!route) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor:
                        "#f8fafc",
                    py: 8
                }}
            >

                <Container maxWidth="lg">

                    <Typography
                        variant="h4"
                        fontWeight={800}
                    >
                        Bus route not found
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            color: "#64748b"
                        }}
                    >
                        The requested bus route
                        does not exist or is no
                        longer available.
                    </Typography>

                </Container>

            </Box>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Main Page
    |--------------------------------------------------------------------------
    */

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor:
                    "#f8fafc",
                py: {
                    xs: 3,
                    md: 5
                }
            }}
        >

            <Container maxWidth="lg">
                <Box sx={{ mb: 3 }}>
                    <Button
                        component="a"
                        href="/buses"
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            backgroundColor: "#1976d2",
                            color: "#ffffff",
                            fontWeight: 700,
                            textTransform: "none",
                            borderRadius: "10px",
                            px: 2.5,
                            py: 1,

                            "&:hover": {
                                backgroundColor: "#1565c0"
                            }
                        }}
                    >
                        Back to Buses
                    </Button>
                </Box>
                {/* Bus Header */}

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: "22px",
                        border:
                            "1px solid #dbe5f0",
                        overflow: "hidden",
                        mb: 4
                    }}
                >

                    <Box
                        sx={{
                            p: {
                                xs: 2.5,
                                sm: 4
                            },
                            background:
                                "linear-gradient(135deg, #0d47a1 0%, #1976d2 60%, #42a5f5 100%)",
                            color: "#ffffff"
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: 2
                            }}
                        >

                            <Box
                                sx={{
                                    width: 58,
                                    height: 58,
                                    borderRadius:
                                        "16px",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    backgroundColor:
                                        "rgba(255,255,255,0.16)",
                                    flexShrink: 0
                                }}
                            >

                                <DirectionsBusIcon
                                    sx={{
                                        fontSize: 34
                                    }}
                                />

                            </Box>

                            <Box>

                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.8rem",
                                        fontWeight:
                                            700,
                                        opacity: 0.8,
                                        letterSpacing:
                                            "1px"
                                    }}
                                >
                                    BUS ROUTE
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "1.6rem",
                                            sm: "2rem"
                                        },
                                        fontWeight:
                                            900
                                    }}
                                >
                                    Bus{" "}
                                    {
                                        route.routeNumber
                                    }
                                </Typography>

                                <Typography
                                    sx={{
                                        opacity: 0.9,
                                        mt: 0.3
                                    }}
                                >
                                    {
                                        route.city
                                            ?.name ||
                                        "Unknown City"
                                    }
                                </Typography>

                            </Box>

                        </Box>

                    </Box>

                    {/* Route Summary */}

                    <Box
                        sx={{
                            p: {
                                xs: 2.5,
                                sm: 3
                            },
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr"
                            },
                            gap: 2
                        }}
                    >

                        <Box>

                            <Typography
                                sx={{
                                    fontSize:
                                        "0.75rem",
                                    color:
                                        "#64748b",
                                    fontWeight:
                                        700,
                                    mb: 0.5
                                }}
                            >
                                START POINT
                            </Typography>

                            <Typography
                                sx={{
                                    fontWeight:
                                        800,
                                    color:
                                        "#0f172a"
                                }}
                            >
                                {
                                    route.startPoint
                                }
                            </Typography>

                        </Box>

                        <Box>

                            <Typography
                                sx={{
                                    fontSize:
                                        "0.75rem",
                                    color:
                                        "#64748b",
                                    fontWeight:
                                        700,
                                    mb: 0.5
                                }}
                            >
                                END POINT
                            </Typography>

                            <Typography
                                sx={{
                                    fontWeight:
                                        800,
                                    color:
                                        "#0f172a"
                                }}
                            >
                                {
                                    route.endPoint
                                }
                            </Typography>

                        </Box>

                    </Box>

                </Card>

                {/* Route Heading */}

                <Typography
                    sx={{
                        fontSize: {
                            xs: "1.4rem",
                            sm: "1.7rem"
                        },
                        fontWeight: 900,
                        color: "#0f172a",
                        mb: 2.5
                    }}
                >
                    Complete Route
                </Typography>

                {/* Route */}

                <RouteSection
                    route={route}
                />

            </Container>

        </Box>
    );
}