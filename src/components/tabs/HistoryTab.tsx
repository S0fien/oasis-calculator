import { Card, CardContent } from "@/components/ui/card";
import { HistoryEntry } from "@/types/HistoryEntry";

interface HistoryTabProps {
  history: HistoryEntry[];
}

export const HistoryTab = ({ history }: HistoryTabProps) => {
  return (
    <div className="space-y-4">
      {history.map((entry, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">{entry.date}</div>
            <div>XP: {entry.results.totalXp}</div>
            <div className="grid grid-cols-2 gap-2">
              <div>Bois: {entry.results.totalResources.wood}</div>
              <div>Argile: {entry.results.totalResources.clay}</div>
              <div>Fer: {entry.results.totalResources.iron}</div>
              <div>Céréales: {entry.results.totalResources.crop}</div>
            </div>
            <div>Consommation: {entry.results.totalUpkeep}</div>
            <div>HP Restants: {entry.results.remainingHp.toFixed(1)}%</div>
            <div>
              Puissance d&apos;attaque: {entry.results.totalAttackPower}
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
  );
};
