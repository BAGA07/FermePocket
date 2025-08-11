import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import { EyeCloseIcon, EyeIcon, TimeIcon } from "../../../icons";
import DatePicker from "../date-picker.tsx";
import { RefreshCw } from "lucide-react";

export default function DefaultInputs() {
  const [showPassword, setShowPassword] = useState(false);
  const [options, setOptions] = useState([
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Charger les options de manière dynamique
  const loadOptions = async () => {
    setIsLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Options dynamiques avec variations
      const dynamicOptions = [
        { value: "marketing", label: "Marketing" },
        { value: "template", label: "Template" },
        { value: "development", label: "Development" },
        { value: "design", label: "Design" },
        { value: "sales", label: "Sales" },
        { value: "support", label: "Support" }
      ];

      // Mélanger aléatoirement les options
      const shuffledOptions = dynamicOptions
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 3); // 3-5 options

      setOptions(shuffledOptions);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur lors du chargement des options:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les options au montage et toutes les 5 minutes
  useEffect(() => {
    loadOptions();
    const interval = setInterval(loadOptions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  // Formater la date de dernière mise à jour
  const formatLastUpdate = (date: Date | null) => {
    if (!date) return "Jamais";
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    if (diff < 1) return "À l'instant";
    if (diff < 60) return `Il y a ${diff} min`;
    if (diff < 1440) return `Il y a ${Math.floor(diff / 60)}h`;
    return `Il y a ${Math.floor(diff / 1440)}j`;
  };

  return (
    <ComponentCard title="Default Inputs">
      {/* Header avec contrôles */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm text-gray-600">
            Options mises à jour: {formatLastUpdate(lastUpdate)}
          </p>
          <p className="text-xs text-gray-500">
            {options.length} options disponibles
          </p>
        </div>
        <button
          onClick={loadOptions}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          title="Actualiser les options"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="input">Input</Label>
          <Input type="text" id="input" />
        </div>
        <div>
          <Label htmlFor="inputTwo">Input with Placeholder</Label>
          <Input type="text" id="inputTwo" placeholder="info@gmail.com" />
        </div>
        <div>
          <Label>Select Input</Label>
          <Select
            options={options}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label>Password Input</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <DatePicker
            id="date-picker"
            label="Date Picker Input"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              // Handle your logic
              console.log({ dates, currentDateString });
            }}
          />
        </div>

        <div>
          <Label htmlFor="tm">Time Picker Input</Label>
          <div className="relative">
            <Input
              type="time"
              id="tm"
              name="tm"
              onChange={(e) => console.log(e.target.value)}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <TimeIcon className="size-6" />
            </span>
          </div>
        </div>
        <div>
          <Label htmlFor="tm">Input with Payment</Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Card number"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.29004 5.90393H17.7067"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.7075 14.0961H2.29085"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.0017 10.001H7.00171"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.29492 7.90393L6.00159 11.001"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.7067 7.90393L13.9999 11.001"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}
