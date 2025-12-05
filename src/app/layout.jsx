import { ToastContainer } from "react-toastify";
import "./globals.css";

export const metadata = {
  title: "Sample Bee | Effortless Ad Tracking & Customer Insights",
  description: "Leverage technology to efficiently track your ads and gather valuable customer data for smarter marketing decisions.",
  keywords: "ad tracking, customer data, marketing insights, sample collection, tech solutions",
  author: "Sample Bee",
};

// Fix the viewport warning by using separate export
export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        {children}
        <ToastContainer theme="dark" />
      </body>
    </html>
  );
}