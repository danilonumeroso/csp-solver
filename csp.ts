
type Var = number;
type DomainElement = number | string;
type Domain = DomainElement[];
type Assignments = Map<Var, DomainElement>;

type BinaryConstraint = {
    x: Var;
    y: Var;
    constraint: (X:Var, xval: DomainElement, Y:Var, yval: DomainElement) => boolean;
}

type UnaryConstraint = {
    x: Var;
    constraint: (x: DomainElement) => boolean;
}
/** Generic class that can be used to describe any CSP. */
export class CSP {
    public vars: Var[];
    public domains: Domain[];
    public current_domains: Domain[];
    public assignments: Assignments;
    public binary_constraints: BinaryConstraint[];
    public removals: [Var, DomainElement][];

    public constructor(vars: Var[],
        domains: Domain[],
        binaryConstraints: BinaryConstraint[],
        unaryConstraints: UnaryConstraint[] = []
    ) {
        this.vars = vars;
        this.domains = domains;
        this.current_domains = [...domains];

        // For each arc, make the arc pointing the other way around. This lets user to specify only undirected arcs.
        this.binary_constraints = binaryConstraints.map(bc => [bc, {x: bc.y, y: bc.x, constraint: bc.constraint}])
            .reduce((prev, curr) => prev = prev.concat(curr), []);

        // Turning unary constraints into binary constraints. This keeps simple handling arcs like (X, X) uniformly.
        this.binary_constraints.push(...unaryConstraints.map(uc => ({x: uc.x, y: uc.x, constraint: (X,x,Y,y) => uc.constraint(x)})))

        this.assignments = new Map();
        this.removals = [];
    }

    public assign(variable: Var, value: DomainElement): void {
        this.assignments.set(variable, value);
    }

    public unassign(variable: Var): void {
        this.assignments.delete(variable);
    }

    public is_assigned(variable: Var): boolean {
        return this.assignments.has(variable);
    }

    public is_complete(): boolean {
        return this.assignments.size === this.vars.length;
    }

    public select_variable(): Var {
        return this.vars.find(v => !this.is_assigned(v));
    }

    public constraints(x: Var): boolean {
        return this.binary_constraints
            .filter(n => n.x === x)
            .filter(n => !(n.constraint(n.x, this.assignments.get(n.x), n.y, this.assignments.get(n.y)) || !this.is_assigned(n.x) || !this.is_assigned(n.y)))
            .length === 0;
    }

    public prune(variable: Var, value: DomainElement): void {
        this.current_domains[this.vars.indexOf(variable)] = this.current_domains[this.vars.indexOf(variable)].filter(domval => value !== domval);
        this.removals.push([variable, value]);
    }
}

/** @returns An assigment satisfying all the constraints or undefined. */
export function backtracking(csp: CSP): [Assignments, number] {
    let n_assignments: number = 0;

    function _backtracking(csp: CSP): boolean {
        if (csp.is_complete()) {
            return true;
        }
    
        let v = csp.select_variable();
        for (let value of csp.current_domains[csp.vars.indexOf(v)]) {
            csp.assign(v, value);
            ++n_assignments;
            if (csp.constraints(v)) {
                    if (_backtracking(csp)) {
                        return true;
                    }
            }
            csp.unassign(v);
        }
        return false;
    }

    if (_backtracking(csp)) {
        return [csp.assignments, n_assignments];
    }
    return undefined;
}

// Backtracking search


export function AC3(csp: CSP): boolean {
    return _AC3(csp, [...csp.binary_constraints]);
}

function _AC3(csp: CSP, queue: BinaryConstraint[]): boolean {
    while (queue.length) {
        let arc = queue.pop();

        // Arc consistency (Xi, Xj)
        if (arc_consistency(csp, arc.x, arc.y, arc.constraint)) {
            if (csp.current_domains[csp.vars.indexOf(arc.x)].length === 0) {
                return false;
            }
            // If dom(X) has been modified, re-evaluate arc-consistency for all arcs (Xk, Xi), k != j
            queue.push(...csp.binary_constraints.filter(c => c.y === arc.x && c.x !== arc.y))
        }
    }
    return true;
}

/** Return true if at least one element has been pruned from the domain. */
function arc_consistency(csp: CSP, x: Var, y: Var, constraint: (X, x, Y, y) => boolean): boolean {
    let pruned = false;
    for (let xvalue of csp.current_domains[csp.vars.indexOf(x)]) {
        /* If Xi conflicts with all the possible Yi, then remove Xi from dom(X)  */
        if (csp.current_domains[csp.vars.indexOf(y)].every(yvalue => !constraint(x, xvalue, y, yvalue))) {
            csp.prune(x, xvalue);
            pruned = true;
        }
    }
    return pruned;
}