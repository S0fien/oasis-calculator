export interface Animal {
  name: string;
  xp: number;
  hp: number;
  attack: number;
  defenseInf: number;
  defenseCav: number;
  upkeep: number;
  speed: number;
  icon: string;
  resources: {
    wood: number;
    clay: number;
    iron: number;
    crop: number;
  };
}
