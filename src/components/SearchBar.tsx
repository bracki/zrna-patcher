import * as React from 'react';
import styled from '@emotion/styled';

export const SearchInput = styled.input`
	width: 22em;
	font-family: Helvetica, Arial;
	padding: 5px;
	margin: 0px 10px;
	border-radius: 5px;
	margin-bottom: 2px;
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
				<SearchInput
					type="text"
					placeholder="Search..."
					value={this.props.filterText}
					onChange={this.handleFilterTextChange}
				/>
			</form>
		);
	}
}