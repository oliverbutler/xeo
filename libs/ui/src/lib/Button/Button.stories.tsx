import { Story, Meta } from '@storybook/react';
import { Button } from './Button';

export default {
  component: Button,
  title: 'Button',
} as Meta;

const Template: Story = (args) => <Button {...args}>Button</Button>;

export const Primary = Template.bind({});
Primary.args = {};
