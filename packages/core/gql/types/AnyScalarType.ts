import { GraphQLScalarType, Kind } from "graphql";

export const AnyScalarType = new GraphQLScalarType({
	name: "Any",
	description: "Arbitrary object",
	parseValue: (value) => {
		return value
	},
	serialize: (value) => {
		return value
	},
	// parseLiteral: (ast) => {
	// 	if (ast.kind === Kind.STRING) {
  //     return ast.value; // value from the client query
  //   }
	// 	return null
	// },
});