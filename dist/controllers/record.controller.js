"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecord = exports.updateRecord = exports.getRecords = exports.createRecord = void 0;
const recordService = __importStar(require("../services/record.service"));
const createRecord = async (req, res, next) => {
    try {
        const record = await recordService.createRecord(req.body, req.user.id);
        res.status(201).json({ status: 'success', data: record });
    }
    catch (error) {
        next(error);
    }
};
exports.createRecord = createRecord;
const getRecords = async (req, res, next) => {
    try {
        const result = await recordService.getRecords(req.query);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.getRecords = getRecords;
const updateRecord = async (req, res, next) => {
    try {
        const record = await recordService.updateRecord(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: record });
    }
    catch (error) {
        next(error);
    }
};
exports.updateRecord = updateRecord;
const deleteRecord = async (req, res, next) => {
    try {
        await recordService.deleteRecord(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRecord = deleteRecord;
