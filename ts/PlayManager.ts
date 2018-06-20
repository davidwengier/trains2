// tslint:disable-next-line:no-reference
/// <reference path ="../types/jquery.d.ts"/>

import { Board } from "./Board";
import { GameEvent } from "./GameEvent";
import { IPlayComponents } from "./IPlayComponents";
import { Train } from "./Train";
import { Util } from "./util";

export function InitialisePlay($container: JQuery): void {
    const manager = new PlayManager($container);

    manager.Start();
}
export class PlayManager {
    private readonly animationEndEventString =
        "webkitAnimationEnd mozAnimationEnd MSAnimationEnd onanimationend animationend";
    private playComponents: IPlayComponents;
    private gameBoard: Board;

    constructor($container: JQuery) {
        this.playComponents = GetPlayComponent($container);
        this.gameBoard = new Board(this.playComponents);

        const top = ($(window).height() - this.gameBoard.canvasHeight) / 2;
        const left = ($(window).width() - this.gameBoard.canvasWidth) / 2;

        $("body").height($(window).height());
        this.playComponents.$trackButtons.css("top", top);
        this.playComponents.$trainButtons.css("top", 15).css("right", 15);
        this.playComponents.$mute.width(left);
        this.playComponents.$autosave.width(left);

        this.playComponents.$trainButtons.draggable({
            containment: "body",
            handle: ".ui-handle"
        });
    }

    public Start(): void {
        this.AttachEvents();

        this.gameBoard.loadCells();
    }

    public DisplayTrainSpeed(speed: number) {
        this.playComponents.$trainButtons.find(".ui-speed").text((speed * 10).toString() + " kms/h");
    }

    private AttachEvents(): void {

        this.playComponents.$globalButtons.find(".ui-title").click(() => {
            this.playComponents.$globalButtons.toggleClass("minimised");
        });

        this.playComponents.$globalButtons.find(".ui-minimise").click(() => {
            this.playComponents.$globalButtons.addClass("minimised");
        });

        this.playComponents.$globalButtons.find("button").click((event) => {
            if (event.currentTarget !== null) {
                this.gameBoard.globalControlClick(event.currentTarget);
            }
        });

        this.playComponents.$trainButtons.find(".ui-close").click(() => {
            this.gameBoard.hideTrainControls();
        });

        this.playComponents.$trainButtons.find("button").click((event) => {
            if (event.currentTarget !== null) {
                this.gameBoard.trainControlClick(event.currentTarget);
            }
        });

        this.playComponents.$trackButtons.find("button").click((event) => {
            if (event.currentTarget !== null) {
                this.gameBoard.trackControlClick(event.currentTarget);
                Util.selectButton($(event.currentTarget));
            }
        });

        this.playComponents.$mute.click(() => {
            const $mute = this.playComponents.$mute;
            const mute = Util.toBoolean($mute.val());
            if (!mute) {
                $mute.val("true");
            } else {
                $mute.val("false");
            }
            this.gameBoard.setMuted(!mute);
        });

        this.playComponents.$autosave.click(() => {
            const $autosave = this.playComponents.$autosave;
            const autosave = Util.toBoolean($autosave.val());
            if (!autosave) {
                $autosave.val("true");
            } else {
                $autosave.val("false");
            }
            this.gameBoard.setAutoSave(!autosave);
            if (!autosave) {
                this.gameBoard.saveCells();
            }
        });

        GameEvent.On("speedchanged", (_, trainID: number, speed: number) => {
            let setTrainSpeed = false;
            if (this.gameBoard.selectedTrain !== undefined) {
                if (trainID === this.gameBoard.selectedTrain.id) {
                    setTrainSpeed = true;
                }
            } else {
                setTrainSpeed = true;
            }

            if (setTrainSpeed) {
                this.DisplayTrainSpeed(speed);
            }
        });

        GameEvent.On("showtraincontrols", (_, train: Train) => {
            this.playComponents.$trainName.text(train.name);
            this.playComponents.$trainButtons.addClass("flipInX").show();
            this.playComponents.$trainButtons.one(this.animationEndEventString, () => {
                this.playComponents.$trainButtons.removeClass("flipInX");
            });
            this.DisplayTrainSpeed(train.getTrainSpeed());
        });

        GameEvent.On("hidetraincontrols", (_) => {
            this.playComponents.$trainButtons.addClass("flipOutX");
            this.playComponents.$trainButtons.one(this.animationEndEventString, () => {
                this.playComponents.$trainButtons.removeClass("flipOutX").hide();
            });
        });
    }
}

export function GetPlayComponent($container: JQuery): IPlayComponents {

    const $trainCanvas = $container.find(".ui-train-canvas");
    const $trackCanvas = $container.find(".ui-track-canvas");
    const $gridCanvas = $container.find(".ui-grid-canvas");
    const $trainLogoCanvas = $container.find(".ui-train-logo-canvas");

    return {
        $trackCanvas,
        $trainCanvas,
        $gridCanvas,
        $trainLogoCanvas,
        $canvases: $().add($trainCanvas).add($trackCanvas).add($gridCanvas),
        $trackButtons: $container.find(".ui-track-buttons"),
        $trainButtons: $container.find(".ui-train-buttons"),
        $globalButtons: $container.find(".ui-game-buttons"),
        $trainName: $container.find(".ui-train-name"),
        $mute: $container.find(".ui-mute"),
        $autosave: $container.find(".ui-autosave")
    };
}