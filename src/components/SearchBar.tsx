import * as React from 'react';

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