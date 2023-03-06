/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/StateDetector.ts":
/*!******************************!*\
  !*** ./src/StateDetector.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StateDetector": () => (/* binding */ StateDetector)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");

class StateDetector {
    constructor(video) {
        this.video = video;
        this.previousTime = 0;
    }
    get state() {
        const { currentTime, previousTime } = this;
        this.previousTime = currentTime;
        if (this.video.ended || !currentTime /* begin of the video */) {
            return;
        }
        if (Math.abs(previousTime - currentTime) > _constants__WEBPACK_IMPORTED_MODULE_0__.checkStateInterval * 2) {
            return "SEEKING" /* State.SEEKING */;
        }
        if (this.video.paused) {
            return "PAUSE" /* State.PAUSE */;
        }
        if (currentTime === previousTime) {
            return "BUFFERING" /* State.BUFFERING */;
        }
        return "PLAYING" /* State.PLAYING */;
    }
    get currentTime() {
        return Math.floor(this.video.currentTime * 1000);
    }
}


/***/ }),

/***/ "./src/StateLogger.ts":
/*!****************************!*\
  !*** ./src/StateLogger.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StateLogger": () => (/* binding */ StateLogger)
/* harmony export */ });
/* harmony import */ var _StateDetector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateDetector */ "./src/StateDetector.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");


class StateLogger {
    constructor(video) {
        this.video = video;
        /**
         * Stores already reported states to avoid duplication
         */
        this.reportedState = { buffering: false, pause: false, playing: false };
        console.log("IDLE" /* State.IDLE */);
        Object.keys(_constants__WEBPACK_IMPORTED_MODULE_1__.statesMap).forEach((event) => {
            video.addEventListener(event, () => console.log(_constants__WEBPACK_IMPORTED_MODULE_1__.statesMap[event]));
        });
        this.stateDetector = new _StateDetector__WEBPACK_IMPORTED_MODULE_0__.StateDetector(video);
        setInterval(() => this.checkState(), _constants__WEBPACK_IMPORTED_MODULE_1__.checkStateInterval);
    }
    setReportedState(state) {
        this.reportedState = Object.assign(Object.assign({}, this.reportedState), state);
    }
    checkState() {
        switch (this.stateDetector.state) {
            case "SEEKING" /* State.SEEKING */:
                this.reportSeeking();
                break;
            case "PAUSE" /* State.PAUSE */:
                this.reportPause();
                break;
            case "BUFFERING" /* State.BUFFERING */:
                this.reportBufferingBegin();
                break;
            case "PLAYING" /* State.PLAYING */:
                this.reportPlaying();
                break;
            default:
                this.handleStoppedVideo();
        }
    }
    handleStoppedVideo() {
        this.reportBufferingEnd();
        this.setReportedState({ playing: false, pause: false });
    }
    reportBufferingBegin() {
        if (!this.reportedState.buffering) {
            console.log(`${"BUFFERING" /* State.BUFFERING */} started`);
            this.bufferingBegin = Date.now();
            this.setReportedState({ buffering: true, playing: false, pause: true });
        }
    }
    reportBufferingEnd() {
        if (this.reportedState.buffering) {
            console.log(`${"BUFFERING" /* State.BUFFERING */} ended, duration ${Date.now() - this.bufferingBegin}ms`);
            this.setReportedState({ buffering: false });
        }
    }
    reportPause() {
        if (!this.reportedState.pause) {
            this.reportBufferingEnd();
            console.log("PAUSE" /* State.PAUSE */);
            this.setReportedState({ playing: false, pause: true });
        }
    }
    reportPlaying() {
        if (!this.reportedState.playing) {
            this.reportBufferingEnd();
            console.log("PLAYING" /* State.PLAYING */);
            this.setReportedState({ playing: true, pause: false });
        }
    }
    reportSeeking() {
        this.reportBufferingEnd();
        console.log("SEEKING" /* State.SEEKING */);
        this.setReportedState({ playing: false });
    }
}


/***/ }),

/***/ "./src/VideoPlayer.ts":
/*!****************************!*\
  !*** ./src/VideoPlayer.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VideoPlayer": () => (/* binding */ VideoPlayer)
/* harmony export */ });
/* harmony import */ var _StateLogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateLogger */ "./src/StateLogger.ts");

class VideoPlayer {
    constructor(video) {
        this.video = video;
        this.destroy = () => { };
        this.handlersMap = {
            ["m3u8" /* VideoType.M3U8 */]: this.useHlsPlayer,
            ["mp4" /* VideoType.MP4 */]: this.useNativePlayer,
            ["mpd" /* VideoType.MPD */]: this.useDashPlayer,
        };
        new _StateLogger__WEBPACK_IMPORTED_MODULE_0__.StateLogger(video);
    }
    load(source) {
        var _a;
        this.destroy();
        const extension = source.split(".").pop();
        this.handlersMap[extension].call(this, source);
        (_a = this.video.play()) === null || _a === void 0 ? void 0 : _a.catch(() => { });
    }
    useDashPlayer(source) {
        const dash = dashjs.MediaPlayer().create();
        dash.initialize(this.video, source, true);
        this.destroy = () => dash.destroy();
    }
    useHlsPlayer(source) {
        if (!Hls.isSupported()) {
            return;
        }
        const hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(this.video);
        this.destroy = () => hls.destroy();
    }
    useNativePlayer(source) {
        this.video.insertAdjacentHTML("beforeend", `<source src="${source}" type="video/mp4" codecs="avc1.4d002a">`);
        this.destroy = () => (this.video.innerHTML = "");
    }
}


/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkStateInterval": () => (/* binding */ checkStateInterval),
/* harmony export */   "statesMap": () => (/* binding */ statesMap)
/* harmony export */ });
const statesMap = {
    ended: "ENDED" /* State.ENDED */,
    loadeddata: "READY" /* State.READY */,
    loadstart: "LOADING" /* State.LOADING */,
    //pause: State.PAUSE, // implemented basing on currentTime
    //playing: State.PLAYING, // implemented basing on currentTime
    //seeking: State.SEEKING, // implemented basing on currentTime
    //waiting: State.BUFFERING, // implemented basing on currentTime
};
const checkStateInterval = 100; // ms


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _VideoPlayer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VideoPlayer */ "./src/VideoPlayer.ts");

const video = document.querySelector("video");
const player = new _VideoPlayer__WEBPACK_IMPORTED_MODULE_0__.VideoPlayer(video);
const selector = document.querySelector("select");
selector.addEventListener("change", () => player.load(selector.options[selector.selectedIndex].value));
selector.disabled = false;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTjRDO0FBRTVDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxxREFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXRDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbEQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkcsUUFBUSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92aWRlb3BsYXllci10ZXN0Ly4vc3JjL1N0YXRlRGV0ZWN0b3IudHMiLCJ3ZWJwYWNrOi8vdmlkZW9wbGF5ZXItdGVzdC8uL3NyYy9TdGF0ZUxvZ2dlci50cyIsIndlYnBhY2s6Ly92aWRlb3BsYXllci10ZXN0Ly4vc3JjL1ZpZGVvUGxheWVyLnRzIiwid2VicGFjazovL3ZpZGVvcGxheWVyLXRlc3QvLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovL3ZpZGVvcGxheWVyLXRlc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmlkZW9wbGF5ZXItdGVzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdmlkZW9wbGF5ZXItdGVzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZpZGVvcGxheWVyLXRlc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92aWRlb3BsYXllci10ZXN0Ly4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrU3RhdGVJbnRlcnZhbCwgU3RhdGUgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcblxuZXhwb3J0IGNsYXNzIFN0YXRlRGV0ZWN0b3Ige1xuICAgIHByaXZhdGUgcHJldmlvdXNUaW1lOiBudW1iZXIgPSAwO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB2aWRlbzogSFRNTFZpZGVvRWxlbWVudCkge31cblxuICAgIHB1YmxpYyBnZXQgc3RhdGUoKTogU3RhdGUge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRUaW1lLCBwcmV2aW91c1RpbWUgfSA9IHRoaXM7XG4gICAgICAgIHRoaXMucHJldmlvdXNUaW1lID0gY3VycmVudFRpbWU7XG4gICAgICAgIGlmICh0aGlzLnZpZGVvLmVuZGVkIHx8ICFjdXJyZW50VGltZSAvKiBiZWdpbiBvZiB0aGUgdmlkZW8gKi8pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoTWF0aC5hYnMocHJldmlvdXNUaW1lIC0gY3VycmVudFRpbWUpID4gY2hlY2tTdGF0ZUludGVydmFsICogMikge1xuICAgICAgICAgICAgcmV0dXJuIFN0YXRlLlNFRUtJTkc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudmlkZW8ucGF1c2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gU3RhdGUuUEFVU0U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1cnJlbnRUaW1lID09PSBwcmV2aW91c1RpbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBTdGF0ZS5CVUZGRVJJTkc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFN0YXRlLlBMQVlJTkc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgY3VycmVudFRpbWUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy52aWRlby5jdXJyZW50VGltZSAqIDEwMDApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFN0YXRlRGV0ZWN0b3IgfSBmcm9tIFwiLi9TdGF0ZURldGVjdG9yXCI7XG5pbXBvcnQgeyBjaGVja1N0YXRlSW50ZXJ2YWwsIFN0YXRlLCBzdGF0ZXNNYXAgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcblxudHlwZSBSZXBvcnRlZFN0YXRlID0geyBidWZmZXJpbmc6IGJvb2xlYW47IHBhdXNlOiBib29sZWFuOyBwbGF5aW5nOiBib29sZWFuIH07XG5cbmV4cG9ydCBjbGFzcyBTdGF0ZUxvZ2dlciB7XG4gICAgcHJpdmF0ZSBidWZmZXJpbmdCZWdpbjogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogU3RvcmVzIGFscmVhZHkgcmVwb3J0ZWQgc3RhdGVzIHRvIGF2b2lkIGR1cGxpY2F0aW9uXG4gICAgICovXG4gICAgcHJpdmF0ZSByZXBvcnRlZFN0YXRlOiBSZXBvcnRlZFN0YXRlID0geyBidWZmZXJpbmc6IGZhbHNlLCBwYXVzZTogZmFsc2UsIHBsYXlpbmc6IGZhbHNlIH07XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHN0YXRlRGV0ZWN0b3I7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHZpZGVvOiBIVE1MVmlkZW9FbGVtZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFN0YXRlLklETEUpO1xuICAgICAgICBPYmplY3Qua2V5cyhzdGF0ZXNNYXApLmZvckVhY2goKGV2ZW50OiBrZXlvZiBHbG9iYWxFdmVudEhhbmRsZXJzRXZlbnRNYXApID0+IHtcbiAgICAgICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsICgpID0+IGNvbnNvbGUubG9nKHN0YXRlc01hcFtldmVudF0pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3RhdGVEZXRlY3RvciA9IG5ldyBTdGF0ZURldGVjdG9yKHZpZGVvKTtcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5jaGVja1N0YXRlKCksIGNoZWNrU3RhdGVJbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRSZXBvcnRlZFN0YXRlKHN0YXRlOiBQYXJ0aWFsPFJlcG9ydGVkU3RhdGU+KTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVwb3J0ZWRTdGF0ZSA9IHsgLi4udGhpcy5yZXBvcnRlZFN0YXRlLCAuLi5zdGF0ZSB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tTdGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXRlRGV0ZWN0b3Iuc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuU0VFS0lORzpcbiAgICAgICAgICAgICAgICB0aGlzLnJlcG9ydFNlZWtpbmcoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuUEFVU0U6XG4gICAgICAgICAgICAgICAgdGhpcy5yZXBvcnRQYXVzZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTdGF0ZS5CVUZGRVJJTkc6XG4gICAgICAgICAgICAgICAgdGhpcy5yZXBvcnRCdWZmZXJpbmdCZWdpbigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTdGF0ZS5QTEFZSU5HOlxuICAgICAgICAgICAgICAgIHRoaXMucmVwb3J0UGxheWluZygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVN0b3BwZWRWaWRlbygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVTdG9wcGVkVmlkZW8oKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVwb3J0QnVmZmVyaW5nRW5kKCk7XG4gICAgICAgIHRoaXMuc2V0UmVwb3J0ZWRTdGF0ZSh7IHBsYXlpbmc6IGZhbHNlLCBwYXVzZTogZmFsc2UgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXBvcnRCdWZmZXJpbmdCZWdpbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlcG9ydGVkU3RhdGUuYnVmZmVyaW5nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtTdGF0ZS5CVUZGRVJJTkd9IHN0YXJ0ZWRgKTtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyaW5nQmVnaW4gPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhpcy5zZXRSZXBvcnRlZFN0YXRlKHsgYnVmZmVyaW5nOiB0cnVlLCBwbGF5aW5nOiBmYWxzZSwgcGF1c2U6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcG9ydEJ1ZmZlcmluZ0VuZCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucmVwb3J0ZWRTdGF0ZS5idWZmZXJpbmcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke1N0YXRlLkJVRkZFUklOR30gZW5kZWQsIGR1cmF0aW9uICR7RGF0ZS5ub3coKSAtIHRoaXMuYnVmZmVyaW5nQmVnaW59bXNgKTtcbiAgICAgICAgICAgIHRoaXMuc2V0UmVwb3J0ZWRTdGF0ZSh7IGJ1ZmZlcmluZzogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcG9ydFBhdXNlKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMucmVwb3J0ZWRTdGF0ZS5wYXVzZSkge1xuICAgICAgICAgICAgdGhpcy5yZXBvcnRCdWZmZXJpbmdFbmQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFN0YXRlLlBBVVNFKTtcbiAgICAgICAgICAgIHRoaXMuc2V0UmVwb3J0ZWRTdGF0ZSh7IHBsYXlpbmc6IGZhbHNlLCBwYXVzZTogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVwb3J0UGxheWluZygpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlcG9ydGVkU3RhdGUucGxheWluZykge1xuICAgICAgICAgICAgdGhpcy5yZXBvcnRCdWZmZXJpbmdFbmQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFN0YXRlLlBMQVlJTkcpO1xuICAgICAgICAgICAgdGhpcy5zZXRSZXBvcnRlZFN0YXRlKHsgcGxheWluZzogdHJ1ZSwgcGF1c2U6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXBvcnRTZWVraW5nKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlcG9ydEJ1ZmZlcmluZ0VuZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhTdGF0ZS5TRUVLSU5HKTtcbiAgICAgICAgdGhpcy5zZXRSZXBvcnRlZFN0YXRlKHsgcGxheWluZzogZmFsc2UgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IEhsc0pzIGZyb20gXCJobHMuanNcIjtcbmltcG9ydCBEYXNoSnMgZnJvbSBcImRhc2hqc1wiO1xuaW1wb3J0IHsgVmlkZW9UeXBlIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBTdGF0ZUxvZ2dlciB9IGZyb20gXCIuL1N0YXRlTG9nZ2VyXCI7XG5cbmRlY2xhcmUgY29uc3QgSGxzOiB0eXBlb2YgSGxzSnM7XG5kZWNsYXJlIGNvbnN0IGRhc2hqczogdHlwZW9mIERhc2hKcztcblxuZXhwb3J0IGNsYXNzIFZpZGVvUGxheWVyIHtcbiAgICBwcml2YXRlIGRlc3Ryb3k6ICgpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgaGFuZGxlcnNNYXA6IFJlY29yZDxWaWRlb1R5cGUsIChzb3VyY2U6IHN0cmluZykgPT4gdm9pZD4gPSB7XG4gICAgICAgIFtWaWRlb1R5cGUuTTNVOF06IHRoaXMudXNlSGxzUGxheWVyLFxuICAgICAgICBbVmlkZW9UeXBlLk1QNF06IHRoaXMudXNlTmF0aXZlUGxheWVyLFxuICAgICAgICBbVmlkZW9UeXBlLk1QRF06IHRoaXMudXNlRGFzaFBsYXllcixcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB2aWRlbzogSFRNTFZpZGVvRWxlbWVudCkge1xuICAgICAgICBuZXcgU3RhdGVMb2dnZXIodmlkZW8pO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkKHNvdXJjZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICBjb25zdCBleHRlbnNpb24gPSBzb3VyY2Uuc3BsaXQoXCIuXCIpLnBvcCgpIGFzIFZpZGVvVHlwZTtcbiAgICAgICAgdGhpcy5oYW5kbGVyc01hcFtleHRlbnNpb25dLmNhbGwodGhpcywgc291cmNlKTtcbiAgICAgICAgdGhpcy52aWRlby5wbGF5KCk/LmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVzZURhc2hQbGF5ZXIoc291cmNlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGFzaCA9IGRhc2hqcy5NZWRpYVBsYXllcigpLmNyZWF0ZSgpO1xuICAgICAgICBkYXNoLmluaXRpYWxpemUodGhpcy52aWRlbywgc291cmNlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5kZXN0cm95ID0gKCkgPT4gZGFzaC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1c2VIbHNQbGF5ZXIoc291cmNlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFIbHMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGhscyA9IG5ldyBIbHMoKTtcbiAgICAgICAgaGxzLmxvYWRTb3VyY2Uoc291cmNlKTtcbiAgICAgICAgaGxzLmF0dGFjaE1lZGlhKHRoaXMudmlkZW8pO1xuICAgICAgICB0aGlzLmRlc3Ryb3kgPSAoKSA9PiBobHMuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXNlTmF0aXZlUGxheWVyKHNvdXJjZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMudmlkZW8uaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIGA8c291cmNlIHNyYz1cIiR7c291cmNlfVwiIHR5cGU9XCJ2aWRlby9tcDRcIiBjb2RlY3M9XCJhdmMxLjRkMDAyYVwiPmApO1xuICAgICAgICB0aGlzLmRlc3Ryb3kgPSAoKSA9PiAodGhpcy52aWRlby5pbm5lckhUTUwgPSBcIlwiKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY29uc3QgZW51bSBTdGF0ZSB7XG4gICAgQlVGRkVSSU5HID0gXCJCVUZGRVJJTkdcIixcbiAgICBFTkRFRCA9IFwiRU5ERURcIixcbiAgICBJRExFID0gXCJJRExFXCIsXG4gICAgTE9BRElORyA9IFwiTE9BRElOR1wiLFxuICAgIFBBVVNFID0gXCJQQVVTRVwiLFxuICAgIFBMQVlJTkcgPSBcIlBMQVlJTkdcIixcbiAgICBSRUFEWSA9IFwiUkVBRFlcIixcbiAgICBTRUVLSU5HID0gXCJTRUVLSU5HXCIsXG59XG5cbmV4cG9ydCBjb25zdCBzdGF0ZXNNYXA6IFBhcnRpYWw8UmVjb3JkPGtleW9mIEdsb2JhbEV2ZW50SGFuZGxlcnNFdmVudE1hcCwgU3RhdGU+PiA9IHtcbiAgICBlbmRlZDogU3RhdGUuRU5ERUQsXG4gICAgbG9hZGVkZGF0YTogU3RhdGUuUkVBRFksXG4gICAgbG9hZHN0YXJ0OiBTdGF0ZS5MT0FESU5HLFxuICAgIC8vcGF1c2U6IFN0YXRlLlBBVVNFLCAvLyBpbXBsZW1lbnRlZCBiYXNpbmcgb24gY3VycmVudFRpbWVcbiAgICAvL3BsYXlpbmc6IFN0YXRlLlBMQVlJTkcsIC8vIGltcGxlbWVudGVkIGJhc2luZyBvbiBjdXJyZW50VGltZVxuICAgIC8vc2Vla2luZzogU3RhdGUuU0VFS0lORywgLy8gaW1wbGVtZW50ZWQgYmFzaW5nIG9uIGN1cnJlbnRUaW1lXG4gICAgLy93YWl0aW5nOiBTdGF0ZS5CVUZGRVJJTkcsIC8vIGltcGxlbWVudGVkIGJhc2luZyBvbiBjdXJyZW50VGltZVxufTtcblxuZXhwb3J0IGNvbnN0IGVudW0gVmlkZW9UeXBlIHtcbiAgICBNM1U4ID0gXCJtM3U4XCIsXG4gICAgTVA0ID0gXCJtcDRcIixcbiAgICBNUEQgPSBcIm1wZFwiLFxufVxuXG5leHBvcnQgY29uc3QgY2hlY2tTdGF0ZUludGVydmFsID0gMTAwOyAvLyBtc1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBWaWRlb1BsYXllciB9IGZyb20gXCIuL1ZpZGVvUGxheWVyXCI7XG5cbmNvbnN0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZpZGVvXCIpO1xuY29uc3QgcGxheWVyID0gbmV3IFZpZGVvUGxheWVyKHZpZGVvKTtcblxuY29uc3Qgc2VsZWN0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwic2VsZWN0XCIpO1xuc2VsZWN0b3IuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiBwbGF5ZXIubG9hZChzZWxlY3Rvci5vcHRpb25zW3NlbGVjdG9yLnNlbGVjdGVkSW5kZXhdLnZhbHVlKSk7XG5zZWxlY3Rvci5kaXNhYmxlZCA9IGZhbHNlO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9