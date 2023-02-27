import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Resource = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.resource;
  },
);
