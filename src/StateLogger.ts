import { checkBufferingInterval, State, statesMap } from "./constants";

export class StateLogger {
    private bufferingBegin: number;
    private pauseReported: boolean = false;
    private playingReported: boolean = false;
    private previousTime: number = 0;

    constructor(private readonly video: HTMLVideoElement) {
        console.log(State.IDLE);
        Object.keys(statesMap).forEach((event: keyof GlobalEventHandlersEventMap) => {
            video.addEventListener(event, () => console.log(statesMap[event]));
        });
        setInterval(() => this.detectBuffering(), checkBufferingInterval);
    }

    private get currentTime(): number {
        return Math.floor(this.video.currentTime * 1000);
    }

    private detectBuffering(): void {
        const { currentTime, previousTime } = this;
        this.previousTime = currentTime;
        if (this.video.ended || !currentTime /* begin of the video */) {
            return this.handleStoppedVideo();
        }
        if (Math.abs(previousTime - currentTime) > checkBufferingInterval * 2) {
            return this.reportSeeking();
        }
        if (this.video.paused) {
            return this.reportPause();
        }

        if (currentTime === previousTime) {
            this.reportBufferingBegin();
        } else {
            this.reportPlaying();
        }
    }

    private handleStoppedVideo(): void {
        this.reportBufferingEnd();
        this.playingReported = false;
        this.pauseReported = false;
    }

    private reportBufferingBegin(): void {
        if (!this.bufferingBegin) {
            console.log(`${State.BUFFERING} started`);
            this.bufferingBegin = Date.now();
            this.playingReported = false;
            this.pauseReported = true;
        }
    }

    private reportBufferingEnd(): void {
        if (this.bufferingBegin) {
            console.log(`${State.BUFFERING} ended, duration ${Date.now() - this.bufferingBegin}ms`);
            this.bufferingBegin = null;
        }
    }

    private reportPause(): void {
        if (!this.pauseReported) {
            this.reportBufferingEnd();
            console.log(State.PAUSE);
            this.playingReported = false;
            this.pauseReported = true;
        }
    }

    private reportPlaying(): void {
        if (!this.playingReported) {
            this.reportBufferingEnd();
            console.log(State.PLAYING);
            this.playingReported = true;
            this.pauseReported = false;
        }
    }

    private reportSeeking(): void {
        this.reportBufferingEnd();
        console.log(State.SEEKING);
        this.playingReported = false;
    }
}
