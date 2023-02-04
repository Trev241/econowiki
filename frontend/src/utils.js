export const mergeData = (data1, data2) => {
  const result = [];
  for (const o of data1) {
    const value2 = data2.find((_o) => _o.year === o.year).value;
    result.push({
      year: o.year,
      value1: o.value,
      value2: value2 ? value2.value : "",
    });
  }
  return result;
};
