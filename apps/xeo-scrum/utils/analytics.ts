import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-EFLQMW0KZH');
};

export const logPageView = () => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};
