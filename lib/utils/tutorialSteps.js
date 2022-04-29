const baseTutorialConfig = {
  disableBeacon: true,
  spotlightPadding: 0,
};

const tutorialSteps = [
  {
    content: <h2>Welcome to Notest</h2>,
    // locale: { skip: <strong aria-label='skip'>S-K-I-P</strong> },
    placement: 'center',
    target: 'body',
    ...baseTutorialConfig,
  },
  {
    target: '.intro-notes-step',
    content: 'This is your main notes section, where you can take notes',
    ...baseTutorialConfig,
  },
  {
    target: '.intro-source-step textarea',
    content:
      'You can add text based information here, such as the first paragraph from an article',
    ...baseTutorialConfig,
  },
  // {
  //   target: '.intro-generate-question-step button',
  //   content:
  //     'You can then generate questions to test yourself which would appear in the main notes',
  //   // disableBeacon: true,
  //   // ...baseTutorialConfig,
  // },
  // {
  //   target: '.intro-question-mode',
  //   content:
  //     'You can tailor the type of questions generated to fit your specific needs!',
  //   ...baseTutorialConfig,
  // },
  // {
  //   target: '.intro-add-notes',
  //   content: 'You can add notes from the side bar and add additional notes',
  //   ...baseTutorialConfig,
  // },
  {
    target: '.intro-testing-mode-step',
    content:
      'You can test yourself with the questions by switching to test mode. Good luck!',
    ...baseTutorialConfig,
  },
];

export { tutorialSteps };
