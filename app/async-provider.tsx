//component that accepts a children prop and returns a provider

import { ReactNode } from 'react';
import Providers from './providers';
import { headers } from 'next/headers';

interface AsyncProviderProps {

    children: ReactNode;
}

export const AsyncProvider = async ({ children }: AsyncProviderProps) => {
    const headersList = await headers()
    const cookie = headersList.get("cookie")
    return (
        <Providers cookie={cookie}>
            {children}
        </Providers>
    );
};

