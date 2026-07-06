<script>
	import { onMount } from 'svelte'
	import { tglobal } from '../lib/store.svelte.js'
	import { watchthefile } from '../lib/file.js'

	let watching = $state(false)
	let done = $state(false)

	let percent = $derived(tglobal.processmax > 0 ? (tglobal.process / tglobal.processmax) * 100 : 0)

	async function handleReadFiles() {
		if (tglobal.videoispress) return
		watching = true
		done = false
		tglobal.videoispress = true
		await watchthefile()
		watching = false
		done = true
	}

	onMount(() => {
		const hash = window.location.hash.substring(1)
		if (hash.includes('?')) {
			const hashParams = new URLSearchParams(hash.split('?')[1])
			if (hashParams.get('autowatch') === 'true') {
				tglobal.closeonfinish = true
				handleReadFiles()
			}
		}
	})
</script>

<div class="loltron-file-panel">
	<div class="loltron-heading">
		<h4>tronclass util</h4>
	</div>
	<div class="loltron-body">
		<div class="loltron-buttons">
			<button class="loltron-btn" onclick={handleReadFiles} disabled={watching}>
				Read All Files
			</button>
		</div>
		{#if watching}
			<div class="loltron-progress">
				<div class="loltron-progress-bar" style="width: {percent}%"></div>
			</div>
		{/if}
		{#if done}
			<div class="loltron-done">已完成讀取</div>
		{/if}
	</div>
</div>

<style>
	.loltron-file-panel {
		padding: 20px;
		margin-top: -40px;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 5px;
	}
	.loltron-heading {
		padding: 0;
	}
	.loltron-heading h4 {
		margin: 0;
		padding: 10px 0;
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
	}
	.loltron-btn:hover:not(:disabled) {
		background: #3071a9;
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
