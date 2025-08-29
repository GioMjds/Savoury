import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return <Skeleton count={5} className="h-6 mb-2" />;
}