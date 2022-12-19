<template lang="pug">

g
	path.curve(:d="curve", :stroke="props.renderedCurve.color")
	circle#start.point(
		@mousedown="emit('selectCurve', PointType.Start)", :cx="props.renderedCurve.startX", :cy="props.renderedCurve.startY",
		r="0.5vw", :stroke="props.renderedCurve.color", :fill="props.renderedCurve.color",
	)
	circle#mid.point(
		@mousedown="emit('selectCurve', PointType.Mid)", :cx="props.renderedCurve.midX", :cy="props.renderedCurve.midY",
		r="0.5vw", :stroke="props.renderedCurve.color", :fill="props.renderedCurve.color",
	)
	circle#end.point(
		@mousedown="emit('selectCurve', PointType.End)", :cx="props.renderedCurve.endX", :cy="props.renderedCurve.endY",
		r="0.5vw", :stroke="props.renderedCurve.color", :fill="props.renderedCurve.color",
	)

</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { PointType } from '@/utils'
import type { RenderedCurve } from '@/utils'

const props = defineProps<{
  renderedCurve: RenderedCurve,
}>()

const emit = defineEmits<{
	(e: 'selectCurve', type: PointType): void,
}>()

const curve = computed(() => {
	const { startX, startY, midX, midY, endX, endY } = props.renderedCurve
	return `M${startX} ${startY} Q${midX} ${midY}, ${endX} ${endY}`
})
</script>
