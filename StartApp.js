class GameDisplay {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.matrix = [...Array(height)].map((line, iline) => {
            
            const linePixel = [...Array(width)].map((col, icol) => {
                
                const pixel = document.createElement('div')
                pixel.classList.add('pixel')
                pixel.setAttribute('xy', `${icol+1}:${height - iline}`)

                return pixel
            })

            return linePixel
        })
    }

    createDisplay(wrap) {
        try {

            this.matrix.forEach((linePixel, iline) => {
                wrap.append(...linePixel)
            })

            this.adaptiveDisplay(wrap)

        } catch (err) {

            console.log(err)

        }
        
    }

    adaptiveDisplay(wrap) {
        try {
            
            const pixelWidthHeight = parseInt(wrap.querySelector('.pixel').offsetWidth)
            wrap.style.width = `${this.width * pixelWidthHeight}px`
            wrap.style.height = `${this.height * pixelWidthHeight}px`

        } catch (err) {
            console.log(err)
        }
    }

}

class SelectGame extends GameDisplay {
    
    constructor(width, height) {
        super(width, height)
        this.snakeCoordinate = []
    }

    setSnakeCoordinate(coordinate) {
        this.snakeCoordinate = [...coordinate]
    }

    createSnakeOfCoordinate() {
        [...this.snakeCoordinate].forEach((snakePixel, ipxl) => {
            document.querySelector(`[xy="${snakePixel.join(':')}"]`).classList.add('pixel-hero', 'snake')
        })

        this.snakeEate()
    }

    getStartSnakePosition() {
        const startCoordinate = []
        this.matrix.forEach((pixelLine, iline) => {
            if (iline === this.height/2) {
                pixelLine.forEach((pixel, ipxl) => {
                    switch (ipxl) {
                        case (Math.round(this.width)/2):
                        case (Math.round(this.width/2) + 1):
                        case (Math.round(this.width/2) -1):
                            startCoordinate.push([ipxl, iline])
                    }
                })
            }
        })

        this.setSnakeCoordinate(startCoordinate)
        this.createSnakeOfCoordinate()
        this.snakeEate()
    }

    snakeMove(x, y) {
        const startCoordinate = this.snakeCoordinate[this.snakeCoordinate.length - 1]
        const withoutLastPxl = [...this.snakeCoordinate].slice(1)
        const nextPxl = document.querySelector(`[xy="${startCoordinate[0] + x}:${startCoordinate[1] + y}"]`)
        
        if (nextPxl && !nextPxl.classList.contains('snake')) {

            if (!nextPxl.classList.contains('snake-eat')) {
                document.querySelector(`[xy="${this.snakeCoordinate[0].join(':')}"]`).classList.remove('pixel-hero', 'snake')
                this.setSnakeCoordinate([...withoutLastPxl, [startCoordinate[0] + x, startCoordinate[1] + y]])
            } else {
                nextPxl.classList.remove('snake-eat')
                this.setSnakeCoordinate([...this.snakeCoordinate, [startCoordinate[0] + x, startCoordinate[1] + y]])
            }
            
            this.createSnakeOfCoordinate()
        }
    }

    snakeEate() {
        if (!document.querySelector('.snake-eat')) {
            let eateNoCreate = true
            let eatPixel = null
            
            while (eateNoCreate) {
                const eatCoordinate = [Math.floor(Math.random() * this.width) + 1, Math.floor(Math.random() * this.height) + 1]
                eateNoCreate = eatPixel && !eatPixel.classList.contains('snake')
                eatPixel = document.querySelector(`[xy="${eatCoordinate.join(':')}"]`)
            }
            
            eatPixel.classList.add('snake-eat')
        }
    }

}

const DISP_WIDTH = 10
const DISP_HEIGHT = 20
const DISPLAY = new GameDisplay(DISP_WIDTH, DISP_HEIGHT)
// DISPLAY.createDisplay(document.querySelector('#display'))

const SELECT_GAME = new SelectGame(DISP_WIDTH, DISP_HEIGHT)
SELECT_GAME.createDisplay(document.querySelector('#display'))
SELECT_GAME.getStartSnakePosition()
let timerID = null

document.addEventListener('keydown', (e) => {
    clearTimeout(timerID)
    if (e.code === 'ArrowUp') {
        timerID = setTimeout(function startMove() {
            SELECT_GAME.snakeMove(0, 1)
            timerID = setTimeout(startMove, 100)
        }, 100)
    }
    if (e.code === 'ArrowDown') {
        timerID = setTimeout(function startMove() {
            SELECT_GAME.snakeMove(0, -1)
            timerID = setTimeout(startMove, 100)
        }, 100)
    }
    if (e.code === 'ArrowRight') {
        timerID = setTimeout(function startMove() {
            SELECT_GAME.snakeMove(1, 0)
            timerID = setTimeout(startMove, 100)
        }, 100)
    }
    if (e.code === 'ArrowLeft') {
        timerID = setTimeout(function startMove() {
            SELECT_GAME.snakeMove(-1, 0)
            timerID = setTimeout(startMove, 100)
        }, 100)
    }
})
//console.log(SELECT_GAME.matrix)