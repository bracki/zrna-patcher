import styled from '@emotion/styled';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import * as _ from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { MdClear, MdFileUpload, MdHelp, MdPlayArrow } from "react-icons/md";
import * as request from 'request';
import { App } from '../App';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';
import { DemoButton, DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import { Helper } from '../helpers/Helper';
import { AnalogModule, Option } from '../zrna/AnalogModule';
import { AnalogModuleNodeModel } from './AnalogModuleNodeModel';
import { TrayWidget } from './TrayWidget';
import { GoMarkGithub } from "react-icons/go";


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

export interface PlayButtonProps {
	isLive: boolean
}

const PlayButton = styled.button<PlayButtonProps>`
	background: rgb(60, 60, 60);
	font-size: 14px;
	padding: 5px 10px;
	border: none;
	color: white;
    background-color: ${props => props.isLive ? "lime" : ""};
	outline: none;
	cursor: pointer;
	margin: 2px;
	border-radius: 3px;
	border-style: solid;
	border-color: black;

	&:hover {
		border-color: white;
		border-style: solid;
	}
`;

// Are we in live mode?
export const LiveModeContext = React.createContext(false);

//create your forceUpdate hook
function useForceUpdate() {
	const [value, set] = React.useState(true); //boolean state
	return () => set(value => !value); // toggle the state to force render
}

export function BodyWidget(props: BodyWidgetProps) {
	const forceUpdate = useForceUpdate();
	const [liveMode, setLiveMode] = useState(false);
	return (
		<Body>
			<Header>
				<div className="title">ZRNA patcher <a href="https://github.com/bracki/zrna-patcher"><GoMarkGithub /> bracki/zrna-patcher</a></div>
			</Header>
			<Content>
				<TrayWidget analogModules={props.analogModules} />
				<LiveModeContext.Provider value={liveMode}>
					<Layer
						onDrop={event => {
							var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
							var nodesCount = _.keys(
								props.app
									.getDiagramEngine()
									.getModel()
									.getNodes()
							).length;

							var node: AnalogModuleNodeModel;
							const analogModule = props.analogModules.find((m) => m.type === data.type);
							// Initialize parameters with 0 values
							const parameters = _.zipObject(analogModule!.parameters, _.fill(Array(analogModule!.parameters.length), 0));

							// Initialize options with default values
							// TODO move this to AnalogMdouleNodeModel
							const geloet = _.map(analogModule!.options, (o: Option) => {
								return {
									...o,
									value: o.valid_values[0]
								}
							})
							const zrnaOptions = _.keyBy(geloet, 'name')

							// Create new node
							node = new AnalogModuleNodeModel(
								{
									zrnaType: analogModule!.type,
									parameters: parameters,
									zrnaOptions: zrnaOptions,
									name: analogModule!.type + ' ' + (nodesCount + 1),
									color: Helper.stringToColor(analogModule!.type)
								});
							// Initialize ports/connections
							analogModule!.inputs.forEach((i) => node.addInPort(i));
							analogModule!.outputs.forEach((i) => node.addOutPort(i));
							// Place node where clicked
							var point = props.app.getDiagramEngine().getRelativeMousePoint(event);
							node.setPosition(point);
							props.app
								.getDiagramEngine()
								.getModel()
								.addNode(node);
							forceUpdate();
						}}
						onDragOver={event => {
							event.preventDefault();
						}}>
						<DemoWorkspaceWidget
							buttons={
								<div>
									<DemoButton onClick={() => {
										const model = props.app.getDiagramEngine().getModel().serialize();
										console.log(model);
										request.post("http://localhost:5000").json({ model: model });
									}}>
										<MdFileUpload /> Upload circuit
									</DemoButton>
									<DemoButton
										onClick={() => {
											const model = props.app.getDiagramEngine().getModel().serialize();
											console.log(model);
										}}>
										<MdHelp /> Print circuit
									</DemoButton>
									<DemoButton
										onClick={() => {
											console.log("CLEARING CIRCUIT");
											props.app.resetActiveModel();
											request.delete("http://localhost:5000");
											forceUpdate();
										}}>
										<MdClear /> Clear circuit
									</DemoButton>
									<PlayButton onClick={() => {
										setLiveMode(!liveMode);
										if (!liveMode) {
											console.log("Starting...")
											request.post("http://localhost:5000/start");
										} else {
											console.log("Pausing...")
											request.post("http://localhost:5000/pause");
										}
									}} isLive={liveMode}>
										<MdPlayArrow />
									</PlayButton>
								</div>
							}>
							<DemoCanvasWidget>
								<CanvasWidget engine={props.app.getDiagramEngine()} />
							</DemoCanvasWidget>
						</DemoWorkspaceWidget>
					</Layer>
				</LiveModeContext.Provider>
			</Content>
		</Body>
	);
}