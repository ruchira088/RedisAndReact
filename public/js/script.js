const data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is my comment"}
];

const CommentBox = React.createClass(
	{
		getInitialState: () => { return {data: []}}
		,
		componentDidMount: function()
		{
			this.setState({data: data})
		}
		,
		render: function()
		{
			return (
				<div className="commentBox">
					<h1>Comments</h1>
					<CommentList data={this.state.data}/>
					<CommentForm/>
				</div>
			);
		}
	});

const CommentList = React.createClass(
	{
		render: function()
		{
			const comments = this.props.data.map(comment => 
			{
				return (
					<Comment author={comment.author} key={comment.id}>
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
			console.log(`The author is ${this.state.author}`)
			$.ajax({
				method: "POST",
				url: "comments",
				contentType: "application/json",
				data: JSON.stringify({
					author: this.state.author,
					comment: this.state.text
				})
			})
			this.setState(this.getInitialState());
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