import { reactive } from 'vue';
import { ComponentType } from '@/types/global';

interface ComponentState {
	currentRightComponent: ComponentType;
}

export const componentState = reactive<ComponentState>({
	currentRightComponent: ComponentType.DEFAULT,
});
