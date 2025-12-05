import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({ children }) {
    return (
        <div className="h-screen overflow-hidden bg-gray-200">
            <ClientLayout>
                {children}
            </ClientLayout>
        </div>
    );
}