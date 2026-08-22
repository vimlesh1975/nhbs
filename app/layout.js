import './globals.css';

export const metadata = {
  title: 'CasparCG Playout Studio | MySQL Graphics Client',
  description: 'Next.js CasparCG Client and MySQL Graphics Playout Controller with live AMCP TCP control.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
