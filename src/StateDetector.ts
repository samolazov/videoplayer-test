import { checkStateInterval, State } from "./constants";

export class StateDetector {
    private previousTime: number = 0;

    constructor(private readonly video: HTMLVideoElement) {}

    public get state(): State {
        const { currentTime, previousTime } = this;
        this.previousTime = currentTime;
        if (this.video.ended || !currentTime /* begin of the video */) {
            return;
        }
        if (Math.abs(previousTime - currentTime) > checkStateInterval * 2) {
            return State.SEEKING;
        }
        if (this.video.paused) {
            return State.PAUSE;
        }
        if (currentTime === previousTime) {
            return State.BUFFERING;
        }
        return State.PLAYING;
    }

    private get currentTime(): number {
        return Math.floor(this.video.currentTime * 1000);
    }
}
