import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';

// 保存当前遍历到的fiber 节点
let workInProgress: FiberNode | null = null;

//
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// react 的更新一定是从fiberRootNode 开始的, 这里的fiber 可能是fiberRootNode 也可能是 组件的fiberNode
	// 所以我们需要 从传入的fiber 遍历到 fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = fiber.return;

	// 只有hostRootFiber 与 FiberRootNode 之间用的 currnet / stateNode 关联
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	// 跳出循环还需要判断下 tag
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			workInProgress = null;
			if (__DEV__) {
				console.warn('workloop 发生错误', e);
			}
		}
	} while (true);
}

/**
 * 递归fiber 的方法
 */
function workLoop() {
	while (workInProgress !== null) {
		performUnitOfwork(workInProgress);
	}
}

function performUnitOfwork(fiber: FiberNode) {
	const next: FiberNode | null = beginWork(fiber);
	// 说明当前fiber 已经处理完了 所以可以将 pendingProps 赋值给 memoizedProps
	fiber.memoizedProps = fiber.pendingProps;

	// 如果next 为 null 说明已经到底了 即 递阶段完成 我们应该去执行归 去找当前fiber几点的 兄弟节点
	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	if (node !== null) {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = fiber.return;
		workInProgress = node;
	}
}
