export const moveFocusToPreviousBlock = async (currentBlock: string) => {
  // TODO handle first block in a list

  const currentBlockContainer = (await waitForElm(
    `[data-rbd-draggable-id="${currentBlock}"]`
  )) as HTMLInputElement;

  if (!currentBlockContainer) return;

  const previousBlock =
    currentBlockContainer.previousElementSibling?.querySelector(
      '.editable-block'
    ) as HTMLInputElement;

  if (!previousBlock) return;

  setCaretToEnd(previousBlock);
};

export const moveFocusToBlock = async (id: string) => {
  const insertedRow = (
    await waitForElm(`[data-rbd-draggable-id="${id}"]`)
  )?.querySelector('.editable-block') as HTMLInputElement;

  if (!insertedRow) return;

  insertedRow.focus();
};

/**
 * Set caret to the end of an input/block
 */
export const setCaretToEnd = (element: HTMLInputElement) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
  }
};

/**
 * Wait for element to be rendered => then return the element
 */
export const waitForElm = (selector: any): Promise<HTMLInputElement | null> => {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};
