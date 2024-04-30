/* eslint-disable @typescript-eslint/quotes */
export enum RimSizeEnum {
  SMALL = "15 à 16",
  MEDIUM = "17 à 18",
  BIG = "≥19"
}

export enum RimRenovationTypeEnum {
  RENOVATION = 'Rénovation',
  RC = 'Rénovation + Fissure',
  RT = 'Rénovation + Dévoilage',
  RCT = 'Rénovation + Fissure + Dévoilage',
  CRACK = 'Fissure',
  TRUING = 'Dévoilage'
}

export enum RimColorTypeEnum {
  SATIN = 'Satinée',
  GLOSSY = 'Brillante',
  MAT = 'Mate',
  NONE = 'Aucune'
}

export enum ClientTypeEnum {
  PROFESSIONAL = 'professionnel',
  INDIVIDUAL = 'particulier'
}

export enum OrderBillTypeEnum {
  DAILY = 'Journalière',
  DECADE = 'decade', // période 10 jours
  MONTHLY = 'mensuelle'
}

export enum BusinessActivityEnum {
  CAR_DEALERSHIPS = 'Concessionnaires automobiles',
  GARAGES_CAR_CENTERS = 'Garages et centres automobiles',
  CAR_RENTAL_COMPANIES = 'Entreprises de location de véhicules',
  TRANSPORT_LOGISTICS_COMPANIES = 'Entreprises de transport et logistique',
  CAR_CLUBS_AND_ASSOCIATIONS = 'Clubs automobiles et associations',
  INDIVIDUALS = 'Particuliers',
  COMPANIES = 'Entreprises'
}

export enum AddressType {
  DELIVERY,
  BILLING
}

export type TVACode = '1' | '2' | '3'

export enum ShoppingCartStatusEnum {
  NEW = 'Nouveau',
  VALIDATED = 'Validé',
  CANCELLED = 'Annulé'
}

export enum OrderStatusEnum {
  HOLD = 'En attente',
  VALIDATED = 'Validé',
  CANCELLED = 'Annulé',
  FINISHED = 'Terminé'
}

export enum RolesEnum {
  USER = 'user',
  ADMIN = 'admin'
}
