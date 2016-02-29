import React from 'react';
import { render } from 'react-dom';
import FileExplorer from './filexplorer.jsx';

import io from 'socket.io-client';
let socketPort = 3001;
let socket = io('http://localhost:' + socketPort.toString());
socket.on('connect', function(){console.log('connected')});

class CodeEditor extends React.Component {
	constructor (props) {
		super(props);
	}
	render () {
		return (
			<div>
				{this.props.defaultValue}
			</div>
			)
	}
}

class JsFileExplorerTest extends React.Component {
	constructor (props) {
		super(props);
        this.state = {
          editor : <CodeEditor defaultValue='Hello World' />
        };
        this.jsExpFunc = this.jsExpFunc.bind(this);
    }

	jsExpFunc (filecontent){
		this.setState({
			editor: <CodeEditor defaultValue={filecontent} />
		})
	}

	render () {
		return (
			<div>
			    <FileExplorer socket={socket} defaultFile='' folder='cells' func={this.jsExpFunc}/> 
				{this.state.editor}
			</div>
		)
	}
}

function docExpFunc (json) {
	const doc = JSON.parse(json);
	const filenames = doc.files;
	doc.cells = [];
	for(let filename of filenames){
		cell = doc.add();
		cell.filename = filename;
		cell.socket = socket;
	}
	doc.update();
}

class FileExplorerTest extends React.Component {
	render () {
		return (
			<div>
				<FileExplorer socket={socket} defaultFile='' folder='docs' func={docExpFunc}/>
				<JsFileExplorerTest />
			</div>
		)
	}
}

render(
	<FileExplorerTest />,
  document.getElementById('example')
);

if (module.hot) {
  module.hot.accept();
}