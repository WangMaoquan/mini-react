import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Key, Props, Ref, ReactElemetType } from 'shared/ReactTypes';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	// fiber 的类型
	tag: WorkTag;
	// 接下来需要被改变的props
	pendingProps: Props;
	// key
	key: Key;
	// 组件类型
	type: any;
	// 对应的真实DOM
	stateNode: any;
	ref: Ref | null;

	// 指向父级fiber
	return: FiberNode | null;
	// 下一个兄弟fiber
	sibling: FiberNode | null;
	// 子fiber
	child: FiberNode | null;
	// 同级fiber 的下标
	index: number;

	// 最后确定props
	memoizedProps: Props | null;
	memoizedState: any;
	// 用于切换 currentFiber 与 workInProgressFiber 的标记
	alternate: FiberNode | null;
	// 用于标记fiber 需要执行的操作 (插入/删除) => 副作用
	flags: Flags;
	updateQueue: unknown;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例基本属性
		this.tag = tag;
		this.key = key;
		this.type = null;
		this.stateNode = null;

		// 构成树状结构
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		// 作为工作单元
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.memoizedState = null;
		this.updateQueue = null;

		this.alternate = null;
		this.flags = NoFlags;
	}
}

/**
 *   FiberRootNode
 *
 * currnet  stateNode
 *
 *   hostRootFiber
 *
 * child   return
 *
 * ...fiberTree
 */
export class FiberRootNode {
	container: Container; // 不同环境对应的类型不一样
	current: FiberNode; // 用于指向 hostRootFiber
	finishedWork: FiberNode | null; // 保存更新完成的 hostRootFiber
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	penddingProps: Props
) => {
	let workInProgress = current.alternate;
	if (workInProgress === null) {
		// 首屏渲染是不存在 workInProgress 的所以是mount
		workInProgress = new FiberNode(current.tag, penddingProps, current.key);
		workInProgress.stateNode = current.stateNode;
		workInProgress.alternate = current;
		current.alternate = workInProgress;
	} else {
		// update
		// 清除上次更新遗留
		workInProgress.pendingProps = penddingProps;
		workInProgress.flags = NoFlags;
	}

	workInProgress.type = current.type;
	workInProgress.updateQueue = current.updateQueue;
	workInProgress.child = current.child;
	workInProgress.memoizedProps = current.memoizedProps;
	workInProgress.memoizedState = current.memoizedState;

	return workInProgress;
};

export function createFiberFromElement(element: ReactElemetType) {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;

	if (typeof type === 'string') {
		fiberTag = HostComponent;
	} else if (__DEV__ && typeof type !== 'function') {
		console.warn('未定义的类型', element);
	}
	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
