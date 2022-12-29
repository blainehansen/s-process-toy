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
