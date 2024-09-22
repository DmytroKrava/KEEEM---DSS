import { Alternative } from "./Alternative.js";
import { Decision } from "./Decision.js";
import { Result } from "./Result.js";


export class ChanceEvent {
    constructor(name, prevStage_, text = null, probability_=1.0, vertixRefferal_=null) {
        this.name = name;
        this.text = text;
        this.probability = probability_;
        this.vertixRefferal = vertixRefferal_;
        this.prevStage = prevStage_;
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

    set probability(probability_) {
        if (typeof probability_ == "number") {
            this._probability = probability_;
        }
        else {
            throw new Error("Type error. Field probability must have a type number.");
        }
    }

    set vertixRefferal(vertixRefferal_) {
        let allElementsAreChanceEvent = false;
        if (vertixRefferal_ instanceof Array) {
            for (let i = 0;     i < vertixRefferal_.length;   i++) {
                if (vertixRefferal_[i] instanceof ChanceEvent) {
                    allElementsAreChanceEvent = true;
                }
            }
        }

        if (vertixRefferal_ instanceof Decision 
            || allElementsAreChanceEvent 
            || vertixRefferal_ instanceof Result 
            || vertixRefferal_ == null) 
        {
            this._vertixRefferal = vertixRefferal_;

            if (this._vertixRefferal 
                && this._vertixRefferal.inputAlternative !== this 
                && !allElementsAreChanceEvent
                && !(vertixRefferal_ instanceof Result)) 
            {
                this._vertixRefferal.inputAlternative = this;
            }
            else if (allElementsAreChanceEvent) {
                this._vertixRefferal = []

                for (let i = 0;     i < vertixRefferal_.length;     i++) {
                    this._vertixRefferal[i] = vertixRefferal_[i];

                    if (this._vertixRefferal[i].prevStage !== this) {
                        this._vertixRefferal[i].prevStage = this;
                    }
                }
            }
            else if (vertixRefferal_ instanceof Result && this._vertixRefferal.inputEvent !== this) {
                this._vertixRefferal.inputEvent = this;
            }
        }
        else {
            throw new Error("Type error. Field nextDecision must be an object of class Decision or arrive of objects of class ChanceEvent.");
        }
    }

    set prevStage(prevStage_) {
        if (prevStage_ instanceof Alternative 
            || prevStage_ instanceof ChanceEvent) 
        {
            this._prevStage = prevStage_;
            
            if(!this._prevStage.nextDecision || !this._prevStage.nextDecision.includes(this)) {
                if (!this._prevStage) {
                    this._prevStage = [];
                }
                this._prevStage.addNextDecision(this);
            }
        }
        else {
            throw new Error("Type error. Field prevStage must be an object of class Decision or ChanceEvent.");
        }
    }

    addNextDecision(newDecision) {
        if (this._nextDecision instanceof Decision) {
            throw new Error("This method can be called only if field nextDecision is an arrive of object of class ChanceEvent.");
        }

        if (this._vertixRefferal && newDecision instanceof ChanceEvent) {
            this._vertixRefferal.push(newDecision);
        }

        else if (!this._vertixRefferal) {
            this._vertixRefferal = [newDecision];
        }

        else {
            throw new Error("Type error. Field nextDecision must be an object of class Decision or arrive of objects of class ChanceEvent.");
        }
    }

    removeVertixReferal(removedVertix) {
        let index = -1;
        for (let i = 0;     i < this._vertixRefferal.length;     i++) {
            if (this._vertixRefferal[i].name === removedVertix.name) {
                index = i;
                break;
            }
        }
        this._vertixRefferal.splice(index, 1);

        if (this._vertixRefferal.length < 1) {
            this._vertixRefferal = null;
        }
    }

    get name() {
        return this._name;
    }

    get text() {
        return this._text;
    }

    get probability() {
        return this._probability;
    }

    get vertixRefferal() {
        if (this._vertixRefferal && !(this._vertixRefferal instanceof Decision) && !(this._vertixRefferal instanceof Result)) {
            let copy = [];
            for (let i = 0;     i < this._vertixRefferal.length;      i++) {
                copy[i] = this._vertixRefferal[i];
            }
            return copy;
        }
        else if (this._vertixRefferal instanceof Result) {
            return this._vertixRefferal;
        }
        return this._vertixRefferal; 
    }

    get prevStage() {
        return this._prevStage;
    }

    remove() {
        if (this.prevStage 
            && this.prevStage instanceof ChanceEvent 
            && this.prevStage.vertixRefferal instanceof Array) 
        {
            let prevStageRefferrals = this._prevStage.vertixRefferal;
            let index = -1;
            for (let i = 0;     i < prevStageRefferrals.length;     i++) {
                if (prevStageRefferrals[i].name === this._name) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                this.prevStage.removeVertixReferal(this);
            }
        }
        else if (this.prevStage 
            && this.prevStage instanceof Alternative 
            && this.prevStage.nextDecision instanceof Array) 
        {
            let prevStageNextDecision = this._prevStage.nextDecision;
            let index = -1;
            for (let i = 0;     i < prevStageNextDecision.length;     i++) {
                if (prevStageNextDecision[i].name === this._name) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                this._prevStage.removeChanceEvent(this);
            }
        }

        if (this.vertixRefferal instanceof Array) {
            this.vertixRefferal.forEach((nextEvent) => {
                nextEvent.prevStage = null;
            });
        } else if (this.vertixRefferal instanceof Decision) {
            this.vertixRefferal.inputAlternative = null;
        }
    
        this._prevStage = null;
        this._vertixRefferal = null;
        delete this;
    }
  
    toJSON() {
        return {
          type: 'ChanceEvent',
          name: this.name,
          prevStage: this.prevStage ? this.prevStage.name : null,
          text: this.text,
          probability: this.probability,
          vertixRefferal: Array.isArray(this.vertixRefferal)
            ? this.vertixRefferal.map(vert => vert.toJSON())
            : this.vertixRefferal ? this.vertixRefferal.name : null,
        };
    }
}
