import { getEnvironment } from '../utils/enviroment.util';
import development from './development';
import production from './production';

interface IConfig {
    [key: string]: any;
}

const configuration: IConfig = {
    development,
    production
}

export default configuration[getEnvironment()];