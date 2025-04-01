import axios from 'axios';

export interface ApiConfig {
  apiKey: string;
  chainId: string;
}

export interface GenerateContractRequest {
  prompt: string;
  chainId: number | string;
}

export interface GenerateContractResponse {
  contract?: string;
  address?: string;
  tx?: string;
  [key: string]: any;
}

export async function generateSmartContract(
  config: ApiConfig,
  request: GenerateContractRequest
): Promise<GenerateContractResponse> {
  try {
    // Convert chainId to number if provided as string
    const chainId = typeof request.chainId === 'string' 
      ? parseInt(request.chainId, 10) 
      : request.chainId;

    const response = await axios.post(
      'https://w3gpt.ai/api/v1/contracts/deploy',
      {
        prompt: request.prompt,
        chainId: chainId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error generating smart contract:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`API Error: ${errorMessage}`);
    }
    
    throw error;
  }
}