import React from 'react';
import {SocialIcon} from "react-social-icons";
import {Name} from "./Name";
import {Spiral} from "./Spiral";


function App() {


    return (
        <div className={"gradiant pb-3"}>
            <div className={"art p-3 pb-0"}>
                <Spiral/>
                <Name/>
            </div>

            <div style={{height: 80}} className={"d-flex justify-content-center align-items-center gap-2"}>
                <SocialIcon url={"https://www.linkedin.com/in/barla"} bgColor={"#0077b5"}/>
                <SocialIcon url={"https://github.com/adambarla"} bgColor={"#4078c0"}/>
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
