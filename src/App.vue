<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useElementSize, useMouseInElement } from '@vueuse/core'

type Point = { x: number, y: number }
const enum PointType {
	Start,
	Mid,
	End,
}
const startY = ref(0)
const mid = reactive({ x: 0, y: 0 } as Point)
const endX = ref(0)
const dragTarget = ref(null as PointType | null)

const container = ref(null)
const { width: size } = useElementSize(container)
const { elementX, elementY, isOutside } = useMouseInElement(container)
function translateCoordinate(n: number) {
	return (n / 100) * size.value
}
function setPoints(newStart: number, newMid: Point, newEnd: number) {
	startY.value = translateCoordinate(newStart)
	mid.x = translateCoordinate(newMid.x)
	mid.y = translateCoordinate(newMid.y)
	endX.value = translateCoordinate(newEnd)
}

const unwatchSize = watch(size, newSize => {
	if (newSize === 0) return
	setPoints(10, { x: 50, y: 50 }, 90)
	unwatchSize()
})


function drag() {
	if (dragTarget.value === null) return

	switch (dragTarget.value) {
	case PointType.Start:
		startY.value = Math.min(elementY.value, mid.y)
		break
	case PointType.Mid:
		if (isOutside.value) return
		mid.x = Math.min(elementX.value, endX.value)
		mid.y = Math.max(elementY.value, startY.value)
		break
	case PointType.End:
		endX.value = Math.max(elementX.value, mid.x)
		break
	}
}
function release() {
	dragTarget.value = null
}
function begin(pointType: PointType) {
	dragTarget.value = pointType
}


const startX = 0
const endY = computed(() => translateCoordinate(100))

function pointString({ x, y }: Point) {
	return `${x} ${y}`
}
const curve = computed(() => {
	const startString = pointString({ x: startX, y: startY.value })
	const midString = pointString(mid)
	const endString = pointString({ x: endX.value, y: endY.value })

	// 'M50 50 Q0 0, 90 0'
	return `M${startString} L${midString} L${endString}`
})
</script>

<template lang="pug">

#top(@mousemove="drag", @mouseup="release"): #container(ref="container"): svg(viewbox='0 0 100 100')
	path.curve(:d="curve")
	circle#start.ctrl(@mousedown="begin(PointType.Start)", :cx="startX", :cy="startY", r="0.5vw")
	circle#mid.ctrl(@mousedown="begin(PointType.Mid)", :cx="mid.x", :cy="mid.y", r="0.5vw")
	circle#end.ctrl(@mousedown="begin(PointType.End)", :cx="endX", :cy="endY", r="0.5vw")

</template>

<style>
body { margin: 0; }

#top {
	overflow: hidden;
	width: 100%;
	height: 100vh;
}
#container {
	display: block;
	margin: auto;
	width: 50vw;
	height: 50vw;
}
svg {
	display: block;
	background: dimgrey;
	width: 100%;
	height: 100%;
}
.curve {
	fill: none;
	stroke: black;
	stroke-width: 3;
}
.ctrl {
	cursor: pointer;
	fill: white;
	stroke: white;
	stroke-width: 2
}


</style>
