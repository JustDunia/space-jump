document.addEventListener('DOMContentLoaded', () => {
	const menu = document.querySelector('.menu')
	const startBtn = document.querySelector('.start-btn')
	const grid = document.querySelector('.grid')
	const doodler = document.createElement('div')
	const doodlerWidth = 60
	const gridHeight = 600
	const gridWidth = 400
	const platformWidth = 85
	const platformHeight = 15
	let jumpHeight = 200
	let doodlerLeftSpace = gridWidth / 2 - doodlerWidth / 2
	let doodlerTempBottom = 150
	let doodlerBottomSpace = doodlerTempBottom
	let isGameOver = false
	const platformCount = 5
	const platforms = []
	let moveUp
	let moveDown
	let moveLeft
	let moveRight
	let score = 0
	let movePlatformsInt
	let addPlatformsInt

	function createDoodler() {
		grid.appendChild(doodler)
		doodler.classList.add('doodler')
		doodler.style.left = doodlerLeftSpace + 'px'
		doodler.style.bottom = doodlerBottomSpace + 'px'
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
			doodlerBottomSpace += 10
			doodler.style.bottom = doodlerBottomSpace + 'px'
			if (doodlerBottomSpace > doodlerTempBottom + jumpHeight) {
				fall()
			}
		}, 30)
	}

	function fall() {
		clearInterval(moveUp)
		moveDown = setInterval(() => {
			doodlerBottomSpace -= 5
			doodler.style.bottom = doodlerBottomSpace + 'px'

			//zablokować skakanie przy samym dotknięciu platformy

			platforms.forEach(platform => {
				if (
					doodlerBottomSpace <= platform.bottom + platformHeight &&
					doodlerBottomSpace >= platform.bottom &&
					doodlerLeftSpace <= platform.left + platformWidth &&
					doodlerLeftSpace >= platform.left - doodlerWidth
				) {
					doodlerTempBottom = doodlerBottomSpace
					jump()
				}
			})
			if (doodlerBottomSpace <= 0) {
				gameOver()
			}
		}, 30)
	}

	function addPlatforms() {
		if (platforms[0].bottom < 0 - platformHeight) {
			grid.removeChild(platforms[0].visual)
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
		} else if (e.key === 'ArrowUp') goStraight()
	}

	function goLeft() {
		clearInterval(moveLeft)
		clearInterval(moveRight)
		moveLeft = setInterval(() => {
			doodlerLeftSpace -= 5
			doodler.style.left = doodlerLeftSpace + 'px'
			if (doodlerLeftSpace <= 0) {
				goRight()
			}
		}, 30)
	}

	function goRight() {
		clearInterval(moveLeft)
		clearInterval(moveRight)
		moveRight = setInterval(() => {
			doodlerLeftSpace += 5
			doodler.style.left = doodlerLeftSpace + 'px'
			if (doodlerLeftSpace >= gridWidth - doodlerWidth) {
				goLeft()
			}
		}, 30)
	}
	function goStraight() {
		clearInterval(moveLeft)
		clearInterval(moveRight)
	}

	function gameOver() {
		isGameOver = true
		clearInterval(moveDown)
		clearInterval(moveUp)
		clearInterval(moveLeft)
		clearInterval(moveRight)
		clearInterval(movePlatformsInt)
		clearInterval(addPlatformsInt)
		showStartWindow()
		grid.removeChild(doodler)
		console.log(score)
	}

	function start() {
		if (!isGameOver) {
			createDoodler()
			createPlatforms()
			hideStartWindow()
			movePlatformsInt = setInterval(movePlatforms, 30)
			addPlatformsInt = setInterval(addPlatforms, 30)
			jump()
			document.addEventListener('keydown', controlMove)
		}
	}
	startBtn.addEventListener('click', start)
	document.addEventListener('keyup', e => {
		if (e.key === 'Enter') start()
	})
})
