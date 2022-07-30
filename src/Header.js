function LoginButtons() {
  return (
    <>
      <button type="button" className="btn btn-success pull-right" data-toggle="modal" data-target="#register" style={{marginRight:"30px"}}>Register</button>
			<button type="button" className="btn btn-success pull-right" data-toggle="modal" data-target="#login" style={{marginRight: "20px"}}>Login</button>
    </>
  );
}

function Title() {
  return (
    <>
      <h1 style={{marginLeft: "30px"}}>
        <a href="." style={{textDecoration: "none"}}>
          <strong style={{color: "#99bc20"}}>Bamboo</strong>
          <img src="bamboo.png" alt="Bamboo" height="33px" style={{marginLeft: "5px"}} />
        </a>
      </h1>
      <h4 style={{marginLeft: "30px"}}>
        <small>Grow your savings for financial independence or retirement</small>
      </h4>
    </>
  );
}

function Register() {
  return (
    <div id="register" className="modal fade" role="dialog">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal">&times;</button>
							<h4 className="modal-title">Register</h4>
						</div>
						<div className="modal-body">
							<form id="formRegister" method="post" action="/">
								<div className="form-group">
									<label>Email Address:</label>
									<input id="registerEmailAddress" type="email" className="form-control" name="registerEmailAddress" required />
								</div>
								<div className="form-group">
									<label>Password: (8 characters minimum)</label>
									<input id="registerPassword" type="password" className="form-control" name="registerPassword" pattern=".{8,}" title="8 characters minimum" required />
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button type="submit" name="register" className="btn btn-success pull-right" form="formRegister">Register</button>
						</div>
					</div>
				</div>
			</div>
  );
}

function Login() {
  return (
    <div id="login" className="modal fade" role="dialog">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal">&times;</button>
							<h4 className="modal-title">Login</h4>
						</div>
						<div className="modal-body">
							<form id="formLogin" method="post" action="/">
								<div className="form-group">
									<label>Email Address:</label>
									<input id="loginEmailAddress" type="email" className="form-control" name="loginEmailAddress" required />
								</div>
								<div className="form-group">
									<label>Password:</label>
									<input id="loginPassword" type="password" className="form-control" name="loginPassword" required />
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button type="submit" name="login" className="btn btn-success pull-right" form="formLogin">Login</button>
						</div>
					</div>
				</div>
			</div>
  );
}

function Header() {
  return (
    <div className="row">
      <div className="page-header">
        <LoginButtons />
        <Title />
        <Register />
        <Login />
      </div>
    </div>
  );
}

export default Header;