import { Placement } from './fiberFlags';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { ReactElemetType } from 'shared/ReactTypes';
import { createFiberFromElement, FiberNode } from './fiber';
import { HostText } from './workTags';
function ChildReconciler(shouldTrackEffect: boolean) {
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElemetType
	) {
		// 根据element 创建fiber
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}
	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}
	function placeSingleChild(fiber: FiberNode) {
		// 首屏渲染
		if (shouldTrackEffect && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}

	return function (
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElemetType | string | number
	) {
		// 判断类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);
				default:
					if (__DEV__) {
						console.warn('暂未实现的类型', newChild);
					}
			}
		}

		// hostText
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}

		return null;
	};
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
