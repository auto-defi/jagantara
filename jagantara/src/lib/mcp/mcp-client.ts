// lib/mcp-client.ts - Fixed MCP Client
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
export class JagantaraMCPClient {
  private client: Client;
  private transport: StdioClientTransport;

  constructor() {
    this.transport = new StdioClientTransport({
      command: "node",
      args: ["src/dist/mcp/mcp-server.js"],
    });

    this.client = new Client(
      {
        name: "jagantara-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );
  }

  async connect() {
    try {
      await this.client.connect(this.transport);
      console.log("Connected to Jagantara MCP Server");
    } catch (error) {
      console.error("Failed to connect to MCP server:", error);
      throw error;
    }
  }

  async getAvailableTools() {
    try {
      const response = (await this.client.request(
        {
          method: "tools/list",
        },
        ListToolsRequestSchema
      )) as any;

      return response.tools || [];
    } catch (error) {
      console.error("Error fetching available tools:", error);
      throw error;
    }
  }

  // (optional) define a response shape if you want type‑safe parsing
  ToolCallResponseSchema = z.object({
    content: z.array(
      z.object({
        type: z.literal("text"),
        text: z.string(),
      })
    ),
    isError: z.boolean().optional(),
  });

  async callTool(name: string, arguments_: Record<string, unknown>) {
    try {
      console.log(`Calling tool: ${name} with arguments:`, arguments_);

      const request = {
        method: "tools/call" as const,
        params: {
          name,
          arguments: arguments_,
        },
      };

      console.log(
        "Sending payload to MCP server:",
        JSON.stringify(request, null, 2)
      );

      // 1️⃣  send the request
      const rawResponse = await this.client.request(
        request,
        this.ToolCallResponseSchema
      ); // ← schema provided here

      console.log("Raw tool response:", rawResponse);

      // 2️⃣  (optional) validate the *response*
      const parsed = this.ToolCallResponseSchema.safeParse(rawResponse);
      if (!parsed.success) {
        console.warn(
          "Response did not match ToolCallResponseSchema:",
          parsed.error
        );
        return rawResponse; // fall back to raw
      }

      return parsed.data; // → { content, isError? }
    } catch (error) {
      console.error(`Error calling tool ${name}:`, error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.close();
      console.log("Disconnected from MCP server");
    } catch (error) {
      console.error("Error disconnecting:", error);
      // Don't throw here as we want to ensure cleanup
    }
  }
}
