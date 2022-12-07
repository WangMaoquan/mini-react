import { FiberNode } from './fiber';

/**
 * 递归 => 归
 */
export const completeWork = (fiber: FiberNode) => {
	console.log(fiber);
};
