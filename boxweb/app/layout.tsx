import type { Metadata } from "next";
import { Playfair_Display, Playfair, Comfortaa } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import '../styles/codeBlockStyle.css'
import { Providers } from './providers';

// Playfair Font For Article Headings
const playfair = Playfair({
    variable: "--font-playfair",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
});

const comfortaa = Comfortaa({
    variable: "--font-comfortaa",
    subsets: ["latin"],
});

// Playfair Display Font For Article Headings
const playfairDisplay = Playfair_Display({
    variable: "--font-playfair-display",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
});

export const metadata: Metadata = {
    title: "Box",
    description: "The Campus Square",
};

// Example: Call this when user opens the app
fetch('http://localhost:8000/somaapp/track-impressions/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${comfortaa.variable} ${playfair.variable} ${playfairDisplay.variable} antialiased `}
            >
                <Providers>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}
