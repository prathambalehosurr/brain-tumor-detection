export interface PredictResponse {
  label: string;
  confidence: number;
  all_probs: {
    [key: string]: number;
  };
}

const USE_MOCK = false;

export async function predictTumor(file: File): Promise<PredictResponse> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          label: 'Meningioma',
          confidence: 94.2,
          all_probs: {
            Meningioma: 94.2,
            Glioma: 4.5,
            Pituitary: 1.3,
          },
        });
      }, 2000);
    });
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/predict', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'System Error: Failed to process MRI scan');
  }

  return response.json();
}
