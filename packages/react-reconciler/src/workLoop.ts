import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

// 保存当前遍历到的fiber 节点
let workInProgress: FiberNode | null = null;

// 修改当前fiber 调用的方法
function prepareFreshStack(fiber: FiberNode) {
	workInProgress = fiber;
}

function renderRoot(root: FiberNode) {
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			workInProgress = null;
			console.warn('workloop 发生错误', e);
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
		prepareFreshStack(next);
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	if (node !== null) {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			prepareFreshStack(sibling);
			return;
		}
		node = fiber.return;
		workInProgress = node;
	}
}
