interface SelectLocationProps {
    sites: { position: [number, number]; name: string }[];
    onSelect: (coords: [number, number] | null) => void;
  }
  
  const SelectLocation: React.FC<SelectLocationProps> = ({ sites, onSelect }) => {
    return (
      <select
        className="p-2 border rounded"
        onChange={(e) => {
          const selectedIndex = e.target.value;
          if (selectedIndex !== '') {
            const site = sites[Number(selectedIndex)];
            onSelect(site.position);
          } else {
            onSelect(null);
          }
        }}
      >
        <option value="">Selecciona un lugar</option>
        {sites.map((site, index) => (
          <option key={index} value={index}>
            {site.name}
          </option>
        ))}
      </select>
    );
  };
  

export default SelectLocation;
  