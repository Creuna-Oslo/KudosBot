let recipientsTimeToMove = [];

export const waitForPrevToMove = (timeToMove, index, cb) => {
  if (recipientsTimeToMove[index] !== timeToMove) {
    recipientsTimeToMove.push(timeToMove);
  }
  const wait = index
    ? recipientsTimeToMove.slice(0, index).reduce((sum, num) => {
        return sum + num;
      })
    : 0;
  console.table({ index, wait, recipientsTimeToMove });
  setTimeout(() => cb(), wait);
};
