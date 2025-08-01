# Vercel AI SDK v5 Guide

This guide covers how to use Vercel AI SDK v5 for building AI-powered chat applications, based on official examples and best practices.

## Overview

Vercel AI SDK v5 introduces a new architecture with improved streaming, better type safety, and more flexible transport options. The key changes from v4 include:

- New `useChat` hook with enhanced capabilities
- `DefaultChatTransport` for HTTP-based communication
- `UIMessage` type with `parts` instead of `content`
- Improved streaming with `UIMessageStreamResponse`

## Installation

```bash
pnpm install ai @ai-sdk/react
```

## Basic Setup

### 1. API Route Setup

Your API route should return a `UIMessageStreamResponse` instead of a text stream:

```typescript
// app/api/chat/route.ts
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid request body", { status: 400 });
    }

    const result = streamText({
      model: openrouter.chat("deepseek/deepseek-chat-v3-0324:free"),
      messages,
    });

    // Use toUIMessageStreamResponse() instead of toTextStreamResponse()
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
```

### 2. Chat Component Setup

```typescript
"use client";

import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function ChatPage() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop, regenerate } =
    useChat<UIMessage>({
      id: "main-chat",
      experimental_throttle: 100,
      transport: new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest({ messages }) {
          return {
            body: {
              messages: messages.map((msg) => ({
                role: msg.role,
                content:
                  msg.parts.find((part) => part.type === "text")?.text || "",
              })),
            },
          };
        },
      }),
      onFinish: () => {
        console.log("Chat finished");
      },
      onError: (error) => {
        console.error("Chat error:", error);
      },
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || status === "streaming") return;

    await sendMessage({
      text: input.trim(),
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="whitespace-pre-wrap">
                {message.parts.find((part) => part.type === "text")?.text || ""}
              </div>
            </div>
          </div>
        ))}

        {status === "streaming" && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-gray-500 text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
            disabled={status === "streaming"}
          />
          <button
            type="submit"
            disabled={!input.trim() || status === "streaming"}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {status === "streaming" ? "Sending..." : "Send"}
          </button>
          {status === "streaming" && (
            <button
              type="button"
              onClick={stop}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Stop
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
```

## Key Concepts

### 1. UIMessage Type

Messages in v5 use the `UIMessage` type with a `parts` array instead of a `content` string:

```typescript
interface UIMessage {
  id: string;
  role: "system" | "user" | "assistant";
  parts: Array<UIMessagePart>;
}
```

To access text content:

```typescript
const textContent =
  message.parts.find((part) => part.type === "text")?.text || "";
```

### 2. ChatStatus Values

The `status` property can be:

- `'submitted'` - Message sent, waiting for response
- `'streaming'` - Response is actively streaming
- `'ready'` - Ready for new messages
- `'error'` - An error occurred

### 3. DefaultChatTransport

The `DefaultChatTransport` handles HTTP communication with your API:

```typescript
transport: new DefaultChatTransport({
  api: "/api/chat",
  prepareSendMessagesRequest({ messages }) {
    return {
      body: {
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.parts.find((part) => part.type === "text")?.text || "",
        })),
      },
    };
  },
});
```

### 4. Sending Messages

Use the `sendMessage` function with a text property:

```typescript
await sendMessage({
  text: "Your message here",
});
```

## Advanced Features

### 1. Custom Transport

You can create custom transports for WebSockets or other protocols:

```typescript
class WebSocketTransport implements ChatTransport<UIMessage> {
  sendMessages(options) {
    // Custom implementation
  }

  reconnectToStream(options) {
    // Custom implementation
  }
}
```

### 2. Message Metadata

Add metadata to messages:

```typescript
await sendMessage({
  text: "Hello",
  metadata: {
    timestamp: Date.now(),
    userId: "user123",
  },
});
```

### 3. Tool Calls

Handle tool calls in your messages:

```typescript
const toolCall = message.parts.find(
  (part) => part.type === "tool"
) as ToolUIPart;
if (toolCall) {
  // Handle tool call
  console.log("Tool:", toolCall.toolName);
  console.log("Input:", toolCall.input);
}
```

### 4. Error Handling

```typescript
const { messages, sendMessage, status, error } = useChat<UIMessage>({
  onError: (error) => {
    console.error("Chat error:", error);
    // Show user-friendly error message
  },
});
```

### 5. Auto-resume

Resume interrupted streams:

```typescript
const { resumeStream } = useChat<UIMessage>({
  resume: true, // Auto-resume on mount
});
```

## Best Practices

1. **Always use `toUIMessageStreamResponse()`** in your API routes for v5 compatibility
2. **Access text content via `parts`** instead of `content` property
3. **Use proper status checks** (`'streaming'` instead of `'in_progress'`)
4. **Handle errors gracefully** with proper error boundaries
5. **Implement proper loading states** using the `status` property
6. **Use TypeScript** for better type safety and developer experience

## Migration from v4

Key changes when migrating from v4 to v5:

### Package Updates

```bash
# Update packages to v5
pnpm install ai@5.0.0 @ai-sdk/react@2.0.0 @ai-sdk/provider@2.0.0 @ai-sdk/provider-utils@3.0.0 zod@3.25.0
```

### Core Changes

1. **Import Changes**: Replace `useChat` from `ai/react` with `useChat` from `@ai-sdk/react`
2. **Message Structure**: Change `content` property to `parts` array
3. **Status Values**: Update status checks from `'in_progress'` to `'streaming'`
4. **Transport**: Use `DefaultChatTransport` instead of direct API calls
5. **API Response**: Return `UIMessageStreamResponse` from API routes

### Type System Changes

- `CoreMessage` → `ModelMessage`
- `Message` → `UIMessage`
- `convertToCoreMessages` → `convertToModelMessages`

### Tool Changes

- `parameters` → `inputSchema` in tool definitions
- `args/result` → `input/output` in tool calls
- `toolCallStreaming` removed (now default)
- Tool part types use specific names: `tool-${toolName}`

### Streaming Changes

- Single chunks → Start/Delta/End pattern with unique IDs
- `textDelta` → `delta` property
- New streaming states: `text-start`, `text-delta`, `text-end`
- Tool input streaming support

### UI Hook Changes

- `append` → `sendMessage` with structured format
- `reload` → `regenerate`
- `initialMessages` → `messages`
- `maxSteps` removed (use server-side `stopWhen`)
- Managed input state removed (must manage manually)
- `onResponse` callback removed

### API Route Changes

- `toTextStreamResponse()` → `toUIMessageStreamResponse()`
- `getErrorMessage` → `onError` callback
- Message ID generation moved to `toUIMessageStreamResponse`

### Provider Changes

- `providerMetadata` → `providerOptions`
- `maxTokens` → `maxOutputTokens`
- `experimental_*` options promoted to stable
- Temperature no longer defaults to 0

### File and Media Changes

- `mimeType` → `mediaType`
- File parts flattened in streams
- `experimental_attachments` → `parts` array

### Error Handling

- More granular error states
- Better type safety for tool calls
- Dynamic tool support with type narrowing

## Detailed Migration Reference

### API Route Changes

**Before (v4):**

```typescript
// app/api/chat/route.ts
import { streamText } from "ai";

export async function POST(request: Request) {
  const result = streamText({
    model: openai("gpt-4"),
    messages,
  });

  return result.toTextStreamResponse();
}
```

**After (v5):**

```typescript
// app/api/chat/route.ts
import { streamText } from "ai";

export async function POST(request: Request) {
  const result = streamText({
    model: openai("gpt-4"),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: () => generateId(),
  });
}
```

### Message Structure Changes

**Before (v4):**

```typescript
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const message: Message = {
  id: "1",
  role: "user",
  content: "Hello!",
};
```

**After (v5):**

```typescript
interface UIMessage {
  id: string;
  role: "user" | "assistant";
  parts: Array<UIMessagePart>;
}

const message: UIMessage = {
  id: "1",
  role: "user",
  parts: [{ type: "text", text: "Hello!" }],
};
```

### Tool Definition Changes

**Before (v4):**

```typescript
const weatherTool = tool({
  description: "Get weather for a city",
  parameters: z.object({
    city: z.string(),
  }),
  execute: async ({ city }) => {
    return `Weather in ${city}`;
  },
});
```

**After (v5):**

```typescript
const weatherTool = tool({
  description: "Get weather for a city",
  inputSchema: z.object({
    city: z.string(),
  }),
  execute: async ({ city }) => {
    return `Weather in ${city}`;
  },
});
```

### Streaming Changes

**Before (v4):**

```typescript
for await (const chunk of result.fullStream) {
  switch (chunk.type) {
    case "text-delta":
      process.stdout.write(chunk.textDelta);
      break;
  }
}
```

**After (v5):**

```typescript
for await (const chunk of result.fullStream) {
  switch (chunk.type) {
    case "text-start":
      console.log(`Starting text block: ${chunk.id}`);
      break;
    case "text-delta":
      process.stdout.write(chunk.delta);
      break;
    case "text-end":
      console.log(`Completed text block: ${chunk.id}`);
      break;
  }
}
```

### Provider Options Changes

**Before (v4):**

```typescript
const result = await generateText({
  model: openai("gpt-4"),
  prompt: "Hello",
  providerMetadata: {
    openai: { store: false },
  },
});
```

**After (v5):**

```typescript
const result = await generateText({
  model: openai("gpt-4"),
  prompt: "Hello",
  providerOptions: {
    openai: { store: false },
  },
});
```

### File Handling Changes

**Before (v4):**

```typescript
// In messages
const message = {
  role: 'user',
  content: 'Check this image',
  experimental_attachments: [
    { url: 'data:image/png;base64,...', contentType: 'image/png' }
  ]
};

// In streams
case 'file': {
  console.log('Media type:', chunk.file.mediaType);
  console.log('File data:', chunk.file.data);
}
```

**After (v5):**

```typescript
// In messages
const message: UIMessage = {
  role: 'user',
  parts: [
    { type: 'text', text: 'Check this image' },
    { type: 'file', url: 'data:image/png;base64,...', mediaType: 'image/png' }
  ]
};

// In streams
case 'file': {
  console.log('Media type:', chunk.mediaType);
  console.log('File data:', chunk.data);
}
```

### Error Handling Changes

**Before (v4):**

```typescript
return result.toDataStreamResponse({
  getErrorMessage: (error) => ({
    errorCode: "STREAM_ERROR",
    message: "An error occurred",
  }),
});
```

**After (v5):**

```typescript
return result.toUIMessageStreamResponse({
  onError: (error) => ({
    errorCode: "STREAM_ERROR",
    message: "An error occurred",
  }),
});
```

### Package Structure Changes

**New Package Requirements:**

```bash
# Core packages
pnpm install ai@5.0.0 @ai-sdk/react@2.0.0

# Additional packages (if needed)
pnpm install @ai-sdk/rsc@2.0.0        # React Server Components
pnpm install @ai-sdk/langchain@2.0.0  # LangChain integration
pnpm install @ai-sdk/llamaindex@2.0.0 # LlamaIndex
```

### Removed Features

The following features have been removed in v5:

- `useAssistant` hook
- `experimental_*` prefixes (promoted to stable)
- `maxSteps` in useChat (use server-side `stopWhen`)
- `toolCallStreaming` option (now default)
- `onResponse` callback
- `sendExtraMessageFields` option (now default)
- `keepLastMessageOnError` option
- `data` role in messages
- `StreamData` class
- `writeMessageAnnotation` and `writeData` methods

## Example with Advanced Features

```typescript
"use client";

import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";

export function AdvancedChat({
  session,
  chatId,
}: {
  session: any;
  chatId: string;
}) {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const { messages, sendMessage, status, stop, regenerate, error } =
    useChat<UIMessage>({
      id: chatId,
      experimental_throttle: 100,
      transport: new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest({ messages, id, body }) {
          return {
            body: {
              id,
              messages: messages.map((msg) => ({
                role: msg.role,
                content:
                  msg.parts.find((part) => part.type === "text")?.text || "",
              })),
              ...body,
            },
          };
        },
      }),
      onFinish: () => {
        console.log("Chat finished");
      },
      onError: (error) => {
        console.error("Chat error:", error);
      },
      onData: (data) => {
        console.log("Data received:", data);
      },
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || status === "streaming") return;

    await sendMessage({
      text: input.trim(),
      files: attachments.length > 0 ? attachments : undefined,
    });

    setInput("");
    setAttachments([]);
  };

  return (
    <div className="flex flex-col h-screen">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error.message}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="whitespace-pre-wrap">
                {message.parts.find((part) => part.type === "text")?.text || ""}
              </div>
              {message.parts.some((part) => part.type === "file") && (
                <div className="mt-2">
                  {message.parts
                    .filter((part) => part.type === "file")
                    .map((part, index) => (
                      <div key={index} className="text-sm opacity-75">
                        📎 {part.fileName}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {status === "streaming" && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-gray-500 text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
            disabled={status === "streaming"}
          />
          <button
            type="submit"
            disabled={!input.trim() || status === "streaming"}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {status === "streaming" ? "Sending..." : "Send"}
          </button>
          {status === "streaming" && (
            <button
              type="button"
              onClick={stop}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Stop
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
```

This guide covers the essential concepts and patterns for using Vercel AI SDK v5 effectively in your applications.
