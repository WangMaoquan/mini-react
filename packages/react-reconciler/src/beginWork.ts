import { FiberNode } from './fiber';
/**
 * 递归 => 递
 * 应该返回子fiber
 */
export const beginWork = (fiber: FiberNode) => {
	// 暂时直接返回child
	return fiber.child;
};
