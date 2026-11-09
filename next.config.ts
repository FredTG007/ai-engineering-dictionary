import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  turbopack: {
    resolveAlias: {
      // Search by meaning loads the self-hosted plain wasm build from public/search-model/ort/.
      // The external-wasm entry stops the bundler from also emitting the 26 MB WebGPU wasm.
      "onnxruntime-web/webgpu": "./node_modules/onnxruntime-web/dist/ort.wasm.min.mjs",
    },
  },
};

export default nextConfig;
