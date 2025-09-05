import { pipeline } from "@xenova/transformers";

let embedPipeline;

// Initialize the embedding model once
export const initEmbeddingModel = async () => {
  if (!embedPipeline) {
    embedPipeline = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
};

/**
 * Generate a single 1D embedding for the input text
 * @param {string} text
 * @returns {number[]} 1D embedding vector
 */
export const generateEmbedding = async (text) => {
  if (!embedPipeline) await initEmbeddingModel();

  const output = await embedPipeline(text);

  let embedding;

  // Check if output is 2D (token-level) or 1D (already pooled)
  if (Array.isArray(output[0][0])) {
    // 2D array: average across tokens
    const tokenVectors = output[0];
    const dim = tokenVectors[0].length;
    embedding = Array(dim).fill(0);

    for (const token of tokenVectors) {
      for (let i = 0; i < dim; i++) {
        embedding[i] += token[i];
      }
    }

    embedding = embedding.map((v) => v / tokenVectors.length);
  } else {
    embedding = output[0];
  }

  return embedding;
};
