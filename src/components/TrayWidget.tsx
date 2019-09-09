import * as React from 'react';
import styled from '@emotion/styled';

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
		console.log("jasjasdjasdjasd");
		console.log(e.target.value);
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

export interface TrayWidgetState {
	filterText: string
}

export class TrayWidget extends React.Component<{}, TrayWidgetState> {
	constructor(props: any) {
		super(props);
		this.state = {filterText: ''};
		this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
	}

	handleFilterTextChange(filterText: string) {
		console.log("eulenbeule");
		console.log(filterText);
		this.setState({filterText: filterText});
	}

	render() {
		const children = React.Children.toArray(this.props.children).filter((c: any) => {return c.props.name.startsWith(this.state.filterText)});
		return (
			<Tray>
				<SearchBar filterText={this.state.filterText} onFilterTextChange={this.handleFilterTextChange} />
				{children}
			</Tray >
		);
	}
}
