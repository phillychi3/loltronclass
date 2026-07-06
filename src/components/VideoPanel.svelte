<script>
	import { onMount } from 'svelte'
	import { tglobal } from '../lib/store.svelte.js'
	import { circle_watch } from '../lib/video.js'

	let watching = $state(false)
	let done = $state(false)

	let percent = $derived(tglobal.processmax > 0 ? (tglobal.process / tglobal.processmax) * 100 : 0)

	async function handleWatch(speed = 1000) {
		if (tglobal.videoispress) return
		watching = true
		done = false
		tglobal.videoispress = true
		await circle_watch(speed)
		watching = false
		done = true
	}

	onMount(() => {
		const hash = window.location.hash.substring(1)
		if (hash.includes('?')) {
			const hashParams = new URLSearchParams(hash.split('?')[1])
			if (hashParams.get('autowatch') === 'true') {
				tglobal.closeonfinish = true
				handleWatch()
			}
		}
	})
</script>

<div class="loltron-panel">
	<div class="loltron-heading">
		<h4>tronclass util</h4>
	</div>
	<div class="loltron-body">
		<div class="loltron-buttons">
			<button class="loltron-btn" onclick={() => handleWatch(1000)} disabled={watching}>
				Watch Video
			</button>
			<button class="loltron-btn" onclick={() => handleWatch(10)} disabled={watching}>
				Watch Video Fast
			</button>
		</div>
		{#if watching}
			<div class="loltron-progress">
				<div class="loltron-progress-bar" style="width: {percent}%"></div>
			</div>
		{/if}
		{#if done}
			<div class="loltron-done">已完成觀看</div>
		{/if}
	</div>
</div>

<style>
	.loltron-panel {
		margin: 20px 0;
		border-radius: 5px;
		padding: 20px;
		background: #fff;
		border: 1px solid #ddd;
	}
	.loltron-heading {
		padding: 10px 0;
	}
	.loltron-heading h4 {
		margin: 0;
	}
	.loltron-body {
		padding: 10px 0;
	}
	.loltron-btn {
		background: #428bca;
		color: white;
		border: none;
		padding: 10px 20px;
		margin: 5px;
		border-radius: 5px;
		cursor: pointer;
		transition: transform 0.1s, background 0.1s;
	}
	.loltron-btn:hover:not(:disabled) {
		background: #3071a9;
		transform: translateY(-2px);
	}
	.loltron-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.loltron-progress {
		margin-top: 16px;
		padding: 6px;
		border-radius: 30px;
		background: rgba(0, 0, 0, 0.25);
		box-shadow:
			inset 0 1px 2px rgba(0, 0, 0, 0.25),
			0 1px rgba(255, 255, 255, 0.08);
	}
	.loltron-progress-bar {
		background-color: #ef416f;
		height: 10px;
		border-radius: 30px;
		transition: width 0.4s ease-out;
	}
	.loltron-done {
		margin-top: 10px;
		color: #5cb85c;
		font-weight: bold;
	}
</style>
