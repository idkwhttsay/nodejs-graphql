import { GraphQLResolveInfo, Kind } from 'graphql';
import { Context } from './types/context.js';
import { Prisma, SubscribersOnAuthors, User } from '@prisma/client';

export default {
  getUsers: (_, args, { db, loader }: Context, info: GraphQLResolveInfo) => {
    const include = {};
    info.fieldNodes.forEach((field) => {
      field.selectionSet?.selections.forEach((selection) => {
        if (
          selection.kind == Kind.FIELD &&
          ['userSubscribedTo', 'subscribedToUser'].includes(selection.name.value)
        ) {
          include[selection.name.value] = true;
        }
      });
    });

    const users = db.user.findMany({ include });
    users
      .then((users) => {
        users.map((u) => {
          loader.user.prime(u.id, u);
        });
      })
      .catch(() => {});

    return users;
  },

  getUser: (_, { id }: { id: string }, { loader }: Context) => {
    return loader.user.load(id);
  },

  getUserSubscribedTo: async (parent: User, _args, { loader }: Context) => {
    const parentValue = parent['userSubscribedTo'] as SubscribersOnAuthors[];

    return parentValue
      ? loader.user.loadMany(parentValue.map((s) => s.subscriberId))
      : loader.subscribed.load(parent.id);
  },

  getSubscribedToUser: async (parent: { id: string }, _args, { loader }: Context) => {
    const parentValue = parent['subscribedToUser'] as SubscribersOnAuthors[];

    return parentValue
      ? loader.user.loadMany(parentValue.map((s) => s.authorId))
      : loader.subscribers.load(parent.id);
  },

  getProfiles: (_, args, { db }: Context) => {
    return db.profile.findMany();
  },

  getProfile: (_, { id }: { id: string }, { db }: Context) => {
    return db.profile.findUnique({ where: { id } });
  },

  getProfileByUserID: (parent: { id: string }, _args, { loader }: Context) => {
    return loader.userProfile.load(parent.id);
  },

  getMemberTypes: (_, args, { db }: Context) => {
    return db.memberType.findMany();
  },

  getMemberType: (_, { id }: { id: string }, { loader }: Context) => {
    return loader.member.load(id);
  },

  getMemberTypeByProfile: (
    parent: { memberTypeId: string },
    _args,
    { loader }: Context,
  ) => {
    return loader.member.load(parent.memberTypeId);
  },

  getPosts: (_, args, { db }: Context) => {
    return db.post.findMany();
  },

  getPost: (_, { id }: { id: string }, { db }: Context) => {
    return db.post.findUnique({ where: { id } });
  },

  getPostsByUserID: (parent: { id: string }, _args, { loader }: Context) => {
    return loader.userPosts.load(parent.id);
  },

  createPost: (_, args: { dto: Prisma.PostUncheckedCreateInput }, { db }: Context) => {
    return db.post.create({ data: args.dto });
  },

  createUser: (_, args: { dto: Prisma.UserUncheckedCreateInput }, { db }: Context) => {
    return db.user.create({ data: args.dto });
  },

  createProfile: (
    _,
    args: { dto: Prisma.ProfileUncheckedCreateInput },
    { db }: Context,
  ) => {
    return db.profile.create({ data: args.dto });
  },

  changePost: (
    _,
    args: {
      dto: Prisma.PostUncheckedUpdateInput;
      id: string;
    },
    { db }: Context,
  ) => {
    return db.post.update({ data: { ...args.dto }, where: { id: args.id } });
  },

  changeUser: (
    _,
    args: {
      dto: Prisma.UserUncheckedUpdateInput;
      id: string;
    },
    { db }: Context,
  ) => {
    return db.user.update({ data: { ...args.dto }, where: { id: args.id } });
  },

  changeProfile: (
    _,
    args: {
      dto: Prisma.ProfileUncheckedUpdateInput;
      id: string;
    },
    { db }: Context,
  ) => {
    return db.profile.update({ data: { ...args.dto }, where: { id: args.id } });
  },

  deletePost: async (_, args: { id: string }, { db }: Context) => {
    return !!(await db.post.delete({ where: { id: args.id } }));
  },

  deleteUser: async (_, args: { id: string }, { db }: Context) => {
    return !!(await db.user.delete({ where: { id: args.id } }));
  },

  deleteProfile: async (_, args: { id: string }, { db }: Context) => {
    return !!(await db.profile.delete({ where: { id: args.id } }));
  },

  subscribeTo: (_, args: { userId: string; authorId: string }, { db }: Context) => {
    return db.user.update({
      where: { id: args.userId },
      data: {
        userSubscribedTo: {
          create: {
            authorId: args.authorId,
          },
        },
      },
    });
  },

  unsubscribeFrom: async (
    _,
    args: { userId: string; authorId: string },
    { db }: Context,
  ) => {
    return !!(await db.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: args.userId,

          authorId: args.authorId,
        },
      },
    }));
  },
};
