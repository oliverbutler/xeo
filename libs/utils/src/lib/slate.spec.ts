import {
  emptySlateText,
  isMentionElement,
  MentionElement,
  SlateBlockType,
} from './slate';

describe('slate', () => {
  it('typeguard should work', () => {
    const data: MentionElement = {
      type: SlateBlockType.MENTION_PAGE,
      pageId: '123',
      children: [{ text: 'hello', ...emptySlateText }],
    };

    expect(isMentionElement(data)).toBe(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data2: any = {
      type: SlateBlockType.PARAGRAPH,
      children: [{ text: 'hello', ...emptySlateText }],
    };

    expect(isMentionElement(data2)).toBe(false);
  });
});
