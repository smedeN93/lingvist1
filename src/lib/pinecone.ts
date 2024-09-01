import { Pinecone } from "@pinecone-database/pinecone";

export const getPineconeClient = () => {
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  return client;
};

export const upsertVectors = async (
  indexName: string,
  vectors: { id: string; values: number[]; metadata: Record<string, any> }[]
) => {
  const pinecone = getPineconeClient();
  const index = pinecone.Index(indexName);

  await index.upsert(vectors);
};

export const queryVectors = async (
  indexName: string,
  queryVector: number[],
  topK: number
) => {
  const pinecone = getPineconeClient();
  const index = pinecone.Index(indexName);

  const queryResponse = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });

  return queryResponse.matches || [];
};
