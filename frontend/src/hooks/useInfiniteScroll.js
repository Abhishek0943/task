import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for infinite scroll detection.
 * Uses IntersectionObserver to detect when sentinel element is visible.
 *
 * @param {Function} onIntersect - Callback to fire when sentinel is visible
 * @param {boolean} enabled - Whether infinite scroll is active
 * @returns {React.RefObject} - Ref to attach to the sentinel element
 */
const useInfiniteScroll = (onIntersect, enabled) => {
    const sentinelRef = useRef(null);

    const handleIntersect = useCallback(
        (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && enabled) {
                onIntersect();
            }
        },
        [onIntersect, enabled]
    );

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(handleIntersect, {
            root: null,
            rootMargin: "200px",
            threshold: 0,
        });

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [handleIntersect]);

    return sentinelRef;
};

export default useInfiniteScroll;
