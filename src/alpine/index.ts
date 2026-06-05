import { registerChartComponents } from './charts';
import { registerExperienceComponents } from './experience';
import { registerWhoamiComponents } from './whoami';
import { registerHeerichComponents } from './heerich';
import { registerNeuralSceneComponents } from './neural-scene';

type AlpineLike = {
  data: (name: string, callback: () => unknown) => void;
};

export default (alpine: AlpineLike) => {
  registerChartComponents(alpine);
  registerExperienceComponents(alpine);
  registerWhoamiComponents(alpine);
  registerHeerichComponents(alpine);
  registerNeuralSceneComponents(alpine);
};
