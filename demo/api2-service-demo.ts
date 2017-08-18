@customElement('api2-service-demo')
class Api2ServiceDemo extends LssProviderBehavior(Polymer.Element) {
    ready() {
        super.ready();
        this.provideInstance('UserManager', this.$.userManager);
    }

    @property()
    fruits: Array<Fruit> = [];

    @property()
    error: string = 'none';

    private names = ['Apple', 'Banana', 'Apricot', 'Blackcurrant', 'Blueberry', 'Orange', 'Strawberry', 'Tomato', 'Redcurrant'];

    private getRandomFruitName() {
        return this.names[Math.floor(Math.random() * this.names.length)];
    }

    @listen('getButton', 'tap')
    async getFruits() {
        this.error = 'none';
        let service: LssApiService = this.$.service;
        let result;
        try {
            result = await service.getAsync<Fruit>('Fruits/?$top=5&$orderby=Id desc', 'Testing');
        } catch (error) {
            this.error = error;
            return;
        }
        this.fruits = result.toList();
    }

    @listen('createButton', 'tap')
    async createFruit() {
        this.error = 'none';
        let service: LssApiService = this.$.service;
        let dto = new Fruit();
        dto.Name = this.getRandomFruitName();
        let fruit;
        try {
            fruit = await service.postAsync<Fruit>('Fruits', dto);
        } catch (error) {
            this.error = error;
            return;
        }
        this.push('fruits', fruit);
    }

    async deleteFruit(e: any) {
        this.error = 'none';
        let id = e.target.getAttribute('object-id');

        let service: LssApiService = this.$.service;

        if (id > 0) {
            try {
                await service.deleteAsync(`Fruits(${id})`);
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
        let service: LssApiService = this.$.service;
        let dto: IODataDto & any;
        let name = this.getRandomFruitName();
        dto = new ODataDto();
        dto.Name = name;

        if (id > 0) {
            try {
                await service.patchAsync(`Fruits(${id})`, dto);
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
        let service: LssApiService = this.$.service;
        let dto: IODataDto & any;
        let name = this.getRandomFruitName();
        dto = new ODataDto();
        dto.Name = name;

        if (id > 0) {
            let returnFruit;
            try {
                returnFruit = await service.patchReturnDtoAsync<Fruit>(`Fruits(${id})`, dto);
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

    attached() {

    }
}

class Fruit extends ODataDto {
    Id: number;
    Name: string;
}
