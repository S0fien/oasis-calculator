import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { animals } from "@/data/animals";
import { oasisPresets } from "@/data/oasisPresets";
import { CalculationResults } from "@/types/CalculationResults";
import lumber from "@/assets/lumber.png";
import clay from "@/assets/clay.png";
import iron from "@/assets/iron.png";
import crop from "@/assets/crop.png";
import { cn } from "@/lib/utils";

interface CalculatorTabProps {
  currentHp: number;
  setCurrentHp: (hp: number) => void;
  animalCounts: { [key: string]: number };
  handleInputChange: (name: string, value: string) => void;
  loadPreset: (preset: string) => void;
  results: CalculationResults;
  saveToHistory: () => void;
}

export const CalculatorTab = ({
  currentHp,
  setCurrentHp,
  animalCounts,
  handleInputChange,
  loadPreset,
  results,
  saveToHistory,
}: CalculatorTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            HP Actuels (%)
          </label>
          <Input
            type="number"
            min="1"
            max="100"
            value={currentHp}
            onChange={(e) =>
              setCurrentHp(
                Math.min(100, Math.max(1, parseInt(e.target.value) || 0)),
              )
            }
            className="w-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Preset d&apos;Oasis
          </label>
          <Select onValueChange={loadPreset} disabled>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un preset" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(oasisPresets).map((preset) => (
                <SelectItem key={preset} value={preset}>
                  {preset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {animals.map((animal) => (
          <div key={animal.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <img src={animal.icon} alt={animal.name} className="w-6 h-6" />
              <label className="flex-grow text-sm">{animal.name}</label>
            </div>
            <Input
              type="number"
              min="0"
              value={animalCounts[animal.name]}
              onChange={(e) => handleInputChange(animal.name, e.target.value)}
              className="w-20"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div
          className={`text-lg font-bold ${results.canSurvive ? "text-green-600" : "text-red-600"}`}
        >
          {results.canSurvive
            ? "Vous pouvez survivre !"
            : "Attention : HP insuffisants !"}
        </div>

        <div>
          <h3 className="font-semibold">Gains</h3>
          <div className="flex items-center justify-center space-x-2 my-4">
            <span
              className={cn(
                "rounded-md p-3",
                results.totalXp > 0 ? "bg-green-100" : "bg-gray-200",
              )}
            >
              XP Totale:
            </span>
            <span
              className={cn(
                "font-bold text-lg",
                results.totalXp > 0 ? "text-green-600" : "text-gray-600",
              )}
            >
              {results.totalXp}
            </span>
          </div>
          <div>
            <div className="font-medium">Ressources:</div>
            <div className="grid grid-cols-2 gap-2 pl-4">
              <div>
                <img src={lumber} alt="Bois" className="w-4 h-4 inline-block" />{" "}
                <span className="font-medium">Bois:</span>{" "}
                {results.totalResources.wood}
              </div>
              <div>
                <img src={clay} alt="Argile" className="w-4 h-4 inline-block" />{" "}
                <span className="font-medium">Argile:</span>{" "}
                {results.totalResources.clay}
              </div>
              <div>
                <img src={iron} alt="Fer" className="w-4 h-4 inline-block" />{" "}
                <span className="font-medium">Fer:</span>{" "}
                {results.totalResources.iron}
              </div>
              <div>
                <img
                  src={crop}
                  alt="Céréales"
                  className="w-4 h-4 inline-block"
                />{" "}
                <span className="font-medium">Céréales:</span>{" "}
                {results.totalResources.crop}
              </div>
            </div>
          </div>
          <div>Consommation: {results.totalUpkeep}</div>
        </div>

        <Separator className="dark:bg-gray-600" />

        <div>
          <h3 className="font-semibold">Combat</h3>
          <div>HP Restants: {results.remainingHp.toFixed(1)}%</div>
          <div>Dégâts par coup: {results.damagePerHit}</div>
          <div>
            Temps de régénération: {results.regenerationTime.toFixed(1)} heures
          </div>
        </div>

        <Separator className="dark:bg-gray-600" />

        <div>
          <h3 className="font-semibold">Statistiques de l&apos;armée</h3>
          <div>Puissance d&apos;attaque: {results.totalAttackPower}</div>
          <div>Défense (Infanterie): {results.totalDefenseInf}</div>
          <div>Défense (Cavalerie): {results.totalDefenseCav}</div>
        </div>
      </div>

      <Button
        onClick={saveToHistory}
        className="transition-all duration-300 hover:scale-105"
      >
        Sauvegarder le calcul
      </Button>
    </div>
  );
};
