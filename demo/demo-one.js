/// <reference path="../bower_components/polymer-ts/polymer-ts.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var DemoOne = (function (_super) {
    __extends(DemoOne, _super);
    function DemoOne() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fruits = [];
        _this.names = ["Apple", "Banana", "Apricot", "Blackcurrant", "Blueberry", "Orange", "Strawberry", "Tomato", "Redcurrant"];
        return _this;
    }
    DemoOne.prototype.ready = function () {
        this.provideInstance("UserManager", this.$.userManager);
    };
    DemoOne.prototype.getRandomFruitName = function () {
        return this.names[Math.floor(Math.random() * this.names.length)];
    };
    DemoOne.prototype.getFruits = function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error = "";
                        service = this.$.service;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, service.getAsync("Fruits/?$top=5&$orderby=Id desc", "Testing")];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.error = error_1;
                        return [2 /*return*/];
                    case 4:
                        this.fruits = result.toList();
                        return [2 /*return*/];
                }
            });
        });
    };
    DemoOne.prototype.createFruit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, dto, fruit, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error = "";
                        service = this.$.service;
                        dto = new Fruit();
                        dto.Name = this.getRandomFruitName();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, service.postAsync("Fruits", dto, "Testing")];
                    case 2:
                        fruit = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        this.error = error_2;
                        return [2 /*return*/];
                    case 4:
                        this.push("fruits", fruit);
                        return [2 /*return*/];
                }
            });
        });
    };
    DemoOne.prototype.deleteFruit = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var id, service, error_3, fruit, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error = "";
                        id = e.target.getAttribute("object-id");
                        service = this.$.service;
                        if (!(id > 0)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, service.deleteAsync("Fruits(" + id + ")", "Testing")];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        this.error = error_3;
                        return [2 /*return*/];
                    case 4:
                        fruit = this.fruits.filter(function (o) { return o.Id === parseInt(id) || 0; });
                        if (fruit.length === 1) {
                            index = this.fruits.indexOf(fruit[0]);
                            this.splice('fruits', index, 1);
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DemoOne.prototype.patchFruit = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var id, service, dto, name, error_4, fruit, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.error = "";
                        id = e.target.getAttribute("object-id");
                        service = this.$.service;
                        name = this.getRandomFruitName();
                        dto = new ODataDto();
                        dto.Name = name;
                        if (!(id > 0)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, service.patchAsync("Fruits(" + id + ")", dto, "Testing")];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        this.error = error_4;
                        return [2 /*return*/];
                    case 4:
                        fruit = this.fruits.filter(function (o) { return o.Id === parseInt(id) || 0; });
                        if (fruit.length === 1) {
                            index = this.fruits.indexOf(fruit[0]);
                            this.set("fruits." + index + ".Name", name);
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DemoOne.prototype.attached = function () {
    };
    return DemoOne;
}(polymer.Base));
__decorate([
    property()
], DemoOne.prototype, "fruits", void 0);
__decorate([
    property()
], DemoOne.prototype, "error", void 0);
__decorate([
    listen("getButton.tap")
], DemoOne.prototype, "getFruits", null);
__decorate([
    listen("createButton.tap")
], DemoOne.prototype, "createFruit", null);
DemoOne = __decorate([
    behavior(LssProviderBehavior),
    component("demo-one")
], DemoOne);
var Fruit = (function (_super) {
    __extends(Fruit, _super);
    function Fruit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Fruit;
}(ODataDto));
DemoOne.register();
//# sourceMappingURL=demo-one.js.map