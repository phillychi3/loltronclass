export function disableVideoJSFocusDetection() {
	const blockedEvents = [
		'visibilitychange',
		'webkitvisibilitychange',
		'mozvisibilitychange',
		'msvisibilitychange',
		'fullscreenchange',
		'webkitfullscreenchange',
		'mozfullscreenchange',
		'MSFullscreenChange',
		'focus',
		'blur',
		'pagehide'
	]

	blockedEvents.forEach((eventType) => {
		const originalAddEvent = EventTarget.prototype.addEventListener
		EventTarget.prototype.addEventListener = function (type, listener, options) {
			if (type === eventType) {
				console.log(`攔截: ${type}`)
				return
			}
			return originalAddEvent.call(this, type, listener, options)
		}

		window.addEventListener(
			eventType,
			(e) => {
				e.stopImmediatePropagation()
				e.preventDefault()
				console.log(`已阻止: ${eventType}`)
			},
			true
		)
	})

	Object.defineProperty(document, 'hidden', { get: () => false, configurable: true })
	Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true })
	Object.defineProperty(document, 'webkitHidden', { get: () => false, configurable: true })
	Object.defineProperty(document, 'webkitVisibilityState', {
		get: () => 'visible',
		configurable: true
	})
	document.hasFocus = () => true
	Object.defineProperty(document, 'hasFocus', { value: () => true, configurable: true })

	console.log('replaced document properties to prevent focus detection')
}
