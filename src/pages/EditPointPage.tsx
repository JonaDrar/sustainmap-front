import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Pointdata } from "../hooks/UseFetchPoints";
import UseFetchPoints from "../hooks/UseFetchPoints";

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
    } else {
      setFormData({
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
    navigate(-1); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { latitud, longitude, type } = formData;

      if (parseFloat(latitud) < -90 || parseFloat(latitud) > 90) {
        alert("La latitud debe estar entre -90 y 90.");
        return;
      }

      if (parseFloat(longitude) < -180 || parseFloat(longitude) > 180) {
        alert("La longitud debe estar entre -180 y 180.");
        return;
      }

      if (parseInt(type, 10) < 1 || parseInt(type, 10) > 4) {
        alert("El tipo debe estar entre 1 y 4.");
        return;
      }

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
  
      navigate("/map");
    } catch (error) {
      console.error("Error al guardar el punto:", error);
      alert("No se pudo guardar el punto. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">Editar Punto</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Latitud
            </label>
            <input
              type="text"
              name="latitud"
              value={formData.latitud}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Longitud
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comuna
            </label>
            <input
              type="text"
              name="commune"
              value={formData.commune || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Region
            </label>
            <input
              type="text"
              name="region"
              value={formData.region || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre Galeria
            </label>
            <input
              type="text"
              name="galleryName"
              value={formData.gallery.galleryName || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número Local
            </label>
            <input
              type="text"
              name="localNumber"
              value={formData.gallery.localNumber || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Foto
            </label>
            <input
              type="text"
              name="photo_url"
              value={formData.photo_url || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Servicios
            </label>
            <textarea
              name="services"
              value={formData.services}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Destacado
            </label>
            <select
              name="highlighted"
              value={formData.highlighted ? "true" : "false"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  highlighted: e.target.value === "true",
                })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
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
  );
};

export default EditPointPage;
