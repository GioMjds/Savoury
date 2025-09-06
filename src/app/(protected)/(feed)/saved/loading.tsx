import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <Skeleton width={45} count={7} />
    )
}