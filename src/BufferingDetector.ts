import { checkBufferingInterval } from "./constants";

export class BufferingDetector {
    private buffering: boolean = false;
    private bufferingBegin: number;
    private previousTime: number;
    private timeout: ReturnType<typeof setTimeout>;

    constructor(
        private readonly video: HTMLVideoElement,
        private readonly bufferingBeginCallback: () => void,
        private readonly bufferingEndCallback: (duration: number) => void
    ) {
        ["canplay", "error", "play", "playing", "seeking"].forEach(event =>
            this.video.addEventListener(event, () => this.restartDetecting())
        );
        ["loadstart", "pause"].forEach(event => this.video.addEventListener(event, () => this.stopDetecting()));
    }

    private get currentTime(): number {
        return Math.floor(this.video.currentTime * 1000);
    }

    private detectBuffering(): void {
        if (this.video.ended || this.video.paused || !this.currentTime /* begin of the video */) {
            return;
        }
        this.buffering = this.currentTime === this.previousTime;
        if (this.buffering) {
            this.handleBuffering();
        } else {
            this.startDetecting();
        }
    }

    private handleBuffering(): void {
        clearTimeout(this.timeout);
        this.bufferingBeginCallback();
        this.bufferingBegin = Date.now();
    }

    private restartDetecting(): void {
        this.stopDetecting();
        this.startDetecting();
    }

    private startDetecting(): void {
        this.previousTime = this.currentTime;
        this.timeout = setTimeout(() => this.detectBuffering(), checkBufferingInterval);
    }

    private stopDetecting(): void {
        clearTimeout(this.timeout);
        if (this.buffering) {
            this.bufferingEndCallback(Date.now() - this.bufferingBegin);
        }
        this.buffering = false;
    }
}
