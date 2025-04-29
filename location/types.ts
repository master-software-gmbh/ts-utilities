import { array, number, object, optional, string, union } from 'valibot';
import type { ccTLD } from '../country';

export interface PredictionInput {
  query: string;
  regions?: ccTLD[];
  language?: string;
}

export interface PredictionOutput {
  predictions: { id: string; mainText: string; secondaryText: string }[];
}

const FormattableText = object({
  text: string(),
  matches: optional(
    array(
      object({
        startOffset: optional(number()),
        endOffset: number(),
      }),
    ),
  ),
});

const StructuredFormat = object({
  mainText: FormattableText,
  secondaryText: FormattableText,
});

export const PlacesAutocompleteResponse = object({
  suggestions: array(
    union([
      object({
        placePrediction: object({
          place: string(),
          text: FormattableText,
          placeId: string(),
          types: array(string()),
          structuredFormat: StructuredFormat,
          distanceMeters: optional(number()),
        }),
      }),
      object({
        queryPrediction: object({
          text: FormattableText,
          structuredFormat: StructuredFormat,
        }),
      }),
    ]),
  ),
});

export const GeocodingResponse = object({
  results: array(
    object({
      place_id: string(),
      types: array(string()),
      formatted_address: string(),
      geometry: object({
        location_type: string(),
        location: object({
          lat: number(),
          lng: number(),
        }),
      }),
    }),
  ),
});

export interface ReverseGeocodingInput {
  region?: ccTLD;
  language?: string;
  coordinates: Coordinates;
}

export interface ReverseGeocodingOutput {
  id: string;
  address: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
