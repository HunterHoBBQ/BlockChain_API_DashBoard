<script>
	import json1 from '$lib/swaps_1.json';
	import json2 from '$lib/swaps_2.json';
	// const apidata = "https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xe2ddd33585b441b9245085588169f35108f85a6e&filter=true"

	const mergedSwaps = json1.data.swaps.concat(json2.data.swaps);
	// const mergedJSON = Object.assign({}, json1, json2);
</script>

<main>
	<h1>Merged Swaps</h1>
	{JSON.stringify(mergedSwaps)}
	<!-- 
	{#each mergedSwaps as swap, id}
		<div>
			<p>ID: {id} {swap.id}</p>
		</div>
	{/each} -->
</main>
