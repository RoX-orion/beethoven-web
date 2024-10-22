// let isDone = false; // 是否传输结束
// let isReady = true; // 是否准备好下一次加载
// let bufferList: Uint8Array = []; // 缓冲区数组
//
// const mediaSource = new MediaSource();
// const url = window.URL.createObjectURL(mediaSource);
//
// // 检测是否为open状态，否则添加监听器，等到open状态就绪后再传输
// (() => {
// 	if (mediaSource.readyState === 'open') {
// 		createSourceBuffer();
// 	} else {
// 		mediaSource.addEventListener('sourceopen', () => {
// 			createSourceBuffer();
// 		});
// 	}
// })()
//
// // 发送请求并开始传输
// const createSourceBuffer = () => {
// 	const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
//
// 	// 传输完毕事件监听器
// 	sourceBuffer.addEventListener('updateend', () => {
// 		if(bufferList.length !== 0){
// 			// 读取完毕后缓冲区有数据，从缓冲区读取
// 			sourceBuffer.appendBuffer(bufferList.shift());
// 		}else{
// 			// 缓冲区无数据
// 			if(isDone){
// 				// 传输结束，关闭
// 				sourceBuffer.abort();
// 				mediaSource.endOfStream();
// 			}else{
// 				isReady = true; // 准备好进行下一次传输
// 			}
// 		}
// 	})
//
// 	window.fetch(url, fetchOption).then((response) => {
// 		if(!response.ok){
// 			throw new Error('网络连接失败')
// 		}else{
// 			const reader = response.body.getReader(); // 获取读取器
//
// 			// 声明处理函数
// 			const processRead = async (params) => {
// 				const {done, value} = params;
// 				if(!done){
// 					if(isReady){
// 						// 如果已准备好则直接读取
// 						sourceBuffer.appendBuffer(value);
// 						this.isReady = false;
// 					}else{
// 						// 否则加入缓冲区
// 						bufferList = [...bufferList, value];
// 					}
// 					// 读取完毕后递归进行下一次读取
// 					await reader.read().then(processRead);
// 				}else{
// 					console.log('可读流读取完毕');
// 					isDone = true;
// 				}
// 			}
//
// 			// 开始读取
// 			reader.read().then(processRead);
// 		}
// 	})
// }
