export type Food = {
    id: number;
    alimento: string;
    sodio: number;
    azucares: number;
    azucares_anadidos: number;
    carbohidratos_refinados: number;
    alcohol: number;
    grasas_saturadas: number;
    proteina: number;
    calorias: number;
    potasio: number;
    agua: number;
    retention_score: number;
};

export type FoodInput = Omit<Food, "id">;
