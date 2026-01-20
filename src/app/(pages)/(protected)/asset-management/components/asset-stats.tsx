interface Props {
  totalAssets: number;
  categories: number;
}

export default function AssetStats({ totalAssets, categories}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card title="Total Assets" value={totalAssets} />
      <Card title="Categories" value={categories} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
