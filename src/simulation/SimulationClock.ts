/** 示意模拟时间，以秒为单位；不代表任何天文时间尺度。 */
export class SimulationClock {
  private elapsed = 0;
  private running = true;
  private speed = 1;

  advance(realSeconds: number): number {
    if (this.running) this.elapsed += realSeconds * this.speed;
    return this.elapsed;
  }

  setRunning(running: boolean): void { this.running = running; }
  setSpeed(speed: number): void {
    if (Number.isFinite(speed) && speed >= 0) this.speed = speed;
  }
}
