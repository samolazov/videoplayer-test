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
    //pause: State.PAUSE, // implemented basing on currentTime
    //playing: State.PLAYING, // implemented basing on currentTime
    //seeking: State.SEEKING, // implemented basing on currentTime
    //waiting: State.BUFFERING, // implemented basing on currentTime
};

export const enum VideoType {
    M3U8 = "m3u8",
    MP4 = "mp4",
    MPD = "mpd",
}

export const checkBufferingInterval = 100; // ms
