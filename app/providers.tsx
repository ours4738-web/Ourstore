'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rehydrateAuth } from '@/lib/store/slices/authSlice';
import { rehydrateCart } from '@/lib/store/slices/cartSlice';

function StoreInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(rehydrateAuth());
        dispatch(rehydrateCart());
    }, [dispatch]);

    return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <StoreInitializer />
            {children}
            <Toaster position="top-right" richColors />
        </Provider>
    );
}
