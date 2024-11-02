// ==UserScript==
// @name         完成期末問卷la
// @namespace    no
// @version      0.1
// @description  lol
// @author       lol
// @match        https://webapp.yuntech.edu.tw/WebNewCAS/TeachSurvey/Survey/LastEval.aspx?current_subj=*
// @match        https://eclass.yuntech.edu.tw/exam/*
// @icon         https://media.discordapp.net/attachments/922733774633050112/969011518861623376/256.png
// @grant        none
// @license MIT
// ==/UserScript==

const rows = Array.from(document.querySelectorAll("tr"));
rows.forEach((row) => {
  const firstRadioInput = row.querySelector('input[type="radio"]');
  if (firstRadioInput) {
    firstRadioInput.click();
  }
});

const submitButton = document.getElementsByClassName("button_green");
submitButton[0].click();
