import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

export function toId(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanum with "-"
    .replace(/-+/g, '-') // collapse multiple "-"
    .replace(/^-|-$/g, ''); // trim leading/trailing "-"
}

/**
 * Subscribes to an observable for debugging purposes.
 * Filters out initial `undefined`, `null`, `[]`, and `{}` emissions to reduce console spam.
 *
 * @param label The console log prefix
 * @param obs The observable to monitor
 * @param destroy$ The component's teardown subject
 * @param enabled Whether debugMode is currently true
 */
export function debugLogObservable<T>(
  label: string,
  obs: Observable<T>,
  destroy$: Observable<void>,
  enabled: boolean = true,
): void {
  if (!enabled) return;

  obs
    .pipe(
      // Filter out initial empty frames, nulls, and empty arrays/objects
      filter((val) => {
        if (val == null) return false; // Drops null and undefined
        if (Array.isArray(val) && val.length === 0) return false; // Drops []
        if (
          typeof val === 'object' &&
          Object.keys(val as Record<string, unknown>).length === 0
        )
          return false; // Drops {}
        return true;
      }),
      distinctUntilChanged(), // Silences repeat emissions of exact same value
      takeUntil(destroy$),
    )
    .subscribe((val) => console.log(label, val));
}

export function arrayToSet(input?: string[] | Set<string>): Set<string> {
  if (input instanceof Set) return input;
  return new Set(input ?? []);
}

export function setToArray(input?: Set<string>): string[] {
  return input ? Array.from(input) : [];
}

export function arrayToEntityMap<T extends { id: string }>(
  arr: T[],
): Record<string, T> {
  return arr.reduce(
    (acc, entity) => {
      acc[entity.id] = entity;
      return acc;
    },
    {} as Record<string, T>,
  );
}
