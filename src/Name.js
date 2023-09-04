import {animated, useSpring} from "@react-spring/web";
import React from "react";

export function Name() {
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
        <animated.div style={props} className={'name d-flex flex-column rounded-3'}>
            {
                ascii.split('\n').map((line, index) => (
                    <pre key={index} className={'huge-text'}>{line}</pre>
                ))
            }
        </animated.div>
    )
}