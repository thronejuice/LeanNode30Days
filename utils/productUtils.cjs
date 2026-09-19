function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const group = item[key];

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(item);
    return groups;
  }, {});
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

module.exports = { deepClone, groupBy };
