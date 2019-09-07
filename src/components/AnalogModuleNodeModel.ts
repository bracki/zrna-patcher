import { DefaultNodeModel, DefaultNodeModelOptions } from '@projectstorm/react-diagrams';

export interface AnalogModuleNodeOptions extends DefaultNodeModelOptions {
	parameters?: string[]
}

export class AnalogModuleNodeModel extends DefaultNodeModel {
	protected parameters: string[];
	constructor(options: AnalogModuleNodeOptions = {}) {
		super({
			...options,
			type: 'analog-module-node'
		});
		this.parameters = options.parameters || []
	}
	getParameters(): string[] {
		return this.parameters;
	}

	serialize() {
		return {
			...super.serialize(),
			parameters: this.parameters
		};
	}

	deserialize(event: any): void {
		super.deserialize(event);
		this.parameters = event.data.parameters;
	}
}
