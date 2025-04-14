import AdminNavBar from "../components/AdminNavBar";
import Footer from "../components/Footer";

export default function AdminLayout({
    children,
    heading,
}: {
    children: React.ReactNode;
    heading: string;
}) {
    return (
        <div className="min-h-screen flex flex-col relative">
            <AdminNavBar heading={heading} />

            <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-8 bg-[url('/background.png')] bg-cover bg-center">
                <div className="-z-10 h-full w-full backdrop-blur-md absolute top-0 left-0"></div>
                <main className="flex-1 flex flex-col">{children}</main>
            </div>
            <Footer />
        </div>
    );
}
