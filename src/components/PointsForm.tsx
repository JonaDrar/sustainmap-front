import InputField from "./form/InputField";
import SelectField from "./form/SelectField";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Pointdata } from "../hooks/UseFetchPoints";
import UseFetchPoints from "../hooks/UseFetchPoints";
import Swal from "sweetalert2";
import Wizard from "../components/Wizard";
import { MapContainer, TileLayer } from "react-leaflet";
import MarkerList from "./MarkerList";
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';
import CenterMap from "./maps/CenterPointMap";

const Step1Form: React.FC<{
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}> = ({ formData, handleChange, handleFileChange, isUploading }) => {
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
        <div className="relative">
          <InputField
            label="Nombre del centro"
            name="name"
            value={formData.name}
            onChange={(e) => handleLimitedChange(e, 20)} // Limitar a 20 caracteres
          />
          <div className="absolute bottom-0 right-4 text-sm text-gray-500">
            {formData.name.length}/20
          </div>
        </div>
        <SelectField
          label="Categoría"
          name="type"
          value={formData.type}
          options={[
            { value: "1", label: "1. Peluquería" },
            { value: "2", label: "2. Peluquería canina" },
            { value: "3", label: "3. Centro de acopio" },
            { value: "4", label: "4. Centro de estudio" },
          ]}
          onChange={handleChange}
        />
        <InputField
          label="Subir foto"
          name="photo"
          type="file"
          onChange={handleFileChange}
        />
        {isUploading && <p>Subiendo imagen...</p>}
        <SelectField
          label="Servicios"
          name="services"
          value={formData.services}
          options={[
            { value: "peinados", label: "Peinados" },
            { value: "masajes", label: "Masajes" },
            { value: "manicure", label: "Manicure" },
            { value: "depilación", label: "Depilación" },
          ]}
          onChange={handleChange}
        />

        <SelectField
          label="Peluquería destacada"
          name="highlighted"
          options={[
            { value: "true", label: "Sí" },
            { value: "false", label: "No" },
          ]}
          value={formData.highlighted ? "true" : "false"}
          onChange={handleChange}
        />

        <InputField
          label="Número de teléfono"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <h6 className="text-lg font-normal my-4">Redes sociales (opcional)</h6>

      <div className="grid gap-4 mt-4">
        <InputField
          label="Sitio Web"
          name="other"
          value={formData.rrss?.other || ""}
          onChange={handleChange}
        />

        <InputField
          label="Facebook URL"
          name="facebook"
          value={formData.rrss?.facebook || ""}
          onChange={handleChange}
        />
        <InputField
          label="Instagram URL"
          name="instagram"
          value={formData.rrss?.instagram || ""}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

const Step2Form: React.FC<{
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}> = ({ formData, handleChange }) => {
  return (
    <>
      <h6 className="col-span-2 text-lg font-normal mb-4">Dirección</h6>
      <div className="grid grid-cols-2 gap-4 pb-4">
        <InputField
          label="Latitud"
          name="latitud"
          value={formData.latitud}
          onChange={handleChange}
        />
        <InputField
          label="Longitud"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
        />

        <InputField
          label="Comuna/Municipio"
          name="commune"
          value={formData.commune}
          onChange={handleChange}
        />
        <InputField
          label="Región"
          name="region"
          value={formData.region}
          onChange={handleChange}
        />

        <InputField
          label="Calle o Avenida y número"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <InputField
          label="Nombre de Galería"
          name="galleryName"
          value={formData.gallery.galleryName}
          onChange={handleChange}
        />
        <InputField
          label="Número Local"
          name="localNumber"
          value={formData.gallery.localNumber}
          onChange={handleChange}
        />
        <InputField
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <MapContainer
          center={[-33.4489, -70.6693]}
          zoom={9}
          style={{ height: "275px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {formData.latitud &&
            formData.longitude &&
            parseFloat(formData.latitud) &&
            parseFloat(formData.longitude) && (
              <>
                <MarkerList sites={[{ ...formData } as unknown as Pointdata]} />
                <CenterMap
                  coords={[
                    parseFloat(formData.latitud),
                    parseFloat(formData.longitude),
                  ]}
                />
              </>
            )}
        </MapContainer>
      </div>
    </>
  );
};

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
  services: string;
  rrss: {
    facebook: string;
    instagram: string;
    other: string;
  };
  phone: string;
  type: string;
  gallery: {
    galleryName: string;
    localNumber: string;
  };
}

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
    services: "",
    type: "",
    gallery: {
      galleryName: "",
      localNumber: "",
    },
    phone: "",
    rrss: {
      // Asegúrate de incluir este objeto
      facebook: "",
      instagram: "",
      other: "",
    },
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
        photo_url: point.photo_url || "",
        region: point.region || "",
        services: point.services.join(", ") || "",
        type: point.type?.toString() || "",
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
      });
    }
  }, [point]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await uploadImageToCloudinary(file);
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
        setFormData({ ...formData, type: value });
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
      instagram: formData.rrss?.instagram && isValidUrl(formData.rrss.instagram) ? formData.rrss.instagram : null,
      facebook: formData.rrss?.facebook && isValidUrl(formData.rrss.facebook) ? formData.rrss.facebook : null,
      other: formData.rrss?.other && isValidUrl(formData.rrss.other) ? formData.rrss.other : null,
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
    if (!socialMediaLinks.facebook && !socialMediaLinks.instagram && !socialMediaLinks.other) {
      socialMediaLinks.facebook = null;
      socialMediaLinks.instagram = null;
      socialMediaLinks.other = null;
    }

    // Para el campo gallery, lo mandamos como null si está vacío
    const galleryData = {
      galleryName: formData.gallery?.galleryName || null,
      localNumber: formData.gallery?.localNumber || null,
    };

    
      const services = formData.services
        .split(",")
        .map((service) => service.trim());

      const dataToSend = {
        ...formData,
        latitud: parseFloat(formData.latitud || "0"),
        longitude: parseFloat(formData.longitude || "0"),
        type: parseInt(formData.type || "0", 10),
        gallery: galleryData,
        services,
        rrss: socialMediaLinks,
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
      Swal.fire(
        "Error",
        "No se pudo guardar el punto. Por favor, intenta nuevamente.",
        "error"
      );
    }
  };

  const handleNextStep = () =>
    setStep((prev) => Math.min(prev + 1, totalSteps));
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
          <Step1Form formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} isUploading={isUploading} />
        )}
        {step === 2 && (
          <Step2Form formData={formData} handleChange={handleChange} />
        )}
      </Wizard>
    </div>
  );
};



export default EditPointPage;
