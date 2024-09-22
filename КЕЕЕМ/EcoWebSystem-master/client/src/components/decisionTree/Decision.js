import { Alternative } from "./Alternative.js";
import { ChanceEvent } from "./ChanceEvent.js";


export class Decision {
    constructor(name_, alternatives_=null, inputAlternative_=null, text_=null) {
        this.name = name_;
        this.text = text_;
        this.inputAlternative = inputAlternative_;
        
        if (alternatives_) {
            this.alternatives = alternatives_;
        }
        else {
            this._alternatives = [];
        }
    }

    set inputAlternative(inputAlternative_) {
        if (inputAlternative_ instanceof Alternative 
            || inputAlternative_ instanceof ChanceEvent 
            || inputAlternative_ == null) 
        {
            this._inputAlternative = inputAlternative_;

            if (inputAlternative_ instanceof Alternative 
                && this._inputAlternative 
                && this._inputAlternative.nextDecision !== this) 
            {
                this._inputAlternative.nextDecision = this;
            }
            
            else if (inputAlternative_ instanceof ChanceEvent 
                && this._inputAlternative 
                && this._inputAlternative.vertixRefferal !== this) 
            {
                this._inputAlternative.vertixRefferal = this;
            }
        }
        else {
            throw new Error('Type error. Field inputAlternative must be an object of class Alternative or ChanceEvent.');
        }
    }

    set name(name_) {
        if (typeof name_ == "string") {
            this._name = name_;
        }
        else {
            throw new Error("Type error. Field name must have a type string");
        }
    }

    set text(text_) {
        if (typeof text_ == "string" || text_ == null) {
            this._text = text_;
        }
        else {
            throw new Error("Type error. Field text must have a type string");
        }
    }

    set alternatives(alternatives_) {
        if (Array.isArray(alternatives_)) {
            const allObjectsAreAlternatives = alternatives_.every(alternative => alternative instanceof Alternative);

            if (allObjectsAreAlternatives) {
                this._alternatives = []
                for (let i = 0;     i < alternatives_.length;    i++) {
                    this._alternatives[i] = alternatives_[i];
                }
            }
            else {
                throw new Error('Type error. Field alternatives must be a list of object of class Alternative.');
            }
        }
        else {
            throw new Error('Type error. Field alternatives must be a list of object of class Alternative.');
        }
    }
    
    addAlternative(alternative_) {
        if (alternative_ instanceof Alternative) {
            const index = this._alternatives.findIndex(alternative => alternative.name === alternative_.name);
            if (index === -1) {
                this._alternatives.push(alternative_);
            }
        }
        else {
            throw new Error("Type error. To field alternatives can't be add object which doesn't exist class 'Alternative'.");
        }
    }

    
    removeAlternative(name_) {
        if (typeof name_ !== "string") {
            throw new Error("Type error. Field name must have a type string.");
        }
        const index = this._alternatives.findIndex(alternative => alternative.name === name_);
        if (index !== -1) {
            this._alternatives.splice(index, 1);
        }
        else {
            throw new Error("No alternative with name '${name_}' found.");
        }
    }

    getAlternative(name_=null, index_=null) {
        if (typeof name_ !== "string" && name_ !== null) {
            throw new Error("Type error. Parameter name_ must have a type string in method getAlternative.");
        }
        if (!Number.isInteger(index_) && index_ !== null) {
            throw new Error("Type error. Parameter index_ must have a type Integer in method getAlternative.");
        }
        if (index_ < 0) {
            throw new Error("Parameter index_ can't be less from 0 in method getAlternative.");
        }
        if (name_ == null && index_ == null) {
            throw new Error("Method getAlternative must get one parameter name_ or index_.");
        }
        if (name_ !== null && index_ !== null) {
            throw new Error("Method getAlternative must get one parameter name_ or index_.");
        }

        if (index_ !== null) {
            return this._alternatives[index_];
        }
        for (let i = 0;     i < this._alternatives.length;     i++) {
            if (name_ === this._alternatives[i].name) {
                return this._alternatives[i];
            }
        }
        return null;
    }

    get inputAlternative() {
        return this._inputAlternative;
    }

    get name() {
        return this._name;
    }

    get text() {
        return this._text;
    }

    get alternatives() {
        let copy = [];
        for (let i = 0;     i < this._alternatives.length;      i++) {
            copy[i] = this._alternatives[i];
        }
        return copy;
    }
    
    remove() {
        if (this._inputAlternative instanceof Alternative) {
            this._inputAlternative.nextDecision = null;
        } else if (this._inputAlternative instanceof ChanceEvent) {
            this._inputAlternative.vertixRefferal = null;
        }

        if (this._alternatives.length > 0) {
            this._alternatives.forEach(alternative => {
                alternative.decisionOwner = null;
            });
            this._alternatives = [];
        }

        this._inputAlternative = null;
        this._alternatives = [];
        this._name = null;
        this._text = null;
    }

    toJSON() {
        return {
            type: 'Decision',
            name: this.name,
            inputAlternative: this._inputAlternative !== null ? this._inputAlternative.name : null,
            text: this.text ? this.text : null,
            alternatives: this.alternatives.map(alt => alt.toJSON()),
        };
    }
}
