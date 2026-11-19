export const audiences = [
  {
    id: 'household', nav: 'Households', name: 'Individuals & households', file: 'home-tech-help.html',
    description: 'Get help with a computer, a device or an everyday digital task.',
    enquiry: 'project-enquiry.html?audience=household'
  },
  {
    id: 'business', nav: 'Businesses', name: 'Businesses & SMEs', file: 'small-business.html',
    description: 'Buy IT support, website work or a data project for your business.',
    enquiry: 'project-enquiry.html?audience=business'
  },
  {
    id: 'employer', nav: 'Employers', name: 'Employers & recruiters', file: 'freelance-contracts.html',
    description: 'Hire Leighton for a freelance assignment or a contract role in your team.',
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
