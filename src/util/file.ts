export function sizeFormater(bytes?: number) {
	if (!bytes) {
		return '未知';
	}
	if (bytes < 1024) {
		return bytes + 'B';
	}
	let remainder = bytes & 1023;
	bytes = bytes >> 10;
	if (bytes < 1024) {
		return bytes + '.' + (remainder >> 10) + 'Kb';
	}
	remainder = bytes & 1023;
	bytes = bytes >> 10;
	if (bytes < 1024) {
		return bytes + '.' + (remainder >> 10) + 'Mb';
	}
	remainder = bytes & 1023;
	bytes = bytes >> 10;
	return bytes + '.' + (remainder >> 10) + 'Gb';
}

export function getBase64(file: File) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}
