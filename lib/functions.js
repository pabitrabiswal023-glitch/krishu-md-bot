module.exports = {
  sleep: (ms) => new Promise(r => setTimeout(r, ms)),
  runtime: (start) => {
    const s = (Date.now() - start) / 1000;
    return `${Math.floor(s/3600)}h ${Math.floor(s%3600/60)}m ${Math.floor(s%60)}s`;
  },
  pickRandom: (arr) => arr[Math.floor(Math.random() * arr.length)]
};
