class Tile {
    constructor(value = 2) {
        this.value = value;
    }

    double() {
        this.value *= 2;
    }
}

class Game {
    constructor(size = 4) {
        this.size = size;
        this.score = 0;
        this.best = 0;
        this.grid = this.createEmptyGrid();
        this.addNewTile();
        this.addNewTile();
        this.updateUI();
    }

    createEmptyGrid() {
        return Array.from({ length: this.size }, () => Array(this.size).fill(null));
    }

    addNewTile() {
        const emptyCells = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === null) {
                    emptyCells.push({ row, col });
                }
            }
        }
        if (emptyCells.length === 0) return;
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.grid[row][col] = new Tile();
    }

    slide(row) {
        const arr = row.filter(tile => tile !== null);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i].value === arr[i + 1].value) {
                arr[i].double();
                this.score += arr[i].value;
                arr.splice(i + 1, 1);
            }
        }
        while (arr.length < this.size) arr.push(null);
        return arr;
    }

    rotateLeft(matrix) {
        return matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
    }

    rotateRight(matrix) {
        return matrix[0].map((_, index) => matrix.map(row => row[index])).reverse();
    }

    moveLeft() {
        let changed = false;
        for (let row = 0; row < this.size; row++) {
            const originalRow = [...this.grid[row]];
            this.grid[row] = this.slide(this.grid[row]);
            if (JSON.stringify(originalRow) !== JSON.stringify(this.grid[row])) changed = true;
        }
        if (changed) this.addNewTile();
    }

    moveRight() {
        this.grid = this.grid.map(row => row.reverse());
        this.moveLeft();
        this.grid = this.grid.map(row => row.reverse());
    }

    moveUp() {
        this.grid = this.rotateRight(this.grid);
        this.moveLeft();
        this.grid = this.rotateLeft(this.grid);
    }

    moveDown() {
        this.grid = this.rotateLeft(this.grid);
        this.moveLeft();
        this.grid = this.rotateRight(this.grid);
    }

    updateUI() {
        const tileContainer = document.querySelector('.tile-container');
        tileContainer.innerHTML = '';
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = this.grid[row][col];
                if (tile) {
                    const tileDiv = document.createElement('div');
                    tileDiv.classList.add('tile', `tile-${tile.value}`);
                    tileDiv.style.top = `${row * 25}%`;
                    tileDiv.style.left = `${col * 25}%`;
                    tileDiv.textContent = tile.value;
                    tileContainer.appendChild(tileDiv);
                }
            }
        }
        document.getElementById('score').textContent = this.score;
        if (this.score > this.best) {
            this.best = this.score;
            document.getElementById('best').textContent = this.best;
        }
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowLeft':
                this.moveLeft();
                break;
            case 'ArrowRight':
                this.moveRight();
                break;
            case 'ArrowUp':
                this.moveUp();
                break;
            case 'ArrowDown':
                this.moveDown();
                break;
        }
        this.updateUI();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    document.addEventListener('keydown', event => game.handleKeyDown(event));
});
