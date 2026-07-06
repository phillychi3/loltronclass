export function contains(selector, text) {
	const elements = document.querySelectorAll(selector)
	return Array.prototype.filter.call(elements, (element) => RegExp(text).test(element.textContent))
}

export function waitForElement(selector, text, maxAttempts = 5) {
	return new Promise((resolve) => {
		let attempts = 0
		const checkElement = () => {
			const elements = contains(selector, text)
			if (elements.length > 0) {
				resolve(true)
			} else if (attempts < maxAttempts) {
				attempts++
				setTimeout(checkElement, 100)
			} else {
				resolve(false)
			}
		}
		checkElement()
	})
}

export function waitForSelector(selector, maxAttempts = 20) {
	return new Promise((resolve) => {
		let attempts = 0
		const checkElement = () => {
			const element = document.querySelector(selector)
			if (element) {
				resolve(element)
			} else if (attempts < maxAttempts) {
				attempts++
				setTimeout(checkElement, 200)
			} else {
				resolve(null)
			}
		}
		checkElement()
	})
}
