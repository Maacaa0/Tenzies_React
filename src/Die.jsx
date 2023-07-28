import React, { useState } from "react"


export default function Die(props) {


    // dice svgs created by chatGPT :)
    const styles = {
        backgroundImage: `url(/assets/images/dice${props.number}.svg)`,
        backgroundColor: props.isHeld ? "#d3a525d9" : "white"
    }

    return (
        <div style={styles}
             className="die"
             onClick={ () => props.toggleHold(props.id) }>
            
        </div>
    )
}