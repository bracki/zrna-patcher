import * as React from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultPortLabel, DefaultPortModel } from '@projectstorm/react-diagrams-defaults';
import styled from '@emotion/styled';
import { AnalogModuleNodeModel } from './AnalogModuleNodeModel';
import { Knob } from 'react-rotary-knob';

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

export interface AnalogModuleNodeProps {
	node: AnalogModuleNodeModel;
	engine: DiagramEngine;
}

/**
 * Default node that models the DefaultNodeModel. It creates two columns
 * for both all the input ports on the left, and the output ports on the right.
 */
export class AnalogModuleNodeWidget extends React.Component<AnalogModuleNodeProps> {
	constructor(props: AnalogModuleNodeProps) {
		super(props);
		this.state = props.node.getParameters();
	}

	handleKnob = (parameter: string) => {
		return (value: number) => {
			console.log("Changing parameter", parameter, value);
			this.setState({[parameter]: value});
			this.props.node.setParameters(this.state);
			console.log(this.state);
		}; 
	}

	generatePort = (port: DefaultPortModel) => {
		return <DefaultPortLabel engine={this.props.engine} port={port} key={port.getID()} />;
	};

	generateKnob = (val: number, parameter: string) => {
		return (
			<div>
				<div>{parameter}</div>
				<Knob min={0} max={100} onChange={this.handleKnob(parameter)}></Knob>
			</div>
		)
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
				<Ports>
					<PortsContainer>{_.map(this.props.node.getInPorts(), this.generatePort)}</PortsContainer>
					<PortsContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</PortsContainer>
				</Ports>
			</Node>
		);
	}
}
