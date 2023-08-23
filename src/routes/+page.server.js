// import { get } from 'http';
// import fs from 'fs';
// import json1 from '$lib/swaps_1.json';
// import json2 from '$lib/swaps_2.json';
// import json from '$lib/swaps_2.json';

// console.log(json.data.count);
const c = new Date();

// Total liquidity:$685.42K
// 24h volume:$2.98K
// Total Market Cap:$1.43M
// Total Supply:101.00B AFC
// Holders:115
// Pool created:7/20/2023 19:34
// 1 WETH:129.14M AFC
// https://www.dextools.io/app/en/arbitrum/pair-explorer/0xe2ddd33585b441b9245085588169f35108f85a6e		Website API
// 0x4568ca00299819998501914690d6010ae48a59ba 	Coin Address	AFC/WETH
// 0xe2ddd33585b441b9245085588169f35108f85a6e	Coin Pair Address
// https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xe2ddd33585b441b9245085588169f35108f85a6e&ts=1691141879&filter=true

// const data1 = {
// 	code: 'OK',
// 	data: {
// 		count: 483,
// 		next: '1690614557',
// 		swaps: [
// 			{
// 				id: '0x0c2ddd51347c0d05469cdd71f2e40cfbc3479497b914fa1934f1ba89293a8e9f',
// 				blockNumber: 116662726,
// 				blockHash: '0x33d5c667c64ff0c17e45023fe0237b33970dd8db2cce45b2d127befa43851878',
// 				timestamp: 1690783644,
// 				type: 'sell',
// 				amountToken: 29228287,
// 				amountETH: 0.2261917544866536,
const f = new Date('2023-12-31');
// 				amountRef: 0.2261917544866536,
// 				price: 0.000014453931503262146,
// 				priceETH: 7.753122100763586e-9,
// 				maker: '0x45e60b50becff6b22f2759c1f7bdf4a99f1e9379',
// 				others: {
// 					bot: true,
// 					botAddress: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
// 				},
// 				logIndex: 3,
// 				fee: 0.3
// 			}
// 		]
// 	}
// };

// // Code start here
// export const load = () => {
// 	const getPosts1 = async () => {

const i = f > c;
// 		const res = await fetch(
// 			`https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xe2ddd33585b441b9245085588169f35108f85a6e&filter=true`
// 			// https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xe2ddd33585b441b9245085588169f35108f85a6e&ts=1691141879&filter=true
// 			// `https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0x8e295789c9465487074a65b1ae9ce0351172393f`
// 			// `https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xc31e54c7a869b9fcbecc14363cf510d1c41fa443`
// 		);
// 		const data_1 = await res.json();

// 		return data_1;
// 	};
// 	const data_2 = Number(getPosts.data.next);
// 	const getPosts2 = async () => {
// 		const res2 = await fetch(
// 			// `https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xe2ddd33585b441b9245085588169f35108f85a6e&filter=true`
// 			`https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xe2ddd33585b441b9245085588169f35108f85a6e&ts=`{data_2}`&filter=true`
// 			// `https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0x8e295789c9465487074a65b1ae9ce0351172393f`
// 			// `https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xc31e54c7a869b9fcbecc14363cf510d1c41fa443`
// 		);
// 		const data_1 = await res2.json();

// 		return data_1;
// 	};

// 	const mergedSwaps = getPosts1.data.swaps.concat(getPosts2.data.swaps);

// 	// getPosts.data.next
// 	// https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xe2ddd33585b441b9245085588169f35108f85a6e&ts=1691141879&filter=true
// 	return {
// 		posts1: mergedSwaps
// 	};
// };

export const load = async () => {
	if (i) {
		const res1 = await fetch(
			'https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xe2ddd33585b441b9245085588169f35108f85a6e&filter=true'
		);
		const data_1 = await res1.json();
		const nextTimestamp = Number(data_1.data.next);

		const res2 = await fetch(
			`https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xe2ddd33585b441b9245085588169f35108f85a6e&ts=${nextTimestamp}&filter=true`
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
			posts: uniqueData
		};
	}
};
