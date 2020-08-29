// @flow

// a little function to help us with reordering the result
const Reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default Reorder;

export const reorderGroups = ({ groups, source, destination }) => {
  const sourceStacks = groups[source.droppableId].stacks;
  const destStacks = groups[destination.droppableId].stacks;
  const stack = sourceStacks[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reorderedStacks = Reorder(sourceStacks, source.index, destination.index);
    const newGroups = {
      ...groups,
      [source.droppableId]: {
        ...groups[source.droppableId],
        stacks: reorderedStacks
      }
    };
    return {
      groups: newGroups
    };
  }

  // moving to different list

  // remove from original
  const newSourceStacks = Array.from(sourceStacks);
  newSourceStacks.splice(source.index, 1);
  // insert into next
  const newDestStacks = Array.from(destStacks);
  newDestStacks.splice(destination.index, 0, stack);

  const newGroups = {
    ...groups,
    [source.droppableId]: {
      ...groups[source.droppableId],
      stacks: newSourceStacks,
    },
    [destination.droppableId]: {
      ...groups[destination.droppableId],
      stacks: newDestStacks,
    }
  };

  return {
    groups: newGroups
  };
};

export function moveBetween({ list1, list2, source, destination }) {
  const newFirst = Array.from(list1.values);
  const newSecond = Array.from(list2.values);

  const moveFrom = source.droppableId === list1.id ? newFirst : newSecond;
  const moveTo = moveFrom === newFirst ? newSecond : newFirst;

  const [moved] = moveFrom.splice(source.index, 1);
  moveTo.splice(destination.index, 0, moved);

  return {
    list1: {
      ...list1,
      values: newFirst
    },
    list2: {
      ...list2,
      values: newSecond
    }
  };
}
