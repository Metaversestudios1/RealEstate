// src/utils.js
export function generateCrashMultiplier(lambda) {
    const randomValue = Math.random(); // generates a random number between 0 and 1
    console.log(randomValue)
    console.log(-Math.log(randomValue))
    const crashMultiplier = -Math.log(randomValue) / lambda; // exponential distribution
    console.log(crashMultiplier)
    console.log(Math.max(1.01, crashMultiplier.toFixed(2)))
    return Math.max(1.01, crashMultiplier.toFixed(2)); // ensure the multiplier is >= 1.01
}
