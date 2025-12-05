export type NamedParamsToPositional<WrappedFunction, Key extends string> = WrappedFunction extends (
  arg: infer Arg
) => infer Result
  ? (input: { [k in Key]: Arg }) => Result
  : never;

// TODO: [TYPES] Improve types
export default function namedParamsToPositional<
  WrappedFunctionArg extends Record<string, any>,
  WrappedFunctionResult,
  Key extends keyof WrappedFunctionArg,
>(
  wrappedFunction: (arg: WrappedFunctionArg[Key]) => WrappedFunctionResult,
  paramName: Key | Key[]
): (input: WrappedFunctionArg) => WrappedFunctionResult {
  if (Array.isArray(paramName)) {
    // @ts-expect-error
    return input => wrappedFunction(...paramName.map(key => input[key]));
  }
  return input => wrappedFunction(input[paramName]);
}
