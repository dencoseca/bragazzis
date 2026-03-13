import { useEffect, useState } from "react";
import debounce from "@/utils/debounce";
import { openingHours } from "@/constants/openingHours";
import Layout from "@/components/Layout";
import Cover from "@/components/Cover";
import FloatingItems from "@/components/FloatingItems";
import FullWidthBanner from "@/components/FullWidthBanner";

const breakpoints = {
    mobile: 760,
    tablet: 1080,
};

export default function Home() {
    const [dimensions, setDimensions] = useState(() => ({
        height: window.innerHeight,
        width: window.innerWidth,
        vh: window.innerHeight / 100,
        vw: window.innerWidth / 100,
    }));

    useEffect(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    }, [dimensions]);

    useEffect(() => {
        if (window.innerWidth < breakpoints.mobile) return;

        const debouncedHandleResize = debounce(function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth,
                vh: window.innerHeight / 100,
                vw: window.innerWidth / 100,
            });
        }, 1000);

        window.addEventListener("resize", debouncedHandleResize);
        return () => {
            window.removeEventListener("resize", debouncedHandleResize);
        };
    }, []);

    return (
        <Layout pageTitle="Home" description="Bragazzi's — an Italian deli, café in Sheffield.">
            <Cover
                openingHours={openingHours}
                dimensions={dimensions}
                breakpoints={breakpoints}
            />
            <section className="home__mobile-cover" id="mobile-cover">
                <ul className="opening-hours">
                    {openingHours.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
            </section>
            <section className="home__statement text--display" id="statement">
                <span>Roam freely and find inspiration...</span>
                <span>or that obscure pasta shape that you've</span>
                <span>been looking for</span>
            </section>
            <FloatingItems dimensions={dimensions} breakpoints={breakpoints} />
            <FullWidthBanner
                dimensions={dimensions}
                breakpoints={breakpoints}
            />
        </Layout>
    );
}
