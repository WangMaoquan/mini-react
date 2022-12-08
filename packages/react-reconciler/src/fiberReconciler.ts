import { ReactElemetType } from 'shared/ReactTypes';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { HostRoot } from './workTags';
import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { scheduleUpdateOnFiber } from './workLoop';

// React.createRoot(rootElement).render(<App />)
/**
 * createRoot 时调用
 * @param container
 * @returns
 */
export function createContaine(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

/**
 * 调用render 时触发
 * @param element
 * @param root
 */
export function updateContainer(
	element: ReactElemetType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	const update = createUpdate(element);
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElemetType | null>,
		update
	);
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
