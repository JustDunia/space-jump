'use strict'

document.addEventListener('DOMContentLoaded', () => {
	const menu = document.querySelector('.menu')
	const pregameText = menu.querySelector('.pregame-text')
	const endingText = menu.querySelector('.ending-text')
	const scoreText = menu.querySelector('.score')
	const startBtn = document.querySelector('.start-btn')
	const grid = document.querySelector('.grid')
	const jumper = document.createElement('div')
	const jumperWidth = 60
	const gridHeight = 800
	const gridWidth = 600
	const platformWidth = 100
	const platformHeight = 15
	let jumpHeight = 225
	let jumperStartingLeftSpace = gridWidth / 2 - jumperWidth / 2
	let jumperLeftSpace = jumperStartingLeftSpace
	let jumperTempBottom = 0
	let jumperBottomSpace = jumperTempBottom
	const platformCount = 6
	const platforms = []
	let moveUp
	let moveDown
	let moveLeft
	let moveRight
	let score = 0
	let movePlatformsInt
	let addPlatformsInt

	function removeHowToPlay() {
		pregameText.classList.add('is-hidden')
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
			const newPlatformBottom = 50 + i * platformGap
			const newPlatform = new Platform(newPlatformBottom)
			platforms.push(newPlatform)
		}
	}

	function hideStartWindow() {
		menu.style.display = 'none'
	}

	function showStartWindow() {
		menu.style.display = 'flex'
	}

	function movePlatforms() {
		platforms.forEach(platform => {
			platform.bottom -= 4
			const visual = platform.visual
			visual.style.bottom = platform.bottom + 'px'
		})
	}

	function jump() {
		clearInterval(moveDown)
		moveUp = setInterval(() => {
			jumperBottomSpace += 6
			jumper.style.bottom = jumperBottomSpace + 'px'
			if (jumperBottomSpace > jumperTempBottom + jumpHeight) {
				fall()
			}
		}, 15)
	}

	function fall() {
		clearInterval(moveUp)
		moveDown = setInterval(() => {
			jumperBottomSpace -= 3
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

	function addPlatforms() {
		if (platforms[0].bottom < 0 - platformHeight) {
			platforms.shift(0)
			const platformGap = gridHeight / platformCount
			const newPlatformBottom = platforms[platformCount - 2].bottom + platformGap
			const newPlatform = new Platform(newPlatformBottom)
			platforms.push(newPlatform)
			score++
		}
	}

	function controlMove(e) {
		if (e.key === 'ArrowLeft') {
			goLeft()
		} else if (e.key === 'ArrowRight') {
			goRight()
		}
		// } else if (e.key === 'ArrowUp') goStraight()
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
		}, 6)
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
		}, 6)
	}
	// function goStraight() {
	// 	clearInterval(moveLeft)
	// 	clearInterval(moveRight)
	// }

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
	}

	function showScore() {
		endingText.classList.remove('is-hidden')
		scoreText.innerText = score
		startBtn.innerText = 'play again'
	}

	function start() {
		removeHowToPlay()
		createJumper()
		createPlatforms()
		hideStartWindow()
		movePlatformsInt = setInterval(movePlatforms, 30)
		addPlatformsInt = setInterval(addPlatforms, 30)
		jump()
		document.addEventListener('keydown', controlMove)
		score = 0
	}

	startBtn.addEventListener('click', start)
	// document.addEventListener('keyup', e => {
	// 	if (e.key === 'Enter') start()
	// })
})
