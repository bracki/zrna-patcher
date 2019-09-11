import styled from '@emotion/styled';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import * as _ from 'lodash';
import * as React from 'react';
import * as request from 'request';
import { App } from '../App';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';
import { DemoButton, DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import { Helper } from '../helpers/Helper';
import { AnalogModule } from '../zrna/AnalogModule';
import { AnalogModuleNodeModel } from './AnalogModuleNodeModel';
import { TrayWidget } from './TrayWidget';

export interface BodyWidgetProps {
	app: App;
	analogModules: Array<AnalogModule>;
}

export const Body = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	height: 100%;
`;

export const Header = styled.div`
	display: flex;
	background: rgb(30, 30, 30);
	flex-grow: 0;
	flex-shrink: 0;
	color: white;
	font-family: Helvetica, Arial, sans-serif;
	padding: 10px;
	align-items: center;
`;

export const Content = styled.div`
	display: flex;
	flex-grow: 1;
	height: 100%;
`;

export const Layer = styled.div`
	position: relative;
	flex-grow: 1;
`;

export class BodyWidget extends React.Component<BodyWidgetProps> {
	render() {
		return (
			<Body>
				<Header>
					<div className="title">ZRNA patcher</div>
				</Header>
				<Content>
					<TrayWidget analogModules={this.props.analogModules}/>
					<Layer
						onDrop={event => {
							var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
							var nodesCount = _.keys(
								this.props.app
									.getDiagramEngine()
									.getModel()
									.getNodes()
							).length;

							var node: AnalogModuleNodeModel;
							const analogModule = this.props.analogModules.find((m) => m.type === data.type);
							// Initialize parameters with 0 values
							const parameters = _.zipObject(analogModule!.parameters, _.fill(Array(analogModule!.parameters.length), 0));
							// Create new node
							node = new AnalogModuleNodeModel(
								{
									zrnaType: analogModule!.type,
									parameters: parameters,
									name: analogModule!.type + ' ' + (nodesCount + 1),
									color: Helper.stringToColor(analogModule!.type)
								});
				            // Initialize ports/connections
							analogModule!.inputs.forEach((i) => node.addInPort(i));
							analogModule!.outputs.forEach((i) => node.addOutPort(i));
							// Place node where clicked
							var point = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
							node.setPosition(point);
							this.props.app
								.getDiagramEngine()
								.getModel()
								.addNode(node);
							this.forceUpdate();
						}}
						onDragOver={event => {
							event.preventDefault();
						}}>
						<DemoWorkspaceWidget
							buttons={
								<DemoButton
									onClick={() => {
										const model = this.props.app.getDiagramEngine().getModel().serialize();
										console.log(model);
										request.post("http://localhost:5000").json({ model: model });
									}}>
									Upload circuit
								</DemoButton>
							}>
							<DemoCanvasWidget>
								<CanvasWidget engine={this.props.app.getDiagramEngine()} />
							</DemoCanvasWidget>
						</DemoWorkspaceWidget>
					</Layer>
				</Content>
			</Body>
		);
	}
}