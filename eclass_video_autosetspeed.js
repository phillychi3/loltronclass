// ==UserScript==
// @name         eclass autosetspeed
// @namespace    no
// @version      0.1
// @description  no
// @author       phillychi3
// @match        https://eclass.yuntech.edu.tw/course/*
// @match        https://tronclass.com.tw/course/*
// @icon         https://media.discordapp.net/attachments/922733774633050112/969011518861623376/256.png
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  let video;
  let speed = 16;
  document.addEventListener("play", setplayspeed, true);
  document.addEventListener("playing", whenplaysetspeed, true);
  function setplayspeed(event) {
    video = event.target;
  }
  function whenplaysetspeed(enent) {
    event.target.playbackRate = speed;
    event.target.muted = true;
    event.target.__proto__.pause = () => {};
  }
})();
