import React from 'react';
import path from 'path';

class FileExplorer extends React.Component {
	constructor (props) {
		super(props);
        this.state = {
          selectedfile : this.props.defaultFile,
          filenames : []
        };
    this.handleChange = this.handleChange.bind(this);

    // List all files in directory
    this.props.socket.on('server:listDirResponse'+this.props.folder, msg => {
      this.setState({filenames: msg});
    });
    this.props.socket.emit('client:listDirRequest', this.props.folder);

    // Receive data from server
    this.props.socket.on('server:readFileResponse'+this.state.selectedFile, msg => {
      this.props.func(msg);
    });
  }

	handleChange (event) {
    const filename = event.target.value;
    
    if(filename != "default"){
      this.props.socket.on('server:readFileResponse'+this.state.selectedFile, msg => {});
      this.props.socket.on('server:readFileResponse'+filename, msg => {
        this.props.func(msg);
      });
    	this.setState({selectedfile: filename});
      const fileRequestData = {
        folder:this.props.folder, 
        filename:filename
      };
      this.props.socket.emit('client:readFileRequest', JSON.stringify(fileRequestData));
    }
	}

	render() {
      let rows = [<option value='default'>Choose a file</option>];
      const filenames = this.state.filenames;
      for (var i=0; i < filenames.length; i++) {
          rows.push(<option value={filenames[i]} key={filenames[i]}>{filenames[i]}</option>);
      }
	    return (
      	<select value={this.state.selectedfile} onChange={this.handleChange}>
          {rows}
    		</select>
	    );
	  }
}

export default FileExplorer;