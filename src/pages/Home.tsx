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
        const main = document.querySelector("main");
        if (main) main.classList.add("visible");
    }, []);

    useEffect(() => {
        const vh = dimensions.height * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);

        if (dimensions.width >= breakpoints.mobile) {
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
        }
    }, [dimensions]);

    return (
        <Layout pageTitle="Home">
            <Cover
                openingHours={openingHours}
                dimensions={dimensions}
                breakpoints={breakpoints}
            />
            <section className="home__mobile-cover" id="mobile-cover">
                <div>
                    {openingHours.map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
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
            <section className="home__covid-notice">
                <span className="text--display">Covid Restrictions</span>
                <p className="text--md">
                    We want to reassure you that we are putting all measures in
                    place to keep you and our team safe so that you can
                    confidently enjoy your visit.
                </p>
                <p className="text--md">
                    We are following all government guidelines and working on
                    practice measures within the shop. We have completed
                    necessary risk assessments and all procedures which will be
                    constantly reviewed and updated where necessary in line with
                    government guidelines.
                </p>
                <p className="text--md">
                    We ask you to please use common sense to play your part
                    keeping everyone safe. In return we will be doing the same
                    for you.
                </p>
                <p className="text--md">
                    Due to the constantly changing nature of this guidance, we
                    will be continuously reviewing our procedures related to
                    capacity.
                </p>
            </section>
        </Layout>
    );
}
