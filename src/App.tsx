import * as SRD from '@projectstorm/react-diagrams';
import { AnalogModuleNodeFactory } from './components/AnalogModuleNodeFactory';
import { DiagramModel } from '@projectstorm/react-diagrams';

/**
 * @author Dylan Vorster
 */
export class App {
	protected activeModel: SRD.DiagramModel;
	protected diagramEngine: SRD.DiagramEngine;

	constructor() {
		this.diagramEngine = SRD.default();
		this.diagramEngine.getNodeFactories().registerFactory(new AnalogModuleNodeFactory());
		this.activeModel = new SRD.DiagramModel();
		this.diagramEngine.setModel(this.activeModel);
	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public resetActiveModel() {
		this.activeModel = new SRD.DiagramModel();
		this.diagramEngine.setModel(this.activeModel);
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}