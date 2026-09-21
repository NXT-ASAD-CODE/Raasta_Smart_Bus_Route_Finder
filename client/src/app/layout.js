import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import "./globals.css";

import Navbar from "../components/Navbar";

export const metadata = {
    title: "Raasta - Smart Bus Route Finder",
    description:
        "Find bus routes and understand how to reach your destination."
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider>
                    <Navbar />

                    {children}
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}