export const generateId = (function() {
  let idCount = 0;

  function generateId() {
    const id = idCount;
    idCount++;
    return id;
  }

  return generateId;
})();
