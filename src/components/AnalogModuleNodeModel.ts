import { DefaultNodeModel, DefaultNodeModelOptions } from '@projectstorm/react-diagrams';
import { Dictionary } from 'lodash';
import { Option } from '../zrna/AnalogModule';
type Parameters = Dictionary<number>;
type ZrnaOptions = Dictionary<Option>;

export interface AnalogModuleNodeOptions extends DefaultNodeModelOptions {
	parameters?: Parameters;
	zrnaOptions?: ZrnaOptions;
	zrnaType?: string;
}

export class AnalogModuleNodeModel extends DefaultNodeModel {
	protected zrnaType: string;
	protected parameters: {};
	protected zrnaOptions: {};
	constructor(options: AnalogModuleNodeOptions = {}) {
		super({
			...options,
			type: 'analog-module-node'
		});
		this.parameters = options.parameters || {}
		this.zrnaOptions = options.zrnaOptions || {}
		this.zrnaType = options.zrnaType || ""
	}

	getZrnaOptions(): {} {
		return this.zrnaOptions;
	}

	setZrnaOptions(options: ZrnaOptions) {
		console.log("options");
		console.log(JSON.stringify(options));
		this.zrnaOptions = options;
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
			zrnaOptions: this.zrnaOptions,
			zrnaType: this.zrnaType
		};
	}

	deserialize(event: any): void {
		super.deserialize(event);
		this.parameters = event.data.parameters;
		this.zrnaOptions = event.data.zrnaOptions;
		this.zrnaType = event.data.zrnaType;
	}
}
