export type JSONObject = { [x: string]: JSONValue };
export type JSONArray = Array<JSONValue>;
export type JSONValue = null | undefined | string | number | boolean | JSONObject | JSONArray;
