import { Suspense } from "react";
import LeaderboardClient from "./LeaderboardClient";

interface PageProps {
    params: Promise<{
        type: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LeaderboardPage({ params, searchParams }: PageProps) {
    const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LeaderboardClient type={resolvedParams.type} />
        </Suspense>
    );
}
