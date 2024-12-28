export interface CalculationResults {
  totalXp: number;
  totalResources: {
    wood: number;
    clay: number;
    iron: number;
    crop: number;
  };
  totalUpkeep: number;
  remainingHp: number;
  canSurvive: boolean;
  regenerationTime: number;
  damagePerHit: string;
  totalAttackPower: number;
  totalDefenseInf: number;
  totalDefenseCav: number;
}
