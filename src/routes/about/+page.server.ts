import QRCode from 'qrcode';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const qrSvg = await QRCode.toString('https://greatai.dev/about', {
		type: 'svg',
		margin: 1,
		color: {
			dark: '#27ca40',
			light: '#00000000'
		}
	});

	return { qrSvg };
};
