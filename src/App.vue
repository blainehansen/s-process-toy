<template lang="pug">

#top
	h1.box
		| S-process toy (by&nbsp;
		a(href="https://github.com/blainehansen/s-process-toy/") Blaine Hansen
		| )

	.box
		a(href="https://github.com/blainehansen/s-process-toy/blob/main/description.md") Check out this project's description to understand what it is and all the ways it is unfinished.

	#container(ref="container"): svg(viewbox='0 0 100 100')
		CurveComponent(
			v-for="(renderedCurve, index) in renderedCurves",
			@selectCurve="type => selectCurve(index, type)",
			:index="index",
			:renderedCurve="renderedCurve",
		)

	.box(v-for="(curve, index) in curves")
		p(:style="{ color: colorAtIndex(index) }")
			| {{ curve.name }}:&nbsp;
			| start={{ curve.startY.toFixed(2) }},&nbsp;
			| mid={ x:{{ curve.midX.toFixed(2) }}, y:{{ curve.midY.toFixed(2) }} },&nbsp;
			| end={{ curve.endX.toFixed(2) }}
		button(@click="removeCurve(index)") remove curve

	.box
		input(v-model="newName", @keydown.enter="addCurve", placeholder="curve name")
		br
		button(@click="addCurve", :disabled="!newName.length") add new curve

	.box
		//- button(@click="loadFromSheet", :disabled="client === null") load from google sheets
		button(@click="saveToSheet", :disabled="client === null") save to Google Sheets

</template>


<script setup lang="ts">
import { type Ref, ref, reactive, watch, computed, onMounted } from 'vue'
import { useElementSize, useMouseInElement, useEventListener } from '@vueuse/core'

import CurveComponent from '@/Curve.vue'
import { PointType, type Curve, type RenderedCurve, tuple as t } from '@/utils'

const container = ref<HTMLDivElement>()
const { width, height } = useElementSize(container)
const size = computed(() => Math.min(width.value, height.value))

function translate(n: number) {
	return (n / 100) * size.value
}

const startX = 0
const endY = computed(() => translate(100))

const defaultCurve = {
	startY: 10,
	midX: 50,
	midY: 50,
	endX: 90,
}
const curves = ref([{ name: "first curve", ...defaultCurve}] as Curve[])

const newName = ref('')
function addCurve() {
	curves.value.push({ name: newName.value, ...defaultCurve })
	newName.value = ''
}
function removeCurve(index: number) {
	curves.value.splice(index, 1)
}

const colors = ['red', 'green', 'blue', 'orange', 'purple', 'yellow']
const colorsLength = colors.length

function colorAtIndex(index: number) {
	const colorIndex = index % colorsLength
	return colors[colorIndex]
}


const renderedCurves = computed(() => curves.value.map((curve, index): RenderedCurve => {
	const color = colorAtIndex(index)

	const startY = translate(curve.startY)
	const midX = translate(curve.midX)
	const midY = translate(curve.midY)
	const endX = translate(curve.endX)

	// https://math.stackexchange.com/questions/3978437/is-it-possible-to-find-the-control-points-of-a-quadratic-bezier-curve-given-the
	return {
		color, startX, startY, midX, midY, endX, endY: endY.value,
		curve: `M${startX} ${startY} Q${midX} ${midY}, ${endX} ${endY.value}`,
	}
}))



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

function refPromise<T>(r: Ref<T>): Promise<NonNullable<T>> {
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
}


const { elementX, elementY } = useMouseInElement(container)

const dragTarget = ref(null as [number, PointType] | null)

function drag() {
	if (dragTarget.value === null) return

	const [index, type] = dragTarget.value
	const curve = curves.value[index]
	if (curve === undefined)
		throw new Error(`no curve at index ${index}`)

	const pointX = (elementX.value / size.value) * 100
	const pointY = (elementY.value / size.value) * 100

	switch (type) {
	case PointType.Start:
		// min <= startY <= midY
		curve.startY = Math.max(Math.min(pointY, curve.midY), 0)
		break
	case PointType.Mid:
		// min <= midX <= endX
		curve.midX = Math.max(Math.min(pointX, curve.endX), 0)
		// startY <= midY <= max
		curve.midY = Math.min(Math.max(pointY, curve.startY), 100)
		break
	case PointType.End:
		// endX <= midX <= max
		curve.endX = Math.min(Math.max(pointX, curve.midX), 100)
		break
	}
}
function release() {
	dragTarget.value = null
}
function selectCurve(index: number, type: PointType) {
	dragTarget.value = [index, type]
}

useEventListener(window, 'mousemove', drag)
useEventListener(window, 'mouseup', release)
</script>

<style>
body { margin: 0; }

#top {
	display: block;
	margin: auto;

	overflow-x: hidden;
	width: 100%;
	height: 100vh;
}
#container {
	display: block;
	margin: auto;
	width: 30vw;
	height: 30vw;
	margin-top: 50px;
	margin-bottom: 50px;
}
svg {
	display: block;
	background: lightgrey;
	width: 100%;
	height: 100%;
}
.curve {
	fill: none;
	stroke-width: 3;
	stroke-opacity: 0.8;
}
.point {
	cursor: pointer;
	stroke-width: 2;
	fill-opacity: 0.5;
	stroke-opacity: 0.8;
}
.box {
	display: block;
	margin: auto;
	margin-top: 2rem;
	text-align: center;
}
h1.box {
	margin-top: 0;
}

</style>
