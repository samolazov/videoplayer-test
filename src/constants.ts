export const enum State {
    BUFFERING = "BUFFERING",
    ENDED = "ENDED",
    IDLE = "IDLE",
    LOADING = "LOADING",
    PAUSE = "PAUSE",
    PLAYING = "PLAYING",
    READY = "READY",
    SEEKING = "SEEKING",
}

export const statesMap: Partial<Record<keyof GlobalEventHandlersEventMap, State>> = {
    ended: State.ENDED,
    loadeddata: State.READY,
    loadstart: State.LOADING,
    pause: State.PAUSE,
    playing: State.PLAYING,
    seeking: State.SEEKING,
    //waiting: State.BUFFERING,
};

export const enum VideoType {
    M3U8 = "m3u8",
    MP4 = "mp4",
    MPD = "mpd",
}

export const checkBufferingInterval = 100; // ms
