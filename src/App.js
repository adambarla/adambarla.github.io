import React, {useEffect, useRef, useState} from 'react';
import p5 from 'p5';
import {SocialIcon} from "react-social-icons";

const Spiral = () => {
    let n = 110000;
    let t = 1;
    const primes = new Map();
    const p5Ref = useRef(null);

    let ascii =
        "     __    ____    __    __  __    ____    __    ____  __      __     \n" +
        "    /__\\  (  _ \\  /__\\  (  \\/  )  (  _ \\  /__\\  (  _ \\(  )    /__\\    \n" +
        "   /(__)\\  )(_) )/(__)\\  )    (    ) _ ( /(__)\\  )   / )(__  /(__)\\   \n" +
        "  (__)(__)(____/(__)(__)(_/\\/\\_)  (____/(__)(__)(_)\\_)(____)(__)(__)  \n" +
        " \n";
    const sketch = (p) => {
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
                    p.circle((prime * Math.sin(prime * t)) / 99 + p5Ref.current.offsetWidth / 2,
                        (prime * Math.cos(prime * t)) / 99 + p5Ref.current.offsetHeight / 2, 3);
                }
            }

            t += 0.0000001;
        };
    };

    useEffect(() => {
        if (p5Ref.current === null) return;
        console.log(p5Ref.current.offsetWidth, p5Ref.current.offsetHeight);
        const mp5 = new p5(sketch, p5Ref.current);
        return () => {
            mp5.remove();
        }
    }, [p5Ref.current?.offsetWidth, p5Ref.current?.offsetHeight]);

    return <div className={"w-100 h-100 rounded-5 overflow-hidden bg-secondary"}
                ref={p5Ref}
                style={{position: "relative"}}>
        <div className={'absolute-text d-flex flex-column bg-secondary rounded-3'}>
            {
                ascii.split('\n').map((line, index) => (
                    <pre key={index} className={'text-white'}>{line}</pre>
                ))
            }
        </div>
    </div>;
};

function App() {
    return (
        <div className={"h-100 bg-primary"}>
            <div className={"spiral p-3 pb-0"}>
                <Spiral/>
            </div>
            <div className={"d-flex flex-column justify-content-center align-items-center"}>
                <div className={"d-flex justify-content-center align-items-center gap-2 w-100"}
                    style={{height:80}}>
                    <SocialIcon url={"https://www.linkedin.com/in/adam-barla-1422b9208/"} bgColor={"#0077b5"}/>
                    <SocialIcon url={"https://github.com/barlaada"} bgColor={"#4078c0"}/>
                </div>
                <div className={"container"}
                     style={{height:80}}>
                   <h4 className={"text-white"}>Work in progress</h4>
                </div>
            </div>
        </div>
    );
}

export default App;
