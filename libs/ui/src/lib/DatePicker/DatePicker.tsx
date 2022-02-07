import 'react-dates/initialize';
import { SingleDatePicker, SingleDatePickerShape } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { useState } from 'react';

/* eslint-disable-next-line */
export type DatePickerProps = Omit<
  SingleDatePickerShape,
  'focused' | 'onFocusChange'
>;

export const DatePicker: React.FunctionComponent<DatePickerProps> = (props) => {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <SingleDatePicker
      focused={focused}
      onFocusChange={({ focused }) => setFocused(focused)}
      {...props}
    />
  );
};

export default DatePicker;
