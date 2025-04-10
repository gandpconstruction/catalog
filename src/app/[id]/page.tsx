import Grid from './grid';

const generateMockData = () => {
  const rows = Array.from({ length: 100 }, (_, rowIndex) => {
    const rowData: any = {};
    for (let col = 1; col <= 20; col++) {
      rowData[`column${col}`] = `R${rowIndex + 1}-C${col}`;
    }
    return {
      catalogId: "d3dd8b5c-1c35-47d9-a9ca-c57cb5b00e37",
      id: `row-${rowIndex}`,
      data: rowData,
    };
  });

  return {
    id: "d3dd8b5c-1c35-47d9-a9ca-c57cb5b00e37",
    name: "Large Catalog",
    rows,
  };
};

const mockData = generateMockData();

export default async function Catalog({
  params,
  data = mockData
}: {
  params: Promise<{ id: string }>,
  data?: typeof mockData
}) {
  const { id } = await params;

  return (
    <div className="h-dvh flex flex-col items-center bg-slate-100">
      {/* Header row */}
      <div className="w-full min-h-[100px] h-[150px] bg-slate-600">
        <div className="flex h-full w-full justify-center items-center text-3xl text-white">
          Catalog ID: {id}
        </div>
      </div>

      {/* Grid */}
      <Grid data={data} id={id} />

    </div>
  );
}