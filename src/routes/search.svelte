<script>
	// import json_data from '$lib/swaps_all.json';
	// import json1 from '$lib/swaps_1.json';
	// import json2 from '$lib/swaps_2.json';

	const mergedSwaps = json1.data.swaps.concat(json2.data.swaps);

	const uniqueSwaps = mergedSwaps.reduce((prev, current) => {
		// Check if a swap with this ID has already been processed
		if (!prev[current.id]) {
			// If not, add it to the output and mark it as seen
			prev[current.id] = true;
			prev.push(current);
		}
		return prev;
	}, []);

	let jsonData = uniqueSwaps;

	// testing ground

	let filter = {
		dateFrom: null,
		dateTo: null,
		maker: null
	};

	$: filteredData = [];

	function filterData() {
		const dateFrom = filter.dateFrom ? new Date(filter.dateFrom + 'T00:00:00').getTime() : 0;
		const dateTo = filter.dateTo ? new Date(filter.dateTo + 'T23:59:59').getTime() : Infinity;

		if (filter.maker) {
			filteredData = jsonData.filter((swap) => {
				const timestamp = swap.timestamp * 1000;
				const isDateMatch = timestamp >= dateFrom && timestamp <= dateTo;
				const isMakerMatch = swap.maker.toLowerCase().includes(filter.maker.toLowerCase());

				return isDateMatch && isMakerMatch;
			});
		} else {
			filteredData = jsonData.filter((swap) => {
				const timestamp = swap.timestamp * 1000;
				const isDateMatch = timestamp >= dateFrom && timestamp <= dateTo;

				return isDateMatch;
			});
		}
	}
</script>

<h1>Swaps Search Filter</h1>
<!-- console.log(jsonData); -->
<!-- {JSON.stringify(jsonData)} -->
<!-- {JSON.stringify(jsonData)} -->

<div>
	<label for="dateFrom">Date From:</label>
	<input type="date" bind:value={filter.dateFrom} id="dateFrom" />

	<label for="dateTo">Date To:</label>
	<input type="date" bind:value={filter.dateTo} id="dateTo" />

	<label for="maker">Maker:</label>
	<input type="text" bind:value={filter.maker} id="maker" />

	<button on:click={filterData}>Apply Filter</button>
</div>

{#if filteredData.length === 0}
	<p>No results found.</p>
{:else}
	<table>
		<thead>
			<tr>
				<th>ID:</th>
				<th>Date & Time (MY)</th>
				<th>Type</th>
				<th>Price USD</th>
				<th>Total USD</th>
				<th>Price ETH</th>
				<th>Amount Token</th>
				<th>Total WETH</th>
				<th>Wallet Address</th>
				<!-- <th>Block Number</th>
				<th>Block Hash</th>
				<th>Others</th>
				<th>Log Index</th>
				<th>Fee</th> -->
			</tr>
		</thead>
		<tbody>
			<!-- {#each filteredData as swap, id} -->
			{#each filteredData as swap, id}
				<!-- {#each filteredData.sort((a, b) => b.timestamp - a.timestamp) as swap, id (swap.timestamp)} -->
				<tr class:buy={swap.type === 'buy'} class:sell={swap.type === 'sell'}>
					<td>
						<details>
							<summary>{filteredData.length - id}</summary>
							<p>{swap.id}</p>
						</details>
					</td>
					<td>{new Date(swap.timestamp * 1000).toString().slice(3, 25)}</td>
					<td>
						{swap.type}
					</td>
					<td>
						{#if swap.price > 1}
							${swap.price.toFixed(3)}
						{:else}
							${swap.price.toFixed(9)}
						{/if}
					</td>
					<td>${(swap.amountToken * swap.price).toFixed(2)}</td>
					<td>
						<details>
							{#if swap.priceETH < 0.00000001}
								<summary>{Number(swap.priceETH).toFixed(13).toString().slice(9, 14)}</summary>
								<p>{Number(swap.priceETH).toFixed(13)}</p>
							{:else if swap.priceETH > 0.1}
								<summary>{Number(swap.priceETH).toFixed(3)}</summary>
								<p>{Number(swap.priceETH)}</p>
							{:else}
								<summary>{Number(swap.priceETH).toFixed(6)}</summary>
								<p>{Number(swap.priceETH)}</p>
							{/if}
						</details>
					</td>
					<td>{Number(swap.amountToken).toLocaleString()}</td>
					<td>{swap.amountETH.toFixed(5)}</td>
					<td>
						<details>
							<summary>{swap.maker.slice(34)}</summary>
							<p>{swap.maker}</p>
						</details>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style>
	/* Your dark theme styles here */
	table {
		border-collapse: collapse;
		width: 100%;
		color: #fff;
		text-align: center;
	}

	th,
	td {
		border: 1px solid #444;
		padding: 8px;
	}

	th {
		background-color: #222;
	}

	tr:nth-child(even) {
		background-color: #333;
	}

	tr:hover {
		background-color: #444;
	}
	tr.buy {
		background-color: lightgreen;
		transition: background-color 0.3s;
		/* opacity: 50%; */
	}

	tr.sell {
		background-color: lightcoral;
		transition: background-color 0.3s;
	}

	/* Hover effect for rows */
	tr.buy:hover {
		background-color: green;
	}

	tr.sell:hover {
		background-color: red;
	}

	tr.buy {
		background-color: rgba(144, 238, 144, 0.3);
		transition: background-color 0.3s;
	}

	tr.sell {
		background-color: rgba(240, 128, 128, 0.25);
		transition: background-color 0.3s;
	}
</style>
