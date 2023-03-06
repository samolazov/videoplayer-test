import HlsJs from "hls.js";
import DashJs from "dashjs";
import { VideoType } from "./constants";
import { StateLogger } from "./StateLogger";

declare const Hls: typeof HlsJs;
declare const dashjs: typeof DashJs;

export class VideoPlayer {
    private destroy: () => void = () => {};

    private readonly handlersMap: Record<VideoType, (source: string) => void> = {
        [VideoType.M3U8]: this.useHlsPlayer,
        [VideoType.MP4]: this.useNativePlayer,
        [VideoType.MPD]: this.useDashPlayer,
    };

    constructor(private readonly video: HTMLVideoElement) {
        new StateLogger(video);
    }

    public load(source: string): void {
        this.destroy();
        const extension = source.split(".").pop() as VideoType;
        this.handlersMap[extension].call(this, source);
        this.video.play()?.catch(() => {});
    }

    private useDashPlayer(source: string): void {
        const dash = dashjs.MediaPlayer().create();
        dash.initialize(this.video, source, true);
        this.destroy = () => dash.destroy();
    }

    private useHlsPlayer(source: string): void {
        if (!Hls.isSupported()) {
            return;
        }
        const hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(this.video);
        this.destroy = () => hls.destroy();
    }

    private useNativePlayer(source: string): void {
        this.video.insertAdjacentHTML("beforeend", `<source src="${source}" type="video/mp4" codecs="avc1.4d002a">`);
        this.destroy = () => (this.video.innerHTML = "");
    }
}
