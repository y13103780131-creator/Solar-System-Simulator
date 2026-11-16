'use strict';
// The desktop host writes PNG files beside the application; normal web use is unchanged.
(()=>{
 if(!window.chrome||!window.chrome.webview)return;
 const nativeFetch=window.fetch.bind(window);let pending=null;
 window.chrome.webview.addEventListener('message',event=>{if(typeof event.data!=='string')return;if(event.data.startsWith('FULLSCREEN|')){const full=event.data==='FULLSCREEN|1';document.getElementById('desktopFullscreenLabel').textContent=full?'退出全屏':'进入全屏';document.getElementById('desktopFullscreen').setAttribute('aria-label',full?'退出全屏':'进入全屏');return}if(!pending)return;const task=pending;pending=null;clearTimeout(task.timer);if(event.data.startsWith('OK|'))task.resolve(new Response(JSON.stringify({name:event.data.slice(3)}),{status:200,headers:{'Content-Type':'application/json'}}));else task.reject(new Error(event.data.startsWith('ERR|')?event.data.slice(4):'桌面程序未能保存截图'));});
 document.getElementById('desktopExit').addEventListener('click',()=>window.chrome.webview.postMessage('desktop:exit'));
 document.getElementById('desktopFullscreen').addEventListener('click',()=>window.chrome.webview.postMessage('desktop:toggleFullscreen'));
 window.addEventListener('keydown',event=>{if(event.key==='F11'&&!event.repeat){event.preventDefault();event.stopPropagation();window.chrome.webview.postMessage('desktop:toggleFullscreen')}},true);
 window.fetch=(input,options)=>{if(input!=='/api/screenshot'||!options||options.method!=='POST')return nativeFetch(input,options);if(pending)return Promise.reject(new Error('截图正在保存'));return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error('读取截图失败'));reader.onload=()=>{pending={resolve,reject,timer:setTimeout(()=>{pending=null;reject(new Error('保存截图超时'))},30000)};window.chrome.webview.postMessage('screenshot:'+reader.result)};reader.readAsDataURL(options.body)});};
})();
