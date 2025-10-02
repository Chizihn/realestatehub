import Joi from "joi";

export const createPropertySchema = Joi.object({
  title: Joi.string().required().min(3).max(255),
  description: Joi.string().optional().max(2000),
  price: Joi.number().required().positive(),
  state: Joi.string().required().min(2).max(100),
  city: Joi.string().required().min(2).max(100),
  neighborhood: Joi.string().optional().max(100),
  address: Joi.string().required().min(5).max(500),
  propertyType: Joi.string().required().valid("HOUSE", "APARTMENT", "LAND"),
  listingType: Joi.string().required().valid("SALE", "RENT"),
  bedrooms: Joi.number().optional().integer().min(0).max(20),
  bathrooms: Joi.number().optional().integer().min(0).max(20),
  area: Joi.number().required().positive(),
  areaUnit: Joi.string().optional().valid("sqm", "sqft").default("sqm"),
  contactName: Joi.string().required().min(2).max(255),
  contactPhone: Joi.string()
    .required()
    .pattern(/^(\+234|0)[789][01]\d{8}$/),
  contactEmail: Joi.string().required().email(),
});

export const updatePropertySchema = Joi.object({
  title: Joi.string().optional().min(3).max(255),
  description: Joi.string().optional().max(2000),
  price: Joi.number().optional().positive(),
  state: Joi.string().optional().min(2).max(100),
  city: Joi.string().optional().min(2).max(100),
  neighborhood: Joi.string().optional().max(100),
  address: Joi.string().optional().min(5).max(500),
  propertyType: Joi.string().optional().valid("HOUSE", "APARTMENT", "LAND"),
  listingType: Joi.string().optional().valid("SALE", "RENT"),
  bedrooms: Joi.number().optional().integer().min(0).max(20),
  bathrooms: Joi.number().optional().integer().min(0).max(20),
  area: Joi.number().optional().positive(),
  areaUnit: Joi.string().optional().valid("sqm", "sqft"),
  contactName: Joi.string().optional().min(2).max(255),
  contactPhone: Joi.string()
    .optional()
    .pattern(/^(\+234|0)[789][01]\d{8}$/),
  contactEmail: Joi.string().optional().email(),
  status: Joi.string().optional().valid("ACTIVE", "INACTIVE", "SOLD", "RENTED"),
});

export const searchSchema = Joi.object({
  q: Joi.string().optional(), // General search query
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  propertyType: Joi.string().optional().valid("HOUSE", "APARTMENT", "LAND"),
  listingType: Joi.string().optional().valid("SALE", "RENT"),
  minPrice: Joi.number().optional().min(0),
  maxPrice: Joi.number().optional().min(0),
  bedrooms: Joi.number().optional().integer().min(0),
  bathrooms: Joi.number().optional().integer().min(0),
  sortBy: Joi.string().optional().valid("newest", "price_asc", "price_desc"),
  page: Joi.number().optional().integer().min(1).default(1),
  limit: Joi.number().optional().integer().min(1).max(100).default(10),
});
