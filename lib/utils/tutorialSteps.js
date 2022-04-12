const tutorialSteps = [
  {
    content: <h2>Welcome to Notest</h2>,
    locale: { skip: <strong aria-label='skip'>S-K-I-P</strong> },
    placement: 'center',
    target: 'body',
  },
  {
    target: '.intro-notes-step',
    content: 'This is your main notes section, where you can take notes',
  },
  {
    target: '.intro-source-step textarea',
    content:
      'You can add text based information here, such as the first paragraph from an article',
  },
  {
    target: '.intro-generate-question-step button',
    content:
      'You can then generate questions to test yourself which would appear in the main notes',
  },
  {
    target: '.intro-testing-mode-step',
    content:
      'You can test yourself with the questions by switching to test mode. Good luck!',
  },
];

export { tutorialSteps };
