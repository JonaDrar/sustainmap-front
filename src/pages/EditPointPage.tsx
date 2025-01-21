import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Pointdata } from "../hooks/UseFetchPoints";
import UseFetchPoints from "../hooks/UseFetchPoints";
import Swal from "sweetalert2";
import {InputField, SelectField} from "../components/form";

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
  });

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
      });
    }
  }, [point]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    try {
      const services = formData.services.split(",").map((service) => {return service.trim()});

      const dataToSend = {
        ...formData,
        latitud: parseFloat(formData.latitud || "0"),
        longitude: parseFloat(formData.longitude || "0"),
        type: parseInt(formData.type || "0", 10),
        gallery: {
          galleryName: formData.gallery.galleryName,
          localNumber: formData.gallery.localNumber,
        },
        services
      };

      if (formData.id) {
        await updatePoint(dataToSend.id, dataToSend);
      } else {
        await createPoint(dataToSend); 
      }
  
      Swal.fire("Éxito", "El punto se ha guardado correctamente.", "success");
      navigate("/");
    } catch (error) {
      console.error("Error al guardar el punto:", error);
      Swal.fire("Error", "No se pudo guardar el punto. Por favor, intenta nuevamente.", "error");
    }
  };

  return (
    <div className="gradient-background min-h-screen flex items-center justify-center">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">Editar Punto</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <InputField
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <InputField
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
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
              label="Comuna"
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
              label="Nombre Galería"
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
              label="Foto"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
            />
            <InputField
              label="Servicios"
              name="services"
              value={formData.services}
              onChange={handleChange}
            />
            <SelectField
              label="Tipo"
              name="type"
              value={formData.type}
              options={[
                { value: "1", label: "Peluqueria" },
                { value: "2", label: "Peluqueria canina" },
                { value: "3", label: "Centro de acopio" },
                { value: "4", label: "Centro de estudio" },
              ]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value,
                })
              }
            />
            <SelectField
              label="Destacado"
              name="highlighted"
              options={[
                { value: "true", label: "Sí" },
                { value: "false", label: "No" },
              ]}
              value={formData.highlighted ? "true" : "false"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  highlighted: e.target.value === "true",
                })
              }
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPointPage;