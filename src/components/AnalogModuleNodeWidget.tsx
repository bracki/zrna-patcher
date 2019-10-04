import * as React from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultPortLabel, DefaultPortModel } from '@projectstorm/react-diagrams-defaults';
import styled from '@emotion/styled';
import { AnalogModuleNodeModel } from './AnalogModuleNodeModel';
import { Knob } from 'react-rotary-knob';
import * as skins from 'react-rotary-knob-skin-pack';
import * as request from 'request';
import * as zrna from '../zrna/AnalogModule';
import Dropdown from 'react-dropdown';
import { Option } from 'react-dropdown';
import 'react-dropdown/style.css';
import { LiveModeContext } from './BodyWidget';


export const Node = styled.div<{ background: string; selected: boolean }>`
		background-color: ${p => p.background};
		border-radius: 5px;
		font-family: sans-serif;
		color: white;
		border: solid 2px black;
		overflow: visible;
		font-size: 11px;
		border: solid 2px ${p => (p.selected ? 'rgb(0,192,255)' : 'black')};
	`;

export const Title = styled.div`
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: nowrap;
		justify-items: center;
	`;

export const TitleName = styled.div`
		flex-grow: 1;
		padding: 5px 5px;
	`;

export const Ports = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
	`;

export const PortsContainer = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		&:first-child {
			margin-right: 10px;
		}

		&:only-child {
			margin-right: 0px;
		}
	`;

export const Parameters = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3));
	`;

export const ParametersContainer = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		&:first-child {
			margin-right: 10px;
		}

		&:only-child {
			margin-right: 0px;
		}
	`;

export const Options = styled.div`
	display: flex;
	background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4));
`;

export const OptionsContainer = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;

	&:first-child {
		margin-right: 10px;
	}

	&:only-child {
		margin-right: 0px;
	}
`;

export interface AnalogModuleNodeProps {
	node: AnalogModuleNodeModel;
	engine: DiagramEngine;
}

export interface AnalogModuleNodeParameters {
	[key: string]: number;
}

export interface AnalogModuleNodeOptions {
	[key: string]: zrna.Option;
}

export interface AnalogModuleNodeState {
	parameters: AnalogModuleNodeParameters;
	options: AnalogModuleNodeOptions;
}
/**
 * Default node that models the DefaultNodeModel. It creates two columns
 * for both all the input ports on the left, and the output ports on the right.
 */
export class AnalogModuleNodeWidget extends React.Component<AnalogModuleNodeProps, AnalogModuleNodeState> {
	static contextType = LiveModeContext;
	context!: React.ContextType<typeof LiveModeContext>;

	constructor(props: AnalogModuleNodeProps) {
		super(props);
		this.state = { parameters: props.node.getParameters(), options: props.node.getZrnaOptions() };
	}

	handleKnob = (parameter: string) => {
		return (value: number) => {
			this.setState(prevState => ({
				options: prevState.options,
				parameters: {
					...prevState.parameters,
					[parameter]: value
				}
			}));

			this.props.node.setParameters(this.state.parameters);
			if (this.context) {
				console.log("POSTING");
				const url = "http://localhost:5000/circuit/module/" + this.props.node.getID() + "/parameter/" + parameter;
				request.post(url).json({ value: value });
			} else {
				console.log("SKIPPING");
			}
		};
	}

	generatePort = (port: DefaultPortModel) => {
		return <DefaultPortLabel engine={this.props.engine} port={port} key={port.getID()} />;
	};

	generateKnob = (val: number, parameter: string) => {
		return (
			<div key={parameter}>
				<div>{parameter} {this.state.parameters[parameter].toFixed(3)}</div>
				<Knob unlockDistance={1} skin={skins.s9} min={0} max={1} onChange={this.handleKnob(parameter)} value={this.state.parameters[parameter]}></Knob>
			</div>
		)
	}

	generateOption = (o: zrna.Option) => {
		return (
			<div key={o.name}>
				<div>{o.name}</div>
				<Dropdown options={o.valid_values} value={o.value} onChange={this.handleOption(o.name)} placeholder="Select an option" />
			</div>
		)
	}

	handleOption = (option: string) => {
		return (o: Option) => {
			console.log("Setting " + option + " to " + o.value);
			this.setState(prevState => ({
				parameters: prevState.parameters,
				options: {
					...prevState.options,
					[option]: {
						...prevState.options[option],
						value: o.value
					}
				}
			}),
				() => {
					this.props.node.setZrnaOptions(this.state.options);
				}
			);
		};
	}

	render() {
		return (
			<Node
				data-default-node-name={this.props.node.getOptions().name}
				selected={this.props.node.isSelected()}
				background={this.props.node.getOptions().color!}>
				<Title>
					<TitleName>{this.props.node.getOptions().name}</TitleName>
				</Title>
				<Parameters>
					<ParametersContainer>{_.map(this.props.node.getParameters(), this.generateKnob)}</ParametersContainer>
				</Parameters>
				<Options>
					<OptionsContainer>{_.map(this.props.node.getZrnaOptions(), this.generateOption)}</OptionsContainer>
				</Options>
				<Ports>
					<PortsContainer>{_.map(this.props.node.getInPorts(), this.generatePort)}</PortsContainer>
					<PortsContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</PortsContainer>
				</Ports>
			</Node>
		);
	}
}
