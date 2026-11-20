export const audiences = [
  {
    id: 'household', nav: 'Households', name: 'Individuals & households', file: 'home-tech-help.html',
    description: 'I can help with a slow PC, a printer, a repair or a one-off digital task.',
    enquiry: 'project-enquiry.html?audience=household'
  },
  {
    id: 'business', nav: 'Businesses', name: 'Businesses & SMEs', file: 'small-business.html',
    description: 'Get a written quote from me for IT support, a website or a data project.',
    enquiry: 'project-enquiry.html?audience=business'
  },
  {
    id: 'employer', nav: 'Employers', name: 'Employers & recruiters', file: 'freelance-contracts.html',
    description: 'See my work, request my CV or send me a freelance or contract opportunity.',
    enquiry: 'contract-enquiry.html'
  }
];

export const engagements = [
  {id: 'contract', name: 'Contract role'},
  {id: 'freelance', name: 'Freelance assignment'},
  {id: 'cover', name: 'Short-term project cover'},
  {id: 'cv', name: 'CV request'}
];

export const engagementFor = value => engagements.find(item => item.id === value);
