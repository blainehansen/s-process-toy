import { ref, type Ref, onMounted } from 'vue'

import { type Curve, refPromise } from './utils'

export function useSheets(curves: Ref<Curve[]>) {
	const accessToken = ref(null as null | string)
	const client = ref(null as null | unknown)

	function initialize() {
		const scriptTag = document.createElement('script')
		scriptTag.src = 'https://accounts.google.com/gsi/client'
		scriptTag.async = true
		scriptTag.defer = true
		scriptTag.onload = () => {
			client.value = (window as any).google.accounts.oauth2.initTokenClient({
				client_id: '192502375938-c06iprnuf2la46a34eut874bauqbbdi4.apps.googleusercontent.com',
				scope: 'https://www.googleapis.com/auth/spreadsheets',
				callback: (tokenResponse: { access_token: string }) => {
					accessToken.value = tokenResponse.access_token
				},
			})
		}
		scriptTag.onerror = () => {
			console.error('failed to load gsi client')
		}
		document.head.appendChild(scriptTag)
	}
	onMounted(initialize)

	type Row = [object, object, object, object, object]
	type RowData = { values: Row }

	const header: Row = [
		{ 'userEnteredValue': { 'stringValue': 'curve name' } },
		{ 'userEnteredValue': { 'stringValue': 'startY' } },
		{ 'userEnteredValue': { 'stringValue': 'midX' } },
		{ 'userEnteredValue': { 'stringValue': 'midY' } },
		{ 'userEnteredValue': { 'stringValue': 'endX' } },
	]

	function formatData(): RowData[] {
		const formattedCurves = curves.value.map(({ name, startY, midX, midY, endX }): RowData => ({ 'values': [
			{ 'userEnteredValue': { 'stringValue': name } },
			{ 'userEnteredValue': { 'numberValue': startY } },
			{ 'userEnteredValue': { 'numberValue': midX } },
			{ 'userEnteredValue': { 'numberValue': midY } },
			{ 'userEnteredValue': { 'numberValue': endX } },
		] }))

		return [{ 'values': header }].concat(formattedCurves)
	}

	async function saveToSheet() {
		const spreadsheetName = window.prompt('New spreadsheet name')
		if (spreadsheetName === null)
			return
		if (spreadsheetName === '') {
			window.alert("name can't be empty!")
			return
		}

		const realAccessToken = await (async () => {
			if (accessToken.value !== null) return accessToken.value
			;(client.value as any).requestAccessToken()
			return await refPromise(accessToken)
		})()

		const response = await fetch(
			`https://sheets.googleapis.com/v4/spreadsheets`,
			{
				method: 'POST',
				headers: {
					'Authorization': 'Bearer ' + realAccessToken,
				},
				body: JSON.stringify({
					'properties': { 'title': spreadsheetName },
					'sheets': [{ 'data': [{
						'startRow': 0,
						'startColumn': 0,
						'rowData': formatData(),
					}] }],
				}),
			},
		)
		if (!response.ok) {
			window.alert("Something went wrong?")
			console.error(response)
			return
		}
		const { spreadsheetUrl } = await response.json()
		window.alert(`Saved to spreadsheet: ${spreadsheetUrl}`)
		// await revokeToken()
	}
	// async function revokeToken() {
	// 	return new Promise<void>(resolve => {
	// 		(window as any).google.accounts.oauth2.revoke(accessToken.value, () => {
	// 			accessToken.value = null
	// 			resolve()
	// 		})
	// 	})
	// }

	return { client, saveToSheet }
}
