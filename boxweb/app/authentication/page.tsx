"use client"

// Imports
import { motion } from "framer-motion"
import { LoginForm } from "@/components/login-authentication-page/login-form"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronLeft } from "lucide-react"

// Login Page
export default function LoginPage() {

    return (
        // Login Page Container
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 font-playfair-display relative">

            {/* Login Form Div */}
            <motion.div
                className="flex w-full max-w-sm flex-col gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Login Form Component */}
                <LoginForm />
            </motion.div>
        </div>
    )
}
