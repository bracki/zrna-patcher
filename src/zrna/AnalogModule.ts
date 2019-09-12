import zrna from './zrna.json';

export interface Option {
    name: string;
    valid_values: string[];
    value?: string;
}

export interface AnalogModule {
    type: string;
    options: Option[];
    parameters: string[];
    inputs: string[];
    outputs: string[];
}

export function analogModules(): AnalogModule[] {
    return zrna;
}

