"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightResolver = void 0;
const Weight_1 = require("../enitities/Weight");
const type_graphql_1 = require("type-graphql");
let WeightResolver = class WeightResolver {
    getWeights(ctx) {
        return ctx.em.find(Weight_1.Weight, {});
    }
    getOne(id, ctx) {
        return ctx.em.findOne(Weight_1.Weight, { id });
    }
    createWeight(weight, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const newWeight = ctx.em.create(Weight_1.Weight, { weight: weight });
            yield ctx.em.persistAndFlush(newWeight);
            return newWeight;
        });
    }
    updateWeight(id, newWeight, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const weight = yield ctx.em.findOne(Weight_1.Weight, { id });
            if (!weight)
                return null;
            if (typeof weight !== 'undefined') {
                weight.weight = newWeight;
                yield ctx.em.persistAndFlush(weight);
            }
            return weight;
        });
    }
    deleteWeight(id, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ctx.em.nativeDelete(Weight_1.Weight, { id });
                return true;
            }
            catch (_a) {
                return false;
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Weight_1.Weight]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WeightResolver.prototype, "getWeights", null);
__decorate([
    type_graphql_1.Query(() => Weight_1.Weight),
    __param(0, type_graphql_1.Arg('id')), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WeightResolver.prototype, "getOne", null);
__decorate([
    type_graphql_1.Mutation(() => Weight_1.Weight),
    __param(0, type_graphql_1.Arg('weight')), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WeightResolver.prototype, "createWeight", null);
__decorate([
    type_graphql_1.Mutation(() => Weight_1.Weight, { nullable: true }),
    __param(0, type_graphql_1.Arg('id')), __param(1, type_graphql_1.Arg('weight')), __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], WeightResolver.prototype, "updateWeight", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('id')), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], WeightResolver.prototype, "deleteWeight", null);
WeightResolver = __decorate([
    type_graphql_1.Resolver()
], WeightResolver);
exports.WeightResolver = WeightResolver;
//# sourceMappingURL=WeightResolver.js.map