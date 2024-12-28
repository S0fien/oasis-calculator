import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import oasis from "@/assets/oasis.png";

// Import types from the /types directory
import { HeroStats } from "@/types/HeroStats";
import { CalculationResults } from "@/types/CalculationResults";
import { HistoryEntry } from "@/types/HistoryEntry";

import { animals } from "@/data/animals";
import { oasisPresets } from "@/data/oasisPresets";

const OasisCalculator = () => {
  const [animalCounts, setAnimalCounts] = useState<{ [key: string]: number }>(
    animals.reduce((acc, animal) => ({ ...acc, [animal.name]: 0 }), {}),
  );
  const [currentHp, setCurrentHp] = useState(100);
  const [heroStats, setHeroStats] = useState<HeroStats>({
    baseHp: 100,
    armor: 0,
    attack: 0,
    strength: 0,
    regenerationRate: 10,
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const savedHeroStats = localStorage.getItem("heroStats");
    if (savedHeroStats) {
      setHeroStats(JSON.parse(savedHeroStats));
    }
    const savedHistory = localStorage.getItem("oasisHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("heroStats", JSON.stringify(heroStats));
  }, [heroStats]);

  useEffect(() => {
    localStorage.setItem("oasisHistory", JSON.stringify(history));
  }, [history]);

  const calculateResults = (): CalculationResults => {
    let totalXp = 0;
    let totalResources = 0;
    let totalDamage = 0;

    animals.forEach((animal) => {
      const count = animalCounts[animal.name] || 0;
      totalXp += animal.xp * count;
      totalResources += animal.resources * count;
      const damageReduction = heroStats.armor / 100;
      totalDamage += animal.hp * count * (1 - damageReduction);
    });

    // La force augmente les dégâts infligés (chaque point de force = +1% de dégâts)
    const strengthMultiplier = 1 + heroStats.strength / 100;
    // L'attaque s'ajoute au multiplicateur de force
    const attackMultiplier = 1 + heroStats.attack / 100;
    // On combine les deux multiplicateurs
    totalDamage = totalDamage / (strengthMultiplier * attackMultiplier);

    const remainingHp = Math.max(
      0,
      currentHp - (totalDamage / heroStats.baseHp) * 100,
    );
    const canSurvive = remainingHp > 0;

    const hpToRegenerate = heroStats.baseHp - remainingHp;
    const regenerationTime = hpToRegenerate / heroStats.regenerationRate;

    return {
      totalXp,
      totalResources,
      remainingHp,
      canSurvive,
      regenerationTime,
      damagePerHit:
        (strengthMultiplier * attackMultiplier * 100).toFixed(1) + "%",
    };
  };

  const handleHeroStatChange = (stat: keyof HeroStats, value: string) => {
    const numValue = parseFloat(value) || 0;
    setHeroStats((prev) => ({ ...prev, [stat]: numValue }));
  };

  const handleInputChange = (animalName: string, value: string) => {
    const count = Math.max(0, parseInt(value) || 0);
    setAnimalCounts((prev) => ({ ...prev, [animalName]: count }));
  };

  const loadPreset = (presetName: string) => {
    setAnimalCounts(() => ({
      ...animals.reduce((acc, animal) => ({ ...acc, [animal.name]: 0 }), {}),
      ...oasisPresets[presetName as keyof typeof oasisPresets],
    }));
  };

  const saveToHistory = () => {
    const results = calculateResults();
    const entry: HistoryEntry = {
      date: new Date().toLocaleString(),
      animals: { ...animalCounts },
      results,
    };
    setHistory((prev) => [entry, ...prev.slice(0, 9)]);
  };

  const results = calculateResults();

  return (
    <div className="p-4 max-w-4xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <img src={oasis} alt="Oasis" className="w-20 h-20 mx-auto mb-8" />
          <CardTitle>Calculateur d&apos;Oasis Travian</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator">
            <TabsList className="mb-4">
              <TabsTrigger value="calculator">Calculateur</TabsTrigger>
              <TabsTrigger value="hero">Stats du Héros</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator">
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
                          Math.min(
                            100,
                            Math.max(1, parseInt(e.target.value) || 0),
                          ),
                        )
                      }
                      className="w-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Preset d&apos;Oasis
                    </label>
                    <Select onValueChange={loadPreset}>
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
                    <div
                      key={animal.name}
                      className="flex items-center space-x-2"
                    >
                      <label className="flex-grow text-sm">{animal.name}</label>
                      <Input
                        type="number"
                        min="0"
                        value={animalCounts[animal.name]}
                        onChange={(e) =>
                          handleInputChange(animal.name, e.target.value)
                        }
                        className="w-20"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2 p-4 bg-gray-100 rounded-lg">
                  <div
                    className={`text-lg font-bold ${results.canSurvive ? "text-green-600" : "text-red-600"}`}
                  >
                    {results.canSurvive
                      ? "Vous pouvez survivre !"
                      : "Attention : HP insuffisants !"}
                  </div>
                  <div>HP Restants: {results.remainingHp.toFixed(1)}%</div>
                  <div>Dégâts par coup: {results.damagePerHit}</div>
                  <div>XP Totale: {results.totalXp}</div>
                  <div>Ressources Totales: {results.totalResources}</div>
                  <div>
                    Temps de régénération: {results.regenerationTime.toFixed(1)}{" "}
                    heures
                  </div>
                </div>

                <Button
                  onClick={saveToHistory}
                  className="transition-all duration-300 hover:scale-105"
                >
                  Sauvegarder le calcul
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="hero">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    HP Maximum
                  </label>
                  <Input
                    type="number"
                    value={heroStats.baseHp}
                    onChange={(e) =>
                      handleHeroStatChange("baseHp", e.target.value)
                    }
                    className="w-32"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Force (%)
                  </label>
                  <Input
                    type="number"
                    value={heroStats.strength}
                    onChange={(e) =>
                      handleHeroStatChange("strength", e.target.value)
                    }
                    className="w-32"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Armure (%)
                  </label>
                  <Input
                    type="number"
                    value={heroStats.armor}
                    onChange={(e) =>
                      handleHeroStatChange("armor", e.target.value)
                    }
                    className="w-32"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Attaque (%)
                  </label>
                  <Input
                    type="number"
                    value={heroStats.attack}
                    onChange={(e) =>
                      handleHeroStatChange("attack", e.target.value)
                    }
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
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                {history.map((entry, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500">{entry.date}</div>
                      <div>XP: {entry.results.totalXp}</div>
                      <div>Ressources: {entry.results.totalResources}</div>
                      <div>
                        HP Restants: {entry.results.remainingHp.toFixed(1)}%
                      </div>
                      <div className="text-sm mt-2">
                        Animaux:{" "}
                        {Object.entries(entry.animals)
                          .filter(([, count]) => count > 0)
                          .map(([name, count]) => `${count}x ${name}`)
                          .join(", ")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OasisCalculator;
