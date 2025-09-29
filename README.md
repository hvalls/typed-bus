# Typed-Bus

A lightweight, type-safe message bus implementation for TypeScript that provides compile-time type checking for message handlers and execution.

## Features
- **Type Safety**: Full TypeScript support with compile-time type checking
- **Simple API**: Clean, fluent interface for registering handlers
- **Async Support**: Handlers can be synchronous or asynchronous
- **Zero Dependencies**: Lightweight implementation with no external dependencies

## Usage
### 1. Define your message registry

Create an interface that extends `MessageRegistry` to define your messages:

```typescript
import { MessageRegistry, createBus } from './bus';

interface AppMessages extends MessageRegistry {
  'user.create': {
    in: { name: string; email: string };
    out: { id: string; name: string; email: string };
  };
  'email.send': {
    in: { message: string; to: string };
    out: { sent: boolean };
  };
}
```

### 2. Register message handlers
Use the fluent API to register handlers for each message type:
```typescript
const bus = createBus<AppMessages>()
  .handle('user.create', async ({ name, email }) => {
    const id = createUser(name, email);
    return { id, name, email };
  })
  .handle('email.send', async ({ message, to }) => {
    const sent = sendEmail(message, to);
    return { sent: true };
  });
```

### 3. Execute messages
Execute messages with full type safety:

```typescript
const user = await bus.execute('user.create', {
  name: 'John',
  email: 'john@example.com'
});
// user is typed as { id: string; name: string; email: string }

const result = await bus.execute('email.send', {
  message: 'Welcome!',
  to: 'john@example.com'
});
// result is typed as { sent: boolean }
```

Executes the handler for the given message with the provided data. Returns a Promise with the handler's result. Throws an error if no handler is registered.
