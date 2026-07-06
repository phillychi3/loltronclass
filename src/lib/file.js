import { tglobal } from './store.svelte.js'

export function watchthefile() {
	return new Promise((resolve) => {
		const activity_id = document.URL.split('/').splice(-1).toString()
		const course = globalData.course

		fetch(`https://eclass.yuntech.edu.tw/api/activities/${activity_id}?sub_course_id=0`, {
			headers: {
				Origin: 'https://eclass.yuntech.edu.tw',
				Referer: `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
				'Content-Type': 'application/json;charset=UTF-8'
			},
			cookie: document.cookie
		})
			.then((response) => response.json())
			.then((data) => {
				tglobal.processmax = data.uploads.length
				tglobal.process = 0
				data.uploads.forEach((element) => {
					fetch(`https://eclass.yuntech.edu.tw/api/course/activities-read/${data.id}`, {
						method: 'POST',
						headers: {
							Origin: 'https://eclass.yuntech.edu.tw',
							Referer: `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
							'Content-Type': 'application/json;charset=UTF-8'
						},
						cookie: document.cookie,
						body: JSON.stringify({ upload_id: element.reference_id })
					}).then((response) => response.json())
					tglobal.process += 1
				})
				tglobal.videoispress = false
				resolve()
			})
	})
}
