import typography from '@tailwindcss/typography';

const config = {
    theme: {
        extend: {
            animation: {
                'blob': 'blob 7s infinite',
                'float': 'float 6s infinite',
                'spin-slow': 'spin 8s linear infinite',
                'bounce-slow': 'bounce 3s infinite',
                'ping-slow': 'ping 3s infinite',
                'gradient': 'gradient 3s linear infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                gradient: {
                    '0%': { backgroundPosition: '0% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
            },
            typography: {
                DEFAULT: {
                    css: {
                        'h1, h2, h3, h4': {
                            color: 'white',
                            marginTop: '1.5em',
                            marginBottom: '0.5em',
                        },
                        'ul, ol': {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                        'li': {
                            marginTop: '0.5em',
                            marginBottom: '0.5em',
                        },
                        'p': {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                        'strong': {
                            color: 'white',
                        },
                        'em': {
                            color: '#d1d5db',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        typography,
    ],
};

export default config;