import './style.css';
import { SolarScene } from './rendering/SolarScene';
import { SimulationClock } from './simulation/SimulationClock';
import { setupControls } from './ui/controls';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <main class="viewport" aria-label="太阳、地球和月球的示意场景"></main>
  <header class="brand"><span class="brand-mark">✳</span><div><strong>SOLARIS</strong><small>太阳系探索</small></div></header>
  <section class="scene-info"><span class="eyebrow">SOLAR SYSTEM / 01</span><h1>探索太阳系</h1><p>太阳 · 地球 · 月球</p><span class="badge">示意比例与运动</span></section>
  <aside class="target"><span>当前观察</span><strong>太阳 · 地球 · 月球</strong></aside>
  <div class="controls"><button id="toggle" type="button" aria-pressed="false">暂停</button><label for="speed">速度</label><select id="speed"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option></select><span class="hint">拖动旋转 · 滚轮缩放 · 右键平移</span></div>
`;
const clock = new SimulationClock();
setupControls(clock);
try {
  const scene = new SolarScene(app.querySelector<HTMLElement>('.viewport')!);
  let previous = performance.now();
  const frame = (now: number) => {
    // 限制后台标签页恢复时的单帧跳变。
    const delta = Math.min((now - previous) / 1000, 0.1);
    previous = now;
    scene.render(clock.advance(delta));
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
} catch (error) {
  console.error('场景初始化失败', error);
  app.querySelector('.viewport')!.insertAdjacentHTML('beforeend', '<p class="error" role="alert">无法启动 3D 场景，请检查浏览器的 WebGL 支持。</p>');
}
