import { GraphQLScalarType, Kind } from 'graphql';

const isValidYear = (year: unknown): year is number => {
  return typeof year === 'number' && Number.isInteger(year);
};

const message = 'Int cannot represent non-integer value: %year%';

export const YearType = new GraphQLScalarType({
  name: 'Year',

  serialize(value) {
    if (!isValidYear(value)) {
      throw new Error(message.replace('%year%', value as string));
    }
    return value;
  },

  parseValue(value) {
    if (!isValidYear(value)) {
      throw new Error(message.replace('%year%', value as string));
    }
    return value;
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      const parsedYear = ast.value;
      if (isValidYear(parsedYear)) {
        return parsedYear;
      }
    }
    return undefined;
  },
});
