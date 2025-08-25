import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Skeleton count={5} height={30} />
        </SkeletonTheme>
    )
}