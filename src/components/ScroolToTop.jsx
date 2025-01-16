import React from 'react';
import { useEffect, useState } from 'react';

const ScrollToTop = () => {
    const [showArrow, setShowArrow] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 200) {
            setShowArrow(true);
        } else {
            setShowArrow(false);
        }
    };


    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {showArrow && (
                <button
                    onClick={scrollUp}
                    className="button d-flex justify-content-center align-items-center  fs-4"
                    title="Go to top"
                >
                    ↑
                </button>
            )}
        </>
    );
};

export default ScrollToTop;