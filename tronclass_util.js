// ==UserScript==
// @name         tronclass util
// @namespace    no
// @version      0.2.2
// @description  more useful tools for tronclass
// @author       lol
// @match        https://eclass.yuntech.edu.tw/course/*
// @icon         https://media.discordapp.net/attachments/922733774633050112/969011518861623376/256.png
// @grant        none
// @updateURL    https://raw.githubusercontent.com/phillychi3/loltronclass/main/tronclass_util.js
// @downloadURL  https://raw.githubusercontent.com/phillychi3/loltronclass/main/tronclass_util.js
// @license MIT
// ==/UserScript==


(function () {
  "use strict";
  let tglobal = {
    process: 0,
    processmax: 0,
    persent: 0,
    ispress: false,
  };

  function tempAlert(msg,duration)
  {
    var el = document.createElement("div");
    el.innerHTML =
    `<div class="lol_alert alert-box success radius" data-alert>
      ${msg}
    </div>
    <style>
      .lol_alert {
        position: absolute;
        top: 40%;
        left: 20%;
        z-index: 99;
      }
    </style>`;
    setTimeout(function(){
      el.parentNode.removeChild(el);
    },duration);
    document.body.appendChild(el);
  }

  function updateprocessbar() {
    try{
    let processbar = document.getElementById("watch-process");
    let persent = (tglobal.process / tglobal.processmax) * 100;
    processbar.style = `width: ${persent}%`;
    }catch(e){}
  }

  function finishprocessbar() {
    try{
    let processbar = document.getElementById("watch-process-div");
    processbar.parentNode.removeChild(processbar);
    }catch(e){}
  }


  function circle_watch(fast = 1000) {
    const video = document.querySelector("video");
    const max = video.duration;
    const maxrun = 60;
    let lasttime = 0;
    const thisvideoid = document.URL.split("/").splice(-1).toString()
    tglobal.processmax = max;
    fetch(`https://eclass.yuntech.edu.tw/api/activities/${thisvideoid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cookie: document.cookie,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        let ct = 0
        for (let i = 0; i < max; i = i + maxrun) {
          ct++
          setTimeout(() => {
            watchthevideo(i, i + maxrun, data);
            tglobal.process = i + maxrun;
            updateprocessbar();
            if(max-i<maxrun){
              console.log("last")
              watchthevideo(i, max, data);
              tglobal.process = max;
              updateprocessbar();
              finishprocessbar();
              tglobal.ispress = false;
              tempAlert("aleardy watch the video", 2000);
            }
          }, fast*ct);
          lasttime = i + maxrun;
        }
      }
    );
  }

  function watchthevideo(start, end, videodata) {
    let student = globalData.user;
    let course = globalData.course;
    let dep = globalData.dept;
    fetch(
      `https://eclass.yuntech.edu.tw/api/course/activities-read/${videodata.id}`,
      {
        method: "POST",
        headers: {
          Origin: "https://eclass.yuntech.edu.tw",
          Referer:
            `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          start: start,
          end: end,
        }),
        cookie: document.cookie,
      }
    )
      .then((response) => response.json())
    fetch("https://eclass.yuntech.edu.tw/statistics/api/online-videos", {
      method: "POST",
      headers: {
        Connection: "keep-alive",
        Origin: "https://eclass.yuntech.edu.tw",
        Referer:
          `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
        "Content-Type": "Typetext/plain;charset=UTF-8",
      },
      cookie: document.cookie,

      body: JSON.stringify({
        user_id: student.id,
        org_id: 1,
        course_id: course.id,
        module_id: videodata.moduls_id,
        syllabus_id: videodata.syllabus_id,
        activity_id: videodata.id,
        upload_id: videodata.uploads[0].id,
        reply_id: null,
        comment_id: null,
        forum_type: "",
        action_type: "play",
        is_teacher: false,
        is_student: true,
        ts: Date.now(),
        user_agent:
          "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
        meeting_type: "online_video",
        start_at: start,
        end_at: end,
        duration: end - start,
        master_course_id: 0,
        org_name: student.orgName,
        user_no: student.userNo,
        user_name: student.name,
        course_code: course.courseCode,
        course_name: course.name,
        dep_id: dep.id,
        dep_name: dep.name,
        dep_code: dep.code,
      }),
    }).then((response) => {
      if (response.ok) {
        console.log("success");
      } else {
        console.log(response.status);
      }
    });
  }

  function makevideopanel() {
    let panel = document.createElement("div");
    panel.style = "padding: 20px;margin-top: -40px;";
    panel.innerHTML = `
    <div class="panel" id="eclassutilpanel">
      <div class="panel-heading">
        <h4>tronclass util</h4>
      </div>
      <div class="panel-body">
        <div class="panel-buttons" id="buttons">
          <button class="btn btn-default" id="btn1">watch video</button>
          <button class="btn btn-default" id="btn2">watch video fast(useless)</button>
        </div>
      </div>
    </div>
    <style>
      .panel {
        margin-bottom: 23px;
        background: rgba(255, 255, 255, 0.9);
      }
      .panel-heading {
        padding: 0px;
      }
    </style>
    `;
    document.querySelector('div.fullscreen-right').appendChild(panel);
    let btn1 = document.getElementById("btn1");
    btn1.addEventListener("click", function () {
      if(!tglobal.ispress){
        let processbar = document.createElement("div");
        processbar.innerHTML = `
        <div class="panel-progress" id="watch-process-div">
            <div class="progress-meter" id="watch-process" style="width: ${tglobal.persent}%"></div>
        </div>
        <style>
          .panel-progress {
            margin-top: 20px;
            padding: 6px;
            border-radius: 30px;
            background: rgba(0, 0, 0, 0.25);
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25),
              0 1px rgba(255, 255, 255, 0.08);
          }
          .progress-meter {
            animation: progressAnimation 6s;
            background-color: #ef416f;
            height: 10px;
            border-radius: 30px;
            transition: 0.4s ease-out;
          }
        `;
        document.querySelector("div.panel-body").appendChild(processbar);
        tglobal.ispress = true;
        circle_watch();
      }
    });
    let btn2 = document.getElementById("btn2");
    btn2.addEventListener("click", function () {
      circle_watch(10);
    });
  }



  function makecoursepanel() {
    let panel = document.createElement("div");
    panel.innerHTML = `
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4 class="panel-title">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" aria-expanded="false">tronclass util</a>
            </h4>
        </div>
        <div class="buttons" id="buttons">
            <button class="btn btn-default" id="btn1">watch all video</button>
            <button class="btn btn-default" id="btn2">wait...</button>
        </div>
    </div>
    <style>
        .panel {
            margin-bottom: 23px;
        }
        .panel-heading {
            padding: 0px;
        }
        .panel-title {
            padding: 10px;
        }
    `;

    let target = document.querySelector(".collapse");
    target.parentNode.insertBefore(panel, target);

    let btn1 = document.getElementById("btn1");
    let btn2 = document.getElementById("btn2");
    btn1.addEventListener("click", function () {
      console.log("click1");
    });
    btn2.addEventListener("click", function () {
      console.log("click2");
    });
  }




  var observer = new MutationObserver(resetTimer);
  var timer = setTimeout(action, 1000, observer);
  observer.observe(document, { childList: true, subtree: true });

  function resetTimer(changes, observer) {
    clearTimeout(timer);
    timer = setTimeout(action, 1000, observer);
  }

  function action(observer) {
    observer.disconnect();
    if (document.URL.match(/https?:\/\/eclass.yuntech.edu.tw\/course\/[0-9]{1,6}\/content#\//)) {
      makecoursepanel();
    }else if(document.URL.match(/https?:\/\/eclass.yuntech.edu.tw\/course\/[0-9]{1,6}\/learning-activity\/full-screen/) && document.getElementsByClassName("online-video")){
      makevideopanel();
    }
  }

  console.log("%c eclass Util %c https://github.com/phillychi3/loltronclass ", "color: white; background: #e9546b; padding:5px 0;", "padding:4px;border:1px solid #e9546b;");
})();
