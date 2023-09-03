import React, {useCallback, useEffect, useRef} from 'react';
import p5 from 'p5';
import {SocialIcon} from "react-social-icons";
import {animated, useSpring} from '@react-spring/web'


function Name() {
    let ascii =
        " █████  ██████   █████  ███    ███     ██████   █████  ██████  ██       █████  \n" +
        "██   ██ ██   ██ ██   ██ ████  ████     ██   ██ ██   ██ ██   ██ ██      ██   ██ \n" +
        "███████ ██   ██ ███████ ██ ████ ██     ██████  ███████ ██████  ██      ███████ \n" +
        "██   ██ ██   ██ ██   ██ ██  ██  ██     ██   ██ ██   ██ ██   ██ ██      ██   ██ \n" +
        "██   ██ ██████  ██   ██ ██      ██     ██████  ██   ██ ██   ██ ███████ ██   ██ ";


    const [props] = useSpring(
        () => ({
            from: {opacity: 0},
            to: {opacity: 1},
            delay: 2000,
            config: {
                friction: 100,
            }
        }),
        []
    )


    return (
        <animated.div style={props} className={'absolute-text d-flex flex-column rounded-3'}>
            {
                ascii.split('\n').map((line, index) => (
                    <pre key={index} className={'name'}>{line}</pre>
                ))
            }
        </animated.div>
    )
}

const Spiral = () => {
    let n = 110000;
    // let t = 1;
    const t = useRef(Math.random() * 2 * Math.PI);
    const primes = new Map();
    const p5Ref = useRef(null);


    const sketch = useCallback((p) => {
        if (p5Ref.current === null) return;
        p.setup = () => {
            p.createCanvas(p5Ref.current.offsetWidth, p5Ref.current.offsetHeight);
            p.fill(125, 157, 223, 255);
            p.noStroke();

            // Generate primes
            for (let i = 2; i <= n; i++) {
                if (!primes.has(i)) {
                    primes.set(i, true);
                    for (let j = i * i; j <= n; j += i) {
                        primes.set(j, false);
                    }
                }
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(p5Ref.current.offsetWidth, p5Ref.current.offsetHeight);
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
    }, [n, primes]);

    useEffect(() => {
        if (p5Ref.current === null) return;

        console.log("seed :", t.current);
        const mp5 = new p5(sketch, p5Ref.current);
        return () => {
            mp5.remove();
        }
    }, [p5Ref.current?.offsetWidth, p5Ref.current?.offsetHeight, sketch, t.current]);

    const [props] = useSpring(
        () => ({
            from: {opacity: 0, position: "relative"},
            to: {opacity: 1, position: "relative"},
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
            <Name/>
        </animated.div>
    );
};

function App() {


    return (
        <div className={"gradiant pb-3"}>
            <div className={"spiral p-3 pb-0"}>
                <Spiral/>
            </div>

            <div style={{height: 80}} className={"d-flex justify-content-center align-items-center gap-2"}>
                <SocialIcon url={"https://www.linkedin.com/in/adam-barla-1422b9208/"} bgColor={"#0077b5"}/>
                <SocialIcon url={"https://github.com/barlaada"} bgColor={"#4078c0"}/>
            </div>
            <div className={"d-flex justify-content-center align-items-center"}>
                <hr className={"w-75"}/>
            </div>
            <div className={"container pt-3"}>
                <h4 className={"text-white"}>Work in progress</h4>
            </div>

        </div>
    );
}

export default App;
