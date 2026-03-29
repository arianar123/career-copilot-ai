import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "../components/AuthProvider";
import { SiteChrome } from "../components/SiteChrome";
import { UserProfileProvider } from "../components/UserProfileProvider";

export const metadata: Metadata = {
  title: "CareerCopilot AI",
  description: "AI-powered career intelligence for students navigating internships and early-career roles"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UserProfileProvider>
            <SiteChrome />
            {children}
          </UserProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
