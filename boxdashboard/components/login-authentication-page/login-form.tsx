import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, SyntheticEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ClipLoader } from 'react-spinners';
import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/auth-context"

// import AppleLogin from 'react-apple-login';


// Login Form
export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    // State Variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Router and Auth Context
    const router = useRouter();

    // Login Function
    const { login } = useAuth();


    // Login Form Submit Handler
    const handleLoginSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // @ Email Validation
        if (!trimmedEmail.includes('@gmail.com')) {
            setErrorMessage('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        // Email Length Validation
        if (trimmedEmail.length < 4) {
            setErrorMessage('Email must be at least 4 characters long');
            setIsLoading(true);
            if (trimmedEmail.includes('@gmail.com')) {
                setIsEmailValid(true);
                setIsLoading(false);
            } else {
                setIsEmailValid(false);
                setIsLoading(false);
            }
            return;
        }

        // Empty Email Validation
        if (trimmedEmail === '') {
            setErrorMessage('Fill In Your Email');
            setIsLoading(false);
            return;
        }

        // Password validation
        if (trimmedPassword.length < 6) {
            setErrorMessage('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        // Empty Password Validation
        if (trimmedPassword === '') {
            setErrorMessage('Fill In Your Password');
            setIsLoading(false);
            return;
        }

        // Login Function (From Auth Provider)
        login(trimmedEmail, trimmedPassword)
            .then(result => {
                if (result.success) {
                    router.push('/dashboard');
                } else {
                    setErrorMessage(result.message);
                }
            })
            .catch(error => {
                setErrorMessage('An error occurred during login. Please try again.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };


    // Email Validation useEffect
    useEffect(() => {
        if (email === '') {
            setIsEmailValid(null);
            return;
        }
        setIsEmailValid(email.includes('@gmail.com'));
    }, [email]);



    return (
        // Login Form Container
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="bg-background border rounded-3xl font-comfortaa">

                {/* Login Form Header */}
                <CardHeader className="text-center">
                    <div className="flex flex-col gap-4 items-center">

                    </div>
                    <CardTitle className="text-xl text-primary font-bold">Welcome To Box Dashboard!</CardTitle>
                    <CardDescription className="text-primary">
                        Login With Your Student Email
                    </CardDescription>
                </CardHeader>


                {/* Login Form Content */}
                <CardContent>

                    {/* Login Form */}
                    <form onSubmit={handleLoginSubmit}>
                        <div className="grid gap-6">

                            {/* Login Form Inputs */}
                            <div className="grid gap-2">

                                {/* Email Input */}
                                <div className="grid">
                                    <Label htmlFor="email" className="flex justify-between items-center w-full">
                                        <p className="text-sm text-primary font-bold">Email</p>
                                        {isEmailValid === true ?
                                            <p className="text-green-500 text-xs">Valid Email Format</p>
                                            : isEmailValid === false ?
                                                <p className="text-red-500 text-xs">Invalid Email Format</p>
                                                : null}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="studentnumber@ufh.ac.za"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={cn(
                                                isEmailValid === true && "rounded-full border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500 focus-visible:ring-[3px] text-foreground placeholder:text-black",
                                                isEmailValid === false && " rounded-full border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-[3px] text-foreground placeholder:text-black",
                                                "pr-10 text-foreground rounded-full placeholder:text-gray-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:appearance-none"
                                            )}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {isEmailValid === true ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : isEmailValid === false ? (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="grid">
                                    <div className="flex items-center">
                                        <Label className="text-sm font-bold text-primary" htmlFor="password">Password</Label>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="text"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            spellCheck="false"
                                            className="pr-10 text-foreground rounded-full placeholder:text-black [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:appearance-none"
                                            style={{
                                                WebkitTextSecurity: showPassword ? 'none' : 'disc',
                                                msTextSecurity: showPassword ? 'none' : 'disc'
                                            } as React.CSSProperties}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-primary" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-primary" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Error Message */}
                                <div className="text-red-500 text-sm text-center">
                                    {errorMessage}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="hover:bg-secondary/90 w-full bg-secondary text-secondary-foreground cursor-pointer rounded-full"
                                    disabled={isLoading}
                                    size="lg"
                                >
                                    Login
                                    {isLoading ? <ClipLoader color="#fff" size={20} /> : ''}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
