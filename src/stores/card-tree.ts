import { atom } from 'nanostores';
import type { CardTreeNode } from '../lib/card-tree';

export const $cardTreeData = atom<CardTreeNode | null>(null);

export function setCardTreeData(data: CardTreeNode): void {
  $cardTreeData.set(data);
}

export function clearCardTreeData(): void {
  $cardTreeData.set(null);
}
