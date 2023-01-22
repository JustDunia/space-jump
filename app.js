'use strict'

document.addEventListener('DOMContentLoaded', () => {
	const backdrop = document.querySelector('.backdrop')
	const pregameText = document.querySelector('.pregame-text')
	const endingText = document.querySelector('.ending-text')
	const scoreText = document.querySelector('.score')
	const startBtn = document.querySelector('.start-btn')
	const grid = document.querySelector('.grid')
	const countVisual = document.createElement('p')
	const midscore = document.createElement('p')
	const jumper = document.createElement('div')

	const gridHeight = 800
	const gridWidth = 600
	const platformWidth = 100
	const platformHeight = 12
	const jumperWidth = 60
	const jumpHeight = gridHeight / 3.3
	const jumperStartingLeftSpace = gridWidth / 2 - jumperWidth / 2
	const platformCount = 6
	const platforms = []

	let jumperLeftSpace = jumperStartingLeftSpace
	let jumperTempBottom = 0
	let jumperBottomSpace = jumperTempBottom
	let score = 0

	// intervals
	let countdownInt
	let moveUp
	let moveDown
	let moveLeft
	let moveRight
	let movePlatformsInt
	let addPlatformsInt

	function removeHowToPlay() {
		pregameText.classList.add('is-hidden')
	}

	function hideStartWindow() {
		backdrop.style.display = 'none'
	}

	function showStartWindow() {
		backdrop.style.display = 'flex'
	}

	function countdown() {
		const countElements = ['3', '2', '1']

		countVisual.classList.add('counting')
		grid.appendChild(countVisual)
		countVisual.innerText = countElements[0]
		let i = 1
		countdownInt = setInterval(() => {
			countVisual.innerText = countElements[i]
			i++
		}, 800)
	}

	function createJumper() {
		grid.appendChild(jumper)
		jumper.classList.add('jumper')
		jumper.style.left = jumperLeftSpace + 'px'
		jumper.style.bottom = 0 + 'px'
	}

	class Platform {
		constructor(newPlatformBottom) {
			this.bottom = newPlatformBottom
			this.left = Math.random() * (gridWidth - platformWidth)
			this.visual = document.createElement('div')

			const visual = this.visual
			visual.classList.add('platform')
			visual.style.left = this.left + 'px'
			visual.style.bottom = this.bottom + 'px'

			grid.appendChild(visual)
		}
	}

	function createPlatforms() {
		for (let i = 0; i < platformCount; i++) {
			const platformGap = gridHeight / platformCount
			const newPlatformBottom = gridHeight / 16 + i * platformGap
			const newPlatform = new Platform(newPlatformBottom)
			platforms.push(newPlatform)
		}
	}

	function movePlatforms() {
		platforms.forEach(platform => {
			if (score > 20) {
				platform.bottom -= 2
			}
			platform.bottom -= 4
			const visual = platform.visual
			visual.style.bottom = platform.bottom + 'px'
		})
	}

	function addPlatforms() {
		if (platforms[0].bottom < 0 - platformHeight) {
			platforms.shift(0)
			const platformGap = gridHeight / platformCount
			const newPlatformBottom = platforms[platformCount - 2].bottom + platformGap
			const newPlatform = new Platform(newPlatformBottom)
			platforms.push(newPlatform)
			showMidscore()
		}
	}

	function jump() {
		clearInterval(moveDown)
		moveUp = setInterval(() => {
			if (score > 20) {
				jumperBottomSpace += 1
			}
			if (score > 50) {
				jumperBottomSpace += 1
			}
			if (jumperBottomSpace < jumperTempBottom + jumpHeight * 0.4) {
				jumperBottomSpace += 6
			}
			if (jumperBottomSpace < jumperTempBottom + jumpHeight * 0.7) {
				jumperBottomSpace += 5
			}
			if (jumperBottomSpace < jumperTempBottom + jumpHeight * 0.8) {
				jumperBottomSpace += 4
			}
			if (jumperBottomSpace < jumperTempBottom + jumpHeight * 0.9) {
				jumperBottomSpace += 3
			}
			if (jumperBottomSpace >= jumperTempBottom + jumpHeight * 0.9) {
				jumperBottomSpace += 2
			}
			jumper.style.bottom = jumperBottomSpace + 'px'
			if (jumperBottomSpace > jumperTempBottom + jumpHeight) {
				fall()
			}
		}, 15)
	}

	function fall() {
		clearInterval(moveUp)
		moveDown = setInterval(() => {
			if (score > 20) {
				jumperBottomSpace -= 1
			}
			if (score > 50) {
				jumperBottomSpace -= 1
			}

			if (jumperBottomSpace > jumperTempBottom + jumpHeight * 0.9) {
				jumperBottomSpace -= 2
			}
			if (jumperBottomSpace > jumperTempBottom + jumpHeight * 0.8) {
				jumperBottomSpace -= 3
			}
			if (jumperBottomSpace <= jumperTempBottom + jumpHeight * 0.8) {
				jumperBottomSpace -= 4
			}
			jumper.style.bottom = jumperBottomSpace + 'px'

			platforms.forEach(platform => {
				if (
					jumperBottomSpace <= platform.bottom + platformHeight &&
					jumperBottomSpace >= platform.bottom &&
					jumperLeftSpace <= platform.left + platformWidth &&
					jumperLeftSpace >= platform.left - jumperWidth
				) {
					jumperTempBottom = jumperBottomSpace
					jump()
				}
			})
			if (jumperBottomSpace <= 0) {
				gameOver()
			}
		}, 10)
	}

	function createMidscore() {
		midscore.classList.add('midscore')
		grid.appendChild(midscore)
		midscore.innerHTML = score
	}

	function showMidscore() {
		score++
		midscore.innerHTML = score
	}

	function controlMove(e) {
		if (e.key === 'ArrowLeft') {
			goLeft()
		} else if (e.key === 'ArrowRight') {
			goRight()
		}
	}

	function goLeft() {
		clearInterval(moveLeft)
		clearInterval(moveRight)
		moveLeft = setInterval(() => {
			jumperLeftSpace -= 2
			jumper.style.left = jumperLeftSpace + 'px'
			if (jumperLeftSpace <= 0) {
				goRight()
			}
		}, 3)
	}

	function goRight() {
		clearInterval(moveLeft)
		clearInterval(moveRight)
		moveRight = setInterval(() => {
			jumperLeftSpace += 2
			jumper.style.left = jumperLeftSpace + 'px'
			if (jumperLeftSpace >= gridWidth - jumperWidth) {
				goLeft()
			}
		}, 3)
	}

	function gameOver() {
		clearInterval(moveDown)
		clearInterval(moveUp)
		clearInterval(moveLeft)
		clearInterval(moveRight)
		clearInterval(movePlatformsInt)
		clearInterval(addPlatformsInt)
		showStartWindow()
		showScore()
		grid.removeChild(jumper)
		while (grid.firstChild) {
			grid.removeChild(grid.firstChild)
		}
		for (let i = 0; i < platformCount; i++) {
			platforms.pop()
		}
		jumperLeftSpace = jumperStartingLeftSpace
		jumperTempBottom = 0
		document.removeEventListener('keydown', controlMove)
	}

	function showScore() {
		endingText.classList.remove('is-hidden')
		scoreText.innerText = score
		startBtn.innerText = 'play again'
	}

	function start() {
		removeHowToPlay()
		hideStartWindow()
		countdown()
		createPlatforms()
		createJumper()
		setTimeout(() => {
			clearInterval(countdownInt)
			grid.removeChild(countVisual)
			createMidscore()
			jump()
			movePlatformsInt = setInterval(movePlatforms, 30)
			addPlatformsInt = setInterval(addPlatforms, 30)
			document.addEventListener('keydown', controlMove)
			leftBtn.addEventListener('click', goLeft)
			rightBtn.addEventListener('click', goRight)
		}, 2400)

		score = 0
	}

	startBtn.addEventListener('click', start)
})
