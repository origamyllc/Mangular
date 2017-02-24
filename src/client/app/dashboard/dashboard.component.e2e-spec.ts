/**
 * Created by prashun on 10/31/16.
 */
describe('Dashboard Component', () => {

  beforeEach(async () => {
    return await browser.get('');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Yoda');
  });

  it('should show the chip dropdown', () => {
      expect(element(by.css('.dropdown:first-child')).isDisplayed()).toBeTruthy();
  });

  it('onclicking  the chip dropdown it should select the dropdown options and make module dropdown visible ', () => {
    element(by.css('.dropdown:first-child > button')).click();
    element(by.css('.dropdown:first-child > ul > li:first-child')).click();
    expect ( element(by.css('.dropdown:nth-child(2)')).isDisplayed()).toBeTruthy();
  });


});
