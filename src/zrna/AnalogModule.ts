import zrna from './zrna.json';

export interface AnalogModule {
    type: string;
    options: Array<string>;
    parameters: Array<string>;
    inputs: Array<string>;
    outputs: Array<string>;
}

export function analogModules(): Array<AnalogModule> {
    return zrna;
}

