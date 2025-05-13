import { Suspense } from "react";
import LeaderboardClient from "./LeaderboardClient";

interface PageProps {
    params: {
        type: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function LeaderboardPage({ params }: PageProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LeaderboardClient type={params.type} />
        </Suspense>
    );
}
