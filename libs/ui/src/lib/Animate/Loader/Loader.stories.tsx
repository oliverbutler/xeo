import { Story, Meta } from '@storybook/react';
import { Loader } from './Loader';

export default {
  component: Loader,
  title: 'Loader',
} as Meta;

const Template: Story = (args) => <Loader {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
