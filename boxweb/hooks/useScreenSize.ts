import { useState, useEffect } from 'react';

export const useScreenSize = () => {
    const [isMedium, setIsMedium] = useState(false);
    const [isSmall, setIsSmall] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMedium(window.innerWidth <= 1440);
            setIsSmall(window.innerWidth <= 700);
        };

        // Initial check
        checkScreenSize();

        // Add event listener
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return { isSmall, isMedium };
}; 