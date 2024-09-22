import { ChanceEvent } from "./ChanceEvent.js";


export class Result {
    constructor(name_, inputEvent_, text_=null) {
        this.name = name_;
        this.text = text_;
        this.inputEvent = inputEvent_;
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

    set inputEvent(event) {
        if (event instanceof ChanceEvent) {
            this._inputEvent = event;
            if (this._inputEvent.vertixRefferal !== this) {
                this._inputEvent.vertixRefferal = this;
            }
        }
        else {
            throw new Error('Type error. Field inputEvent in Result must be an object of class ChanceEvent.');
        }
    }

    get name() {
        return this._name;
    }

    get text() {
        return this._text;
    }

    get inputEvent() {
        return this._inputEvent;
    }

    remove() {
        this._inputEvent.vertixRefferal = null;
        
        this._name = null;
        this._text = null;
        this._inputEvent = null;
    }

    toJSON() {
        return {
            type: 'Result',
            name: this.name,
            inputEvent: this._inputEvent !== null ? this._inputEvent.name : null,
            text: this.text ? this.text : null,
        };
    }
}
