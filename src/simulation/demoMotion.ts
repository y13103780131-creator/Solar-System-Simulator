/** 纯示意运动参数：位置单位和角速度均非真实天文数据。 */
export const demoMotion = {
  earthPosition: { x: 5, y: 0, z: 0 },
  earthSpinRadiansPerSecond: 0.32,
  moonOrbitRadius: 2.1,
  moonOrbitRadiansPerSecond: 0.48,
} as const;

export function motionAt(seconds: number) {
  const angle = seconds * demoMotion.moonOrbitRadiansPerSecond;
  return {
    earthRotation: seconds * demoMotion.earthSpinRadiansPerSecond,
    moonX: Math.cos(angle) * demoMotion.moonOrbitRadius,
    moonZ: Math.sin(angle) * demoMotion.moonOrbitRadius,
  };
}
