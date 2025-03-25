export interface Lens<Whole, Part> {
  get: (whole: Whole) => Part;
  set: (whole: Whole, part: Part) => Whole;
}

export function createLens<Whole, Field extends keyof Whole>(field: Field): Lens<Whole, Whole[Field]> {
  return {
    get(whole) {
      return whole[field];
    },
    set(whole, part) {
      return { ...whole, [field]: part };
    },
  };
}

export function get<Whole, Part>(lens: Lens<Whole, Part>, whole: Whole) {
  return lens.get(whole);
}

export function set<Whole, Part>(lens: Lens<Whole, Part>, whole: Whole, part: Part) {
  return lens.set(whole, part);
}

export function compose<OuterWhole, OuterPartInnerWhole, InnerPart>(
  outer: Lens<OuterWhole, OuterPartInnerWhole>,
  inner: Lens<OuterPartInnerWhole, InnerPart>,
): Lens<OuterWhole, InnerPart> {
  return {
    get(whole) {
      return get(inner, get(outer, whole));
    },
    set(whole, part) {
      return set(outer, whole, set(inner, get(outer, whole), part));
    },
  };
}

export function index<Whole extends Array<unknown>>(index: number): Lens<Whole, Whole[number]> {
  return {
    get(array) {
      return array[index] as Whole[number];
    },
    set(array, value) {
      const copy = [...array];
      copy[index] = value;
      return copy;
    },
  };
}

export function byId<Whole extends { id: string }[]>(id: string): Lens<Whole, Whole[number]> {
  return {
    get(array) {
      return array.find((item) => item.id === id) as Whole[number];
    },
    set(array, value) {
      const copy = [...array];
      const index = copy.findIndex((item) => item.id === value.id);
      if (index !== -1) {
        copy[index] = value;
      }
      return copy;
    },
  };
}