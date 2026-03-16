export function calculateRiskScore(likelihood: number, impact: number) {
  const score = likelihood * impact;
  let level = "Low";
  if (score >= 20) level = "Critical";
  else if (score >= 12) level = "High";
  else if (score >= 6) level = "Medium";
  return { score, level };
}
