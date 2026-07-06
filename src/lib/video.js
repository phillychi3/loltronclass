import { tglobal } from './store.svelte.js'

function extractVideoId(url) {
	try {
		const parsedUrl = new URL(url)
		return parsedUrl.searchParams.get('v') || parsedUrl.pathname.split('/').pop()
	} catch (error) {
		console.error('獲取影片ID出錯:', error)
		return null
	}
}

async function get_youtube_length() {
	const iframe = document.querySelector('iframe[src*="youtube.com"]')
	if (!iframe) throw new Error('No YouTube iframe')
	const videoId = extractVideoId(iframe.src)
	if (!videoId) throw new Error('無法獲取影片ID')
	console.log('找到影片ID:', videoId)
	const apifetch = await fetch(
		'https://youtube_videotime_worker.phillychi3.workers.dev/api/video?url=' + videoId,
		{ mode: 'no-cors' }
	)
	if (!apifetch.ok) throw new Error('API錯誤: ' + apifetch.status)
	const apidata = await apifetch.json()
	return apidata.length
}

function watchthevideo(start, end, videodata) {
	start = Math.floor(start)
	end = Math.floor(end)
	const duration = end - start
	const student = globalData.user
	const course = globalData.course
	const dep = globalData.dept

	fetch(`https://eclass.yuntech.edu.tw/api/course/activities-read/${videodata.id}`, {
		method: 'POST',
		headers: {
			Origin: 'https://eclass.yuntech.edu.tw',
			Referer: `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
			'Content-Type': 'application/json;charset=UTF-8'
		},
		body: JSON.stringify({ start, end }),
		cookie: document.cookie
	}).then((response) => response.json())

	fetch('https://eclass.yuntech.edu.tw/statistics/api/online-videos', {
		method: 'POST',
		headers: {
			Connection: 'keep-alive',
			Origin: 'https://eclass.yuntech.edu.tw',
			Referer: `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
			'Content-Type': 'text/plain;charset=UTF-8'
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
			forum_type: '',
			action_type: 'play',
			is_teacher: false,
			is_student: true,
			ts: Date.now(),
			user_agent: 'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
			meeting_type: 'online_video',
			start_at: start,
			end_at: end,
			duration,
			master_course_id: 0,
			org_name: student.orgName,
			user_no: student.userNo,
			user_name: student.name,
			course_code: course.courseCode,
			course_name: course.name,
			dep_id: dep.id,
			dep_name: dep.name,
			dep_code: dep.code
		})
	}).then((response) => {
		if (response.ok) {
			console.log('success')
		} else {
			console.log(response.status)
		}
	})
}

export function circle_watch(fast = 1000) {
	return new Promise((resolve, reject) => {
		;(async () => {
			const video = document.querySelector('video')
			let max

			if (document.getElementById('player')) {
				try {
					max = await get_youtube_length()
				} catch (e) {
					console.error(e)
					max = 10000
				}
			} else if (video) {
				max = video.duration
			} else {
				setTimeout(() => {
					circle_watch(fast).then(resolve).catch(reject)
				}, 1000)
				console.error('video not found')
				return
			}

			max = Math.floor(max)
			const maxrun = 60
			const thisvideoid = document.URL.split('/').splice(-1).toString()
			tglobal.processmax = max

			try {
				const response = await fetch(
					`https://eclass.yuntech.edu.tw/api/activities/${thisvideoid}`,
					{
						method: 'GET',
						headers: { 'Content-Type': 'application/json' },
						cookie: document.cookie
					}
				)
				const data = await response.json()

				let ct = 0
				for (let i = 0; i < max; i += maxrun) {
					ct++
					setTimeout(() => {
						watchthevideo(i, i + maxrun, data)
						tglobal.process = i + maxrun
						if (max - i < maxrun) {
							watchthevideo(i, max, data)
							tglobal.process = max
							tglobal.videoispress = false
							if (tglobal.closeonfinish) window.close()
							resolve()
						}
					}, fast * ct)
				}
			} catch (e) {
				console.error(e)
				reject(e)
			}
		})()
	})
}
