'use server'

export async function generateSoln(len) {
  const solution = Array.from({ length: len }, (_, i) => i);
  
  for (let i = solution.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [solution[i], solution[j]] = [solution[j], solution[i]];
  }
  console.log(solution)
  return solution;
}