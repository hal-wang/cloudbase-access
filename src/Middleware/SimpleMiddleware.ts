import Middleware from ".";
import HttpContext from "../HttpContext";

class SimpleMiddleware extends Middleware {
  constructor(
    private readonly delegate: (
      ctx: HttpContext,
      next: () => Promise<void>
    ) => Promise<void>
  ) {
    super();
  }

  async invoke(): Promise<void> {
    await this.delegate(this.ctx, this.next.bind(this));
  }
}

export default SimpleMiddleware;
