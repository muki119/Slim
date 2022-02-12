import React, { useEffect} from 'react';
import anime from 'animejs'
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
        <div className = 'Name'>
            <div className = "slim-side ">
                <span className = "slim">S<span>enior</span></span>
                <span className = "slim">L<span>eadership</span></span>
                <span className = "slim">I<span>nstant</span></span>
                <span className = "slim">M<span>essenger</span></span>
            </div>
            <div className = "menu-side">
                <span className = 'links msanim'><a href='/login'>Login</a></span>
                <span className = 'orspan msanim'>Or</span>
                <span className = 'links msanim'><a href='/register'>Register</a></span>
            </div>
        </div>
    )
}