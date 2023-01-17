export type EventHandler = (...args: any) => void;

export type EventMap = {
  [event: string]: EventHandler;
};

export class EventEmitter<TEvents extends EventMap = {}> {
  private readonly events: Map<string, Set<EventHandler>> = new Map();

  public on<Event extends keyof TEvents>(event: Event, handler: TEvents[Event]): void;
  public on(event: string, handler: EventHandler): void;
  public on(event: string, handler: EventHandler): void {
    this.events.has(event) || this.events.set(event, new Set());
    this.events.get(event)!.add(handler);
  }

  public once<Event extends keyof TEvents>(event: Event, handler: TEvents[Event]): void;
  public once(event: string, handler: EventHandler): void;
  public once(event: string, handler: EventHandler): void {
    const wrapper: EventHandler = (...args) => {
      this.off(event, wrapper);
      handler(...args);
    };

    this.on(event, wrapper);
  }

  public off<Event extends keyof TEvents>(event?: Event, handler?: TEvents[Event]): void;
  public off(event?: string, handler?: EventHandler): void;
  public off(event?: string, handler?: EventHandler): void {
    if (!event) {
      this.events.clear();
    } else if (!handler) {
      this.events.delete(event);
    } else {
      this.events.get(event)?.delete(handler);
    }
  }

  public emit(event: string, ...args: any[]): boolean {
    const listeners = this.events.get(event);

    if (!listeners) {
      return false;
    }

    for (const listener of listeners) {
      listener(event, ...args);
    }

    return true;
  }
}
