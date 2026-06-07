import mitt from 'mitt'

type Events = {
	getPlayListFun: number;
	showDrawer: void;
};

export default mitt<Events>();
