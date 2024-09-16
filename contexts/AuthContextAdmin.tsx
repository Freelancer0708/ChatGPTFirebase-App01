import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { adminAuth } from '../adminFirebase';

export type GlobalAuthState = {
    user: User | null | undefined;
};
const initialState: GlobalAuthState = {
    user: undefined,
};
const AuthContext = createContext<GlobalAuthState>(initialState);
type Props = { children: ReactNode };
export const AuthProviderAdmin = ({ children }: Props) => {
    const [user, setUser] = useState<GlobalAuthState>(initialState);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(adminAuth, (user) => {
            if (user) {
                setUser({ user });
            } else {
                setUser({ user: null });
            }
        });
        return () => unsubscribe();
    }, []);
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuthContextAdmin = () => useContext(AuthContext);