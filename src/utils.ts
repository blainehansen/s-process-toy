export type Curve = {
	name: string,
	startY: number,
	midX: number,
	midY: number,
	endX: number,
}

export type RenderedCurve = {
	color: string,
	startX: number,
	startY: number,
	midX: number,
	midY: number,
	endX: number,
	endY: number,
	curve: string,
}

export const enum PointType {
	Start,
	Mid,
	End,
}

export function tuple<L extends any[]>(...values: L): L {
	return values as L
}

import { type Ref, watch } from 'vue'

export function refPromise<T>(r: Ref<T>): Promise<NonNullable<T>> {
	let resolver!: (value: NonNullable<T>) => void
	const promise = new Promise<NonNullable<T>>(resolve => { resolver = resolve })

	const unwatch = watch(r, value => {
		if (value === null || value === undefined)
			return
		resolver(value as NonNullable<T>)
		unwatch()
	})
	return promise
}

const colors = ['red', 'green', 'blue', 'orange', 'purple', 'yellow']
const colorsLength = colors.length

export function colorAtIndex(index: number) {
	const colorIndex = index % colorsLength
	return colors[colorIndex]
}


// const spreadsheetId = '1ROl3CHhKfGS55HSelmftcOr2kSgmZJvdwB4b8ktP8hI'
// const data = {
// 	'majorDimension': 'ROWS',
// 	'values': [""].concat(
// 		curves.value.map(({ name, startY, midX, midY, endX }) => t(name, startY, midX, midY, endX))
// 	),
// }
// await fetch(
// 	`/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:E:clear`,
// 	{
// 		method: 'POST',
// 		headers: {
// 			'Authorization': 'Bearer ' + realAccessToken,
// 		},
// 	},
// )

// const response = await fetch(
// 	`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:E?valueInputOption=USER_ENTERED`,
// 	{
// 		method: 'PUT',
// 		headers: {
// 			'Authorization': 'Bearer ' + realAccessToken,
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify(data),
// 	},
// ).then(response => response.json())
// console.log(response)


// async function loadFromSheet() {
// 	(client.value as any).requestAccessToken()
// 	const realAccessToken = await refPromise(accessToken)
// 	const spreadsheetId = '1ROl3CHhKfGS55HSelmftcOr2kSgmZJvdwB4b8ktP8hI'

// 	// https://developers.google.com/sheets/api/guides/migration#v4-api_4
// 	// https://developers.google.com/drive/api/guides/api-specific-auth#OAuth2Authorizing
// 	const response = await fetch(
// 		`https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'`

// 		`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:E`,
// 		{
// 			headers: {
// 				'Authorization': 'Bearer ' + realAccessToken,
// 				// 'Content-Type': 'application/json'
// 			},
// 			// body: JSON.stringify(data),
// 		},
// 	).then(response => response.json())

// 	console.log(response)
// }
