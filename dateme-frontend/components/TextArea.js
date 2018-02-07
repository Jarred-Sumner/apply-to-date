export default class TextArea extends React.Component {
  handleChange = evt => this.props.onChange(evt.target.value);

  render() {
    const { name, value, placeholder, type, ...otherProps } = this.props;

    return (
      <React.Fragment>
        <textarea
          {...otherProps}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
        />
        <style jsx>{`
          textarea {
            border-radius: 4px;
            border: 1px solid #e4e9f0;
            padding: 14px 22px;
            box-shadow: none;
            appearance: none;
            font-size: 21px;
            font-family: Frank Ruhl Libre, serif;
            line-height: 27px;
          }

          textarea::-webkit-input-placeholder {
            color: #b9bed1;
          }

          textarea::-moz-placeholder {
            color: #b9bed1;
          }
        `}</style>
      </React.Fragment>
    );
  }
}
