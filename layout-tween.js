/**
 * This funciton when called on a list of elements will measure the position and size
 * of all it's children elements and return a function, which when called will animate
 * from the old size and position to the new one.
 * 
 * @param  {...HTMLElement} parents 
 * @param option
 * 
 * options:
 * 
 *  translate: whether to animate position changes
 *  scale: whether to animate size changes
 *  exemptParents: this will ignore elements explicitly passed
 *                 into this function when they are matched as
 *                 a child of another element.
 *  exempt: a list of elements to ignore
 *  animationOptions: options for the animation, see mdn:
 *                   https://developer.mozilla.org/en-US/docs/Web/API/Element/animate#Parameters
 */
function tweenLayoutChanges(...parents) {
	
	// If the user would prefer less animation then don't do anything just return a no-op function.
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReducedMotion === true) return function () {};

	// Option schema & default values
	const options = {
		translate: true,
		scale:true,
		clip: false,
		exemptParents: true,
		exempt: [],
		animationOptions: {
			easing: 'ease-out',
			duration: 500
		}
	};

	// If the last element is not an element then treat it as options.
	if (parents[parents.length - 1] instanceof HTMLElement === false) {
		Object.assign(options, parents.pop());
	}

	// If clipping don't scale
	if (options.clip) {
		options.scale = false;
	}

	// Map of Maps for each element handed to the function
	const posMap = new Map();
	for (parent of parents) {

		// Turn an array of elements into a map of elements to their respective bounding box
		const boundingBoxMap = new Map(
			Array.from(parent.children).map(
				el => [ el, el.getBoundingClientRect() ]
			)
		);

		// This maps each parent to the map of it's childern to their respective
		// bounding box.
		posMap.set(parent, boundingBoxMap);
	}

	// Run this to animate the difference between the old size/position and the new size/position
	return function () {
		for (parent of parents) {
			const children = Array.from(parent.children);

			// get the boundingBoxMap from earlier
			const oldPositions = posMap.get(parent);

			// Measure the new bounding boxes for each element
			const newPositions = new Map(children.map(el => [el, el.getBoundingClientRect()]));

			for (const el of children) {

				// Ignore elements which are excluded in the options
				if (options.exempt.includes(el)) continue;

				// Ignore elements which are having their children animated already
				if (options.exemptParents && parents.includes(el)) continue;

				// If the element is not new then animate the transform between old and new
				if (oldPositions.has(el)) {
					const oldPos = oldPositions.get(el);
					const newPos = newPositions.get(el);

					// Use this so that transforms can be nested
					let oldTransform = window.getComputedStyle(el).transform;

					// none is only valid as the only option so replace it with an identity transform
					if (oldTransform === 'none') {
						oldTransform = 'scale(1)';
					}

					// This is the transform to put the new position back in the old position
					const translateTransform = `translate(${oldPos.x - newPos.x}px, ${oldPos.y - newPos.y}px)`;
					
					// if the element is too small that it can't be scaled up to size then don't scale.
					const scaleTransform = (newPos.width === 0 || newPos.height === 0) ?
						'scale(1)' :
						`scale(${oldPos.width/newPos.width},${oldPos.height/newPos.height})`;

					const heightDiff = (newPos.height - oldPos.height);
					const widthDiff = (newPos.width - oldPos.width);

					// Do the animation to move/scale old elements
					el.animate({
						transformOrigin: ['0 0','0 0'],
						transform: [`${oldTransform} ${options.translate ? translateTransform : ''} ${options.scale ? scaleTransform : ''}`, oldTransform],
						clipPath: [!options.clip ? 'inset(0px 0px 0px 0px)' : `inset(0px ${widthDiff}px ${heightDiff}px 0px)`, 'inset(0px 0px 0px 0px)']
					}, options.animationOptions);

					// Otherwise it's a new element and needs to be faded in after
				} else {
					const fadeAnimationOptions = {};

					Object.assign(fadeAnimationOptions, options.animationOptions);

					// Fade in new elements once the old animations have finished
					Object.assign(fadeAnimationOptions, {
						delay: (fadeAnimationOptions.delay || 0) + fadeAnimationOptions.duration,
						fill: 'backwards'
					});

					// Do the animation to fade in new elements
					el.animate({
						opacity: ['0', '1']
					}, fadeAnimationOptions);
				}
			}
		}
	}
}

export default tweenLayoutChanges;
