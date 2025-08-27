import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Skeleton count={5} />
        </div>
    )
}