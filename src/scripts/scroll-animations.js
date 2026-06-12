import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileViewport = window.matchMedia("(max-width: 900px)");
const revealDuration = 1.05;
const revealStagger = 0.14;
const parallaxScrub = 0.8;

const isInitiallyVisible = (element) => {
	const bounds = element.getBoundingClientRect();

	return bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0;
};

const initScrollAnimations = () => {
	if (reducedMotion.matches) {
		gsap.set("[data-animation], [data-animation-group] > *", { clearProps: "all" });
		return;
	}

	const revealDistance = mobileViewport.matches ? 18 : 28;

	const context = gsap.context(() => {
		gsap.set(".hero-card", { opacity: 0, y: 14 });
		gsap.set('[data-animation="hero-parallax"]', {
			force3D: true,
			scale: 1.06,
			transformOrigin: "center center",
		});
		gsap.set(".hero-topbar", { opacity: 0, y: -12 });
		gsap.set(".hero-copy h1", { opacity: 0, y: 24 });
		gsap.set(".hero-lead", { opacity: 0, y: 16 });
		gsap.set(".language-switcher-mobile", { opacity: 0, y: 10 });
		document.documentElement.classList.remove("has-scroll-animations");

		const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

		heroTimeline
			.to(".hero-card", { opacity: 1, y: 0, duration: revealDuration, clearProps: "opacity,transform" })
			.to('[data-animation="hero-parallax"]', { scale: 1.025, duration: 1.8 }, 0)
			.to(".hero-topbar", { opacity: 1, y: 0, duration: revealDuration, clearProps: "opacity,transform" }, 0.25)
			.to(".hero-copy h1", { opacity: 1, y: 0, duration: revealDuration, clearProps: "opacity,transform" }, 0.38)
			.to(".hero-lead", { opacity: 1, y: 0, duration: revealDuration, clearProps: "opacity,transform" }, 0.58)
			.to(".language-switcher-mobile", { opacity: 1, y: 0, duration: revealDuration, clearProps: "opacity,transform" }, 0.68);

		if (!mobileViewport.matches) {
			gsap.to('[data-animation="hero-parallax"]', {
				yPercent: 3,
				ease: "none",
				overwrite: "auto",
				scrollTrigger: {
					trigger: ".hero-card",
					start: "top top",
					end: "bottom top",
					invalidateOnRefresh: true,
					scrub: parallaxScrub,
				},
			});
		}

		const reveal = (element, vars, start = "top 86%", initialDelay = 0.15) => {
			const animationVars = {
				...vars,
				clearProps: "opacity,transform",
			};

			if (isInitiallyVisible(element)) {
				gsap.from(element, { ...animationVars, delay: initialDelay });
				return;
			}

			gsap.from(element, {
				...animationVars,
				scrollTrigger: {
					trigger: element,
					start,
					once: true,
				},
			});
		};

		const revealGroup = (group, vars, start = "top 84%", initialDelay = 0.15) => {
			const animationVars = {
				...vars,
				clearProps: "opacity,transform",
				stagger: vars.stagger ?? revealStagger,
			};

			if (isInitiallyVisible(group)) {
				gsap.from(group.children, { ...animationVars, delay: initialDelay });
				return;
			}

			gsap.from(group.children, {
				...animationVars,
				scrollTrigger: {
					trigger: group,
					start,
					once: true,
				},
			});
		};

		gsap.utils.toArray('[data-animation="heading"]').forEach((element) => {
			reveal(element, {
				opacity: 0,
				y: revealDistance,
				duration: revealDuration,
				ease: "power3.out",
			}, "top 88%", 0.85);
		});

		if (!mobileViewport.matches) {
			gsap.utils.toArray('[data-animation="image-parallax"]').forEach((element) => {
				const image = element.querySelector("img");
				const distance = Number(element.dataset.parallaxDistance) || 32;

				gsap.fromTo(
					image,
					{
						force3D: true,
						scale: 1.065,
						transformOrigin: "center center",
						y: -distance / 2,
					},
					{
						force3D: true,
						scale: 1.065,
						y: distance / 2,
						ease: "none",
						overwrite: "auto",
						scrollTrigger: {
							trigger: element,
							start: "top bottom",
							end: "bottom top",
							invalidateOnRefresh: true,
							scrub: parallaxScrub,
						},
					},
				);
			});
		}

		gsap.utils.toArray('[data-animation-group="story"]').forEach((group) => {
			revealGroup(group, {
				opacity: 0,
				y: revealDistance,
				duration: revealDuration,
				ease: "power3.out",
				stagger: revealStagger,
			}, "top 86%", 1);
		});

		gsap.utils.toArray('[data-animation-group="cards"]').forEach((group) => {
			revealGroup(group, {
				opacity: 0,
				y: revealDistance,
				duration: revealDuration,
				ease: "power3.out",
				stagger: revealStagger,
			});
		});

		gsap.utils.toArray('[data-animation-group="process"]').forEach((group) => {
			revealGroup(group, {
				opacity: 0,
				y: revealDistance,
				duration: revealDuration,
				ease: "power3.out",
				stagger: revealStagger,
			}, "top 84%", 0.2);
		});

		gsap.utils.toArray('[data-animation-group="projects"]').forEach((group) => {
			revealGroup(group, {
				opacity: 0,
				y: revealDistance,
				duration: revealDuration,
				ease: "power3.out",
				stagger: revealStagger,
			}, "top 84%");
		});

		const statement = document.querySelector('[data-animation="statement"]');
		const stats = document.querySelector('[data-animation-group="stats"]');

		if (statement && stats) {
			const statementTimeline = gsap.timeline(
				isInitiallyVisible(statement)
					? { delay: 0.2 }
					: {
							scrollTrigger: {
								trigger: statement,
								start: "top 84%",
								once: true,
							},
						},
			);

			statementTimeline
				.from(statement, {
					opacity: 0,
					y: 28,
					duration: revealDuration,
					ease: "power3.out",
					clearProps: "opacity,transform",
				})
				.from(
					stats.children,
					{
						opacity: 0,
						y: 18,
						duration: revealDuration,
						ease: "power2.out",
						stagger: revealStagger,
						clearProps: "opacity,transform",
					},
					"-=0.4",
				);
		}

		const contactLeft = document.querySelector('[data-animation="contact-left"]');
		const contactRight = document.querySelector('[data-animation="contact-right"]');

		if (contactLeft && contactRight) {
			reveal(contactLeft, {
				opacity: 0,
				x: -28,
				duration: revealDuration,
				ease: "power3.out",
			}, "top 84%");

			reveal(contactRight, {
				opacity: 0,
				x: 28,
				duration: revealDuration,
				ease: "power3.out",
			}, "top 84%", 0.25);
		}

		gsap.utils.toArray('[data-animation-group="footer"]').forEach((group) => {
			revealGroup(group, {
				opacity: 0,
				y: 16,
				duration: revealDuration,
				ease: "power3.out",
				stagger: revealStagger,
			}, "top 96%");
		});
	});

	return () => context.revert();
};

let cleanup = initScrollAnimations();

const refreshScrollTriggers = () => {
	requestAnimationFrame(() => ScrollTrigger.refresh());
};

window.addEventListener("modular-homes:language-change", refreshScrollTriggers);
window.addEventListener("load", refreshScrollTriggers, { once: true });

reducedMotion.addEventListener("change", () => {
	cleanup?.();
	cleanup = initScrollAnimations();
	refreshScrollTriggers();
});

mobileViewport.addEventListener("change", () => {
	cleanup?.();
	cleanup = initScrollAnimations();
	refreshScrollTriggers();
});
