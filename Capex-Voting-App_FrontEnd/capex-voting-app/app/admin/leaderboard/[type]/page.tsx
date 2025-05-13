import { Suspense } from "react";
import LeaderboardClient from "./LeaderboardClient";

type Props = {
    params: {
        type: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function LeaderboardPage({ params }: Props) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LeaderboardClient type={params.type} />
        </Suspense>
    );
}
