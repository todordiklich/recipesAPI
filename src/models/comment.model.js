import { prisma } from '../db/prisma/client.js';

export const getComment = async (id) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });
  return comment;
};

export const addComment = async (data) => {
  const comment = await prisma.comment.create({
    data,
  });

  return comment;
};

export const editComment = async (id, data) => {
  const comment = await prisma.comment.update({
    where: { id },
    data,
  });
  return comment;
};

export const deleteComment = async (id) => {
  const comment = await prisma.comment.delete({
    where: {
      id,
    },
  });
  return comment;
};
