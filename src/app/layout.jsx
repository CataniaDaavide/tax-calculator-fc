import "./globals.css";

export const metadata = {
  title: "TAX CALCULATOR FC",
  description: "Calcolatore tasse per compravendita su fc",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased overscroll-none`}
      >
        {children}
      </body>
    </html>
  );
}
