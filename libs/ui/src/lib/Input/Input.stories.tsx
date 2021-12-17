import { Story, Meta } from '@storybook/react';
import { Input } from './Input';

export default {
  component: Input,
  title: 'Input',
} as Meta;

const Template: Story = (args) => <Input {...args} label={args.label} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Input',
  placeholder: "I'm an input",
};

export const ErrorMessage = Template.bind({});
ErrorMessage.args = {
  label: 'Input',
  error: {
    message: 'Problem with input given',
  },
};
