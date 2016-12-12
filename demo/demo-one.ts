/// <reference path="../bower_components/polymer-ts/polymer-ts.ts" />

@behavior(LssProviderBehavior)
@component("demo-one")
class DemoOne extends polymer.Base {
    provideInstance: (key: string, any) => void;
    ready() {
        this.provideInstance("UserManager", this.$.userManager);
    }

    @property()
    fruits: Array<Fruit> = [];

    @property()
    error: string;

    private names = ["Apple", "Banana", "Apricot", "Blackcurrant", "Blueberry", "Orange", "Strawberry", "Tomato", "Redcurrant"];

private getRandomFruitName(){
    return this.names[Math.floor(Math.random() * this.names.length)];
}
    @listen("getButton.tap")
    async getFruits() {
        this.error = "";
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

    @listen("createButton.tap")
    async createFruit() {
        this.error = "";
        var service: LssApiService = this.$.service;
        var dto = new Fruit();
        dto.Name = this.getRandomFruitName();
        var fruit;
        try {
            fruit = await service.postAsync<Fruit>("Fruits", dto, "Testing");
        } catch (error) {
            this.error = error;
            return;
        }
        this.push("fruits", fruit)
    }

    async deleteFruit(e) {
        this.error = "";
        var id = e.target.getAttribute("object-id");

        var service: LssApiService = this.$.service;

        if (id > 0) {
            try {
                await service.deleteAsync(`Fruits(${id})`, "Testing");
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

    async patchFruit(e) {
        this.error = "";
        var id = e.target.getAttribute("object-id");
        var service: LssApiService = this.$.service;
        var dto: IODataDto & any;
        var name = this.getRandomFruitName();
        dto = new ODataDto();
        dto.Name = name;

        if (id > 0) {
            try {
                await service.patchAsync(`Fruits(${id})`, dto, "Testing");
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

    attached() {

    }
}

class Fruit extends ODataDto {
    Id: number
    Name: String
}

DemoOne.register();
