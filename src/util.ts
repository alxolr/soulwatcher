export function sumStats(stats: any) {
  return (data: any) => {
    aggregate(stats, data);
  };
}

export function aggregate(source: any, current: any) {
  for (let key of Object.keys(current)) {
    if (typeof current[key] === 'number') {
      if (!(key in source)) {
        source[key] = 0;
      }
      source[key] += current[key];
    } else if (typeof current[key] === 'object') {
      if (!(key in source)) {
        source[key] = {};
      }
      aggregate(source[key], current[key]);
    }
  }
}
