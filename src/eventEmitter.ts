export type EventMap = {
  [event: string]: [...any];
};

type K<T> = string & keyof T;

export type AnyEventHandler = (...args: any) => void;
export type EventHandler<Map extends EventMap, E extends K<Map>> = (...args: Map[E]) => void;

export type MergeEventMap<A extends EventMap, B extends EventMap> = {
  [K in keyof (A & B)]: [K] extends [keyof A] ? A[K] : [K] extends [keyof B] ? B[K] : never;
};

export type EventMapExtension<TParent extends EventMap> = EventMap & {
  [K in keyof TParent]?: never;
};

export class EventEmitter<Events extends EventMap = {}> {
  private readonly events: Map<string, Set<AnyEventHandler>> = new Map();

  public on<E extends K<Events>>(event: E, handler: EventHandler<Events, E>): void {
    this.events.has(event) || this.events.set(event, new Set());
    this.events.get(event)!.add(handler);
  }

  public once<E extends K<Events>>(event: E, handler: EventHandler<Events, E>): void {
    const wrapper = ((...args) => {
      this.off(event, wrapper);
      handler(...args);
    }) as EventHandler<Events, E>;

    this.on(event, wrapper);
  }

  public off<E extends K<Events>>(event?: E, handler?: EventHandler<Events, E>): void {
    if (!event) {
      this.events.clear();
    } else if (!handler) {
      this.events.delete(event);
    } else {
      this.events.get(event)?.delete(handler);
    }
  }

  public emit<E extends K<Events>>(event: E, ...args: Events[E]): boolean {
    const listeners = this.events.get(event);

    if (!listeners) {
      return false;
    }

    for (const listener of listeners) {
      listener(...args);
    }

    return true;
  }
}
