import { useState, useEffect } from 'react';
import supabase from './supabaseClient';

export default function useAuth() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then((session) => {
            setSession(session);
        });

        const subscription = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return session;
}