

describe('Sidenav Component', () => {

  beforeEach(async () => {
    return await browser.get('');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Yoda');
  });

  it('should have a hamburger menu', () => {
     expect(element(by.css('.hamburger')).isDisplayed()).toBeTruthy();
  });

  it('should click the a hamburger menu', () => {
     element(by.css('.hamburger')).click();
  });

  it('should click the Dashboard link', () => {
    element(By.css('.menu')).all(By.tagName('li')).get(0).click();
    expect(browser.getCurrentUrl()).toBe('http://172.17.175.38:5555/dashboard');
  });

  it('should click the Bugs link', () => {
    element(By.css('.menu')).all(By.tagName('li')).get(1).click();
    expect(browser.getCurrentUrl()).toBe('http://172.17.175.38:5555/nvbugs');
  });

  it('should click the Notes link', () => {
    element(By.css('.menu')).all(By.tagName('li')).get(2).click();
    expect(browser.getCurrentUrl()).toBe('http://172.17.175.38:5555/notes');
  });

  it('should click the Block link', () => {
    element(By.css('.menu')).all(By.tagName('li')).get(3).click();
    expect(browser.getCurrentUrl()).toBe('http://172.17.175.38:5555/blocks');
  });

  it('should click the Modes link', () => {
    element(By.css('.menu')).all(By.tagName('li')).get(4).click();
    expect(browser.getCurrentUrl()).toBe('http://172.17.175.38:5555/modes');
  });

  it('should click the Users link', () => {
    element(By.css('.menu')).all(By.tagName('li')).get(5).click();
    expect(browser.getCurrentUrl()).toBe('http://172.17.175.38:5555/users');
  });
});
