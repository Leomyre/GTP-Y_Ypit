// context/DeviseContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const devisesDisponibles = ["EUR", "USD", "MGA", "GBP", "CAD"];
const LOCAL_STORAGE_KEY = "devise_affichage";

type DeviseContextType = {
    devise: string;
    setDevise: (devise: string) => void;
};

const DeviseContext = createContext<DeviseContextType | undefined>(undefined);

export function DeviseProvider({ children }: { children: React.ReactNode }) {
    const [devise, setDeviseState] = useState("EUR");

    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved && devisesDisponibles.includes(saved)) {
            setDeviseState(saved);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, devise);
    }, [devise]);

    const setDevise = (d: string) => {
        if (devisesDisponibles.includes(d)) setDeviseState(d);
    };

    return (
        <DeviseContext.Provider value={{ devise, setDevise }}>
            {children}
        </DeviseContext.Provider>
    );
}

export function useDevise() {
    const context = useContext(DeviseContext);
    if (!context) throw new Error("useDevise must be used within DeviseProvider");
    return context;
}
