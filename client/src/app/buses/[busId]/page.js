import {
    Box,
    Container,
    Typography,
    Card,
    Chip,
    Divider
} from "@mui/material";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const busData = {
    "11c": {
    number: "11C",
    name: "11C Bus",
    city: "Karachi",

    upRoute: {
        firstStop: "Azam Basti",
        lastStop: "Saadi Town / Gulzar-e-Hijri",

        stops: [
            "Azam Basti",
            "Corporation",
            "Parsi Colony",
            "Kala Pul",
            "Jinnah Hospital (JPMC)",
            "Saddar",
            "7th Day Hospital",
            "Numaish",
            "Guru Mandir",
            "Islamia College",
            "Jail Chowrangi",
            "New Town Police Station",
            "Purani Sabzi Mandi",
            "Civic Centre",
            "Urdu University (Gulshan-e-Iqbal)",
            "NIPA Chowrangi",
            "Safari Park",
            "Karachi University",
            "Samama Shopping Complex",
            "Mosamiyat",
            "Johar Complex",
            "Safoora Goth",
            "Saadi Town / Gulzar-e-Hijri"
        ],

        roads: []
    },

    downRoute: {
        firstStop: "Saadi Town / Gulzar-e-Hijri",
        lastStop: "Azam Basti",

        stops: [
            "Saadi Town / Gulzar-e-Hijri",
            "Safoora Goth",
            "Johar Complex",
            "Mosamiyat",
            "Samama Shopping Complex",
            "Karachi University",
            "Safari Park",
            "NIPA Chowrangi",
            "Urdu University (Gulshan-e-Iqbal)",
            "Civic Centre",
            "Purani Sabzi Mandi",
            "New Town Police Station",
            "Jail Chowrangi",
            "Islamia College",
            "Guru Mandir",
            "Numaish",
            "7th Day Hospital",
            "Saddar",
            "Jinnah Hospital (JPMC)",
            "Kala Pul",
            "Parsi Colony",
            "Corporation",
            "Azam Basti"
        ],

        roads: []
    }
},

   "9c": {
    number: "9C",
    name: "9C Bus",
    city: "Karachi",

    upRoute: {
        firstStop: "Model Colony Mor",
        lastStop: "Shireen Jinnah Colony",

        stops: [
            "Model Colony Mor",
            "Malir Halt",
            "Drigh Road Station",
            "FTC Building",
            "Jinnah Postgraduate Medical Centre (JPMC)",
            "Cantt Station",
            "Delhi Colony",
            "Punjab Chowrangi",
            "Gizri Road",
            "Teen Talwar & Do Talwar",
            "Abdullah Shah Ghazi Shrine",
            "Shireen Jinnah Colony"
        ],

        roads: [
            "Jinnah Avenue",
            "Shahrah-e-Faisal",
            "Baloch Colony Flyover",
            "Korangi Road",
            "Rafiqui Shaheed Road",
            "Sarwar Shaheed Road",
            "Khayaban-e-Jami",
            "Sunset Boulevard",
            "Shahrah-e-Iran",
            "Khayaban-e-Saadi"
        ]
    },

    downRoute: {
        firstStop: "Shireen Jinnah Colony",
        lastStop: "Model Colony Mor",

        stops: [
            "Shireen Jinnah Colony",
            "Abdullah Shah Ghazi Shrine",
            "Do Talwar & Teen Talwar",
            "Punjab Chowrangi",
            "Delhi Colony",
            "Cantt Station",
            "Jinnah Hospital (JPMC)",
            "Nursery / Karsaz / Drigh Road",
            "Malir Halt",
            "Jinnah Avenue",
            "Model Colony Mor"
        ],

        roads: [
            "Marine Promenade",
            "Shahrah-e-Iran",
            "Gizri Road",
            "Khayaban-e-Jami",
            "Rafiqui Shaheed Road",
            "Shahrah-e-Faisal",
            "FTC Building Area"
        ]
    }
}
};

function RouteSection({ title, route }) {
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
                    {title}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "1.2rem",
                            fontWeight: 900,
                            color: "#0f172a"
                        }}
                    >
                        {route.firstStop}
                    </Typography>

                    <ArrowDownwardIcon
                        sx={{
                            color: "#1976d2"
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: "1.2rem",
                            fontWeight: 900,
                            color: "#0f172a"
                        }}
                    >
                        {route.lastStop}
                    </Typography>
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
                    {route.stops.map(
                        (stop, index) => {
                            const isFirst =
                                index === 0;

                            const isLast =
                                index ===
                                route.stops.length - 1;

                            return (
                                <Box
                                    key={`${stop}-${index}`}
                                    sx={{
                                        display: "flex",
                                        gap: 2
                                    }}
                                >
                                    {/* Timeline */}

                                    <Box
                                        sx={{
                                            width: 24,
                                            display: "flex",
                                            flexDirection:
                                                "column",
                                            alignItems:
                                                "center"
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
                                                    minHeight: 45,
                                                    backgroundColor:
                                                        "#bfdbfe"
                                                }}
                                            />
                                        )}
                                    </Box>

                                    {/* Stop information */}

                                    <Box
                                        sx={{
                                            pb: isLast
                                                ? 0
                                                : 3
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
                                                    "#0f172a"
                                            }}
                                        >
                                            {stop}
                                        </Typography>

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

            <Divider />

            {/* Roads */}

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
                        mb: 1.5
                    }}
                >
                    Roads Covered
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1
                    }}
                >
                    {route.roads.map(
                        (road, index) => (
                            <Chip
                                key={`${road}-${index}`}
                                label={road}
                                size="small"
                                sx={{
                                    backgroundColor:
                                        "#eff6ff",
                                    color:
                                        "#1565c0",
                                    fontWeight: 600
                                }}
                            />
                        )
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

    const bus = busData[busId];

    if (!bus) {
        return (
            <Container
                maxWidth="lg"
                sx={{ py: 8 }}
            >
                <Typography
                    variant="h4"
                    fontWeight={800}
                >
                    Bus not found
                </Typography>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                py: {
                    xs: 3,
                    md: 5
                }
            }}
        >
            <Container maxWidth="lg">

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
                                alignItems: "center",
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
                                        "rgba(255,255,255,0.16)"
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
                                        fontWeight: 700,
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
                                        fontWeight: 900
                                    }}
                                >
                                    Bus {bus.number}
                                </Typography>

                                <Typography
                                    sx={{
                                        opacity: 0.9,
                                        mt: 0.3
                                    }}
                                >
                                    {bus.city}
                                </Typography>
                            </Box>
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

                {/* Up Route */}

                <Box sx={{ mb: 3 }}>
                    <RouteSection
                        title="UP ROUTE"
                        route={bus.upRoute}
                    />
                </Box>

                {/* Down Route */}

                <RouteSection
                    title="DOWN / RETURN ROUTE"
                    route={bus.downRoute}
                />

            </Container>
        </Box>
    );
}