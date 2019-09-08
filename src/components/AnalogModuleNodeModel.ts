import { DefaultNodeModel, DefaultNodeModelOptions } from '@projectstorm/react-diagrams';
import { Dictionary } from 'lodash';

type Parameters = Dictionary<number>;

export interface AnalogModuleNodeOptions extends DefaultNodeModelOptions {
	parameters?: Parameters;
	zrnaType?: string;
}

export class AnalogModuleNodeModel extends DefaultNodeModel {
	protected zrnaType: string;
	protected parameters: {};
	constructor(options: AnalogModuleNodeOptions = {}) {
		super({
			...options,
			type: 'analog-module-node'
		});
		this.parameters = options.parameters || {}
		this.zrnaType = options.zrnaType || ""
	}

	getParameters(): {} {
		return this.parameters;
	}

	setParameters(parameters: Parameters) {
		this.parameters = parameters;
	}

	serialize() {
		return {
			...super.serialize(),
			parameters: this.parameters,
			zrnaType: this.zrnaType
		};
	}

	deserialize(event: any): void {
		super.deserialize(event);
		this.parameters = event.data.parameters;
		this.zrnaType = event.data.zrnaType;
	}
}
