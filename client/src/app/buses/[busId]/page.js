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
            firstStop: "Saadi Town / Safoora Goth",
            lastStop: "Azam Basti",

            stops: [
                { en: "Saadi Town / Safoora Goth", ur: "سعدی ٹاؤن / صفورہ گوٹھ" },
                { en: "Mosamiyat / Samama", ur: "موسمیات / ثمامہ" },
                { en: "N.I.P.A. Chowrangi", ur: "نیپا چورنگی" },
                { en: "Urdu College / Civic Centre", ur: "اردو کالج / سوک سینٹر" },
                { en: "Sabzi Mandi (Old)", ur: "سبزی منڈی (پرانی)" },
                { en: "New Town / Islamia College", ur: "نیو ٹاؤن / اسلامیہ کالج" },
                { en: "Guru Mandir / Numaish Chowrangi", ur: "گرو مندر / نمائش چورنگی" },
                { en: "7th Day Hospital", ur: "سیونتھ ڈے ہسپتال" },
                { en: "Saddar (Empress Market area)", ur: "صدر (ایمپریس مارکیٹ ایریا)" },
                { en: "Jinnah Postgraduate Medical Centre (JPMC)", ur: "جناح پوسٹ گریجویٹ میڈیکل سینٹر (جے پی ایم سی)" },
                { en: "Kala Pul", ur: "کالا پل" },
                { en: "Corporation / Parsi Colony", ur: "کارپوریشن / پارسی کالونی" },
                { en: "Azam Basti", ur: "اعظم بستی" }
            ],

            roads: [
                "University Road",
                "Gulshan-e-Iqbal",
                "National Stadium flyover",
                "Jail Chowrangi",
                "M.A. Jinnah Road",
                "Rafiqui Shaheed Road"
            ]
        },

        downRoute: {
            firstStop: "Azam Basti",
            lastStop: "Saadi Town / Safoora Goth",

            stops: [
                { en: "Azam Basti", ur: "اعظم بستی" },
                { en: "Corporation / Parsi Colony", ur: "کارپوریشن / پارسی کالونی" },
                { en: "Kala Pul", ur: "کالا پل" },
                { en: "Jinnah Hospital (JPMC)", ur: "جناح ہسپتال (جے پی ایم سی)" },
                { en: "Saddar", ur: "صدر" },
                { en: "7th Day Hospital", ur: "سیونتھ ڈے ہسپتال" },
                { en: "Numaish Chowrangi / Guru Mandir", ur: "نمائش چورنگی / گرو مندر" },
                { en: "Islamia College / New Town", ur: "اسلامیہ کالج / نیو ٹاؤن" },
                { en: "Jail Chowrangi / Sabzi Mandi (Old)", ur: "جیل چورنگی / سبزی منڈی (پرانی)" },
                { en: "Civic Centre / Urdu College", ur: "سوک سینٹر / اردو کالج" },
                { en: "N.I.P.A. Chowrangi", ur: "نیپا چورنگی" },
                { en: "Safari Park / Karachi University", ur: "سفاری پارک / کراچی یونیورسٹی" },
                { en: "Samama / Mosamiyat", ur: "ثمامہ / موسمیات" },
                { en: "Safoora Goth / Saadi Town", ur: "صفورہ گوٹھ / سعدی ٹاؤن" }
            ],

            roads: [
                "Rafiqui Shaheed Road",
                "M.A. Jinnah Road",
                "Jail Road",
                "University Road"
            ]
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
                { en: "Model Colony Mor", ur: "ماڈل کالونی موڑ" },
                { en: "Malir Halt", ur: "ملیر ہالٹ" },
                { en: "Drigh Road Station", ur: "ڈرگ روڈ اسٹیشن" },
                { en: "FTC Building", ur: "ایف ٹی سی بلڈنگ" },
                { en: "Jinnah Postgraduate Medical Centre (JPMC)", ur: "جناح پوسٹ گریجویٹ میڈیکل سینٹر (جے پی ایم سی)" },
                { en: "Cantt Station", ur: "چھاؤنی اسٹیشن" },
                { en: "Delhi Colony", ur: "دہلی کالونی" },
                { en: "Punjab Chowrangi", ur: "پنجاب چورنگی" },
                { en: "Gizri Road", ur: "گزری روڈ" },
                { en: "Teen Talwar & Do Talwar", ur: "تین تلوار اور دو تلوار" },
                { en: "Abdullah Shah Ghazi Shrine", ur: "عبداللہ شاہ غازی کا مزار" },
                { en: "Shireen Jinnah Colony", ur: "شیریں جناح کالونی" }
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
                { en: "Shireen Jinnah Colony", ur: "شیریں جناح کالونی" },
                { en: "Abdullah Shah Ghazi Shrine", ur: "عبداللہ شاہ غازی کا مزار" },
                { en: "Do Talwar & Teen Talwar", ur: "دو تلوار اور تین تلوار" },
                { en: "Punjab Chowrangi", ur: "پنجاب چورنگی" },
                { en: "Delhi Colony", ur: "دہلی کالونی" },
                { en: "Cantt Station", ur: "چھاؤنی اسٹیشن" },
                { en: "Jinnah Hospital (JPMC)", ur: "جناح ہسپتال (جے پی ایم سی)" },
                { en: "Nursery / Karsaz / Drigh Road", ur: "نرسری / کارساز / ڈرگ روڈ" },
                { en: "Malir Halt", ur: "ملیر ہالٹ" },
                { en: "Jinnah Avenue", ur: "جناح ایونیو" },
                { en: "Model Colony Mor", ur: "ماڈل کالونی موڑ" }
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