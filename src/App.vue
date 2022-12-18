<script setup lang="ts">
import { onMounted } from 'vue'
import Konva from 'konva'

onMounted(() => {
	const stage = new Konva.Stage({
		container: 'container',
		width: window.innerWidth,
		height: window.innerHeight,
	})

	// add canvas element
	const layer = new Konva.Layer()
	stage.add(layer)

	// create shape
	const box = new Konva.Rect({
		x: 50,
		y: 50,
		width: 100,
		height: 50,
		fill: '#00D2FF',
		stroke: 'black',
		strokeWidth: 4,
		draggable: true,
	})
	layer.add(box)

	// add cursor styling
	box.on('mouseover', function () {
		document.body.style.cursor = 'pointer'
	})
	box.on('mouseout', function () {
		document.body.style.cursor = 'default'
	})
})


</script>

<template lang="pug">

#container

</template>
