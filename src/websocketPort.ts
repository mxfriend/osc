import { AbstractOSCPort } from './abstractPort';
import { Packet, PacketInterface } from './buffer';

type WebsocketEvents = {
  error: (error: Event) => void;
};

export class WebsocketPort extends AbstractOSCPort<never, WebsocketEvents> {
  private readonly url: string;
  private sock?: Promise<WebSocket>;

  constructor(url: string) {
    super();
    this.url = url;
    this.handleMessage = this.handleMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  async close(): Promise<void> {
    const sock = this.sock && await this.sock;
    sock && sock.close();
  }

  protected async sendPacket(packet: PacketInterface): Promise<void> {
    const sock = await this.connect();
    sock.send(packet.buffer);
  }

  private async connect(): Promise<WebSocket> {
    if (this.sock) {
      return this.sock;
    }

    return this.sock = new Promise((resolve, reject) => {
      const sock = new WebSocket(this.url);

      attachListeners(sock, {
        open: () => {
          attachListeners(sock, {
            message: this.handleMessage,
            close: this.handleClose,
            error: this.handleError,
          });
          resolve(sock);
        },
        error: reject,
      });
    });
  }

  private handleMessage(evt: MessageEvent): void {
    if (evt.data instanceof ArrayBuffer) {
      this.receive(new Packet(evt.data));
    }
  }

  private handleClose(): void {
    this.sock = undefined;
  }

  private handleError(err: Event): void {
    this.emit('error', err);
  }
}

type ListenerMap = {
  [Event in keyof WebSocketEventMap]?: (evt: WebSocketEventMap[Event]) => void;
};

function attachListeners(ws: WebSocket, events: ListenerMap): void;
function attachListeners(ws: WebSocket, events: Record<string, (...args: any[]) => void>): void {
  const cleanup = () => {
    for (const [event, listener] of Object.entries(events)) {
      ws.removeEventListener(event, listener);
    }
  };

  for (const [event, listener] of Object.entries(events)) {
    ws.addEventListener(event, events[event] = (...args: any[]) => {
      cleanup();
      listener(...args);
    });
  }
}
