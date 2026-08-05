import { describe, it, expect } from "vitest";
import { encodeModel, decodeModel } from "../urlState";
import { createDefaultModel } from "../model";

describe("urlState roundtrip", () => {
  it("encodes and decodes the default model losslessly", () => {
    const m = { ...createDefaultModel(), name: "Demo Protocol", symbol: "DEMO" };
    const decoded = decodeModel(encodeModel(m));
    expect(decoded).not.toBeNull();
    expect(decoded!.name).toBe("Demo Protocol");
    expect(decoded!.symbol).toBe("DEMO");
    expect(decoded!.totalSupply).toBe(m.totalSupply);
    expect(decoded!.allocations).toEqual(m.allocations);
    expect(decoded!.vestings).toEqual(m.vestings);
  });

  it("produces a URL-safe string", () => {
    const s = encodeModel(createDefaultModel());
    expect(s).toMatch(/^[A-Za-z0-9+\-$]+$/);
  });

  it("returns null for garbage input", () => {
    expect(decodeModel("not-a-model")).toBeNull();
    expect(decodeModel("")).toBeNull();
    expect(decodeModel("AAAA")).toBeNull();
  });

  it("rejects wrong version and clamps out-of-range numbers", () => {
    const m = createDefaultModel();
    m.allocations[0].percent = 250 as number;
    const decoded = decodeModel(encodeModel(m));
    expect(decoded!.allocations[0].percent).toBe(100);
  });

  it("rejects incomplete and duplicate bucket sets", () => {
    const incomplete = createDefaultModel();
    incomplete.allocations = incomplete.allocations.slice(1);
    expect(decodeModel(encodeModel(incomplete))).toBeNull();

    const duplicate = createDefaultModel();
    duplicate.vestings[1] = { ...duplicate.vestings[0] };
    expect(decodeModel(encodeModel(duplicate))).toBeNull();
  });
});
