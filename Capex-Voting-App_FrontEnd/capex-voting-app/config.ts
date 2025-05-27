export const config = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://capex-voting-app-attempt2.vercel.app',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production'
}; 