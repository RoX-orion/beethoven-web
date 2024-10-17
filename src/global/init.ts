import { getAppConfig } from "@/api/config";

export async function initConfig() {
	getAppConfig().then(response => {

	});
}
