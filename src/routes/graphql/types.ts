import {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  ThunkObjMap,
  GraphQLInputFieldConfig,
} from 'graphql';

import { UUIDType } from './types/uuid.js';
import { YearType } from './types/year.js';

import resolvers from './resolvers.js';

// QUERIES

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: 'basic' },
    business: { value: 'business' },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: {
    id: {
      type: MemberTypeId,
    },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: resolvers.getProfileByUserID,
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: resolvers.getPostsByUserID,
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: resolvers.getUserSubscribedTo,
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: resolvers.getSubscribedToUser,
    },
  }),
});

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: YearType },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberType.getFields().id.type },
    memberType: {
      type: MemberType,
      resolve: resolvers.getMemberTypeByProfile,
    },
  },
});

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UserType.getFields().id.type },
  }),
});

// MUTATIONS

const getRequiredFields = (
  objects: GraphQLInputObjectType,
  required: string[],
): ThunkObjMap<GraphQLInputFieldConfig> => {
  const fields = objects.getFields();
  const result = {};
  for (const field in fields) {
    if (required.includes(field)) {
      result[field] = {
        ...fields[field],
        type: new GraphQLNonNull(fields[field].type),
      };
    }
  }

  return result;
};

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: PostType.getFields().title.type as GraphQLInputType },
    content: { type: PostType.getFields().content.type as GraphQLInputType },
    authorId: { type: PostType.getFields().authorId.type as GraphQLInputType },
  },
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    ...getRequiredFields(ChangePostInput, ['title', 'content', 'authorId']),
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: UserType.getFields().name.type as GraphQLInputType },
    balance: { type: UserType.getFields().balance.type as GraphQLInputType },
  },
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: getRequiredFields(ChangeUserInput, ['name', 'balance']),
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: ProfileType.getFields().isMale.type as GraphQLInputType },
    yearOfBirth: { type: ProfileType.getFields().yearOfBirth.type as GraphQLInputType },
    memberTypeId: { type: ProfileType.getFields().memberTypeId.type as GraphQLInputType },
  },
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    ...getRequiredFields(ChangeProfileInput, ['isMale', 'yearOfBirth', 'memberTypeId']),
    userId: { type: ProfileType.getFields().userId.type as GraphQLInputType },
  },
});
