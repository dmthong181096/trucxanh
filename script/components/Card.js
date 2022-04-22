import { Node } from "../core/Node.js";
import { Sprite } from "../core/Sprite.js";
import { Label } from "../core/Label.js";
// import { Button } from "../core/Button.js";

export class Card extends Node {
    constructor(index) {
        super();
        this.index = index;
        this.value = null;
        this.tl = gsap.timeline({ paused: true });
        this._createSprite();
        this._createCover();
        this._createLabel();
    }
    _createSprite() {
        this.sprite = new Sprite();
        this.sprite.width = 100;
        this.sprite.height = 100;
        this.sprite.elm.setAttribute("isClicked", "false")
        this.addChild(this.sprite);
    }
    _createCover() {
        let cover = new Node();
        cover.width = 100;
        cover.height = 100;
        cover.elm.style.backgroundColor = "orange";
        cover.elm.style.border = "solid 1px blue";
        this.cover = cover;
        this.addChild(this.cover);
    }
    _createLabel() {
        let label = new Label()
        label.text = this.index
        label.y = 40
        label.x = 40
        this.label = label
        this.addChild(this.label)
    }
    setValue(value) {
        this.value = value;
        this.sprite.path = "./images/trucxanh" + value + ".jpg";
    }
    openCard() {
        console.log("Open");
        this.cover.elm.style.display = "none"
        this.label.elm.style.display = "none"
        this.elm.style.zIndex = "999"
    }
    closeCard() {
        console.log("Close", this.index)
        this.tl.to(this.sprite.elm, { scaleX: 0, duration: 0.5 });
        this.tl.to(this.cover.elm, { scaleX: 1, duration: 0.5 });
        this.tl.to(this.label.elm, { scaleX: 1, duration: 0.5 });
        this.tl.play()
        this.cover.elm.style.display = "block"
        this.label.elm.style.display = "block"
        this.sprite.elm.setAttribute("isClicked", "false")
    }
    hideCard() {
        this.elm.style.display = "none"
    }
    flipCard() {
        console.log("Flip");
        this.tl.to(this.sprite.elm, { scaleX: 0, duration: 0 });
        this.tl.to(this.label.elm, { scaleX: 0, duration: 0 });
        this.tl.to(this.cover.elm, { scaleX: 0, duration: 0.5 });
        this.tl.call(() => {
            this.openCard()
        })
        this.tl.to(this.sprite.elm, { scaleX: 1, duration: 0.5 });
        this.tl.play()
    }

    scaleCard() {
        console.log("Scale");
        var tl1 = new TimelineMax({ paused: true });
        tl1.fromTo(this.sprite.elm,  1, { zIndex: 999,scale: 0 }, {zIndex:999, scale: 1.5 }, 0);;
        tl1.seek(0).play()
    }
    preventSelfClick() {
        return this.sprite.elm.getAttribute("isclicked")
    }
}

