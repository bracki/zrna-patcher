import * as React from 'react';
import { AnalogModuleNodeModel } from './AnalogModuleNodeModel';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { AnalogModuleNodeWidget } from './AnalogModuleNodeWidget';

export class AnalogModuleNodeFactory extends AbstractReactFactory<AnalogModuleNodeModel, DiagramEngine> {
	constructor() {
		super('analog-module-node');
	}

	generateModel(event: any) {
		return new AnalogModuleNodeModel();
	}

	generateReactWidget(event: any): JSX.Element {
		return <AnalogModuleNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}
