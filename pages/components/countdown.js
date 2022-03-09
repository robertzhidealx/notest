import React from 'react';
import ReactDOM from 'react-dom';
import Countdown from 'react-countdown';
// Import react-circular-progressbar module and styles
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
  } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";

const Countdown = (props) => {
    console.log("countdown component?")
     // Random component
     const Completionist = () => <span>Time is up!</span>;
     
     // Renderer callback with condition
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <Completionist />;
        } else {
            // Render a countdown
            // return <span>{hours}:{minutes}:{seconds}</span>;
            return <CircularProgressbar
            value={seconds}
            strokeWidth={50}
            styles={buildStyles({
                strokeLinecap: "butt"
            })}
            />
        }
    };

// ReactDOM.render(
   return  (
       <>
       <CircularProgressbar
        value={15}
        strokeWidth={50}
        styles={buildStyles({
            strokeLinecap: "butt"
        })}
        />
   <Countdown
    date={Date.now() + 5000}
    renderer={renderer}
    />
    </>
    )
//   document.getElementById('root')
//   );
// ReactDOM.render(
//     <Countdown
//     date={Date.now() + 5000}
//     renderer={renderer}
//     />,
//   document.getElementById('root')
//   );
}

export default Countdown;