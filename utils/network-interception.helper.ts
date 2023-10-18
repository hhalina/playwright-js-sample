import { Page, Request, Response, test } from '@playwright/test';
import _ from 'lodash';
import { sleep } from './common';

export interface RequestData {
  postData?: Record<string, unknown>;
  fulfillData?: Record<string, unknown>;
  requestType?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
}

export async function listener(
  page: Page,
  relUrl: string,
  interceptedRequests: { request: Request; response: Response | Record<string, unknown> }[],
  requestData: RequestData[] = [{}],
) {
  /**
   * The method intercepts network requests.
   * It checks the requestData which is array of requests that we need to intercept.
   * For each request it checks url, request method and postData (if post or put request).
   * Postdata is checked by matching one object to another
   * For example we need to check request which body contains {isFixedRate: true, from: 'btc', to: 'eth'}
   * We are intercepting requests and if request body is
   * {"from": "btc","to": "eth","amountFrom": 0.1, "isFixedRate": false,"source": "web","reqId": 2,"wtpExperiment": "2"}
   * then it considers to be a match
   *
   * Pay attention that keys and dataTypes should be exactly the same to get the match!
   *
   * For fulfilling request with given response use the next fulfill structure:
   * route.fulfill({status: 404, contentType: 'text/plain', body: 'Not Found!'}); -> get request fulfill example
   * route.fulfill({status: 404, json: {"result": true}}); -> post request fulfill example
   */
  await test.step(`Apply network listener and catch '${relUrl}' requests`, async () => {
    await page.route(`**${relUrl}**`, async (route) => {
      const match = requestData.filter((item: RequestData) => {
        const requestType = item.requestType || 'POST';
        return ['POST', 'PUT'].includes(requestType)
          ? route.request().url().includes(relUrl) && _.isMatch(JSON.parse(route.request().postData()), item.postData)
          : route.request().url().includes(relUrl);
      });
      if (match.length > 0) {
        if (match[0].fulfillData) {
          await route.fulfill(match[0].fulfillData);
        } else {
          await route.fetch();
          await route.continue();
        }
        interceptedRequests.push({
          request: JSON.parse(route.request().postData()),
          response: await route
            .request()
            .response()
            .then((response) => response.json()),
        });
      } else {
        await route.continue();
      }
    });
  });
}

export async function removeListener(page: Page, url: string = '') {
  await test.step('Remove network listener', async () => {
    await page.unroute(`**${url}**`);
  });
}

export async function waitForInterceptedRequest(
  interceptedRequests: Record<string, unknown>[],
  expectedReqLength: number = 1,
) {
  await test.step('Wait for requests to be catched', async () => {
    const maxAttempts = 10;
    let attempts = 0;

    while (interceptedRequests.length < expectedReqLength && attempts < maxAttempts) {
      await sleep(1000);
      attempts++;
    }
    return interceptedRequests.length === expectedReqLength;
  });
}
