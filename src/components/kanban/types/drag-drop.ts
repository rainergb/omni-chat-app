export enum DragDropType {
  COLUMN = 'COLUMN',
  TASK = 'TASK',
}

export interface DragResult {
  type: DragDropType;
  sourceId: string;
  destinationId: string;
  sourceIndex: number;
  destinationIndex: number;
  draggedItemId: string;
}
