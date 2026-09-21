import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import "./globals.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
    title: "Raasta - Smart Bus Route Finder",
    description:
        "Find bus routes and understand how to reach your destination."
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <AppRouterCacheProvider>
                    <Navbar />

                    <BoxWrapper>
                        {children}
                    </BoxWrapper>

                    <Footer />
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}

function BoxWrapper({ children }) {
    return (
        <main
            style={{
                flex: 1,
                width: "100%"
            }}
        >
            {children}
        </main>
    );
}