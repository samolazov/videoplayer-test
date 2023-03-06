import { State, statesMap } from "./constants";
import { BufferingDetector } from "./BufferingDetector";

export class StateLogger {
    constructor(video: HTMLVideoElement) {
        console.log(State.IDLE);
        new BufferingDetector(video, this.bufferingBeginCallback, this.bufferingEndCallback);
        Object.keys(statesMap).forEach((event: keyof GlobalEventHandlersEventMap) => {
            video.addEventListener(event, () => console.log(statesMap[event]));
        });
    }

    private bufferingBeginCallback(): void {
        console.log(`${State.BUFFERING} started`);
    }

    private bufferingEndCallback(duration: number): void {
        console.log(`${State.BUFFERING} ended, duration ${duration}ms`);
    }
}
