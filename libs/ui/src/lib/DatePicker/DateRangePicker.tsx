import 'react-dates/initialize';
import {
  DateRangePicker as ReactDatesRangePicker,
  DateRangePickerShape,
  FocusedInputShape,
} from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { useState } from 'react';
import moment from 'moment';

/* eslint-disable-next-line */
export type DateRangePickerProps = Omit<
  DateRangePickerShape,
  'focusedInput' | 'onFocusChange'
>;

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

export const DateRangePicker: React.FunctionComponent<DateRangePickerProps> = (
  props
) => {
  const [focused, setFocused] = useState<FocusedInputShape | null>(null);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <ReactDatesRangePicker
      hideKeyboardShortcutsPanel={true}
      displayFormat={'ddd DD/MM/YY'}
      focusedInput={focused}
      isOutsideRange={() => false}
      onFocusChange={(focus) => setFocused(focus)}
      {...props}
    />
  );
};

export default DateRangePicker;
