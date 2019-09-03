import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget';
import { App } from '../App';
import { TrayItemWidget } from './TrayItemWidget';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';
import { DemoButton, DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import styled from '@emotion/styled';
import { AnalogModule } from '../zrna/AnalogModule';

export interface BodyWidgetProps {
	app: App;
	modules: Array<AnalogModule>;
}

export const Body = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	min-height: 100%;
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
					<TrayWidget>
						{ this.props.modules.map((m: AnalogModule, i: number) => (
							<TrayItemWidget model={{ type: m.type }} name={m.type} color="rgb(192,255,0)" />
						))}
					</TrayWidget>
					<Layer
						onDrop={event => {
							var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
							var nodesCount = _.keys(
								this.props.app
									.getDiagramEngine()
									.getModel()
									.getNodes()
							).length;

							var node: DefaultNodeModel;
							const analogModule = this.props.modules.find((m) => m.type === data.type);
							// TODO: Assign a unique colour
							node = new DefaultNodeModel(analogModule!.type + ' ' + (nodesCount + 1), 'rgb(192,255,0)' );
							analogModule!.inputs.forEach((i) => node.addInPort(i));
							analogModule!.outputs.forEach((i) => node.addOutPort(i));
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
										console.log(this.props.app.getDiagramEngine().getModel().getModels());
										console.log(this.props.app.getDiagramEngine().getModel().getLinks());
									}}>
									Serialize Graph
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