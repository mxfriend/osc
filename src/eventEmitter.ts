export type EventHandler = (...args: any[]) => void;

export type EventMap = {
  [event: string]: EventHandler;
};

export type MergeEventMap<A extends EventMap, B extends EventMap> = {
  [K in keyof (A & B)]: K extends keyof A ? A[K] : K extends keyof B ? B[K] : never;
};

type K<M> = Exclude<keyof M, number | symbol>;

export class EventEmitter<Events extends EventMap = {}> {
  private readonly events: Map<string, Set<EventHandler>> = new Map();

  public on<Event extends K<Events>>(event: Event, handler: Events[Event]): void {
    this.events.has(event) || this.events.set(event, new Set());
    this.events.get(event)!.add(handler);
  }

  public once<Event extends K<Events>>(event: Event, handler: Events[Event]): void {
    const wrapper = ((...args) => {
      this.off(event, wrapper);
      handler(...args);
    }) as Events[Event];

    this.on(event, wrapper);
  }

  public off<Event extends K<Events>>(event?: Event, handler?: Events[Event]): void {
    if (!event) {
      this.events.clear();
    } else if (!handler) {
      this.events.delete(event);
    } else {
      this.events.get(event)?.delete(handler);
    }
  }

  public emit(event: K<Events>, ...args: any): boolean {
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
