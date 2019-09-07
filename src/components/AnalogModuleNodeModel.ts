import { DefaultNodeModel, DefaultNodeModelOptions } from '@projectstorm/react-diagrams';

export interface AnalogModuleNodeOptions extends DefaultNodeModelOptions {
	parameters?: string[];
	zrnaType?: string;
}

export class AnalogModuleNodeModel extends DefaultNodeModel {
	protected parameters: string[];
	protected zrnaType: string;
	constructor(options: AnalogModuleNodeOptions = {}) {
		super({
			...options,
			type: 'analog-module-node'
		});
		this.parameters = options.parameters || []
		this.zrnaType = options.zrnaType || ""
	}
	getParameters(): string[] {
		return this.parameters;
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
