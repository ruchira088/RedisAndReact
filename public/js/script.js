const CommentBox = React.createClass(
	{
		getInitialState: () => { return {data: []}}
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
		render: function()
		{
			return (
				<div className="commentBox">
					<h1>Comments</h1>
					<CommentList data={this.state.data}/>
					<CommentForm handleCommentSubmit={this.handleCommentSubmit}/>
				</div>
			);
		}
	});

const CommentList = React.createClass(
	{
		render: function()
		{
			var id = 0;
			const comments = this.props.data.map(comment => 
			{
				return (
					<Comment author={comment.author} key={id++}>
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
				<form className="commentForm" onSubmit={this.handleSubmit}>
					<input 
						type="text" 
						value={this.state.author} 
						onChange={this.authorChanged} 
						placeholder="Your name"/>

					<input 
						type="text" 
						value={this.state.text}
						onChange={this.textChanged}
						placeholder="Say something..."/>

					<input type="submit" value="Post"/>
				</form>
			);
		}
	});

const Comment = React.createClass(
	{
		render: function()
		{
			return (
				<div className="comment">
					<div className="author">
						{this.props.author}
					</div>
					<div className="contents">
						{this.props.children}
					</div>
				</div>
			);
		}
	});

ReactDOM.render(<CommentBox/>, $("#placeholder").get(0))