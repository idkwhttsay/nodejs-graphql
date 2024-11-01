import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLBoolean } from 'graphql';

import {
  MemberTypeId,
  MemberType,
  PostType,
  ProfileType,
  UserType,
  CreatePostInput,
  CreateUserInput,
  CreateProfileInput,
  ChangePostInput,
  ChangeUserInput,
  ChangeProfileInput,
} from './types.js';
import { UUIDType as UUID } from './types/uuid.js';
import resolvers from './resolvers.js';

const UUIDType = new GraphQLNonNull(UUID);

export const queries = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: resolvers.getMemberTypes,
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeId } },
      resolve: resolvers.getMemberType,
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: resolvers.getPosts,
    },
    post: {
      type: PostType,
      args: { id: { type: UUIDType } },
      resolve: resolvers.getPost,
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: resolvers.getUsers,
    },
    user: {
      type: UserType,
      args: { id: { type: UUIDType } },
      resolve: resolvers.getUser,
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: resolvers.getProfiles,
    },
    profile: {
      type: ProfileType,
      args: { id: { type: UUIDType } },
      resolve: resolvers.getProfile,
    },
  },
});

export const mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: PostType,
      args: { dto: { type: CreatePostInput } },
      resolve: resolvers.createPost,
    },
    createUser: {
      type: UserType,
      args: { dto: { type: CreateUserInput } },
      resolve: resolvers.createUser,
    },
    createProfile: {
      type: ProfileType,
      args: { dto: { type: CreateProfileInput } },
      resolve: resolvers.createProfile,
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangePostInput },
      },
      resolve: resolvers.changePost,
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeUserInput },
      },
      resolve: resolvers.changeUser,
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeProfileInput },
      },
      resolve: resolvers.changeProfile,
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: resolvers.deletePost,
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: resolvers.deleteUser,
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: resolvers.deleteProfile,
    },
    subscribeTo: {
      type: UserType,
      args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
      resolve: resolvers.subscribeTo,
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
      resolve: resolvers.unsubscribeFrom,
    },
  },
});
