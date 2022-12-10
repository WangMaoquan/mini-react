import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { ReactElemetType } from 'shared/ReactTypes';
import { HostRoot, HostComponent, HostText } from './workTags';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
/**
 * 递归 => 递
 * 应该返回子fiber
 */
export const beginWork = (workInProgress: FiberNode) => {
	switch (workInProgress.tag) {
		case HostRoot:
			// 计算状态最新值
			// 创新 子fiberNode
			return updateHostRoot(workInProgress);
		case HostComponent:
			return updateHostComponent(workInProgress);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginwork 暂未实现类型');
			}
	}
	// 暂时直接返回child
	return workInProgress.child;
};

function updateHostRoot(workInProgress: FiberNode) {
	// 计算状态的最新值
	const baseState = workInProgress.memoizedState;
	const updateQueue = workInProgress.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pendding;
	updateQueue.shared.pendding = null;
	const { memoizedState } = processUpdateQueue(baseState, pending);
	workInProgress.memoizedState = memoizedState;

	// 返回子fiberNode
	const nextChild = memoizedState;
	reconcileChildren(workInProgress, nextChild);
	return workInProgress.child;
}

// hostComponent 是不会触发更新的 所以没有计算状态的最新值
function updateHostComponent(workInProgress: FiberNode) {
	const nextProps = workInProgress.pendingProps;
	const nextChild = nextProps.children;
	reconcileChildren(workInProgress, nextChild);
	return workInProgress.child;
}

function reconcileChildren(
	workInProgress: FiberNode,
	children?: ReactElemetType
) {
	const current = workInProgress.alternate;
	if (current !== null) {
		// update
		workInProgress.child = reconcileChildFibers(
			workInProgress,
			current?.child,
			children
		);
	} else {
		// mount
		workInProgress.child = mountChildFibers(workInProgress, null, children);
	}
}
