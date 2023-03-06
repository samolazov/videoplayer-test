/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/StateLogger.ts":
/*!****************************!*\
  !*** ./src/StateLogger.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StateLogger": () => (/* binding */ StateLogger)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");

class StateLogger {
    constructor(video) {
        this.video = video;
        this.pauseReported = false;
        this.playingReported = false;
        this.previousTime = 0;
        console.log("IDLE" /* State.IDLE */);
        Object.keys(_constants__WEBPACK_IMPORTED_MODULE_0__.statesMap).forEach((event) => {
            video.addEventListener(event, () => console.log(_constants__WEBPACK_IMPORTED_MODULE_0__.statesMap[event]));
        });
        setInterval(() => this.detectBuffering(), _constants__WEBPACK_IMPORTED_MODULE_0__.checkBufferingInterval);
    }
    get currentTime() {
        return Math.floor(this.video.currentTime * 1000);
    }
    detectBuffering() {
        const { currentTime, previousTime } = this;
        this.previousTime = currentTime;
        if (this.video.ended || !currentTime /* begin of the video */) {
            return this.handleStoppedVideo();
        }
        if (Math.abs(previousTime - currentTime) > _constants__WEBPACK_IMPORTED_MODULE_0__.checkBufferingInterval * 2) {
            return this.reportSeeking();
        }
        if (this.video.paused) {
            return this.reportPause();
        }
        if (currentTime === previousTime) {
            this.reportBufferingBegin();
        }
        else {
            this.reportPlaying();
        }
    }
    handleStoppedVideo() {
        this.reportBufferingEnd();
        this.playingReported = false;
        this.pauseReported = false;
    }
    reportBufferingBegin() {
        if (!this.bufferingBegin) {
            console.log(`${"BUFFERING" /* State.BUFFERING */} started`);
            this.bufferingBegin = Date.now();
            this.playingReported = false;
            this.pauseReported = true;
        }
    }
    reportBufferingEnd() {
        if (this.bufferingBegin) {
            console.log(`${"BUFFERING" /* State.BUFFERING */} ended, duration ${Date.now() - this.bufferingBegin}ms`);
            this.bufferingBegin = null;
        }
    }
    reportPause() {
        if (!this.pauseReported) {
            this.reportBufferingEnd();
            console.log("PAUSE" /* State.PAUSE */);
            this.playingReported = false;
            this.pauseReported = true;
        }
    }
    reportPlaying() {
        if (!this.playingReported) {
            this.reportBufferingEnd();
            console.log("PLAYING" /* State.PLAYING */);
            this.playingReported = true;
            this.pauseReported = false;
        }
    }
    reportSeeking() {
        this.reportBufferingEnd();
        console.log("SEEKING" /* State.SEEKING */);
        this.playingReported = false;
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
/* harmony export */   "checkBufferingInterval": () => (/* binding */ checkBufferingInterval),
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
const checkBufferingInterval = 100; // ms


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFLLDJCQUFhO0lBQ2xCLFVBQVUsMkJBQWE7SUFDdkIsU0FBUywrQkFBZTtJQUN4QiwwREFBMEQ7SUFDMUQsOERBQThEO0lBQzlELDhEQUE4RDtJQUM5RCxnRUFBZ0U7Q0FDbkUsQ0FBQztBQVFLLE1BQU0sc0JBQXNCLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSzs7Ozs7OztVQzNCaEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ040QztBQUU1QyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLElBQUkscURBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUV0QyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmlkZW9wbGF5ZXItdGVzdC8uL3NyYy9TdGF0ZUxvZ2dlci50cyIsIndlYnBhY2s6Ly92aWRlb3BsYXllci10ZXN0Ly4vc3JjL1ZpZGVvUGxheWVyLnRzIiwid2VicGFjazovL3ZpZGVvcGxheWVyLXRlc3QvLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovL3ZpZGVvcGxheWVyLXRlc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmlkZW9wbGF5ZXItdGVzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdmlkZW9wbGF5ZXItdGVzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZpZGVvcGxheWVyLXRlc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92aWRlb3BsYXllci10ZXN0Ly4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrQnVmZmVyaW5nSW50ZXJ2YWwsIFN0YXRlLCBzdGF0ZXNNYXAgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcblxuZXhwb3J0IGNsYXNzIFN0YXRlTG9nZ2VyIHtcbiAgICBwcml2YXRlIGJ1ZmZlcmluZ0JlZ2luOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwYXVzZVJlcG9ydGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBwbGF5aW5nUmVwb3J0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIHByZXZpb3VzVGltZTogbnVtYmVyID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdmlkZW86IEhUTUxWaWRlb0VsZW1lbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coU3RhdGUuSURMRSk7XG4gICAgICAgIE9iamVjdC5rZXlzKHN0YXRlc01hcCkuZm9yRWFjaCgoZXZlbnQ6IGtleW9mIEdsb2JhbEV2ZW50SGFuZGxlcnNFdmVudE1hcCkgPT4ge1xuICAgICAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgKCkgPT4gY29uc29sZS5sb2coc3RhdGVzTWFwW2V2ZW50XSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5kZXRlY3RCdWZmZXJpbmcoKSwgY2hlY2tCdWZmZXJpbmdJbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgY3VycmVudFRpbWUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy52aWRlby5jdXJyZW50VGltZSAqIDEwMDApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGV0ZWN0QnVmZmVyaW5nKCk6IHZvaWQge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRUaW1lLCBwcmV2aW91c1RpbWUgfSA9IHRoaXM7XG4gICAgICAgIHRoaXMucHJldmlvdXNUaW1lID0gY3VycmVudFRpbWU7XG4gICAgICAgIGlmICh0aGlzLnZpZGVvLmVuZGVkIHx8ICFjdXJyZW50VGltZSAvKiBiZWdpbiBvZiB0aGUgdmlkZW8gKi8pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVN0b3BwZWRWaWRlbygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChNYXRoLmFicyhwcmV2aW91c1RpbWUgLSBjdXJyZW50VGltZSkgPiBjaGVja0J1ZmZlcmluZ0ludGVydmFsICogMikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwb3J0U2Vla2luZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnZpZGVvLnBhdXNlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwb3J0UGF1c2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyZW50VGltZSA9PT0gcHJldmlvdXNUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLnJlcG9ydEJ1ZmZlcmluZ0JlZ2luKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlcG9ydFBsYXlpbmcoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlU3RvcHBlZFZpZGVvKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlcG9ydEJ1ZmZlcmluZ0VuZCgpO1xuICAgICAgICB0aGlzLnBsYXlpbmdSZXBvcnRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBhdXNlUmVwb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcG9ydEJ1ZmZlcmluZ0JlZ2luKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuYnVmZmVyaW5nQmVnaW4pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke1N0YXRlLkJVRkZFUklOR30gc3RhcnRlZGApO1xuICAgICAgICAgICAgdGhpcy5idWZmZXJpbmdCZWdpbiA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB0aGlzLnBsYXlpbmdSZXBvcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5wYXVzZVJlcG9ydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVwb3J0QnVmZmVyaW5nRW5kKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5idWZmZXJpbmdCZWdpbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCR7U3RhdGUuQlVGRkVSSU5HfSBlbmRlZCwgZHVyYXRpb24gJHtEYXRlLm5vdygpIC0gdGhpcy5idWZmZXJpbmdCZWdpbn1tc2ApO1xuICAgICAgICAgICAgdGhpcy5idWZmZXJpbmdCZWdpbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcG9ydFBhdXNlKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMucGF1c2VSZXBvcnRlZCkge1xuICAgICAgICAgICAgdGhpcy5yZXBvcnRCdWZmZXJpbmdFbmQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFN0YXRlLlBBVVNFKTtcbiAgICAgICAgICAgIHRoaXMucGxheWluZ1JlcG9ydGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnBhdXNlUmVwb3J0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXBvcnRQbGF5aW5nKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMucGxheWluZ1JlcG9ydGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlcG9ydEJ1ZmZlcmluZ0VuZCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coU3RhdGUuUExBWUlORyk7XG4gICAgICAgICAgICB0aGlzLnBsYXlpbmdSZXBvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnBhdXNlUmVwb3J0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVwb3J0U2Vla2luZygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZXBvcnRCdWZmZXJpbmdFbmQoKTtcbiAgICAgICAgY29uc29sZS5sb2coU3RhdGUuU0VFS0lORyk7XG4gICAgICAgIHRoaXMucGxheWluZ1JlcG9ydGVkID0gZmFsc2U7XG4gICAgfVxufVxuIiwiaW1wb3J0IEhsc0pzIGZyb20gXCJobHMuanNcIjtcbmltcG9ydCBEYXNoSnMgZnJvbSBcImRhc2hqc1wiO1xuaW1wb3J0IHsgVmlkZW9UeXBlIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBTdGF0ZUxvZ2dlciB9IGZyb20gXCIuL1N0YXRlTG9nZ2VyXCI7XG5cbmRlY2xhcmUgY29uc3QgSGxzOiB0eXBlb2YgSGxzSnM7XG5kZWNsYXJlIGNvbnN0IGRhc2hqczogdHlwZW9mIERhc2hKcztcblxuZXhwb3J0IGNsYXNzIFZpZGVvUGxheWVyIHtcbiAgICBwcml2YXRlIGRlc3Ryb3k6ICgpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgaGFuZGxlcnNNYXA6IFJlY29yZDxWaWRlb1R5cGUsIChzb3VyY2U6IHN0cmluZykgPT4gdm9pZD4gPSB7XG4gICAgICAgIFtWaWRlb1R5cGUuTTNVOF06IHRoaXMudXNlSGxzUGxheWVyLFxuICAgICAgICBbVmlkZW9UeXBlLk1QNF06IHRoaXMudXNlTmF0aXZlUGxheWVyLFxuICAgICAgICBbVmlkZW9UeXBlLk1QRF06IHRoaXMudXNlRGFzaFBsYXllcixcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB2aWRlbzogSFRNTFZpZGVvRWxlbWVudCkge1xuICAgICAgICBuZXcgU3RhdGVMb2dnZXIodmlkZW8pO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkKHNvdXJjZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICBjb25zdCBleHRlbnNpb24gPSBzb3VyY2Uuc3BsaXQoXCIuXCIpLnBvcCgpIGFzIFZpZGVvVHlwZTtcbiAgICAgICAgdGhpcy5oYW5kbGVyc01hcFtleHRlbnNpb25dLmNhbGwodGhpcywgc291cmNlKTtcbiAgICAgICAgdGhpcy52aWRlby5wbGF5KCk/LmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVzZURhc2hQbGF5ZXIoc291cmNlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGFzaCA9IGRhc2hqcy5NZWRpYVBsYXllcigpLmNyZWF0ZSgpO1xuICAgICAgICBkYXNoLmluaXRpYWxpemUodGhpcy52aWRlbywgc291cmNlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5kZXN0cm95ID0gKCkgPT4gZGFzaC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1c2VIbHNQbGF5ZXIoc291cmNlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFIbHMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGhscyA9IG5ldyBIbHMoKTtcbiAgICAgICAgaGxzLmxvYWRTb3VyY2Uoc291cmNlKTtcbiAgICAgICAgaGxzLmF0dGFjaE1lZGlhKHRoaXMudmlkZW8pO1xuICAgICAgICB0aGlzLmRlc3Ryb3kgPSAoKSA9PiBobHMuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXNlTmF0aXZlUGxheWVyKHNvdXJjZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMudmlkZW8uaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIGA8c291cmNlIHNyYz1cIiR7c291cmNlfVwiIHR5cGU9XCJ2aWRlby9tcDRcIiBjb2RlY3M9XCJhdmMxLjRkMDAyYVwiPmApO1xuICAgICAgICB0aGlzLmRlc3Ryb3kgPSAoKSA9PiAodGhpcy52aWRlby5pbm5lckhUTUwgPSBcIlwiKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY29uc3QgZW51bSBTdGF0ZSB7XG4gICAgQlVGRkVSSU5HID0gXCJCVUZGRVJJTkdcIixcbiAgICBFTkRFRCA9IFwiRU5ERURcIixcbiAgICBJRExFID0gXCJJRExFXCIsXG4gICAgTE9BRElORyA9IFwiTE9BRElOR1wiLFxuICAgIFBBVVNFID0gXCJQQVVTRVwiLFxuICAgIFBMQVlJTkcgPSBcIlBMQVlJTkdcIixcbiAgICBSRUFEWSA9IFwiUkVBRFlcIixcbiAgICBTRUVLSU5HID0gXCJTRUVLSU5HXCIsXG59XG5cbmV4cG9ydCBjb25zdCBzdGF0ZXNNYXA6IFBhcnRpYWw8UmVjb3JkPGtleW9mIEdsb2JhbEV2ZW50SGFuZGxlcnNFdmVudE1hcCwgU3RhdGU+PiA9IHtcbiAgICBlbmRlZDogU3RhdGUuRU5ERUQsXG4gICAgbG9hZGVkZGF0YTogU3RhdGUuUkVBRFksXG4gICAgbG9hZHN0YXJ0OiBTdGF0ZS5MT0FESU5HLFxuICAgIC8vcGF1c2U6IFN0YXRlLlBBVVNFLCAvLyBpbXBsZW1lbnRlZCBiYXNpbmcgb24gY3VycmVudFRpbWVcbiAgICAvL3BsYXlpbmc6IFN0YXRlLlBMQVlJTkcsIC8vIGltcGxlbWVudGVkIGJhc2luZyBvbiBjdXJyZW50VGltZVxuICAgIC8vc2Vla2luZzogU3RhdGUuU0VFS0lORywgLy8gaW1wbGVtZW50ZWQgYmFzaW5nIG9uIGN1cnJlbnRUaW1lXG4gICAgLy93YWl0aW5nOiBTdGF0ZS5CVUZGRVJJTkcsIC8vIGltcGxlbWVudGVkIGJhc2luZyBvbiBjdXJyZW50VGltZVxufTtcblxuZXhwb3J0IGNvbnN0IGVudW0gVmlkZW9UeXBlIHtcbiAgICBNM1U4ID0gXCJtM3U4XCIsXG4gICAgTVA0ID0gXCJtcDRcIixcbiAgICBNUEQgPSBcIm1wZFwiLFxufVxuXG5leHBvcnQgY29uc3QgY2hlY2tCdWZmZXJpbmdJbnRlcnZhbCA9IDEwMDsgLy8gbXNcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgVmlkZW9QbGF5ZXIgfSBmcm9tIFwiLi9WaWRlb1BsYXllclwiO1xuXG5jb25zdCB2aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ2aWRlb1wiKTtcbmNvbnN0IHBsYXllciA9IG5ldyBWaWRlb1BsYXllcih2aWRlbyk7XG5cbmNvbnN0IHNlbGVjdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInNlbGVjdFwiKTtcbnNlbGVjdG9yLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4gcGxheWVyLmxvYWQoc2VsZWN0b3Iub3B0aW9uc1tzZWxlY3Rvci5zZWxlY3RlZEluZGV4XS52YWx1ZSkpO1xuc2VsZWN0b3IuZGlzYWJsZWQgPSBmYWxzZTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==