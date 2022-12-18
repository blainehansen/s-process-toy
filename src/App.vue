<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useElementSize, useMouseInElement } from '@vueuse/core'

type Point = { x: number, y: number }
const enum PointType {
	Start,
	Mid,
	End,
}
const start = reactive({ x: 0, y: 0 } as Point)
const mid = reactive({ x: 0, y: 0 } as Point)
const end = reactive({ x: 0, y: 0 } as Point)
const dragTarget = ref(null as PointType | null)

const container = ref(null)
const { width: size } = useElementSize(container)
const { elementX, elementY, isOutside } = useMouseInElement(container)
function translateCoordinate(n: number) {
	return (n / 100) * size.value
}
function setPoints(setStart: Point, setMid: Point, setEnd: Point) {
	start.x = translateCoordinate(setStart.x)
	start.y = translateCoordinate(setStart.y)
	mid.x = translateCoordinate(setMid.x)
	mid.y = translateCoordinate(setMid.y)
	end.x = translateCoordinate(setEnd.x)
	end.y = translateCoordinate(setEnd.y)
}

const unwatchSize = watch(size, newSize => {
	if (newSize === 0) return
	setPoints({ x: 10, y: 50 }, { x: 50, y: 50 }, { x: 90, y: 50 })
	unwatchSize()
})


function drag() {
	if (dragTarget.value === null || isOutside.value) return

	switch (dragTarget.value) {
	case PointType.Start:
		start.x = elementX.value
		start.y = elementY.value
		break
	case PointType.Mid:
		mid.x = elementX.value
		mid.y = elementY.value
		break
	case PointType.End:
		end.x = elementX.value
		end.y = elementY.value
		break
	}
}
function dragHandlers(pointType: PointType) {
	return {
		mousedown() {
			dragTarget.value = pointType
		},
		mouseup() {
			dragTarget.value = null
		},
	}
}


function pointString({ x, y }: Point) {
	return `${x} ${y}`
}
const curve = computed(() => {
	const startString = pointString(start)
	const midString = pointString(mid)
	const endString = pointString(end)

	// 'M50 50 Q0 0, 90 0'
	return `M${startString} L${midString} L${endString}`
})
</script>

<template lang="pug">

#container(ref="container", @mousemove="drag"): svg(viewbox='0 0 100 100')
	path.curve(:d="curve")
	circle#start.ctrl(v-on="dragHandlers(PointType.Start)", :cx="start.x", :cy="start.y", r="0.5vw")
	circle#mid.ctrl(v-on="dragHandlers(PointType.Mid)", :cx="mid.x", :cy="mid.y", r="0.5vw")
	circle#end.ctrl(v-on="dragHandlers(PointType.End)", :cx="end.x", :cy="end.y", r="0.5vw")

</template>

<style>
body { margin: 0; }

#container {
	display: block;
	margin: 0 auto;
	width: 50vw;
	height: 50vw;
}
svg {
	background: dimgrey;
	overflow: hidden;
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
