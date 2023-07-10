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

class Snake extends GameDisplay {
    
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

class Tetris extends GameDisplay {
    constructor(height, width) {
        super(height, width)
        this.figures = {
            tank: [],
            stick: [],
            square: [],
            zigzag: [],
            hook: []
        }
        this.currentFigure = []
        this.nextFigure = []
    }

    getNewFigure() {
        return this.figures[this.chooseRandomFigure()]
    }

    chooseRandomFigure() {
        return Object.keys(this.figures)[Math.floor(Math.random() * 5)]
    }

    startGame() {
        Object.keys(this.figures).forEach((figureName, ifigure) => {
            if (figureName === 'tank') {
                this.figures[figureName].push([this.width/2 - 1, this.height + 2], [this.width/2, this.height + 2], [this.width/2 + 1, this.height + 2], [this.width/2, this.height + 1])
            }
            if (figureName === 'stick') {
                this.figures[figureName].push([this.width/2, this.height + 4], [this.width/2, this.height + 3], [this.width/2, this.height + 2], [this.width/2, this.height + 1])
            }
            if (figureName === 'square') {
                this.figures[figureName].push([this.width/2 - 1, this.height + 2], [this.width/2, this.height + 2], [this.width/2 - 1, this.height + 1], [this.width/2, this.height + 1])
            }
            if (figureName === 'zigzag') {
                this.figures[figureName].push([this.width/2 - 1, this.height + 2], [this.width/2, this.height + 2], [this.width/2, this.height + 1], [this.width/2 + 1, this.height + 1])
            }
            if (figureName === 'hook') {
                this.figures[figureName].push([this.width/2 - 1, this.height + 2], [this.width/2, this.height + 2], [this.width/2, this.height + 1], [this.width/2 + 1, this.height + 1])
            }
        })

        this.currentFigure = this.getNewFigure()
        this.nextFigure = this.getNewFigure()
    }

    getViewFigure(coordinate) {

        if (this.checkCoordinate(coordinate).lower === -1) {
            this.currentFigure.forEach((pixelLine) => {
                const oldPxl = document.querySelector(`[xy="${pixelLine.join(':')}"]`)
                if (oldPxl) {
                    oldPxl.classList.remove('pixel-hero', 'tetris')
                }
            })
    
            coordinate.forEach((pixelLine) => {
                const newPxl = document.querySelector(`[xy="${pixelLine.join(':')}"]`)
                if (newPxl && !newPxl.classList.contains('pixel-hero')) {
                    newPxl.classList.add('pixel-hero', 'tetris')
                }
            })

            this.currentFigure = [...coordinate]
        } else {
            this.currentFigure.forEach((pixelLine) => {
                const oldPxl = document.querySelector(`[xy="${pixelLine.join(':')}"]`)
                if (oldPxl) {
                    oldPxl.classList.add('lower')
                }
            })
            
            this.currentFigure = this.nextFigure
            this.nextFigure = this.getNewFigure()
        }

    }

    moveFigure(up, left) {
        const newCoordinate = this.currentFigure.map(([x, y]) => {
            return [x + up, y + left]
        })
        
        this.checkCoordinate(newCoordinate).bckground === -1 ? this.getViewFigure(newCoordinate) : this.getNewFigure(this.currentFigure)
    }

    moveTurn(coordinate) {
        const relativeCoordinate = coordinate[1]
        const newCoordinate = coordinate.map(([x, y]) => {
            const toRelativeCoordinate = [x - relativeCoordinate[0], y - relativeCoordinate[1]]
            const newX = -(toRelativeCoordinate[1]) + relativeCoordinate[0]
            const newY = toRelativeCoordinate[0] + relativeCoordinate[1]

            return [newX, newY]
        })

        this.checkCoordinate(newCoordinate).bckground === -1 ? this.getViewFigure(newCoordinate) : this.getNewFigure(coordinate)
    }

    checkCoordinate(coordinate) {
        const checkedCoordinat = coordinate.map(coordinateItem => {
            const pxl = document.querySelector(`[xy="${coordinateItem.join(':')}"]`)
            return (coordinateItem[1] < 1 || (pxl && pxl.classList.contains('lower')))
            ? 'lower'
            : (coordinateItem[0] < 1 || coordinateItem[0] > this.width)
            ? 'bckground' : true
        })
        
        return {
            lower: checkedCoordinat.indexOf('lower'),
            bckground: checkedCoordinat.indexOf('bckground')
        }
    }
}




const DISP_WIDTH = 10
const DISP_HEIGHT = 20
const DISPLAY = new GameDisplay(DISP_WIDTH, DISP_HEIGHT)

const SELECT_GAME = new Tetris(DISP_WIDTH, DISP_HEIGHT)
SELECT_GAME.createDisplay(document.querySelector('#display'))
SELECT_GAME.startGame()
timerID = setTimeout(function startMove() {
    SELECT_GAME.moveFigure(0, -1)
    timerID = setTimeout(startMove, 500)
}, 500)


document.addEventListener('keydown', (e) => {
    
    if (e.code === 'Enter') {
        clearTimeout(timerID)
        SELECT_GAME.currentFigure = SELECT_GAME.getNewFigure()
    }
    if (e.code === 'Space') {
        SELECT_GAME.moveTurn(SELECT_GAME.currentFigure)
    }
    if (e.code === 'ArrowDown') {
        SELECT_GAME.moveFigure(0, -1)
    }
    if (e.code === 'ArrowLeft') {
        SELECT_GAME.moveFigure(-1, 0)
    }
    if (e.code === 'ArrowRight') {
        SELECT_GAME.moveFigure(1, 0)
    }
})

console.log(SELECT_GAME)