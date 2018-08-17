
import '@polymer/paper-button/paper-button';
import '@leavittsoftware/user-manager/lib/user-manager';

import {ApiService, ODataDto} from '@leavittsoftware/api-service/lib/api-service';
import {customElement, listen, property, query} from '@polymer/decorators';
import {DeclarativeEventListeners} from '@polymer/decorators/lib/declarative-event-listeners.js';
import {html, PolymerElement} from '@polymer/polymer/polymer-element';

@customElement('api-service-demo') export class Api2ServiceDemo extends DeclarativeEventListeners
(PolymerElement) {
  @property({type: Array}) fruits: Array<Fruit> = [];

  @property({type: String}) error: string = 'none';

  @query('api-service') lssApiService: ApiService;

  static get template() {
    return html`
        <user-manager></user-manager>
        <api-service app-name="Testing" id="service"></api-service>

        <h2>lss-api-service Fruits CRUD Demo</h2>
        <paper-button id="getButton" raised>Get Top 5 Fruits</paper-button>
        <paper-button id="createButton" raised>Post a new random fruit</paper-button>
        <div style="color:red;margin:16px">Errors: [[error]]</div>

        <template is="dom-repeat" items="[[fruits]]">
            <div style="margin:16px;padding:8px;border:1px dashed green;width:350px; display: inline-block;">
                <pre>
                  [[item.Name]]
                  [[item.Id]]
                </pre>
                <paper-button object-id$="[[item.Id]]" on-tap="deleteFruit" raised>Delete</paper-button>
                <paper-button object-id$="[[item.Id]]" on-tap="patchFruit" raised>Patch Random Name</paper-button>
                <paper-button object-id$="[[item.Id]]" on-tap="patchReturnDtoFruit" raised>Patch and return dto</paper-button>

            </div>`;
  }

  private names = ['Apple', 'Banana', 'Apricot', 'Blackcurrant', 'Blueberry', 'Orange', 'Strawberry', 'Tomato', 'Redcurrant'];

  private getRandomFruitName() {
    return this.names[Math.floor(Math.random() * this.names.length)];
  }

  @listen('tap', 'getButton')
  public async getFruits() {
    this.error = 'none';

    let result;
    try {
      result = await this.lssApiService.getAsync<Fruit>('Fruits/?$top=5&$orderby=Id desc', ' Testing');
    } catch (error) {
      this.error = error;
      return;
    }
    this.fruits = result.toList();
  }

  @listen('tap', 'createButton')
  async createFruit() {
    this.error = 'none';
    let dto = new Fruit();
    dto.Name = this.getRandomFruitName();
    let fruit;
    try {
      fruit = await this.lssApiService.postAsync<Fruit>('Fruits', dto);
    } catch (error) {
      this.error = error;
      return;
    }
    (this as any).push('fruits', fruit);
  }

  async deleteFruit(e: any) {
    this.error = 'none';
    let id = e.target.getAttribute('object-id');

    if (id > 0) {
      try {
        await this.lssApiService.deleteAsync(`Fruits(${id}) `);
      } catch (error) {
        this.error = error;
        return;
      }
      let fruit = this.fruits.filter(o => o.Id === parseInt(id) || 0);
      if (fruit.length === 1) {
        let index = this.fruits.indexOf(fruit[0]);
        (this as any).splice('fruits', index, 1);
      }
    }
  }

  async patchFruit(e: any) {
    this.error = 'none';
    let id = e.target.getAttribute('object-id');
    let dto: ODataDto&any;
    let name = this.getRandomFruitName();
    dto = new ODataDto();
    dto.Name = name;

    if (id > 0) {
      try {
        await this.lssApiService.patchAsync(`Fruits(${id})`, dto);
      } catch (error) {
        this.error = error;
        return;
      }
      let fruit = this.fruits.filter(o => o.Id === parseInt(id) || 0);
      if (fruit.length === 1) {
        let index = this.fruits.indexOf(fruit[0]);
        (this as any)
            .set(
                ` fruits.${index}
            .Name`,
                name);
      }
    }
  }

  async patchReturnDtoFruit(e: any) {
    this.error = 'none';
    let id = e.target.getAttribute('object-id');
    let dto: ODataDto&any;
    let name = this.getRandomFruitName();
    dto = new ODataDto();
    dto.Name = name;

    if (id > 0) {
      let returnFruit;
      try {
        returnFruit = await this.lssApiService.patchReturnDtoAsync<Fruit>(`Fruits(${id})`, dto);
      } catch (error) {
        this.error = error;
        return;
      }
      let fruit = this.fruits.filter(o => o.Id === parseInt(id) || 0);
      if (fruit.length === 1) {
        let index = this.fruits.indexOf(fruit[0]);
        (this as any)
            .set(
                ` fruits.${index}
            .Name`,
                returnFruit.Name);
      }
    }
  }
}

class Fruit extends ODataDto {
  Id: number;
  Name: string;
}
