import { useState, useEffect } from "react";

const LessonModal = ({
  show,
  onClose,
  onSubmit,
  lessonData = null,
  moduleId,
  mode = "Add",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content_type: "video",
    content_url: "",
    order: 1,
    is_preview: false,
    is_active: true,
  });

  useEffect(() => {
    if (lessonData) {
      setFormData({
        title: lessonData.title || "",
        content_type: lessonData.content_type || "video",
        content_url: lessonData.content_url || "",
        order: lessonData.order || 1,
        is_preview: lessonData.is_preview || false,
        is_active: lessonData.is_active ?? true,
      });
    }
  }, [lessonData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      module: moduleId,
    };
    onSubmit(payload, lessonData?.id || null);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
        <h3 className="text-xl font-bold mb-4">{mode} Lesson</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Lesson Title"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <select
            name="content_type"
            value={formData.content_type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="video">Video</option>
            <option value="text">Text</option>
            <option value="quiz">Quiz</option>
          </select>

          <input
            name="content_url"
            value={formData.content_url}
            onChange={handleChange}
            placeholder="Content URL (video link or text ID)"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            placeholder="Order"
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name="is_preview"
                checked={formData.is_preview}
                onChange={handleChange}
              />
              <span>Preview</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <span>Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonModal;
