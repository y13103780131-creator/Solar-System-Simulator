import { SimulationClock } from '../simulation/SimulationClock';

export function setupControls(clock: SimulationClock): void {
  const toggle = document.querySelector<HTMLButtonElement>('#toggle')!;
  const speed = document.querySelector<HTMLSelectElement>('#speed')!;
  let running = true;
  toggle.addEventListener('click', () => {
    running = !running;
    clock.setRunning(running);
    toggle.textContent = running ? '暂停' : '继续';
    toggle.setAttribute('aria-pressed', String(!running));
  });
  speed.addEventListener('change', () => clock.setSpeed(Number(speed.value)));
}
