import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import p5 from "p5";
import {animated, useSpring} from "@react-spring/web";

export const Spiral = () => {
    // let t = 1;
    const t = useRef(Math.random() * 2 * Math.PI);
    const p5Ref = useRef(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const primes = useMemo(() => {
        let tmp = new Map();
        if (p5Ref.current === null) return tmp;

        const n = Math.ceil(Math.sqrt(width ** 2 + height ** 2)) * 50;

        for (let i = 2; i <= n; i++) {
            if (!tmp.has(i)) {
                tmp.set(i, true);
                for (let j = i * i; j <= n; j += i) {
                    tmp.set(j, false);
                }
            }
        }
        return tmp;
    }, [width, height]);

    const sketch = useCallback((p) => {
        if (p5Ref.current === null) return;
        p.setup = () => {
            p.createCanvas(width, height);
            p.fill(125, 157, 223, 255);
            p.noStroke();
            p.frameRate(30);
        };

        p.windowResized = () => {
            p.resizeCanvas(width, height);
        }

        p.draw = () => {
            p.background(7, 18, 48, 255);

            for (let prime of primes.keys()) {
                if (primes.get(prime)) {
                    p.circle((prime * Math.sin(prime * t.current)) / 99 + p5Ref.current.offsetWidth / 2,
                        (prime * Math.cos(prime * t.current)) / 99 + p5Ref.current.offsetHeight / 2,
                        Math.max(2, p5Ref.current.offsetWidth / 500));
                }
            }

            t.current += 0.0000001 / Math.max(p5Ref.current.offsetWidth, p5Ref.current.offsetHeight) * 1000;
        };
    }, [width, height, primes]);


    useEffect(() => {
        if (p5Ref.current === null) return;

        const mp5 = new p5(sketch, p5Ref.current);
        return () => {
            mp5.remove();
        }
    }, [sketch]);

    useEffect(() => {
        console.log("seed :", t.current);

        const observer = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect;
            setWidth(rect.width);
            setHeight(rect.height);
        });
        observer.observe(document.documentElement);

        return () => {
            observer.unobserve(document.documentElement);
        };
    }, []);

    const [props] = useSpring(
        () => ({
            from: {opacity: 0},
            to: {opacity: 1},
            delay: 1000,
            config: {
                friction: 50
            }
        }),
        []
    )

    return (
        <animated.div style={props} className={"w-100 h-100 rounded-5 overflow-hidden bg-secondary"}
                      ref={p5Ref}>
        </animated.div>
    );
};