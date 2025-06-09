import { animate, svg } from "https://esm.sh/animejs";

 window.addEventListener("DOMContentLoaded", () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;

      anime({
        targets: '.circle',    
        opacity: [1, 1],
        delay: anime.stagger(100),
        duration: 1200,
        ease: 'inOutExpo',
        loop: true,
        alternate: true,
        rotate: 90,

      });
    });