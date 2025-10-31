import { pipeline } from "@xenova/transformers";

let embedPipeline;

// ✅ Initialize embedding model once
export const initEmbeddingModel = async () => {
  if (!embedPipeline) {
    embedPipeline = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Embedding model loaded: all-MiniLM-L6-v2");
  }
};

/**
 * Generate a 1D embedding array for text (float array)
 * Ensures correct shape and datatype for MongoDB vector search.
 */
export const generateEmbedding = async (text) => {
  if (!embedPipeline) await initEmbeddingModel();

  // Run the pipeline
  const output = await embedPipeline(text, { pooling: "mean", normalize: true });

  // Xenova pipeline returns Tensor-like structure. Safely convert to JS array
  let embedding = Array.from(output.data || output[0]);

  // Ensure it's a Float32 array (required by MongoDB vector)
  embedding = embedding.map((v) => parseFloat(v));

  return embedding;
};
