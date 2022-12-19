<template lang="pug">

#top
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

	br
	br
	br
	.box
		input(v-model="newName", @keydown.enter="addCurve", placeholder="curve name")
		br
		button(@click="addCurve", :disabled="!newName.length") add new curve

</template>


<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useElementSize, useMouseInElement, useEventListener } from '@vueuse/core'

import CurveComponent from '@/Curve.vue'
import { PointType } from '@/utils'
import type { Curve, RenderedCurve } from '@/utils'

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

	return { color, startX, startY, midX, midY, endX, endY: endY.value }
}))

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

	overflow: hidden;
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
	text-align: center;
}

</style>
