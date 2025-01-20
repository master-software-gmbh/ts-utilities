export type JSONObject = { [x: string]: JSONValue };
export type JSONArray = Array<JSONValue>;
export type JSONValue = string | number | boolean | JSONObject | JSONArray;
