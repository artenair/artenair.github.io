export default class MinHeap {
    constructor(source, comparator, priorityChanger) {
        this._data = [];
        this._comparator = comparator;
        this._priorityChanger = priorityChanger;
        source.forEach(element => this.push(element));
    }

    isEmpty() {
        return this._data.length === 0;
    }

    getDataAsArray() {
        return this._data.map( (element) => {
            let clone = {...element};
            delete clone.currentIndex;
            return clone;
        });
    }

    push(element) {
        this._data.push(element);
        let index = this._data.length - 1;
        if(element instanceof Object) {
            element.currentIndex = index;
        }
        this.moveUp(index);
    }

    pop() {
        if(this._data.length === 0) return null;
        if(this._data.length === 1) {
            return this._data.pop();
        }
        const removed = this._data[0];
        this._data[0] = this._data.pop();
        this.moveDown(0);
        return removed;
    }

    moveUp(index) {
        if(this._data.length === 1 || index >= this._data.length) return;
        while(index > 0) {
            const parentIndex = this.getParentIndex(index);
            if(this.compareIndexes(index,parentIndex) < 0) {
                this.swap(index, parentIndex);
            }
            index = parentIndex;
        }
    }

    moveDown(index) {
        while(index < this._data.length) {
            const leftChildIndex = this.getLeftIndex(index);
            const rightChildIndex = this.getRightIndex(index);
            let minIndex = index;
            if(rightChildIndex < this._data.length && this.compareIndexes(rightChildIndex, minIndex) < 0) {
                minIndex = rightChildIndex;
            }

            if(leftChildIndex < this._data.length && this.compareIndexes(leftChildIndex, minIndex) < 0) {
                minIndex = leftChildIndex;
            }

            if(index === minIndex) return;

            this.swap(index, minIndex)
            index = minIndex;
        }
    }

    swap(i, j) {
        const swap = this._data[i];
        this._data[i] = this._data[j];
        this._data[j] = swap;

        if(this._data[j] instanceof  Object) {
            this._data[j].currentIndex = j;
        }

        if(this._data[i] instanceof Object) {
            this._data[i].currentIndex = i;
        }
    }

    compareIndexes(i, j) {
        return this._comparator(this._data[i], this._data[j]);
    }

    getParentIndex(index) {
        return Math.floor((index-1)/2);
    }

    getLeftIndex(index) {
        return 2 * index + 1;
    }

    getRightIndex(index) {
        return 2 * (index + 1);
    }

    changePriority(index, newValue) {
        if(index < 0  || index >= this._data.length) return;
        this._priorityChanger(this._data[index], newValue);
        this.moveUp(index);
        this.moveDown(index);
    }

}