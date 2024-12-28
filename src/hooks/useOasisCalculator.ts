import { useState, useEffect } from "react";
import { HeroStats } from "@/types/HeroStats";
import { CalculationResults } from "@/types/CalculationResults";
import { HistoryEntry } from "@/types/HistoryEntry";
import { animals } from "@/data/animals";
import { oasisPresets } from "@/data/oasisPresets";

export const useOasisCalculator = () => {
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

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = () => {
      const savedHeroStats = localStorage.getItem("heroStats");
      const savedHistory = localStorage.getItem("oasisHistory");

      if (savedHeroStats) {
        setHeroStats(JSON.parse(savedHeroStats));
      }
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    };

    loadSavedData();
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem("heroStats", JSON.stringify(heroStats));
  }, [heroStats]);

  useEffect(() => {
    localStorage.setItem("oasisHistory", JSON.stringify(history));
  }, [history]);

  const calculateResults = (): CalculationResults => {
    let totalXp = 0;
    let totalUpkeep = 0;
    let totalDamage = 0;
    let totalAttackPower = 0;
    let totalDefenseInf = 0;
    let totalDefenseCav = 0;
    const totalResources = {
      wood: 0,
      clay: 0,
      iron: 0,
      crop: 0,
    };

    // Calculate totals
    animals.forEach((animal) => {
      const count = animalCounts[animal.name] || 0;
      totalXp += animal.xp * count;
      totalUpkeep += animal.upkeep * count;
      totalAttackPower += animal.attack * count;
      totalDefenseInf += animal.defenseInf * count;
      totalDefenseCav += animal.defenseCav * count;

      // Calculate resources
      totalResources.wood += animal.resources.wood * count;
      totalResources.clay += animal.resources.clay * count;
      totalResources.iron += animal.resources.iron * count;
      totalResources.crop += animal.resources.crop * count;

      const damageReduction = heroStats.armor / 100;
      totalDamage += animal.attack * count * (1 - damageReduction);
    });

    // Calculate damage multipliers
    const strengthMultiplier = 1 + heroStats.strength / 100;
    const attackMultiplier = 1 + heroStats.attack / 100;
    const totalMultiplier = strengthMultiplier * attackMultiplier;

    // Apply damage reduction
    totalDamage = totalDamage / totalMultiplier;

    // Calculate remaining HP and regeneration time
    const remainingHp = Math.max(
      0,
      currentHp - (totalDamage / heroStats.baseHp) * 100,
    );
    const hpToRegenerate = heroStats.baseHp - remainingHp;
    const regenerationTime = hpToRegenerate / heroStats.regenerationRate;

    return {
      totalXp,
      totalResources,
      totalUpkeep,
      remainingHp,
      canSurvive: remainingHp > 0,
      regenerationTime,
      damagePerHit: `${(totalMultiplier * 100).toFixed(1)}%`,
      totalAttackPower,
      totalDefenseInf,
      totalDefenseCav,
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
    const baseAnimalCounts = animals.reduce(
      (acc, animal) => ({ ...acc, [animal.name]: 0 }),
      {},
    );
    setAnimalCounts({
      ...baseAnimalCounts,
      ...oasisPresets[presetName as keyof typeof oasisPresets],
    });
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

  const resetCalculator = () => {
    setAnimalCounts(
      animals.reduce((acc, animal) => ({ ...acc, [animal.name]: 0 }), {}),
    );
    setCurrentHp(100);
    setHeroStats({
      baseHp: 100,
      armor: 0,
      attack: 0,
      strength: 0,
      regenerationRate: 10,
    });
    setHistory([]);
  };

  return {
    animalCounts,
    currentHp,
    heroStats,
    history,
    results: calculateResults(),
    setCurrentHp,
    handleHeroStatChange,
    handleInputChange,
    loadPreset,
    saveToHistory,
    resetCalculator,
  };
};
