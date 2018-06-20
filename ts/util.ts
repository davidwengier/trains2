// tslint:disable-next-line:no-reference
/// <reference path ="../types/jquery.d.ts"/>

export class Util {
    public static getRandomName(): string {
        return "The " + this.getRandomElement(this.adjectives) + " " + this.getRandomElement(this.names);
    }
    public static toBoolean(value: string): boolean {
        return value === "true";
    }
    public static selectButton($button: JQuery): void {
        const $parent = $button.closest("ul");
        $parent.find("button.selected").removeClass("selected");
        $button.addClass("selected");
    }
    private static adjectives: string[] = [
        "Flying",
        "Haunted",
        "Heavy",
        "Electric",
        "Diesel",
        "Daylight",
        "Outback",
        "Overland",
        "Underground",
        "Western",
        "Golden",
        "Awkward",
        "Livid",
        "Courageous",
        "Timid",
        "Nervous",
        "Emotional",
        "Ferocious",
        "Moronic",
        "Cynical",
        "Sassy",
        "Reluctant",
        "Majestic"
    ];

    private static names: string[] = [
        "Gary",
        "Steve",
        "Paul",
        "George",
        "Scotsman",
        "Express",
        "Wanderer",
        "Locomotive",
        "Warrior",
        "Alfonse"
    ];

    private static getRandomElement(items: string[]): string {
        return items[Math.floor(Math.random() * items.length)];
    }
}