import { Node } from "./Node.js";

export class Label extends Node {
    constructor() {
        super();
        this._text = "";
        this._fontSize = ""
        this._fontFamily = ""
        this._color = ""
        
    }

    get text() {
        return this._text;
    }
    set text(value){
        this._text = value;
        this.elm.innerText = this._text;
    }
    get fontSize() {
        return this._fontSize;
    }
    set fontSize(value){
        this._fontSize = value;
        this.elm.style.fontSize = this._fontSize + "px" ;
    }
    get fontFamily() {
        return this._fontFamily;
    }
    set fontFamily(value){
        this._fontFamily = value;
        this.elm.style.fontFamily = this._fontFamily
    }
    get color() {
        return this._color;
    }
    set color(value){
        this._color = value;
        this.elm.style.color = this._color
    }
    // _createElement(value) {
    //     let elm = document.createElement("h1")
    //     elm.style.innerText  = value
    //     // elm.style
    //     return elm
    // }
}