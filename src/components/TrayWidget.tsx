import * as React from 'react';
import styled from '@emotion/styled';
import { AnalogModule } from '../zrna/AnalogModule';
import { TrayItemWidget } from './TrayItemWidget';
import { Helper } from '../helpers/Helper';

export const Tray = styled.div`
	min-width: 200px;
	background: rgb(20, 20, 20);
	flex-grow: 0;
	flex-shrink: 0;
	overflow-y: auto;
`;

export interface SearchBarProps {
	filterText: string
	onFilterTextChange(filterText: string): void
}

export class SearchBar extends React.Component<SearchBarProps> {
	constructor(props: SearchBarProps) {
		super(props)
		this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
	}

	handleFilterTextChange(e: React.ChangeEvent<HTMLInputElement>) {
		this.props.onFilterTextChange(e.target.value);
	}

	render() {
		return (
			<form>
				<input
					type="text"
					placeholder="Search..."
					value={this.props.filterText}
					onChange={this.handleFilterTextChange}
				/>
			</form>
		);
	}
}

export interface TrayWidgetProps {
	analogModules: AnalogModule[];
}

export interface TrayWidgetState {
	filterText: string;
}

export class TrayWidget extends React.Component<TrayWidgetProps, TrayWidgetState> {
	constructor(props: any) {
		super(props);
		this.state = { filterText: '' };
		this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
	}

	handleFilterTextChange(filterText: string) {
		this.setState({ filterText: filterText });
	}

	render() {
		const analogModules = this.props.analogModules.filter((m: AnalogModule) => { return m.type.startsWith(this.state.filterText) });
		return (
			<Tray>
				<SearchBar filterText={this.state.filterText} onFilterTextChange={this.handleFilterTextChange} />
				{analogModules.map((m: AnalogModule, i: number) => (
					<TrayItemWidget model={{ type: m.type }} name={m.type} color={Helper.stringToColor(m.type)} key={i} />
				))
				}
			</Tray >
		);
	}
}
