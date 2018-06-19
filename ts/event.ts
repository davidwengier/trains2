export class Event {
    public static globalEventID = 1;
    public static globalEvents: GlobalEvent = {};

    public On(eventName: string, callback: (event: GlobalEventObject, ...data: any[]) => void): number {
        const id = Event.globalEventID;
        Event.globalEventID++;

        let existingEvents = Event.globalEvents[eventName];
        if (existingEvents === undefined) {
            Event.globalEvents[eventName] = new Array<StoredEvent>();
            existingEvents = Event.globalEvents[eventName];
        }

        existingEvents.push({
            id,
            callback
        });

        return id;
    }

    public Emit(eventName: string, ...data: any[]): void {
        const existingEvents = Event.globalEvents[eventName];
        if (existingEvents !== undefined) {

            const eventObject: GlobalEventObject = {
                eventName,
                data
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

    public Unsubscribe(eventID: number): void {
        for (const eventName in Event.globalEvents) {
            if (Event.globalEvents.hasOwnProperty(eventName) && Event.globalEvents[eventName] !== undefined) {
                for (let i = 0; i < Event.globalEvents[eventName].length; i++) {
                    if (Event.globalEvents[eventName][i].id === eventID) {
                        Event.globalEvents[eventName].splice(i, 1);
                        return;
                    }
                }
            }
        }
    }
}

export interface StoredEvent {
    id: number;
    callback: Function;
}

export interface GlobalEventObject {
    eventName: string;
    data: any[];
}

export interface GlobalEvent {
    [eventName: string]: Array<StoredEvent>;
}