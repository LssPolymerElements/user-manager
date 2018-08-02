
@Polymer.decorators.customElement('api2-service-demo') class Api2ServiceDemo extends Polymer.DeclarativeEventListeners
(Polymer.Element) {
  @Polymer.decorators.property({type: Array}) fruits: Array<Fruit> = [];

  @Polymer.decorators.property({type: String}) error: string = 'none';

  @Polymer.decorators.query('lss-api-service') lssApiService: LssApiService;

  private names = ['Apple', 'Banana', 'Apricot', 'Blackcurrant', 'Blueberry', 'Orange', 'Strawberry', 'Tomato', 'Redcurrant'];

  private getRandomFruitName() {
    return this.names[Math.floor(Math.random() * this.names.length)];
  }

  @Polymer
      .decorators.listen('tap', 'getButton') public async getFruits() {
    this.error = 'none';

    let result;
    try {
      result = await this.lssApiService.getAsync<Fruit>('Fruits/?$top=5&$orderby=Id desc', 'Testing');
    } catch (error) {
      this.error = error;
      return;
    }
    this.fruits = result.toList();
  }

  @Polymer
      .decorators.listen('tap', 'createButton') async createFruit() {
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
    this.push('fruits', fruit);
  }

  async deleteFruit(e: any) {
    this.error = 'none';
    let id = e.target.getAttribute('object-id');

    if (id > 0) {
      try {
        await this.lssApiService.deleteAsync(`Fruits(${id})`);
      } catch (error) {
        this.error = error;
        return;
      }
      let fruit = this.fruits.filter(o => o.Id === parseInt(id) || 0);
      if (fruit.length === 1) {
        let index = this.fruits.indexOf(fruit[0]);
        this.splice('fruits', index, 1);
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
        this.set(`fruits.${index}.Name`, name);
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
        this.set(`fruits.${index}.Name`, returnFruit.Name);
      }
    }
  }
}

class Fruit extends ODataDto {
  Id: number;
  Name: string;
}
