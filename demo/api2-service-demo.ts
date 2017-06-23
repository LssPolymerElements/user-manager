@customElement("api2-service-demo")
class Api2ServiceDemo extends LssProviderBehavior(Polymer.Element) {
    ready() {
        super.ready();
        this.provideInstance("UserManager", this.$.userManager);
    }

    @property()
    fruits: Array<Fruit> = [];

    @property()
    error: string = "none";

    private names = ["Apple", "Banana", "Apricot", "Blackcurrant", "Blueberry", "Orange", "Strawberry", "Tomato", "Redcurrant"];

    private getRandomFruitName() {
        return this.names[Math.floor(Math.random() * this.names.length)];
    }

    @listen("getButton", "tap")
    async getFruits() {
        this.error = "none";
        var service: LssApiService = this.$.service;
        var result;
        try {
            result = await service.getAsync<Fruit>("Fruits/?$top=5&$orderby=Id desc", "Testing");
        } catch (error) {
            this.error = error;
            return;
        }
        this.fruits = result.toList();
    }

    @listen("createButton", "tap")
    async createFruit() {
        this.error = "none";
        var service: LssApiService = this.$.service;
        var dto = new Fruit();
        dto.Name = this.getRandomFruitName();
        var fruit;
        try {
            fruit = await service.postAsync<Fruit>("Fruits", dto);
        } catch (error) {
            this.error = error;
            return;
        }
        this.push("fruits", fruit)
    }

    async deleteFruit(e: any) {
        this.error = "none";
        var id = e.target.getAttribute("object-id");

        var service: LssApiService = this.$.service;

        if (id > 0) {
            try {
                await service.deleteAsync(`Fruits(${id})`);
            } catch (error) {
                this.error = error;
                return;
            }
            var fruit = this.fruits.filter(o => o.Id === parseInt(id) || 0);
            if (fruit.length === 1) {
                var index = this.fruits.indexOf(fruit[0]);
                this.splice('fruits', index, 1);
            }

        }
    }

    async patchFruit(e: any) {
        this.error = "none";
        var id = e.target.getAttribute("object-id");
        var service: LssApiService = this.$.service;
        var dto: IODataDto & any;
        var name = this.getRandomFruitName();
        dto = new ODataDto();
        dto.Name = name;

        if (id > 0) {
            try {
                await service.patchAsync(`Fruits(${id})`, dto);
            } catch (error) {
                this.error = error;
                return;
            }
            var fruit = this.fruits.filter(o => o.Id === parseInt(id) || 0);
            if (fruit.length === 1) {
                var index = this.fruits.indexOf(fruit[0]);
                this.set(`fruits.${index}.Name`, name);
            }
        }
    }

    async patchReturnDtoFruit(e: any) {
        this.error = "none";
        var id = e.target.getAttribute("object-id");
        var service: LssApiService = this.$.service;
        var dto: IODataDto & any;
        var name = this.getRandomFruitName();
        dto = new ODataDto();
        dto.Name = name;

        if (id > 0) {
            try {
                var returnFruit = await service.patchReturnDtoAsync<Fruit>(`Fruits(${id})`, dto);
            } catch (error) {
                this.error = error;
                return;
            }
            var fruit = this.fruits.filter(o => o.Id === parseInt(id) || 0);
            if (fruit.length === 1) {
                var index = this.fruits.indexOf(fruit[0]);
                this.set(`fruits.${index}.Name`, returnFruit.Name);
            }
        }
    }

    attached() {

    }
}

class Fruit extends ODataDto {
    Id: number
    Name: String
}
