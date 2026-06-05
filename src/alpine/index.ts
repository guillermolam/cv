import { registerChartComponents } from './charts';
import { registerWhoamiComponents } from './whoami';
import { registerHeerichComponents } from './heerich';

type AlpineLike = {
  data: (name: string, callback: () => unknown) => void;
};

export default (alpine: AlpineLike) => {
  registerChartComponents(alpine);
  registerWhoamiComponents(alpine);
  registerHeerichComponents(alpine);
};
