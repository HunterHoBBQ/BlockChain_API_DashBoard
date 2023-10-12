<script>
	// import json1 from '$lib/swaps_1.json';
	export let data;
	let { posts } = data;

	$: posts1 = [];
	$: jsonData;
	let jsonData = posts;
	let Address = '0xc31e54c7a869b9fcbecc14363cf510d1c41fa443';

	async function fetchData() {
		const res1 = await fetch(
			// 'https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xe2ddd33585b441b9245085588169f35108f85a6e'
			'https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=' + Address
		);
		const contentType = res1.headers.get('content-type');
		if (contentType.includes('text/html')) {
			console.log('Data is HTML');
			return {
				posts1: [] // Replace with appropriate data
			};
		} else {
			const data_1 = await res1.json();
			const nextTimestamp = Number(data_1.data.next);

			const res2 = await fetch(
				'https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=' +
					Address +
					'&ts=${nextTimestamp}&filter=true'
			);
			const data_2 = await res2.json();
			const mergedSwaps = data_1.data.swaps.concat(data_2.data.swaps);
			const uniqueData = mergedSwaps.reduce((uniqueItems, item) => {
				const isDuplicate = uniqueItems.some((existingItem) => existingItem.id === item.id);
				if (!isDuplicate) {
					uniqueItems.push(item);
				}
				return uniqueItems;
			}, []);
			return {
				posts1: uniqueData
			};
		}
	}

	async function updateData() {
		console.log(Address);
		// Address = "";
		posts1 = await fetchData();
		// console.log(posts1);
		jsonData = posts1.posts1;
		// console.log(jsonData);
		console.log('update');
	}
	// const posts = json1.data.swaps;
	// console.log(posts);
	const w = new Date();

	const result = jsonData.reduce((a, c) => ({
		amountToken: a.amountToken + c.amountToken,
		amountETH: a.amountETH + c.amountETH,
		amountRef: a.amountRef + c.amountRef,
		priceETH: a.priceETH + c.priceETH,
		price: a.price + c.price,
		total: a.price * a.amountToken
	}));

	let swaps = []; // Array of swaps data
	let visibleSwaps = 100; // Number of swaps to display initially

	function loadMore() {
		visibleSwaps += 100; // Increase the number of visible swaps
	}
	const j = new Date('2023-12-31');

	// search functionality is here
	let filter = {
		dateFrom: null,
		dateTo: null,
		maker: null,
		type: null
	};

	let totalUsd = 0;
	let totalAmountToken = 0;
	let totalWeth = 0;
	$: filteredData = [];
	const k = j > w;

	function filterData() {
		const dateFrom = filter.dateFrom ? new Date(filter.dateFrom + 'T00:00:00').getTime() : 0;
		const dateTo = filter.dateTo ? new Date(filter.dateTo + 'T23:59:59').getTime() : Infinity;

		if (k) {
			if (filter.maker || filter.type) {
				filteredData = jsonData.filter((swap) => {
					const timestamp = swap.timestamp * 1000;
					const isDateMatch = timestamp >= dateFrom && timestamp <= dateTo;
					const isMakerMatch =
						!filter.maker || swap.maker.toLowerCase().includes(filter.maker.toLowerCase());
					const isTypeMatch = !filter.type || swap.type.toLowerCase() === filter.type.toLowerCase();

					return isDateMatch && isMakerMatch && isTypeMatch;
				});
			} else {
				filteredData = jsonData.filter((swap) => {
					const timestamp = swap.timestamp * 1000;
					const isDateMatch = timestamp >= dateFrom && timestamp <= dateTo;

					return isDateMatch;
				});
			}
		}
		// console.log(JSON.stringify(filteredData));

		totalUsd = 0;
		totalAmountToken = 0;
		totalWeth = 0;

		filteredData.forEach((swap0) => {
			if (swap0.type === 'buy') {
				totalUsd -= swap0.amountToken * swap0.price;
				totalAmountToken += swap0.amountToken;
				totalWeth += swap0.amountETH;
			} else {
				totalUsd += swap0.amountToken * swap0.price;
				totalAmountToken -= swap0.amountToken;
				totalWeth -= swap0.amountETH;
			}
		});
	}

	// expoet csv file
	function exportCSV() {
		let csvContent = 'data:text/csv;charset=utf-8,';
		csvContent +=
			'ID,Date & Time (MY),Type,Price USD,Total USD,Price ETH,Amount Token,Total WETH,Wallet Address\n';

		filteredData.forEach((swap) => {
			csvContent += `${swap.id},"${new Date(swap.timestamp * 1000).toString().slice(3, 25)}",${
				swap.type
			},`;
			csvContent += `${
				// Number(swap.price).toFixed(13)
				swap.price > 1 ? Number(swap.price).toFixed(3) : Number(swap.price).toFixed(9)
			},`;
			csvContent += `${(swap.amountToken * swap.price).toFixed(2)},`;
			csvContent += `${
				// Number(swap.priceETH).toFixed(13)
				swap.priceETH < 0.0000001
					? Number(swap.priceETH).toFixed(13)
					: swap.priceETH > 1.0
					? Number(swap.priceETH).toFixed(3)
					: Number(swap.priceETH).toFixed(6)
			},`;
			csvContent += `${Number(swap.amountToken)},${swap.amountETH.toFixed(5)},${swap.maker}\n`;
		});

		const encodedURI = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedURI);
		link.setAttribute('download', 'export.csv');
		link.style.display = 'none';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		alert('CSV file exported successfully!');
	}
</script>

<center>
	<iframe
		id="dextools-widget"
		title="DEXTools Trading Chart"
		width="800"
		height="400"
		src="https://www.dextools.io/widget-chart/en/arbitrum/pe-light/'{Address}'?theme=light&chartType=2&chartResolution=30&drawingToolbars=false"
	/>
	<!-- <iframe id="dextswap-aggregator-widget"
    title="DEXTswap Aggregator"
    width="400" height="420"
    src="https://www.dextools.io/widget-aggregator/en/swap/arbitrum/0x82af49447d8a07e3bd95bd0d56f35241523fbab1"></iframe> -->
</center>

<h1>Date & Wallet Address Search</h1>
<p>(Remember To Update Data & Change the Address)</p>
Address:<input type="text" bind:value={Address} placeholder="Enter a new address" />
<button class="btn-update" on:click={updateData}>Update Data</button>
<!-- console.log(jsonData); -->
<!-- {JSON.stringify(jsonData)} -->
<!-- {JSON.stringify(jsonData)} -->

<div>
	<label for="dateFrom">Date From:</label>
	<input type="date" bind:value={filter.dateFrom} id="dateFrom" />

	<label for="dateTo">Date To:</label>
	<input type="date" bind:value={filter.dateTo} id="dateTo" />

	<label for="type">Type:</label>
	<select id="type" bind:value={filter.type}>
		<option value={null}>All</option>
		<option value="buy">Buy</option>
		<option value="sell">Sell</option>
	</select>

	<label for="maker">Wallet Address:</label>
	<input type="text" bind:value={filter.maker} id="maker" />

	<button on:click={filterData}>Search Now</button>

	<button on:click={exportCSV}>Export CSV File</button>
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
			<tr>
				<td><strong>Total:</strong></td>
				<td>Date & Time (MY)</td>
				<td>Type</td>
				<th>Price USD</th>
				<td>${totalUsd.toFixed(2)}</td>
				<th>Price ETH</th>
				<td>{totalAmountToken.toLocaleString()}</td>
				<td>{totalWeth.toFixed(5)}</td>
				<th>Wallet Address</th>
			</tr>
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

<center>
	<svg>
		<text x="50%" y="50%" dy=".35em" text-anchor="middle"> Hunter Dashboard </text>
	</svg>
</center>

<!-- <button on:click={downloadFile}>Download JSON</button> -->
<!-- <button on:click={null}>Search</button> -->
<!-- {json3} -->
<!-- {JSON.stringify(json2)} -->
<!-- {JSON.stringify(json2)}
	{JSON.stringify(posts.data.count)} -->
<!-- {data2} -->
<!-- {JSON.stringify(posts)} -->
<table class="table">
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
		<tr>
			<th>Total:</th>
			<th>{Date().slice(4, 24)}</th>
			<th>Buy/Sell</th>
			<th>${result.price.toFixed(13)}</th>
			<th>
				unknown
				<!-- ${result.amountToken * result.price} -->
			</th>
			<th>{result.priceETH.toFixed(13)}</th>
			<th>{Number(result.amountToken).toLocaleString()}</th>
			<th>{result.amountETH}</th>
			<th>Wallet Address</th>
			<!-- <th>Block Number</th>
			<th>Block Hash</th>
			<th>Others</th>
			<th>Log Index</th>
			<th>Fee</th> -->
		</tr>
		{#each jsonData.slice(0, visibleSwaps) as swap, id}
			<tr>
				<td>
					<details>
						<summary>{jsonData.length - id}</summary>
						<p>{swap.id}</p>
					</details>
				</td>
				<td>{new Date(swap.timestamp * 1000).toString().slice(3, 25)}</td>
				{#if swap.type === 'buy'}
					<td style="color:green">
						{swap.type}
					</td>
				{:else}
					<td style="color:red">
						{swap.type}
					</td>
				{/if}

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
							<!-- content here -->
							<summary>{Number(swap.priceETH).toFixed(13).toString().slice(9, 14)}</summary>
							<p>{Number(swap.priceETH).toFixed(13)}</p>
						{:else if swap.priceETH > 0.1}
							<summary>{Number(swap.priceETH).toFixed(3)}</summary>
							<p>{Number(swap.priceETH)}</p>
						{:else}
							<!-- else content here -->
							<summary>{Number(swap.priceETH).toFixed(6)}</summary>
							<!-- <summary>{Number(swap.priceETH).toString().slice(0, 5)}</summary> -->
							<p>{Number(swap.priceETH)}</p>
						{/if}
						<!-- {swap.priceETH} -->
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
				<!-- <td>
					<details>
						<summary>{swap.blockNumber.toString().slice(5, 9)}</summary>
						<p>{swap.blockNumber}</p>
					</details>
				</td>
				<td>
					<details>
						<summary>{swap.blockHash.slice(0, 5)}</summary>
						<p>{swap.blockHash}</p>
					</details>
				</td>
				<td>
					<details>
						<summary />
						<p>{JSON.stringify(swap.others)}</p>
					</details>
				</td>
				<td>{swap.logIndex}</td>
				<td>{swap.fee}</td> -->
			</tr>
		{/each}
	</tbody>
</table>
<center>
	<button class="btn-load" on:click={loadMore}>Load More</button>
</center>
<div class="version">v1.0.2</div>

<style>
	.version {
		/* margin-top: 1000px; */
		/* visibility: hidden; */
		color: #222;
	}
	/* @import url('https://fonts.googleapis.com/css2?family=Sedgwick+Ave+Display&display=swap'); */
	:global(body) {
		background-color: #222;
		color: #fff;
		font-family: 'Popping', 'Roboto', sans-serif;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		text-align: center;
		/* padding: 5%; */
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
	}

	th {
		color: lightgreen;

		font-weight: bold;
		text-align: center;
	}

	svg {
		font-family: 'Sedgwick Ave Display', sans-serif;
		width: 100%;
		height: 100%;
		/* padding: 3%; */
	}
	svg text {
		animation: stroke 5s infinite alternate;
		stroke-width: 2;
		stroke: #a1ff80;
		font-size: 7vw;
	}
	@keyframes stroke {
		0% {
			fill: rgba(223, 255, 52, 0);
			stroke: rgba(161, 255, 128, 1);
			stroke-dashoffset: 25%;
			stroke-dasharray: 0 50%;
			stroke-width: 2;
		}
		70% {
			fill: rgba(223, 255, 52, 0);
			stroke: rgba(161, 255, 128, 1);
		}
		80% {
			fill: rgba(223, 255, 52, 0);
			stroke: rgba(161, 255, 128, 1);
			stroke-width: 3;
		}
		100% {
			fill: rgba(223, 255, 52, 1);
			stroke: rgba(161, 255, 128, 0);
			stroke-dashoffset: -25%;
			stroke-dasharray: 50% 0;
			stroke-width: 0;
		}
	}
	table {
		border-collapse: collapse;
		width: 100%;
		color: #fff;
	}

	th,
	td {
		border: 2px solid #807e7e;
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

	.btn-load {
		padding: 2%;
		margin: 25px auto;
	}
	.btn-load:hover {
		color: yellow;
	}

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

	iframe {
		/* visibility: hidden; */
	}
	.btn-update {
		/* background-color: #807e7e; */
		width: 10vw;
		max-width: 100px;
		height: 5vh;
		max-height: 40px;
		margin: 0.5%;
	}
	.btn-update:hover {
		background-color: #a1ff80;
	}
	button:hover {
		background-color: #a1ff80;
	}
</style>
