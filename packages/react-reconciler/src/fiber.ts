import { WorkTag } from './workTags';
import { Key, Props, Ref } from 'shared/ReactTypes';
import { Flags, NoFlags } from './fiberFlags';

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
	// 用于切换 currentFiber 与 workInProgressFiber 的标记
	alternate: FiberNode | null;
	// 用于标记fiber 需要执行的操作 (插入/删除) => 副作用
	flags: Flags;

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

		this.alternate = null;
		this.flags = NoFlags;
	}
}
