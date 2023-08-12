declare module 'point-in-triangle' {
  type Point = [x: number, y: number]

  type Triangle = [p1: Point, p2: Point, p3: Point]

  export default function inside(point: Point, triangle: Triangle): boolean
}
