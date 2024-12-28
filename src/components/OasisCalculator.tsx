import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOasisCalculator } from "@/hooks/useOasisCalculator";
import { CalculatorTab } from "./tabs/CalculatorTab";
import { HeroTab } from "./tabs/HeroTab";
import { HistoryTab } from "./tabs/HistoryTab";
import oasis from "@/assets/oasis.png";

const OasisCalculator = () => {
  const {
    animalCounts,
    currentHp,
    heroStats,
    history,
    results,
    setCurrentHp,
    handleHeroStatChange,
    handleInputChange,
    loadPreset,
    saveToHistory,
    resetCalculator,
  } = useOasisCalculator();

  return (
    <div className="p-4 max-w-4xl mx-auto mt-10">
      <Card>
        <CardHeader className="grid space-y-4">
          <img src={oasis} alt="Oasis" className="w-20 h-20 mx-auto" />
          <CardTitle>Calculateur d&apos;Oasis Travian</CardTitle>
          <Button
            onClick={resetCalculator}
            variant="outline"
            className="mx-auto w-24"
          >
            Réinitialiser
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator">
            <TabsList className="mb-4">
              <TabsTrigger value="calculator">Calculateur</TabsTrigger>
              <TabsTrigger value="hero">Stats du Héros</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator">
              <CalculatorTab
                currentHp={currentHp}
                setCurrentHp={setCurrentHp}
                animalCounts={animalCounts}
                handleInputChange={handleInputChange}
                loadPreset={loadPreset}
                results={results}
                saveToHistory={saveToHistory}
              />
            </TabsContent>

            <TabsContent value="hero">
              <HeroTab
                heroStats={heroStats}
                handleHeroStatChange={handleHeroStatChange}
              />
            </TabsContent>

            <TabsContent value="history">
              <HistoryTab history={history} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OasisCalculator;
