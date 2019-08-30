import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget';
import { App } from '../App';
import { TrayItemWidget } from './TrayItemWidget';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';
import styled from '@emotion/styled';

export interface BodyWidgetProps {
	app: App;
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
						<TrayItemWidget model={{ type: 'AudioIn' }} name="AudioIn" color="rgb(192,255,0)" />
						<TrayItemWidget model={{ type: 'AudioOut' }} name="AudioOut" color="rgb(0,192,255)" />
						<TrayItemWidget model={{ type: 'GainInv' }} name="GainInv" color="rgb(192,192,255)" />
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
							if (data.type === 'AudioIn') {
								node = new DefaultNodeModel('AudioIn ' + (nodesCount + 1), 'rgb(192,255,0)');
								node.addOutPort('output');
							} else if (data.type === 'AudioOut') {
								node = new DefaultNodeModel('AudioOut ' + (nodesCount + 1), 'rgb(0,192,255)');
								node.addInPort('input');
							} else if (data.type === 'GainInv') {
								node = new DefaultNodeModel('GainInv ' + (nodesCount + 1), 'rgb(0,192,255)');
								node.addInPort('input');
								node.addOutPort('output');
							} else {
								node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(0,192,255)');
								node.addOutPort('output');
							}
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
						<DemoCanvasWidget>
							<CanvasWidget engine={this.props.app.getDiagramEngine()} />
						</DemoCanvasWidget>
					</Layer>
				</Content>
			</Body>
		);
	}
}
