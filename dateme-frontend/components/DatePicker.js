import React from "react";
import moment from "moment";

export default class DatePicker extends React.Component {
  static defaultProps = {
    maxYear: 2018 - 18,
    minYear: 1917,
    monthLabel: "Month",
    dayLabel: "Day",
    yearLabel: "Year",
    useMonthNames: true
  };

  constructor(props) {
    super(props);
    const { dayLabel, monthLabel, yearLabel, value } = props;

    this.state = {
      day: null,
      month: null,
      year: null,
      selectDay: value
        ? moment(value).date()
        : props.mode === "TH" ? "วันที่" : dayLabel,
      selectMonth: value
        ? moment(value).month() + 1
        : props.mode === "TH" ? "เดือน" : monthLabel,
      selectYear: value
        ? moment(value).year()
        : props.mode === "TH" ? "ปี" : yearLabel
    };
  }

  shouldComponentUpdate(_nextProps, nextState) {
    return (
      this.state.selectDay !== nextState.selectDay ||
      this.state.selectMonth !== nextState.selectMonth ||
      this.state.selectYear !== nextState.selectYear
    );
  }

  componentWillMount() {
    let day = [],
      month = [],
      year = [];

    const pad = n => {
      return n < 10 ? "0" + n : n;
    };

    for (let i = 1; i <= 31; i++) {
      day.push(this.props.padDay ? pad(i) : i);
    }

    let monthIndex = 1;
    for (const monthName of moment.localeData().months()) {
      month.push({
        text: this.props.useMonthNames
          ? monthName
          : this.props.padMonth ? pad(monthIndex) : monthIndex,
        value: monthIndex
      });
      monthIndex++;
    }

    for (let i = this.props.maxYear; i >= this.props.minYear; i--) {
      year.push(i);
    }

    this.setState({
      day: day,
      month: month,
      year: year
    });
  }

  changeDate(e, type) {
    this.setState({
      [type]: e.target.value
    });
    this.checkDate(e.target.value, type);
  }

  getDate(date) {
    if (moment(date).isValid()) {
      return moment(date).format();
    } else {
      return null;
    }
  }

  checkDate(value, type) {
    let { selectDay, selectMonth, selectYear } = this.state;

    if (type === "selectDay") {
      selectDay = value;
    } else if (type === "selectMonth") {
      selectMonth = value;
    } else if (type === "selectYear") {
      selectYear = value;
    }

    if (this.isSelectedAllDropdowns(selectDay, selectMonth, selectYear)) {
      const dateObject = {
        year: selectYear,
        month: selectMonth - 1,
        day: selectDay
      };
      this.props.onChange(this.getDate(dateObject));
    } else {
      this.props.onChange(null);
    }
  }

  isSelectedAllDropdowns(selectDay, selectMonth, selectYear) {
    if (selectDay === "" || selectMonth === "" || selectYear === "") {
      return false;
    }
    return this.props.mode === "TH"
      ? selectDay !== "วันที่" && selectMonth !== "เดือน" && selectYear !== "ปี"
      : selectDay !== this.props.dayLabel &&
          selectMonth !== this.props.monthLabel &&
          selectYear !== this.props.yearLabel;
  }

  render() {
    const dayElement = this.state.day.map((day, id) => {
      return (
        <option value={day} key={id}>
          {day}
        </option>
      );
    });
    const monthElement = this.state.month.map((month, id) => {
      return (
        <option value={month.value} key={id}>
          {month.text}
        </option>
      );
    });
    const yearElement = this.state.year.map((year, id) => {
      return (
        <option value={year} key={id}>
          {year}
        </option>
      );
    });

    return (
      <div>
        <select
          className={this.props.className}
          value={this.state.selectMonth}
          onChange={e => this.changeDate(e, "selectMonth")}
        >
          <option value="">
            {this.props.mode === "TH" ? "เดือน" : this.props.monthLabel}
          </option>
          {monthElement}
        </select>
        <select
          className={this.props.className}
          value={this.state.selectDay}
          onChange={e => this.changeDate(e, "selectDay")}
        >
          <option value="">
            {this.props.mode === "TH" ? "วันที่" : this.props.dayLabel}
          </option>
          {dayElement}
        </select>
        <select
          className={this.props.className}
          value={this.state.selectYear}
          onChange={e => this.changeDate(e, "selectYear")}
        >
          <option value="">
            {this.props.mode === "TH" ? "ปี" : this.props.yearLabel}
          </option>
          {yearElement}
        </select>
        <style jsx>{`
          div {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 7px;
            width: 100%;
          }
          select {
            width: 100%;
            display: flex;
            font-family: Open Sans, sans-serif;
            align-items: center;
            align-content: center;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.75);
            height: 100%;
          }
        `}</style>
      </div>
    );
  }
}
