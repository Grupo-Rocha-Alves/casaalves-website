import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Toaster } from 'react-hot-toast';
import '../styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    
    // Páginas que não devem ter navbar e footer
    const noLayoutPages = ['/login', '/'];

    const shouldUseLayout = !noLayoutPages.includes(router.pathname);

    return (
        <AuthProvider>
            {shouldUseLayout ? (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            ) : (
                <Component {...pageProps} />
            )}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#1f2937',
                        border: '1px solid #e5e7eb',
                        padding: '16px',
                        borderRadius: '0.5rem',
                    },
                    success: {
                        iconTheme: {
                            primary: '#16a34a',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#dc2626',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </AuthProvider>
    );
}
