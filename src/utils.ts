export type Curve = {
	startY: number,
	midX: number,
	midY: number,
	endX: number,
}

export type RenderedCurve = {
	startX: number,
	startY: number,
	midX: number,
	midY: number,
	endX: number,
	endY: number,
}

export const enum PointType {
	Start,
	Mid,
	End,
}
