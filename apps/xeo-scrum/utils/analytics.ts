import ReactGA from 'react-ga4';

const GA_TRACKING_ID = 'G-EFLQMW0KZH';

export const initGA = () => {
  ReactGA.initialize(GA_TRACKING_ID);
};

export enum UserAction {
  CLICK_ADD_NOTION_CONNECTION = 'click_add_notion_connection',
  ADD_NOTION_CONNECTION = 'add_notion_connection',
  LOGIN = 'login',
  LOGOUT = 'logout',
  SPRINT_CREATE = 'sprint_create',
  SPRINT_START_EDIT = 'sprint_start_edit',
  SPRINT_SAVE_EDIT = 'sprint_save_edit',
  SPRINT_DELETE = 'sprint_delete',
  SPRINT_VIEW = 'sprint_view',
}

export const trackUserIdentification = (userId: string | null) => {
  ReactGA.gtag('config', GA_TRACKING_ID, { user_id: userId });
};

export const trackAction = (action: UserAction) => {
  ReactGA.event({
    category: 'User',
    action,
  });
};

export const trackSprintAction = async (properties: {
  action: UserAction;
  sprintId: string;
}) => {
  ReactGA.event(
    {
      category: 'Sprint',
      action: properties.action,
    },
    {
      sprintId: properties.sprintId,
    }
  );
};
