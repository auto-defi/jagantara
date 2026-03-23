// lib/transition.ts

import gsap from "gsap";
import { useRouter } from "next/navigation";

export const animatePageIn = () => {
  const transitionElement = document.getElementById("transition-element");

  if (transitionElement) {
    const tl = gsap.timeline();

    tl.set(transitionElement, {
      yPercent: 0,
    }).to(transitionElement, {
      yPercent: -100,
      duration: 0.4,
      ease: "power2.inOut",
    });
  }
};

export const animatePageOut = (to: string, router: any) => {
  const animationWrapper = document.getElementById("transition-element");

  if (animationWrapper) {
    const tl = gsap.timeline();

    tl.set(animationWrapper, {
      yPercent: 100,
    }).to(animationWrapper, {
      yPercent: 0,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        router.push(to);
      },
    });
  }
};
