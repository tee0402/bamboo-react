function Info({alertStyle, info}) {
  return (
    <div className="row">
      <div className="col-md-1"></div>
      <div className="col-md-10">
        <div className={"alert " + alertStyle} style={{fontSize: "18px"}}>
          {info}
        </div>
      </div>
      <div className="col-md-1"></div>
    </div>
  );
}

export default Info;