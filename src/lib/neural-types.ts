export interface NeuronNode {
  id: string;
  label: string;
  color: string;
  description?: string;
}

export interface AxonNode {
  id: string;
  label: string;
  neuronId: string;
  type: 'category' | 'skill';
  description?: string;
}

export interface DendriteNode {
  id: string;
  label: string;
  axonId: string;
  neuronId: string;
  usageCount: number;
  website?: string;
  tagIds?: string[];
}

export interface Synapse {
  from: string;
  to: string;
  type: string;
  weight?: number;
}

export interface NeuralGraphData {
  neurons: NeuronNode[];
  axons: AxonNode[];
  dendrites: DendriteNode[];
  synapses: Synapse[];
  generatedAt: string;
}
