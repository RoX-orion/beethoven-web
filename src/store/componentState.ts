import { reactive } from 'vue';
import { ComponentType } from '@/types/global';

interface ComponentState {
	currentMiddleComponent: ComponentType;
}

export const componentState = reactive<ComponentState>({
	currentMiddleComponent: ComponentType.DEFAULT,
});
