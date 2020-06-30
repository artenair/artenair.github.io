export const Direction = {
    TOP: "top",
    RIGHT: "right",
    BOTTOM: "bottom",
    LEFT: "left",
}

export default class PassageDirection {

    static allows(direction) {
        let allowed = PassageDirection.getAllowedDirections();
        return allowed.includes(direction);
    }

    static getAllowedDirections() {
        let allowed = [];
        for(let direction in Direction) {
            if(!Direction.hasOwnProperty(direction)) continue;
            allowed = [...allowed, Direction[direction]];
        }
        return allowed;
    }

    static reverse(direction) {
        if(!PassageDirection.allows(direction)) return null;
        switch (direction) {
            case Direction.TOP:
                return Direction.BOTTOM;
            case Direction.BOTTOM:
                return Direction.TOP;
            case Direction.LEFT:
                return Direction.RIGHT;
            case Direction.RIGHT:
                return Direction.LEFT;
        }
    }
}