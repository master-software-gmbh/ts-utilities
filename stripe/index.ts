import type Stripe from 'stripe';

export function getStripeId(resource: string | { id: string }): string {
  if (typeof resource === 'object') {
    return resource.id;
  }

  return resource;
}

/**
 * Auto pagination of Stripe list resources.
 * Stripe's Node.js SDK already has auto pagination but
 * with an upper limit of objects for performance reasons.
 * @param listFn Callback to list Stripe objects.
 * @param startingAfter Token to fetch objects starting after the given ID.
 * @returns Array of Stripe objects.
 */
export async function getPagedStripeObject<T extends { id: string }>(
  listFn: (params: Stripe.PaginationParams) => Stripe.ApiListPromise<T>,
  startingAfter?: string,
): Promise<T[]> {
  const { data, has_more } = await listFn({
    starting_after: startingAfter,
  });

  if (has_more) {
    return [...data, ...(await getPagedStripeObject(listFn, data[data.length - 1]?.id))];
  }

  return data;
}
