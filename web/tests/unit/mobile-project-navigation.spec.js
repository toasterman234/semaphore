import './setup';
import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import i18n from '@/plugins/i18';
import MobileProjectNavigation from '@/components/MobileProjectNavigation.vue';

function makeNavigation(items = [], currentPath = '/project/7/history') {
  return mount(MobileProjectNavigation, {
    props: { projectId: 7, currentPath, items },
    global: {
      plugins: [i18n],
      stubs: {
        RouterLink: {
          props: ['to'],
          template: '<a :href="to"><slot /></a>',
        },
        VIcon: true,
      },
    },
  });
}

const menuItems = [
  { key: 'schedule', title: 'Schedule', icon: 'mdi-clock-outline', to: '/project/7/schedule' },
  { key: 'workflows', title: 'Workflows', icon: 'mdi-graph', to: '/project/7/workflows' },
  { key: 'templates', title: 'Templates', icon: 'mdi-check', to: '/project/7/templates' },
];

describe('MobileProjectNavigation', () => {
  it('always links to the current project dashboard', () => {
    const wrapper = makeNavigation(menuItems);
    expect(wrapper.get('[data-testid="mobile-navigation-dashboard"]').attributes('href'))
      .to.equal('/project/7/history');
    expect(wrapper.get('[data-testid="mobile-navigation-dashboard"]').attributes('aria-current'))
      .to.equal('page');
    wrapper.unmount();
  });

  it('prefers the available templates and workflows routes for primary tabs', () => {
    const wrapper = makeNavigation(menuItems);
    expect(wrapper.get('[data-testid="mobile-navigation-templates"]').attributes('href'))
      .to.equal('/project/7/templates');
    expect(wrapper.get('[data-testid="mobile-navigation-workflows"]').attributes('href'))
      .to.equal('/project/7/workflows');
    expect(wrapper.find('[data-testid="mobile-navigation-schedule"]').exists()).to.equal(false);
    wrapper.unmount();
  });

  it('does not invent hidden or unlicensed menu links', () => {
    const wrapper = makeNavigation([menuItems[0]]);
    expect(wrapper.get('[data-testid="mobile-navigation-schedule"]').exists()).to.equal(true);
    expect(wrapper.find('[data-testid="mobile-navigation-workflows"]').exists()).to.equal(false);
    expect(wrapper.find('[data-testid="mobile-navigation-templates"]').exists()).to.equal(false);
    wrapper.unmount();
  });

  it('marks nested routes active but not similarly prefixed routes', () => {
    const wrapper = makeNavigation(menuItems, '/project/7/workflows/42/runs');
    expect(wrapper.get('[data-testid="mobile-navigation-workflows"]').attributes('aria-current'))
      .to.equal('page');
    expect(wrapper.get('[data-testid="mobile-navigation-dashboard"]').attributes('aria-current'))
      .to.equal(undefined);
    wrapper.unmount();
  });

  it('opens the existing project drawer through an explicit event', async () => {
    const wrapper = makeNavigation(menuItems);
    await wrapper.get('[data-testid="mobile-navigation-more"]').trigger('click');
    expect(wrapper.emitted('open-menu')).to.have.length(1);
    wrapper.unmount();
  });
});
