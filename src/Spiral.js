import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import p5 from "p5";
import {animated, useSpring} from "@react-spring/web";

function gaussian2D(x, y, muX, muY, sigmaX, sigmaY, rho) {
    let sigmaXY = rho * sigmaX * sigmaY;
    let detSigma = sigmaX * sigmaX * sigmaY * sigmaY - sigmaXY * sigmaXY;
    let coeff = 1 / (2 * Math.PI * Math.sqrt(detSigma));
    let xDiff = x - muX;
    let yDiff = y - muY;
    let expPart = -0.5 / detSigma * (xDiff * xDiff * sigmaY * sigmaY + yDiff * yDiff * sigmaX * sigmaX - 2 * xDiff * yDiff * sigmaXY);
    return coeff * Math.exp(expPart);
}


export const Spiral = () => {
    const t = useRef(Math.random() * 2 * Math.PI);
    const p5Ref = useRef(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const start = useRef(Date.now())

    const primes = useMemo(() => {
        if (p5Ref.current === null) return [];
        const n = Math.ceil(Math.sqrt(width ** 2 + height ** 2)) * 50 * 2;
        let sieve = new Array(n + 1).fill(true);
        sieve[0] = sieve[1] = false; // 0 and 1 are not primes
        for (let i = 2; i * i <= n; i++) {
            if (sieve[i]) {
                for (let j = i * i; j <= n; j += i) {
                    sieve[j] = false;
                }
            }
        }
        const primesList = [];
        for (let i = 2; i <= n; i++) {
            if (sieve[i]) {
                primesList.push(i);
            }
        }
        return primesList;
        }, [width, height]);

    const sketch = useCallback((p) => {
        if (p5Ref.current === null) return;
        p.setup = () => {
            p.createCanvas(width, height);
            p.fill(203,220,255,255);
            p.noStroke();
            p.frameRate(30);
        };

        p.windowResized = () => {
            p.resizeCanvas(width, height);
        }

        p.draw = () => {
            p.background(7, 18, 48, 255);

            for (let prime of primes) {
                let angle = prime * t.current;
                let x0 = p5Ref.current.offsetWidth * 0.5;
                let y0 = p5Ref.current.offsetHeight * 0.5;
                let radius = prime / 99;
                let x = (radius * Math.sin(angle)) + x0;
                let y = (radius * Math.cos(angle)) + y0;

                let xO = p5Ref.current.offsetWidth * 0.5
                let yO = p5Ref.current.offsetHeight * 0.737
                let sx = 125
                let sy = 50
                let corr = 0
                let offset = gaussian2D(x, y, xO, yO, sx, sy, corr)
                offset *= 1/(1 + Math.exp(-0.005 * (Date.now() - start.current - 2000) )  ) * 60000
                y += (y-yO) * offset
                x += (x-xO) * offset

                p.circle(x, y, Math.max(2, p5Ref.current.offsetWidth / 500));
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