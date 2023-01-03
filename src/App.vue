<template lang="pug">

#top
	.box(class="text-base prose prose-slate xl:text-xl")
		h1
			| S-process toy
			br
			| (by&nbsp;
			a(href="https://github.com/blainehansen/s-process-toy/") Blaine Hansen
			| )

		p
			| Read the description below to understand what this project is
			br
			| and all the ways it is&nbsp;
			i unfinished
			|.

	#container(ref="container", class="w-[70vw] h-[70vw] lg:w-[40vw] lg:h-[40vw] xl:w-[30vw] xl:h-[30vw]"): svg(viewbox='0 0 100 100')
		CurveComponent(
			v-for="(renderedCurve, index) in renderedCurves",
			@selectCurve="type => selectCurve(index, type)",
			:index="index",
			:renderedCurve="renderedCurve",
		)

	.box: button(@click="curvyMode = !curvyMode") "curvy" mode {{ curvyMode ? "on" : "off" }}

	.box(v-for="(curve, index) in curves")
		p(:style="{ color: colorAtIndex(index) }")
			b {{ curve.name }}:
			br
			| start={{ curve.startY.toFixed(2) }},&nbsp;
			| mid={ x:{{ curve.midX.toFixed(2) }}, y:{{ curve.midY.toFixed(2) }} },&nbsp;
			| end={{ curve.endX.toFixed(2) }}
		button(v-if="curves.length > 1", @click="removeCurve(index)") remove curve

	.box
		input(v-model="newName", @keydown.enter="addCurve", placeholder="new curve name")
		br
		button(@click="addCurve", :disabled="!newName.length") add curve

	.box
		button(@click="saveToSheet", :disabled="client === null") save to Google Sheets

	.box(class="text-base prose prose-slate xl:text-xl text-left"): Description

</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useElementSize, useMouseInElement, useEventListener } from '@vueuse/core'
import CurveComponent from './Curve.vue'
import Description from './Description.md'

import { PointType, type Curve, type RenderedCurve, colorAtIndex } from './utils'
import { useSheets } from './sheets'

const container = ref<HTMLDivElement>()
const { width, height } = useElementSize(container)
const size = computed(() => Math.min(width.value, height.value))
const curvyMode = ref(false)

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
const curves = ref([{ name: "my first curve", ...defaultCurve}] as Curve[])
const { client, saveToSheet } = useSheets(curves)

const newName = ref('')
function addCurve() {
	if (newName.value.length === 0) return
	curves.value.push({ name: newName.value, ...defaultCurve })
	newName.value = ''
}
function removeCurve(index: number) {
	curves.value.splice(index, 1)
}

const renderedCurves = computed(() => curves.value.map((curve, index): RenderedCurve => {
	const color = colorAtIndex(index)

	const startY = translate(curve.startY)
	const midX = translate(curve.midX)
	const midY = translate(curve.midY)
	const endX = translate(curve.endX)

	return {
		color, startX, startY, midX, midY, endX, endY: endY.value,
		// https://math.stackexchange.com/questions/3978437/is-it-possible-to-find-the-control-points-of-a-quadratic-bezier-curve-given-the
		curve: curvyMode.value
			? `M${startX} ${startY} Q${midX} ${midY}, ${endX} ${endY.value}`
			: `M${startX} ${startY} L${midX} ${midY} L${endX} ${endY.value}`,
	}
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
useEventListener(window, 'touchmove', drag)
useEventListener(window, 'touchend', release)
</script>

<style>
body {
	margin: 0;
}

#top {
	padding-left: 1rem;
	padding-right: 1rem;
}
#container {
	display: block;
	margin: auto;
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
