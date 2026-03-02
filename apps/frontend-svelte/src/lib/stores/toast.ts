import { writable } from 'svelte/store';

export interface Toast {
	id: number;
	message: string;
	type: 'success' | 'error' | 'info';
}

let nextId = 0;

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function add(message: string, type: Toast['type'] = 'info') {
		const id = nextId++;
		update((toasts) => [...toasts, { id, message, type }]);
		setTimeout(() => {
			remove(id);
		}, 4000);
	}

	function remove(id: number) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	return {
		subscribe,
		success: (msg: string) => add(msg, 'success'),
		error: (msg: string) => add(msg, 'error'),
		info: (msg: string) => add(msg, 'info'),
		remove
	};
}

export const toast = createToastStore();
