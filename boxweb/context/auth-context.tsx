'use client';

// Imports
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUser } from '../redux/user-store/userSlice';


// Auth Context Type Variables
interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    signup: (username: string, email: string, password: string, fullName?: string, structure?: string) => Promise<{ success: boolean; message: string }>;
    checkExistingUserData: (username: string, email: string) => Promise<{ success: boolean; message: string; errors?: string[] }>;
    verifyOTP: (email: string, otpCode: string) => Promise<{ success: boolean; message: string }>;
    resendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
    refreshUserData: () => Promise<void>;
}


// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Auth Provider
export function AuthProvider({ children }: { children: ReactNode }) {

    // State Variables
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // dispatch
    const dispatch = useAppDispatch();

    // user data from redux
    const userData = useAppSelector((state) => state.user);

    // Check Authentication Status
    const checkAuthStatus = () => {

        // set loading
        setLoading(true);

        // Get JWT token from localStorage as fallback
        const jwtToken = localStorage.getItem('jwt_token');

        // Fetching Current User
        fetch(`${process.env.NEXT_PUBLIC_CHECK_AUTH_STATUS || 'http://localhost:8000/somaapp/user/'}`, {
            credentials: 'include',
            headers: jwtToken ? {
                'Authorization': `Bearer ${jwtToken}`
            } : {}
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Authentication failed');
            })
            .then(content => {
                setIsAuthenticated(true);
                setUsername(content.username);

                console.log("---------User Content: ", content)
                console.log("---------User Structure from backend: ", content.structure)

                // Update Redux store with user details that match userSlice
                const userStructure = content.structure || null;
                console.log("Processing structure value:", userStructure, "Type:", typeof userStructure);

                const userData = {
                    // Core user fields
                    id: content.id || null,
                    username: content.username || '',
                    email: content.email || '',
                    fullName: content.full_name || null,

                    // Profile fields
                    profilePicture: content.profile_picture || null,
                    bio: content.bio || null,
                    privacySettings: content.privacy_settings || null,
                    structure: typeof userStructure === 'string' ? userStructure : null, // Validate structure is a string

                    // Social media fields
                    userFacebook: content.user_facebook || null,
                    userInstagram: content.user_instagram || null,
                    userXTwitter: content.user_x_twitter || null,
                    userThreads: content.user_threads || null,
                    userYouTube: content.user_youtube || null,
                    userLinkedIn: content.user_linkedin || null,
                    userTikTok: content.user_tiktok || null,

                    // System fields
                    createdAt: content.created_at || null,
                    updatedAt: content.updated_at || null,
                };

                dispatch(setUser(userData));
                console.log("-----------User Data with Structure: ", userData)
                console.log("-----------Redux Structure Value: ", userData.structure)
            })
            .catch(() => {
                setIsAuthenticated(false);
                setUsername(null);
                dispatch(setUser({})); // Clear user data in Redux
                localStorage.removeItem('jwt_token'); // Clear stored token
            })
            .finally(() => {
                setLoading(false);
            });
    };


    // Login Function
    const login = (email: string, password: string) => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        return fetch(`${process.env.NEXT_PUBLIC_LOGIN || 'http://localhost:8000/somaapp/login/'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const content = await response.json();
                if (content.username) {
                    // Store JWT token in localStorage as fallback
                    if (content.jwt) {
                        localStorage.setItem('jwt_token', content.jwt);
                    }

                    // Skip verification for now
                    setIsAuthenticated(true);
                    setUsername(content.username);

                    console.log("Login successful, checking auth status and loading structure...");
                    await checkAuthStatus();

                    console.log("Auth check completed, structure should be loaded in Redux");
                    return { success: true, message: content.message || 'Login successful' };
                } else {
                    return {
                        success: false,
                        message: content.error || 'Login failed. Please check your credentials.'
                    };
                }
            })
            .catch((error) => {
                console.error('Login error:', error);
                return {
                    success: false,
                    message: 'Network error occurred. Please check your connection and try again.'
                };
            });
    };


    // Check Existing User Data Function
    const checkExistingUserData = (username: string, email: string) => {
        return fetch(`${process.env.NEXT_PUBLIC_CHECK_EXISTING_USER || 'http://localhost:8000/somaapp/check-existing-user/'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email }),
        })
            .then(async response => {
                if (!response.ok) {
                    try {
                        const errorData = await response.json();
                        return {
                            success: false,
                            message: errorData.errors ? errorData.errors.join(', ') : 'Username or email already exists',
                            errors: errorData.errors || []
                        };
                    } catch (parseError) {
                        return {
                            success: false,
                            message: 'Error checking user data',
                            errors: []
                        };
                    }
                }
                return response.json();
            })
            .then(content => {
                return {
                    success: true,
                    message: content.message || 'Username and email are available'
                };
            })
            .catch(error => {
                return {
                    success: false,
                    message: 'Network error occurred. Please check your connection and try again.',
                    errors: []
                };
            });
    };

    // Signup Function
    const signup = (username: string, email: string, password: string, fullName?: string, structure?: string) => {
        const signupData: any = { username, email, password };
        if (fullName) {
            signupData.full_name = fullName;
        }
        if (structure) {
            signupData.structure = structure;
        }
        
        return fetch(`${process.env.NEXT_PUBLIC_SIGNUP || 'http://localhost:8000/somaapp/signup/'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupData),
        })
            .then(async response => {
                if (!response.ok) {
                    // Try to get the error message from the response
                    try {
                        const errorData = await response.json();
                        return {
                            success: false,
                            message: errorData.error || 'Signup failed. Please try again.'
                        };
                    } catch (parseError) {
                        return {
                            success: false,
                            message: 'Signup failed. Please try again.'
                        };
                    }
                }
                return response.json();
            })
            .then(content => {
                if (!content.username) {
                    return {
                        success: false,
                        message: content.error || 'Signup failed. Please try again.'
                    };
                }

                // Verify the signup
                return fetch(`${process.env.NEXT_PUBLIC_VERIFY_SIGNUP || 'http://localhost:8000/somaapp/verify-signup/'}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                })
                    .then(verifyResponse => {
                        if (!verifyResponse.ok) {
                            // If verification fails, attempt to clean up the partial registration
                            return fetch(`${process.env.NEXT_PUBLIC_CLEANUP_SIGNUP || 'http://localhost:8000/somaapp/cleanup-signup/'}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ email }),
                            })
                                .then(() => {
                                    throw new Error('Database registration verification failed');
                                });
                        }
                        return content;
                    });
            })
            .then(() => {
                // Try to login after successful signup
                return login(email, password)
                    .then(loginResult => {
                        if (!loginResult.success) {
                            // If login fails, clean up the registration
                            return fetch(`${process.env.NEXT_PUBLIC_CLEANUP_SIGNUP || 'http://localhost:8000/somaapp/cleanup-signup/'}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ email }),
                            })
                                .then(() => {
                                    return {
                                        success: false,
                                        message: 'Username Or E-mail Already Exists'
                                    };
                                });
                        }
                        return loginResult;
                    })
                    .catch(() => {
                        // If login throws an error, clean up the registration
                        return fetch(`${process.env.NEXT_PUBLIC_CLEANUP_SIGNUP}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email }),
                        })
                            .then(() => {
                                throw new Error('Login failed after signup');
                            });
                    });
            })
            .catch(error => {
                return {
                    success: false,
                    message: error.message === 'Database registration verification failed'
                        ? 'Unable to verify signup status. Please try again.'
                        : error.message === 'Login failed after signup'
                            ? 'Signup successful but automatic login failed. Please try logging in manually.'
                            : 'Network error occurred. Please check your connection and try again.'
                };
            });
    };

    // Verify OTP Function
    const verifyOTP = (email: string, otpCode: string) => {
        return fetch(`${process.env.NEXT_PUBLIC_VERIFY_OTP}/somaapp/verify-otp/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp_code: otpCode }),
        })
            .then(async response => {
                if (!response.ok) {
                    try {
                        const errorData = await response.json();
                        return {
                            success: false,
                            message: errorData.error || 'OTP verification failed. Please try again.'
                        };
                    } catch (parseError) {
                        return {
                            success: false,
                            message: 'OTP verification failed. Please try again.'
                        };
                    }
                }
                return response.json();
            })
            .then(content => {
                if (!content.message) {
                    return {
                        success: false,
                        message: content.error || 'OTP verification failed. Please try again.'
                    };
                }
                return {
                    success: true,
                    message: content.message
                };
            })
            .catch(error => {
                return {
                    success: false,
                    message: 'Network error occurred. Please check your connection and try again.'
                };
            });
    };

    // Resend OTP Function
    const resendOTP = (email: string) => {
        return fetch(`${process.env.NEXT_PUBLIC_RESEND_OTP}/somaapp/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                resend: true // Flag to indicate this is a resend request
            }),
        })
            .then(async response => {
                if (!response.ok) {
                    try {
                        const errorData = await response.json();
                        return {
                            success: false,
                            message: errorData.error || 'Failed to resend OTP. Please try again.'
                        };
                    } catch (parseError) {
                        return {
                            success: false,
                            message: 'Failed to resend OTP. Please try again.'
                        };
                    }
                }
                return response.json();
            })
            .then(content => {
                if (!content.message) {
                    return {
                        success: false,
                        message: content.error || 'Failed to resend OTP. Please try again.'
                    };
                }
                return {
                    success: true,
                    message: 'OTP sent successfully!'
                };
            })
            .catch(error => {
                return {
                    success: false,
                    message: 'Network error occurred. Please check your connection and try again.'
                };
            });
    };

    // Logout Function
    const logout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_LOGOUT || 'http://localhost:8000/somaapp/logout/'}`, {
                method: 'POST',
                credentials: 'include',
            });
            
            // Clear local state regardless of server response
            setIsAuthenticated(false);
            setUsername(null);
            dispatch(setUser({})); // Clear user data in Redux
            localStorage.removeItem('jwt_token'); // Clear stored token
            
            if (!response.ok) {
                console.error('Logout failed on server');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            // Still clear local state even if request fails
            setIsAuthenticated(false);
            setUsername(null);
            dispatch(setUser({}));
            localStorage.removeItem('jwt_token');
        }
    };

    // Refresh User Data Function
    const refreshUserData = async () => {
        console.log("Manually refreshing user data...");
        await checkAuthStatus();
    };

    // Check Authentication Status on Mount
    useEffect(() => {
        // Check authentication status on mount
        checkAuthStatus();
    }, []);


    // Return Auth Provider
    return (
        <AuthContext.Provider value={{ isAuthenticated, username, loading, login, logout, signup, checkExistingUserData, verifyOTP, resendOTP, refreshUserData }}>
            {children}
        </AuthContext.Provider>
    );
}


// Use Auth Context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 