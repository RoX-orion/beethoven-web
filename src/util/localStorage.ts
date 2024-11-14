export function saveData(key: string, value: any) {
	localStorage.setItem(key, value);
}

export function getData(key: string)  {
	return localStorage.getItem(key);
}

export function deleteData(key: string) {
	return localStorage.removeItem(key);
}
