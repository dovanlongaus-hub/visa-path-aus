import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4", "text-sm", false && "hidden")).toBe("px-4 text-sm");
  });
});
