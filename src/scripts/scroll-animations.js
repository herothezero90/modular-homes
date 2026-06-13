import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileViewport = window.matchMedia("(max-width: 900px)");
const revealStagger = 0.14;
const revealStart = "top 85%";
const revealDelay = 0.15;
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

	const isMobile = mobileViewport.matches;
	const revealDistance = isMobile ? 40 : 28;
	const revealDuration = isMobile ? 1.2 : 1.05;

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

		if (!isMobile) {
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

		// Single-element reveal
		const reveal = (element, vars, start = revealStart, initialDelay = revealDelay) => {
			const animationVars = { ...vars, clearProps: "opacity,transform" };

			if (isInitiallyVisible(element)) {
				gsap.from(element, { ...animationVars, delay: initialDelay });
				return;
			}

			gsap.from(element, {
				...animationVars,
				scrollTrigger: { trigger: element, start, once: true },
			});
		};

		// Group reveal:
		// - Mobile: each child gets its own ScrollTrigger so vertical items animate as you scroll to them
		// - Desktop: single trigger on group with stagger so horizontal rows cascade nicely
		const revealItems = (group, vars, start = revealStart) => {
			const baseVars = { ...vars, duration: revealDuration, ease: "power3.out", clearProps: "opacity,transform" };
			delete baseVars.stagger;

			if (isMobile) {
				[...group.children].forEach((child, i) => {
					if (isInitiallyVisible(child)) {
						gsap.from(child, { ...baseVars, delay: revealDelay + i * revealStagger });
					} else {
						gsap.from(child, {
							...baseVars,
							scrollTrigger: { trigger: child, start, once: true },
						});
					}
				});
			} else {
				const groupVars = { ...baseVars, stagger: revealStagger };

				if (isInitiallyVisible(group)) {
					gsap.from(group.children, { ...groupVars, delay: revealDelay });
				} else {
					gsap.from(group.children, {
						...groupVars,
						scrollTrigger: { trigger: group, start, once: true },
					});
				}
			}
		};

		// Headings
		gsap.utils.toArray('[data-animation="heading"]').forEach((element) => {
			reveal(element, { opacity: 0, y: revealDistance, duration: revealDuration, ease: "power3.out" });
		});

		// Image parallax — desktop only; mobile gets fade via revealItems (story group)
		if (!isMobile) {
			gsap.utils.toArray('[data-animation="image-parallax"]').forEach((element) => {
				const image = element.querySelector("img");
				const distance = Number(element.dataset.parallaxDistance) || 32;

				gsap.fromTo(
					image,
					{ force3D: true, scale: 1.065, transformOrigin: "center center", y: -distance / 2 },
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
			revealItems(group, { opacity: 0, y: revealDistance });
		});

		gsap.utils.toArray('[data-animation-group="cards"]').forEach((group) => {
			revealItems(group, { opacity: 0, y: revealDistance });
		});

		gsap.utils.toArray('[data-animation-group="process"]').forEach((group) => {
			revealItems(group, { opacity: 0, y: revealDistance });
		});

		gsap.utils.toArray('[data-animation-group="projects"]').forEach((group) => {
			revealItems(group, { opacity: 0, y: revealDistance });
		});

		// Statement + stats
		const statement = document.querySelector('[data-animation="statement"]');
		const stats = document.querySelector('[data-animation-group="stats"]');

		if (statement && stats) {
			if (isMobile) {
				// On mobile each element triggers independently as it enters the viewport
				reveal(statement, { opacity: 0, y: revealDistance, duration: revealDuration, ease: "power3.out" });
				[...stats.children].forEach((child) => {
					reveal(child, { opacity: 0, y: revealDistance, duration: revealDuration, ease: "power2.out" });
				});
			} else {
				// Desktop: timeline so statement and stats play as a single composed sequence
				const statementTimeline = gsap.timeline(
					isInitiallyVisible(statement)
						? { delay: 0.2 }
						: { scrollTrigger: { trigger: statement, start: revealStart, once: true } },
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
		}

		// Contact — horizontal slide on desktop, vertical fade on mobile
		const contactLeft = document.querySelector('[data-animation="contact-left"]');
		const contactRight = document.querySelector('[data-animation="contact-right"]');

		if (contactLeft && contactRight) {
			if (isMobile) {
				reveal(contactLeft, { opacity: 0, y: revealDistance, duration: revealDuration, ease: "power3.out" });
				reveal(contactRight, { opacity: 0, y: revealDistance, duration: revealDuration, ease: "power3.out" }, revealStart, 0.25);
			} else {
				reveal(contactLeft, { opacity: 0, x: -28, duration: revealDuration, ease: "power3.out" });
				reveal(contactRight, { opacity: 0, x: 28, duration: revealDuration, ease: "power3.out" }, revealStart, 0.25);
			}
		}

		gsap.utils.toArray('[data-animation-group="footer"]').forEach((group) => {
			revealItems(group, { opacity: 0, y: revealDistance }, "top 92%");
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
