import React, {useCallback, useEffect, useRef} from "react";
import p5 from "p5";
import {animated, useSpring} from "@react-spring/web";

const n = 110000;

export const Spiral = () => {
    // let t = 1;
    const t = useRef(Math.random() * 2 * Math.PI);
    const primes = useRef(new Map());
    const p5Ref = useRef(null);


    const sketch = useCallback((p) => {
        if (p5Ref.current === null) return;
        p.setup = () => {
            p.createCanvas(p5Ref.current.offsetWidth, p5Ref.current.offsetHeight);
            p.fill(125, 157, 223, 255);
            p.noStroke();

            // Generate primes
            for (let i = 2; i <= n; i++) {
                if (!primes.current.has(i)) {
                    primes.current.set(i, true);
                    for (let j = i * i; j <= n; j += i) {
                        primes.current.set(j, false);
                    }
                }
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(p5Ref.current.offsetWidth, p5Ref.current.offsetHeight);
        }

        p.draw = () => {
            p.background(7, 18, 48, 255);

            for (let prime of primes.current.keys()) {
                if (primes.current.get(prime)) {
                    p.circle((prime * Math.sin(prime * t.current)) / 99 + p5Ref.current.offsetWidth / 2,
                        (prime * Math.cos(prime * t.current)) / 99 + p5Ref.current.offsetHeight / 2,
                        Math.max(2, p5Ref.current.offsetWidth / 500));
                }
            }

            t.current += 0.0000001 / Math.max(p5Ref.current.offsetWidth, p5Ref.current.offsetHeight) * 1000;
        };
    }, []);

    useEffect(() => {
        if (p5Ref.current === null) return;

        console.log("seed :", t.current);
        const mp5 = new p5(sketch, p5Ref.current);
        return () => {
            mp5.remove();
        }
    }, [p5Ref.current?.offsetWidth, p5Ref.current?.offsetHeight, sketch]);

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
                      ref={p5Ref}/>
    );
};