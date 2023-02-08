export const mergeData = (...datasets) => {
  const temp = {};

  datasets.forEach((dataset) => {
    dataset.forEach((entry) => {
      if (Object.hasOwn(temp, entry.year)) 
        temp[entry.year].push(entry.value);
      else  
        temp[entry.year] = [entry.value];
    })
  })

  return Object.keys(temp).map((year) => {
    let object = {
      year: year
    }
    temp[year].forEach((value, i) => object[`value${i + 1}`] = value ? value : "")
    return object
  })
};
