export class GameEvent {
    public static globalEventID = 1;
    public static globalEvents: IGlobalEvent = {};

    public static On(eventName: string, callback: (event: IGlobalEventObject, ...data: any[]) => void): number {
        const id = GameEvent.globalEventID;
        GameEvent.globalEventID++;

        let existingEvents = GameEvent.globalEvents[eventName];
        if (existingEvents === undefined) {
            GameEvent.globalEvents[eventName] = new Array < IStoredEvent > ();
            existingEvents = GameEvent.globalEvents[eventName];
        }

        existingEvents.push({
            callback,
            id
        });

        return id;
    }

    public static Emit(eventName: string, ...data: any[]): void {
        const existingEvents = GameEvent.globalEvents[eventName];
        if (existingEvents !== undefined) {

            const eventObject: IGlobalEventObject = {
                data,
                eventName
            };

            const callbackData: any[] = [eventObject];
            for (const item of data) {
                callbackData.push(item);
            }

            for (const event of existingEvents) {
                event.callback.apply(null, callbackData);
            }
        }
    }

    public static Unsubscribe(eventID: number): void {
        for (const eventName in GameEvent.globalEvents) {
            if (GameEvent.globalEvents.hasOwnProperty(eventName) && GameEvent.globalEvents[eventName] !== undefined) {
                for (let i = 0; i < GameEvent.globalEvents[eventName].length; i++) {
                    if (GameEvent.globalEvents[eventName][i].id === eventID) {
                        GameEvent.globalEvents[eventName].splice(i, 1);
                        return;
                    }
                }
            }
        }
    }
}

export interface IStoredEvent {
    id: number;
    callback: (event: IGlobalEventObject, ...data: any[]) => void;
}

export interface IGlobalEventObject {
    eventName: string;
    data: any[];
}

export interface IGlobalEvent {
    [eventName: string]: IStoredEvent[];
}