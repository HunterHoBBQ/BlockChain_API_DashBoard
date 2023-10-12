import json1 from '$lib/swaps_1.json';

export const load = async () => {
	const res1 = await fetch(
		'https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xc31e54c7a869b9fcbecc14363cf510d1c41fa443&filter=true'
	);
	const contentType = res1.headers.get('content-type');
	// console.log(contentType);
	if (contentType.includes('text/html')) {
		console.log('====================================');
		console.log('html');
		console.log('====================================');
		return {
			posts: json1.data.swaps
		};
	} else {
		const data_1 = await res1.json();
		const nextTimestamp = Number(data_1.data.next);

		const res2 = await fetch(
			`https://www.dextools.io/shared/data/swaps?chain=arbitrum&pair=0xc31e54c7a869b9fcbecc14363cf510d1c41fa443&ts=${nextTimestamp}&filter=true`
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
