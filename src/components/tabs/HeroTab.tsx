import { Input } from "@/components/ui/input";
import { HeroStats } from "@/types/HeroStats";

interface HeroTabProps {
  heroStats: HeroStats;
  handleHeroStatChange: (stat: keyof HeroStats, value: string) => void;
}

export const HeroTab = ({ heroStats, handleHeroStatChange }: HeroTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">HP Maximum</label>
        <Input
          type="number"
          value={heroStats.baseHp}
          onChange={(e) => handleHeroStatChange("baseHp", e.target.value)}
          className="w-32"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Force (%)</label>
        <Input
          type="number"
          value={heroStats.strength}
          onChange={(e) => handleHeroStatChange("strength", e.target.value)}
          className="w-32"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Armure (%)</label>
        <Input
          type="number"
          value={heroStats.armor}
          onChange={(e) => handleHeroStatChange("armor", e.target.value)}
          className="w-32"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Attaque (%)</label>
        <Input
          type="number"
          value={heroStats.attack}
          onChange={(e) => handleHeroStatChange("attack", e.target.value)}
          className="w-32"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Régénération (HP/heure)
        </label>
        <Input
          type="number"
          value={heroStats.regenerationRate}
          onChange={(e) =>
            handleHeroStatChange("regenerationRate", e.target.value)
          }
          className="w-32"
        />
      </div>
    </div>
  );
};
