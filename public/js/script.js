const CommentBox = React.createClass(
	{
		getInitialState: () => { return {data: [], searchTerm: ""}}
		,
		componentDidMount: function()
		{
			$.ajax({
				url: "/comments",
				dataType: "json"
			})
				.done(response => this.setState({data: response}))
				.fail(() => console.log("Unable to fetch data from server."));
		}
		,
		handleCommentSubmit: function({author, text}, callback)
		{
			$.ajax({
				method: "POST",
				url: "/comments",
				contentType: "application/json",
				data: JSON.stringify({
					date: Date.now(),
					author: author,
					text: text
				})
			})
				.done(() =>
				{
					this.componentDidMount();
					callback(null);
				})
				.fail(() => console.log("Unable to post comment."));
		}
		,
		handleSearch: function(searchTerm)
		{
			this.setState({searchTerm: searchTerm})
		}
		,
		render: function()
		{
			return (
				<div className="commentBox">
					<h1>Comments</h1>
					<SearchBox search={this.handleSearch}/>
					<CommentList data={this.state.data} searchTerm={this.state.searchTerm}/>
					<CommentForm handleCommentSubmit={this.handleCommentSubmit}/>
				</div>
			);
		}
	});

const SearchBox = React.createClass(
	{
		handleSearchTextChange: function({target: input})
		{
			this.props.search(input.value)
		}
		,
		render: function()
		{
			return (
				<div id="searchBox">
					<input
						className="form-control"
						placeholder="Search..."
						onChange={this.handleSearchTextChange} 
						type="text"/>
				</div>
			);
		}
	});

const CommentList = React.createClass(
	{
		render: function()
		{
			var id = 0;
			const comments = this.props.data
				.filter(comment => comment.text.toLowerCase().includes(this.props.searchTerm.toLowerCase()))
				.map(comment => 
				{
					return (
						<Comment author={comment.author} date={comment.date} key={id++}>
							{comment.text}
						</Comment>
					);
				})

			return (
				<div className="commentList">
					{comments}
				</div>
			);
		}
	});

const CommentForm = React.createClass(
	{
		getInitialState: () => { 
			return {
				author: "",
				text: ""
			}
		}
		,
		authorChanged: function({target: input})
		{
			this.setState({author: input.value});
		},
		textChanged: function({target: input})
		{
			this.setState({text: input.value});
		},
		handleSubmit: function(event)
		{
			event.preventDefault();

			this.props.handleCommentSubmit({
				author: this.state.author,
				text: this.state.text
			}, function(err)
			{
				if(!err)
				{
					this.setState(this.getInitialState())	
				}
			}.bind(this))
		},
		render: function()
		{
			return (
				<form role="form" onSubmit={this.handleSubmit}>
					<hr/>
					<input
						type="text"
						className="form-control"
						value={this.state.author}
						onChange={this.authorChanged}
						placeholder="Your name"/>
					<input 
						type="text"
						className="form-control"
						value={this.state.text}
						onChange={this.textChanged}
						placeholder="Say something..."/>
					<input className="btn btn-primary" type="submit" value="Post"/>
				</form>
			);
		}
	});

const Comment = React.createClass(
	{
		render: function()
		{
			const date = new Date(this.props.date);
			const dateString = `${date.toLocaleTimeString()}, ${date.toDateString()}`;

			return (
				<div className="panel panel-default">
					<div className="panel-heading">
						<span className="author">
							{this.props.author}
						</span>
						<span className="date">
							{dateString}
						</span>
					</div>
					<div className="panel-body">
						{this.props.children}
					</div>
				</div>
			);
		}
	});

ReactDOM.render(<CommentBox/>, $("#placeholder").get(0))