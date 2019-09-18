import { CSP, backtracking, AC3 } from "./csp"

function variables(n: number): number[] {
    return contiguousNumbers(n, 0);
}

function contiguousNumbers(n: number, offset: number = 0): number[] {
    return [...Array(n).keys()].map(v => v + offset);
}

function disequalityConstraint(x: number, y: number) {
    return {
        x: x,
        y: y,
        constraint: (X: number, x: number, Y: number, y: number) => x !== y
    }
}

function equalityConstraint(x: number, y: number) {
    return {
        x: x,
        y: y,
        constraint: (X: number, x: number, Y: number, y: number) => x === y
    }
}

const MapColoring = () => {

    var csp = new CSP(
        variables(7),
        [
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2]
        ],
        [
            disequalityConstraint(0, 1),
            disequalityConstraint(0, 2),
            disequalityConstraint(1, 2),
            disequalityConstraint(1, 3),
            disequalityConstraint(2, 3),
            disequalityConstraint(2, 5),
            disequalityConstraint(3, 4),
            disequalityConstraint(4, 5)
        ]
    );

    const names = new Map([
        [0, "WA"],
        [1, "NT"],
        [2, "SA"],
        [3, "Q"],
        [4, "NS"],
        [5, "V"],
        [6, "T"]
    ])

    const domains = new Map([
        [0, "Blue"],
        [1, "Red"],
        [2, "Green"]
    ])

    const [result, n_assigments] = backtracking(csp)
    console.log(result)
    for (let [key, val] of result) {
        console.log(names.get(key as number), domains.get(val as number))
    }
}

const ZebraPuzzle = () => {

    enum Variables {
        Red,
        Green,
        Ivory,
        Yellow,
        Blue,

        English,
        Spanish,
        Irish,
        Nigerian,
        Japanese,

        Coffee,
        Tea,
        Milk,
        OrangeJuice,
        Water,

        OldGold,
        Kools,
        Chesterfields,
        LuckyStrike,
        Parliament,

        Dog,
        Snail,
        Fox,
        Horse,
        Zebra
    }

    var csp = new CSP(
        variables(25),
        [
            //** Colors */
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            //** Nationality */
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            //** Drink */
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            //** Smoke */
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            //** Pet */
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
            contiguousNumbers(5),
        ],
        [
            //** Colors */
            disequalityConstraint(0, 1),
            disequalityConstraint(0, 2),
            disequalityConstraint(0, 3),
            disequalityConstraint(0, 4),
            disequalityConstraint(1, 2),
            disequalityConstraint(1, 3),
            disequalityConstraint(1, 4),
            disequalityConstraint(2, 3),
            disequalityConstraint(2, 4),
            disequalityConstraint(3, 4),
            //** Nationality */
            disequalityConstraint(5, 6),
            disequalityConstraint(5, 7),
            disequalityConstraint(5, 8),
            disequalityConstraint(5, 9),
            disequalityConstraint(6, 7),
            disequalityConstraint(6, 8),
            disequalityConstraint(6, 9),
            disequalityConstraint(7, 8),
            disequalityConstraint(7, 9),
            disequalityConstraint(8, 9),
            //** Drink */
            disequalityConstraint(10, 11),
            disequalityConstraint(10, 12),
            disequalityConstraint(10, 13),
            disequalityConstraint(10, 14),
            disequalityConstraint(11, 12),
            disequalityConstraint(11, 13),
            disequalityConstraint(11, 14),
            disequalityConstraint(12, 13),
            disequalityConstraint(12, 14),
            disequalityConstraint(13, 14),
            //** Smoke */
            disequalityConstraint(15, 16),
            disequalityConstraint(15, 17),
            disequalityConstraint(15, 18),
            disequalityConstraint(15, 19),
            disequalityConstraint(16, 17),
            disequalityConstraint(16, 18),
            disequalityConstraint(16, 19),
            disequalityConstraint(17, 18),
            disequalityConstraint(17, 19),
            disequalityConstraint(18, 19),
            //** Pet */
            disequalityConstraint(20, 21),
            disequalityConstraint(20, 22),
            disequalityConstraint(20, 23),
            disequalityConstraint(20, 24),
            disequalityConstraint(21, 22),
            disequalityConstraint(21, 23),
            disequalityConstraint(21, 24),
            disequalityConstraint(22, 23),
            disequalityConstraint(22, 24),
            disequalityConstraint(23, 24),

            equalityConstraint(Variables.English, Variables.Red),
            equalityConstraint(Variables.Spanish, Variables.Dog),
            equalityConstraint(Variables.Green, Variables.Coffee),
            equalityConstraint(Variables.Irish, Variables.Tea),
            equalityConstraint(Variables.OldGold, Variables.Snail),
            equalityConstraint(Variables.Yellow, Variables.Kools),
            equalityConstraint(Variables.LuckyStrike, Variables.OrangeJuice),
            equalityConstraint(Variables.Japanese, Variables.Parliament),

            {
                x: Variables.Green,
                y: Variables.Ivory,
                constraint: (X: number, x: number, Y: number, y: number) => { //non simmetrical constraint
                    if (X === Variables.Green && Y === Variables.Ivory) {
                        return x - y === 1;
                    }

                    return y - x === 1;
                }
            },

            {
                x: Variables.Chesterfields,
                y: Variables.Fox,
                constraint: (X: number, x: number, Y: number, y: number) => Math.abs(x - y) === 1
            },

            {
                x: Variables.Kools,
                y: Variables.Horse,
                constraint: (X: number, x: number, Y: number, y: number) => Math.abs(x - y) === 1
            },

            {
                x: Variables.Nigerian,
                y: Variables.Blue,
                constraint: (X: number, x: number, Y: number, y: number) => Math.abs(x - y) === 1
            },
        ],
        [
            {
                x: Variables.Milk,
                constraint: x => x === 2 //middle house
            },
            {
                x: Variables.Nigerian,
                constraint: x => x === 0 //first house
            }
        ]
    );

    if (AC3(csp)) {
        console.log(csp.current_domains)

        const [result, n_assigments] = backtracking(csp);
    
        let houses = [[], [], [], [], []];
    
        for (let [key, val] of result) {
            houses[val].push(key)
        }
    
        console.log(houses.map(house => house.map(v => Variables[v])))
        console.log("Number of assigments: ", n_assigments);
    } else {
        console.log("No solution")
    }
}

ZebraPuzzle();
//MapColoring();