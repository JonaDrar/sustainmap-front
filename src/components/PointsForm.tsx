import InputField from "./form/InputField";
import SelectField from "./form/SelectField";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Pointdata } from "../hooks/UseFetchPoints";
import UseFetchPoints from "../hooks/UseFetchPoints";
import Swal from "sweetalert2";
import Wizard from "../components/Wizard";
import CenterMap from "./maps/CenterPointMap";
import { useCloudinaryUpload } from "../hooks/useCloudinaryUpload";
import CreatableSelectField from "./form/CreatableSelectField";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { MultiValue, SingleValue } from "react-select";
import ToggleField from "./form/ToggleField";
import highlightImage from "/images/Star.png";
import PhoneNumberInput from "./form/PhoneNumberInput";
import pointMarker from "./maps/MarkerPoint";

interface OptionType {
  label: string;
  value: string;
}

interface FormData {
  id: string;
  name: string;
  address: string;
  commune: string;
  description: string;
  highlighted: boolean;
  latitud: string;
  longitude: string;
  photo_url: string;
  region: string;
  services: OptionType[];
  rrss: {
    facebook: string;
    instagram: string;
    other: string;
  };
  phone: string;
  type: OptionType[];
  gallery: {
    galleryName: string;
    localNumber: string;
  };
  activationStartDate: string;
  activationEndDate: string;
  isActive: boolean;
}

const formatDateForInput = (date: string | undefined): string | undefined => {
  if (date) {
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0]; // Extracts the date part (YYYY-MM-DD)
  }
  return undefined;
};

const Step1Form: React.FC<{
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSelectChange: (
    value: MultiValue<OptionType> | SingleValue<OptionType>,
    field: string
  ) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleChange: (value: boolean, field: string) => void;
  handlePhoneChange: (value: string) => void;
  isUploading: boolean;
}> = ({
  formData,
  handleChange, handleDateChange,
  handlePhoneChange,
  handleFileChange,
  handleSelectChange,
  handleToggleChange,
  isUploading,
}) => {
  // Función para manejar la limitación de caracteres
  const handleLimitedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    maxLength: number
  ) => {
    if (e.target.value.length <= maxLength) {
      handleChange(e);
    }
  };

  return (
    <>
      <h6 className="col-span-2 text-lg font-normal mb-4">
        Información básica
      </h6>
      <div className="grid grid-cols-2 gap-6 ">
        <InputField
          label="Nombre del centro"
          placeholder="E.g: Siempre Linda "
          name="name"
          value={formData.name}
          maxLength={30}
          onChange={(e) => handleLimitedChange(e, 30)} // Limitar a 30 caracteres
        />

        <SelectField
          label="Categoría"
          name="type"
          value={formData.type}
          options={[
            { value: "1", label: "1. Peluquería" },
            { value: "2", label: "2. Peluquería canina" },
            { value: "3", label: "3. Centro de acopio" },
            { value: "4", label: "4. Centro de estudio" },
            { value: "5", label: "5. Otros" },
          ]}
          onChange={(value) => handleSelectChange(value, "type")}
        />
        <InputField
          label="Adjunta imagen"
          name="photo"
          type="file"
          onChange={handleFileChange}
        />
        {isUploading && <p>Subiendo imagen...</p>}

        <CreatableSelectField
          label="Servicios"
          name="services"
          value={formData.services}
          options={[
            { value: "cabello", label: "Cabello" },
            { value: "peinados", label: "Peinados" },
            { value: "especialista", label: "Especialista en rulos" },
            { value: "depilación", label: "Depilación" },
            { value: "manicure", label: "Manicure" },
            { value: "pedicure", label: "Pedicure" },
            { value: "masajes", label: "Masajes" },
            { value: "decoloración", label: "Decoloración" },
          ]}
          onChange={(value) => handleSelectChange(value, "services")}
        />

        <ToggleField
          label="Peluquería destacada"
          value={formData.highlighted}
          onChange={(highlighted) =>
            handleToggleChange(highlighted, "highlighted")
          }
          imageSrc={highlightImage}
        />
        <PhoneNumberInput value={formData.phone} onChange={handlePhoneChange} />
        <InputField
          label="Nombre de Galería(opcional)"
          placeholder="E.g: Galería Caracoles"
          name="galleryName"
          value={formData.gallery.galleryName}
          onChange={handleChange}
        />
        <InputField
          label="Nombre de depto/local(opcional)"
          placeholder="Local 304 E"
          name="localNumber"
          value={formData.gallery.localNumber}
          onChange={handleChange}
        />

      </div>
      <h6 className="text-lg font-normal my-4">Redes sociales (opcional)</h6>

      <div className="grid gap-4 mt-4">
        <InputField
          label="Sitio Web"
          placeholder="E.g: https://www.siemprelinda.com"
          name="other"
          value={formData.rrss?.other || ""}
          onChange={handleChange}
        />

        <InputField
          label="Facebook URL"
          placeholder="E.g: https://www.facebook.com/siemprelinda"
          name="facebook"
          value={formData.rrss?.facebook || ""}
          onChange={handleChange}
        />
        <InputField
          label="Instagram URL"
          placeholder="E.g: @siempre.linda.providencia"
          name="instagram"
          value={formData.rrss?.instagram || ""}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center justify-between w-full">
        <h6 className="text-lg font-normal my-4">Configuración de activación</h6>
        <p className="text-sm font-medium w-[190px] mr-[210px]">
          Estado de activación:{" "}
          <span className={formData.isActive ? "text-green-600" : "text-red-600"}>
            {formData.isActive ? "Activo" : "Inactivo"}
          </span>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Fecha de inicio"
          name="activationStartDate"
          type="date"
          value={formatDateForInput(formData.activationStartDate) || ""}
          onChange={(e) => handleDateChange(e, "activationStartDate")} 
        />
        <InputField
          label="Fecha de término"
          name="activationEndDate"
          type="date"
          value={formatDateForInput(formData.activationEndDate) || ""}
          onChange={(e) => handleDateChange(e, "activationEndDate")} 
        />
        {/* <div className="col-span-2">
          <p className="text-sm font-medium">
            Estado de activación:{" "}
            <span className={formData.isActive ? "text-green-600" : "text-red-600"}>
              {formData.isActive ? "Activo" : "Inactivo"}
            </span>
          </p>
        </div> */}
      </div>
    </>
  );
};

const Step2Form: React.FC<{
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}> = ({ formData, handleChange }) => {
  const [mapCenter, setMapCenter] = useState<[number, number] | null>([
    parseFloat(formData.latitud) || -33.4489,
    parseFloat(formData.longitude) || -70.6693,
  ]);

  const searchLocation = async (
    query: string,
    commune: string,
    region: string
  ) => {
    if (query.trim() === "" || commune.trim() === "" || region.trim() === "") return;

    try {
      const fullQuery = `${query}, ${commune}, ${region}`;
      console.log("Buscando dirección:", fullQuery);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&addressdetails=1&limit=1`
      );

      const data = await response.json();
      console.log("Respuesta de la API:", data);

      if (data.length > 0) {
        const { lat, lon } = data[0];
        
        formData.latitud = lat;
      formData.longitude = lon;

        formData.latitud = lat.toString();
        formData.longitude = lon.toString();

        console.log("Coordenadas encontradas:", lat, lon);

        // Actualizar latitud y longitud de forma conjunta
        handleChange({
          target: { name: "latitud", value: lat.toString() },
        } as React.ChangeEvent<HTMLInputElement>);

        handleChange({
          target: { name: "longitude", value: lon.toString() },
        } as React.ChangeEvent<HTMLInputElement>);

        // Actualizar el centro del mapa
        setMapCenter([lat, lon]);
      } else {
        alert("No se encontraron resultados para la dirección ingresada.");
      }
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    }
  };

  const handleMarkerDrag = (event: L.DragEndEvent) => {
    const marker = event.target as L.Marker;
    const { lat, lng } = marker.getLatLng();
    formData.latitud = lat.toString();
    formData.longitude = lng.toString();

    console.log("Marcador arrastrado a:", lat, lng);

    // Actualizar latitud y longitud de forma conjunta
    handleChange({
      target: { name: "latitud", value: lat.toString() },
    } as React.ChangeEvent<HTMLInputElement>);

    handleChange({
      target: { name: "longitude", value: lng.toString() },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSearch = () => {
    if (formData.address.trim() !== "") {
      searchLocation(formData.address, formData.commune, formData.region);
    } else {
      alert("Por favor, ingresa una dirección válida.");
    }
  };

  return (
    <>
      <h6 className="col-span-2 text-lg font-normal mb-4">Dirección</h6>
      <div className="grid grid-cols-2 gap-4 pb-4">
        
        <InputField
          label="Dirección"
          placeholder="Av. Providencia 675"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <InputField
          label="Comuna/Municipio"
          placeholder="Ej: Providencia"
          name="commune"
          value={formData.commune}
          onChange={handleChange}
        />
        <InputField
          label="Región"
          placeholder="Ej: Región Metropolitana"
          name="region"
          value={formData.region}
          onChange={handleChange}
        />
        <div className="flex items-center">
  <img 
    src="/images/icon-pin.png" 
    alt="Icono de ubicación" 
    className="w-6 h-6 mr-4" 
  />
  <h2 className="font-bold text-blue-600">
    .Arrastre el marcador para mejorar la ubicación en el mapa.
  </h2>
</div>
        <InputField
          label="Coordenadas -Latitud (opcional)"
          placeholder="Ej: -33.4489"
          name="latitud"
          value={formData.latitud}
          onChange={handleChange}
        />
        <InputField
          label="Coordenadas-Longitud (opcional)"
          placeholder="Ej: -70.6693"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
        />
        <div className="col-span-2">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white py-2 px-4 rounded w-full"
          >
            Buscar ubicación
          </button>
        </div>
      
      </div>

      <div>
        <MapContainer
          center={mapCenter || [-33.4489, -70.6693]} // default center if null
          zoom={15}
          style={{ height: "275px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <CenterMap coords={mapCenter} />
          {formData.latitud && formData.longitude && parseFloat(formData.latitud) && parseFloat(formData.longitude) && (
            <Marker
              position={[parseFloat(formData.latitud), parseFloat(formData.longitude)]}
              draggable={true}
              icon={pointMarker}
              eventHandlers={{
                dragend: handleMarkerDrag,
              }}
            />
          )}
        </MapContainer>
      </div>
    </>
  );
};

// Define las opciones en una constante
const typeOptions = [
  { value: "1", label: "1. Peluquería" },
  { value: "2", label: "2. Peluquería canina" },
  { value: "3", label: "3. Centro de acopio" },
  { value: "4", label: "4. Centro de estudio" },
  { value: "5", label: "5. Otros" },
];

// Función para obtener el objeto con value y label
const getTypeLabel = (type: number) => {
  if (type === null) return null;
  const option = typeOptions.find(opt => opt.value === type.toString());
  return option?.label || "";
};

// Función para capitalizar la primera letra de una cadena
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const EditPointPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updatePoint, createPoint } = UseFetchPoints();
  const point: Pointdata | undefined = location.state?.point;
  const { uploadImageToCloudinary, isUploading } = useCloudinaryUpload();

  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    address: "",
    commune: "",
    description: "",
    highlighted: false,
    latitud: "",
    longitude: "",
    photo_url: "",
    region: "",
    services: [],
    type: [],
    gallery: {
      galleryName: "",
      localNumber: "",
    },
    phone: "+569",
    rrss: {
      facebook: "",
      instagram: "",
      other: "",
    },
    activationStartDate: "",
    activationEndDate: "",
    isActive: false,
  });

  const [step, setStep] = useState(1);
  const totalSteps = 2;

  useEffect(() => {
    if (point) {
      setFormData({
        id: point.id || "",
        name: point.name || "",
        address: point.address || "",
        commune: point.commune || "",
        description: point.description || "",
        highlighted: point.highlighted || false,
        latitud: point.latitud?.toString() || "",
        longitude: point.longitude?.toString() || "",
        photo_url: typeof point.photo_url === "string" ? point.photo_url : "",
        region: point.region || "",
        services: point.services ? point.services.map(service => ({
          value: service,
          label: capitalizeFirstLetter(service),
        })) : [],
        type: point.type && Array.isArray(point.type) ? point.type.map((type: number) => ({
              value: type.toString(),
              label: getTypeLabel(type),
            } as OptionType))
          : [],
        gallery: {
          galleryName: point.gallery?.galleryName || "",
          localNumber: point.gallery?.localNumber || "",
        },
        phone: point.phone || "",
        rrss: {
          facebook: point.rrss?.facebook || "",
          instagram: point.rrss?.instagram || "",
          other: point.rrss?.other || "",
        },
        activationStartDate: point.activationStartDate || "",
        activationEndDate: point.activationEndDate || "",
        isActive: point.isActive || false,
      });
    }
  }, [point]);

  // useEffect(() => {
  //   console.log("Datos de formData actualizados:", formData);
  // }, [formData]); // Verificar cómo cambia el formData en cada actualización

  // useEffect(() => {
  //   // Si el formulario ha cambiado y se está en el paso 2, actualizamos la vista
  //   if (step === 2 && point) {
  //     console.log("Formulario está en el paso 2:", formData);

  //     // Aquí podrías realizar alguna validación o actualizar algo del estado
  //     if (!formData.phone || formData.phone === "+569") {
  //       console.log("El teléfono no ha sido completado correctamente.");
  //     }
  //   }
  // }, [step, formData]);  // El estado solo cambia cuando el paso cambia

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await uploadImageToCloudinary(file);
        console.log("URL de la imagen subida:", uploadedUrl);
        setFormData({ ...formData, photo_url: uploadedUrl });
        Swal.fire("Éxito", "La imagen se subió correctamente.", "success");
      } catch (error) {
        console.error("Error uploading image:", error);
        Swal.fire(
          "Error",
          "No se pudo subir la imagen. Por favor, intenta nuevamente.",
          "error"
        );
      }
    }
  };

  const handleSelectChange = (
    value: MultiValue<OptionType> | SingleValue<OptionType>,
    field: string
  ) => {
      setFormData({ ...formData, [field]: value });
  };

  const validateDates = () => {
    const startDate = new Date(formData.activationStartDate);
    const endDate = new Date(formData.activationEndDate);

    const newErrors = { activationStartDate: "", activationEndDate: "" };
    let isValid = true;

    if (!formData.activationStartDate) {
      newErrors.activationStartDate = "La fecha de inicio es requerida.";
      isValid = false;
    } else if (isNaN(startDate.getTime())) {
      newErrors.activationStartDate = "La fecha de inicio no es válida.";
      isValid = false;
    }

    if (!formData.activationEndDate) {
      newErrors.activationEndDate = "La fecha de fin es requerida.";
      isValid = false;
    } else if (isNaN(endDate.getTime())) {
      newErrors.activationEndDate = "La fecha de fin no es válida.";
      isValid = false;
    }

    if (isValid && startDate > endDate) {
      newErrors.activationEndDate = "La fecha de fin debe ser posterior a la fecha de inicio.";
      isValid = false;
    }

    if (!isValid) {
      Swal.fire(
        "Error",
        `${newErrors.activationStartDate || ""} ${newErrors.activationEndDate || ""}`,
        "error"
      );
    }
    return isValid;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [field]: value };
      const startDate = new Date(updatedFormData.activationStartDate);
      const endDate = new Date(updatedFormData.activationEndDate);

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        updatedFormData.isActive = startDate <= new Date() && endDate >= new Date();
      }

      return updatedFormData;
    });
  };

const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  const { name, value, type, checked } = e.target as HTMLInputElement;

  if (name === "latitud") {
    if (value === "-" || /^-?\d*\.?\d*$/.test(value)) {
      const num = parseFloat(value);
      if (value === "-" || value === "" || (num >= -90 && num <= 90)) {
        setFormData({ ...formData, latitud: value });
      }
    }
    return;
  }

  if (name === "longitude") {
    if (value === "-" || /^-?\d*\.?\d*$/.test(value)) {
      const num = parseFloat(value);
      if (value === "-" || value === "" || (num >= -180 && num <= 180)) {
        setFormData({ ...formData, longitude: value });
      }
    }
    return;
  }

  if (name === "type") {
    if (/^[1-4]?$/.test(value)) {
      setFormData({ ...formData, type: value ? [{ label: value, value: value }] : [] });
    }
    return;
  }

  if (name === "highlighted") {
    setFormData({ ...formData, highlighted: value === "true" });
    return;
  }

  if (["facebook", "instagram", "other"].includes(name)) {
    setFormData({
      ...formData,
      rrss: {
        ...formData.rrss,
        [name]: value,
      },
    });
    return;
  }

  if (name === "galleryName" || name === "localNumber") {
    setFormData({
      ...formData,
      gallery: {
        ...formData.gallery,
        [name]: value,
      },
    });
  } else {
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }
};


  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDates()) {
      Swal.fire("Error", "Por favor corrige los errores en las fechas.", "error");
      return;
    }

    const startDate = new Date(formData.activationStartDate);
    const endDate = new Date(formData.activationEndDate);


    // Función para validar si una URL es válida
    const isValidUrl = (url: string) => {
      const pattern = /^(https?:\/\/)?([\w.-]+)(\.[a-z]{2,6})(\/[\w.-]*)*\/?$/i;
      return pattern.test(url);
    };

    // Inicializamos el objeto con valores vacíos
    const socialMediaLinks: {
      instagram: string | null;
      facebook: string | null;
      other: string | null;
    } = {
      instagram:
        formData.rrss?.instagram && isValidUrl(formData.rrss.instagram)
          ? formData.rrss.instagram
          : null,
      facebook:
        formData.rrss?.facebook && isValidUrl(formData.rrss.facebook)
          ? formData.rrss.facebook
          : null,
      other:
        formData.rrss?.other && isValidUrl(formData.rrss.other)
          ? formData.rrss.other
          : null,
    };

    // Solo asignamos si la URL es válida
    if (formData.rrss?.facebook && isValidUrl(formData.rrss.facebook)) {
      socialMediaLinks.facebook = formData.rrss.facebook;
    } else if (!formData.rrss?.facebook || formData.rrss?.facebook === "") {
      socialMediaLinks.other = null;
    }

    if (formData.rrss?.instagram && isValidUrl(formData.rrss.instagram)) {
      socialMediaLinks.instagram = formData.rrss.instagram;
    } else if (!formData.rrss?.instagram || formData.rrss?.instagram === "") {
      socialMediaLinks.other = null;
    }

    if (formData.rrss?.other && isValidUrl(formData.rrss.other)) {
      socialMediaLinks.other = formData.rrss.other;
    } else if (!formData.rrss?.other || formData.rrss?.other === "") {
      socialMediaLinks.other = null;
    }

    // Si no hay valores en rrss, lo dejamos como null
    if (
      !socialMediaLinks.facebook &&
      !socialMediaLinks.instagram &&
      !socialMediaLinks.other
    ) {
      socialMediaLinks.facebook = null;
      socialMediaLinks.instagram = null;
      socialMediaLinks.other = null;
    }

    // Para el campo gallery, lo mandamos como null si está vacío
    const galleryData = {
      galleryName: formData.gallery?.galleryName || null,
      localNumber: formData.gallery?.localNumber || null,
    };

    const { services, type } = formData;

    const dataToSend = {
      ...formData,
        activationStartDate: startDate ? startDate.toISOString() : undefined,
        activationEndDate: endDate ? endDate.toISOString() : undefined,
      latitud: parseFloat(formData.latitud || "0"),
      longitude: parseFloat(formData.longitude || "0"),
      type: type.map(({ value }) =>  parseInt(value, 10)),
      gallery: galleryData,
      services: services.map((service) => service.value),
      rrss: socialMediaLinks,
      photo_url: formData.photo_url,
    };

    try {
      if (formData.id) {
        await updatePoint(dataToSend.id, dataToSend);
      } else {
        await createPoint(dataToSend);
      }

      Swal.fire("Éxito", "El punto se ha guardado correctamente.", "success");
      navigate("/");
    } catch (error) {
      console.error("Error al guardar el punto:", error);

      let errorMessage = "No se pudo guardar el punto. Por favor, intenta nuevamente.";

      if (error instanceof Error) {
          if (error.message.includes("<ul>")) {
              // If it's a list of errors (formatted as <ul>)
              errorMessage = error.message;
          } else {
              // Single error message
              errorMessage = error.message;
          }
      }

      Swal.fire({
          title: "Error",
          html: errorMessage, // Displays formatted error message
          icon: "error",
      });
  }
};

  const handleNextStep = () =>
    setStep((prev) => Math.min(prev + 1, totalSteps));

  const handleToggleChange = (value: boolean, field: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value });
  };
  const handlePreviousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const isOnEditPage = location.pathname.includes("edit-point");
  return (
    <div className="gradient-background min-h-screen p-10 items-center justify-center ">
      <Wizard
        step={step}
        totalSteps={totalSteps}
        onPrevious={step > 1 ? handlePreviousStep : undefined}
        onNext={(e) =>
          step === totalSteps ? handleSubmit(e) : handleNextStep()
        }
        onCancel={handleCancel}
        headerText="Puntos de interés"
        subHeaderText={`${isOnEditPage ? "Editar" : "Crear"} punto de interés`}
      >
        {step === 1 && (
          <Step1Form
            formData={formData}
            handleSelectChange={handleSelectChange}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleToggleChange={handleToggleChange}
            handlePhoneChange={handlePhoneChange}
            handleDateChange={handleDateChange} isUploading={isUploading}
          />
        )}
        {step === 2 && (
          <Step2Form formData={formData} handleChange={handleChange} />
        )}
      </Wizard>
    </div>
  );
};

export default EditPointPage;