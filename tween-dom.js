// When a new child is added smoothly 
function smoothAdd(...parents) {
	const options = {
		translate: true,
		scale:true
	};
	if (parents[parents.length - 1] instanceof HTMLElement === false) {
		Object.assign(options, parents.pop());
	}
	const posMap = new Map();
	for (parent of parents) {
		posMap.set(parent, new Map(Array.from(parent.children).map(el => [el, el.getBoundingClientRect()])));
	}
	return function () {
		for (parent of parents) {
			const children = Array.from(parent.children);
			const newPositions = new Map(children.map(el => [el, el.getBoundingClientRect()]));
			const oldPositions = posMap.get(parent);
			children.forEach(el => {
				if (oldPositions.has(el)) {
					const oldPos = oldPositions.get(el);
					const newPos = newPositions.get(el);
					let oldTransform = window.getComputedStyle(el).transform;
					if (oldTransform === 'none') {
						oldTransform = 'scale(1)';
					}
					const translateTransform = `translate(${oldPos.x - newPos.x}px, ${oldPos.y - newPos.y}px)`;
					const scaleTransform = `scale(${oldPos.width/newPos.width},${oldPos.height/newPos.height})`;
					const anim = el.animate({
						transformOrigin: ['0 0','0 0'],
						transform: [`${oldTransform} ${options.translate ? translateTransform : ''} ${options.scale ? scaleTransform : ''}`, oldTransform],
					}, {
						easing: 'ease-out',
						duration: 500
					});
				} else {
					el.animate({
						opacity: ['0', '1']
					}, {
						easing: 'ease-out',
						duration: 500,
						delay: 500,
						fill: 'backwards'
					});
				}
			});
		}
	}
}

export default smoothAdd;