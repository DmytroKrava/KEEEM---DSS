import { Decision } from "./Decision.js";
import { ChanceEvent } from "./ChanceEvent.js";

export class Alternative {
    constructor(name, decisionOwner, text = null, nextDecision_=null) {
        this.name = name;
        this.text = text;
        this.nextDecision = nextDecision_;
        this.decisionOwner = decisionOwner;
    }

    set name(name_) {
        if (typeof name_ == "string") {
            this._name = name_;
        }
        else {
            throw new Error("Type error. Field name must have a type string");
        }
    }

    set text (text_) {
        if (typeof text_ == "string" || text_ == null) {
            this._text = text_;
        }
        else {
            throw new Error("Type error. Field text must have a type string");
        }
    }

    set decisionOwner(decisionOwner_) {
        if (decisionOwner_ instanceof Decision) {
            this._decisionOwner = decisionOwner_;
            this._decisionOwner.addAlternative(this);
        }
        else {
            throw new Error("Type error. Field decisionOwner must be an object of class Decision.");
        }
    }

    set nextDecision(nextDecision_) {
        let allAreChanceEvents = false;
        if (nextDecision_ instanceof Array) {
            for (let i = 0;     i < nextDecision_.length;   i++) {
                if (nextDecision_[i] instanceof ChanceEvent) {
                    allAreChanceEvents = true;
                }
            }
        }

        if (nextDecision_ instanceof Decision || allAreChanceEvents || nextDecision_ == null) {
            this._nextDecision = nextDecision_;

            if (this._nextDecision && this._nextDecision.inputAlternative !== this && !allAreChanceEvents) {
                this._nextDecision.inputAlternative = this;
            }
            else if (allAreChanceEvents) {
                for (let i = 0;     i < this._nextDecision.length;     i++) {
                    this._nextDecision[i] = nextDecision_[i];

                    if (this._nextDecision[i].prevStage !== this) {
                        this._nextDecision[i].prevStage = this;
                    }
                }
            }
        }
        else {
            throw new Error("Type error. Field nextDecision must be an object of class Decision or arrive of objects of class ChanceEvent.");
        }
    }

    addNextDecision(newDecision) {
        if (this._nextDecision instanceof Decision) {
            throw new Error("This method can be called only if field nextDecision is an arrive of objects of class ChanceEvent.");
        }
        if (this._nextDecision && newDecision instanceof ChanceEvent) {
            this._nextDecision.push(newDecision);
        }
        else if (!this._nextDecision) {
            this._nextDecision = [newDecision];
        }
        else {
            throw new Error("Type error. Field nextDecision must be an object of class Decision or arrive of objects of class ChanceEvent.");
        }
    }

    removeChanceEvent(chanceEvent) {
        let index = -1;

        for (let i = 0;     i < this._nextDecision.length;     i++) {
            if (this._nextDecision[i].name === chanceEvent.name) {
                index = i;
                break;
            }
        }
        this._nextDecision.splice(index, 1);

        if (this._nextDecision.length < 1) {
            this._nextDecision = null;
        }
    }

    get name() {
        return this._name;
    }

    get text() {
        return this._text;
    }

    get decisionOwner() {
        return this._decisionOwner;
    }

    get nextDecision() {
        if (this._nextDecision && !(this._nextDecision instanceof Decision)) {
            let copy = [];
            for (let i = 0;     i < this._nextDecision.length;      i++) {
                copy[i] = this._nextDecision[i];
            }
            return copy;
        }
        return this._nextDecision; 
    }


    remove() {
        this._decisionOwner.removeAlternative(this.name);

        if (this._nextDecision instanceof Array) {
            this._nextDecision.forEach((nextEvent) => {
                nextEvent.prevStage = null;
            });
        } 
        else if (this._nextDecision instanceof Decision) {
            this._nextDecision.inputAlternative = null;
        }

        this._decisionOwner = null;
        this._nextDecision = null;
        this._name = null;
        this._text = null;
    }

    toJSON() {
        return {
          type: 'Alternative',
          name: this.name,
          decisionOwner: this.decisionOwner ? this.decisionOwner.name : null,
          text: this.text,
          nextDecision: Array.isArray(this.nextDecision)
            ? this.nextDecision.map(next => next.toJSON())
            : this.nextDecision ? this.nextDecision.name : null,
        };
    }
}
