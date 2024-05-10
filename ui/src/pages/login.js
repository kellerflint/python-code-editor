import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import supabase from '../auth/supabaseClient';

function Login() {
    return (
        <Auth
            supabaseClient={supabase}
            providers={['google', 'github']}
            appearance={{ theme: ThemeSupa }}
        //theme='dark'
        />
    );
}

export default Login;