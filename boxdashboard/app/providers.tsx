'use client';

import { Provider } from 'react-redux';
import { store } from '../redux';
import { AuthProvider } from '../context/auth-context';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../redux';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        // Redux Provider
        <Provider store={store}>
            {/* Redux Presistance Provider */}
            <PersistGate loading={null} persistor={persistor}>
                {/* Authentication Provider */}
                <AuthProvider>
                    {children}
                </AuthProvider>
            </PersistGate>
        </Provider>
    );
} 