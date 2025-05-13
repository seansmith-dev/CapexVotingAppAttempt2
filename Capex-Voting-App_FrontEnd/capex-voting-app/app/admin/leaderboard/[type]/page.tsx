import { Suspense } from "react";
import LeaderboardClient from "./LeaderboardClient";

interface PageProps {
    params: Promise<{
        type: string;
    }>;
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function LeaderboardPage({ params }: PageProps) {
    const resolvedParams = await params;
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LeaderboardClient type={resolvedParams.type} />
        </Suspense>
    );
}
