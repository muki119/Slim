import React, { createContext,useContext, useEffect, useState ,useReducer} from 'react';
import {
    Redirect
} from "react-router-dom";
import anime, { easings } from 'animejs'
import "./landing.css";

export default function Landing(){
    useEffect(()=>{
        const targets = ['.slim',".msanim"]
        anime({
            targets:targets,
            translateY:['-200%','0%'],
            opacity:[0,1],
            duration:1000,
            delay:anime.stagger(50),
            direction:'normal',
            easing:'easeInOutCubic',
            complete:function(anim){
                anim.remove(targets)
            }
        })
    },[])

    return(
        <div class = 'Name'>
            <div class = "slim-side ">
                <span class = "slim">S<span>enior</span></span>
                <span class = "slim">L<span>eadership</span></span>
                <span class = "slim">I<span>nstant</span></span>
                <span class = "slim">M<span>essenger</span></span>
            </div>
            <div class = "menu-side">
                <span class = 'links msanim'><a href='/login'>Login</a></span>
                <span class = 'orspan msanim'>Or</span>
                <span class = 'links msanim'><a href='/register'>Register</a></span>
            </div>
        </div>
    )
}