import { GraphQLScalarType, Kind } from 'graphql';

function isValidYear(year: unknown): year is number {
  return typeof year === 'number' && Number.isInteger(year);
}

export const YearType = new GraphQLScalarType({
  name: 'Year',

  serialize(value) {
    if (!isValidYear(value)) {
      throw new Error('Year should be an integer');
    }

    return value;
  },

  parseValue(value) {
    if (!isValidYear(value)) {
      throw new Error('Year should be an integer');
    }

    return value;
  },

  parseLiteral(value) {
    if (value.kind == Kind.INT) {
      const parsedYear = value.value;
      if (isValidYear(parsedYear)) {
        return parsedYear;
      }
    }

    return undefined;
  },
});
