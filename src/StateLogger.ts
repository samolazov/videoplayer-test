import { StateDetector } from "./StateDetector";
import { checkStateInterval, State, statesMap } from "./constants";

type ReportedState = { buffering: boolean; pause: boolean; playing: boolean };

export class StateLogger {
    private bufferingBegin: number;

    /**
     * Stores already reported states to avoid duplication
     */
    private reportedState: ReportedState = { buffering: false, pause: false, playing: false };

    private readonly stateDetector;

    constructor(private readonly video: HTMLVideoElement) {
        console.log(State.IDLE);
        Object.keys(statesMap).forEach((event: keyof GlobalEventHandlersEventMap) => {
            video.addEventListener(event, () => console.log(statesMap[event]));
        });
        this.stateDetector = new StateDetector(video);
        setInterval(() => this.checkState(), checkStateInterval);
    }

    private setReportedState(state: Partial<ReportedState>): void {
        this.reportedState = { ...this.reportedState, ...state };
    }

    private checkState(): void {
        switch (this.stateDetector.state) {
            case State.SEEKING:
                this.reportSeeking();
                break;
            case State.PAUSE:
                this.reportPause();
                break;
            case State.BUFFERING:
                this.reportBufferingBegin();
                break;
            case State.PLAYING:
                this.reportPlaying();
                break;
            default:
                this.handleStoppedVideo();
        }
    }

    private handleStoppedVideo(): void {
        this.reportBufferingEnd();
        this.setReportedState({ playing: false, pause: false });
    }

    private reportBufferingBegin(): void {
        if (!this.reportedState.buffering) {
            console.log(`${State.BUFFERING} started`);
            this.bufferingBegin = Date.now();
            this.setReportedState({ buffering: true, playing: false, pause: true });
        }
    }

    private reportBufferingEnd(): void {
        if (this.reportedState.buffering) {
            console.log(`${State.BUFFERING} ended, duration ${Date.now() - this.bufferingBegin}ms`);
            this.setReportedState({ buffering: false });
        }
    }

    private reportPause(): void {
        if (!this.reportedState.pause) {
            this.reportBufferingEnd();
            console.log(State.PAUSE);
            this.setReportedState({ playing: false, pause: true });
        }
    }

    private reportPlaying(): void {
        if (!this.reportedState.playing) {
            this.reportBufferingEnd();
            console.log(State.PLAYING);
            this.setReportedState({ playing: true, pause: false });
        }
    }

    private reportSeeking(): void {
        this.reportBufferingEnd();
        console.log(State.SEEKING);
        this.setReportedState({ playing: false });
    }
}
