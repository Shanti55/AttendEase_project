const statusStyles = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-800',
  DONE: 'bg-green-100 text-green-800',
};

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const dueLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-IN')
    : null;

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[#0D1B2A] truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
          {dueLabel && (
            <p className="text-xs text-gray-400 mt-2">Due: {dueLabel}</p>
          )}
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${statusStyles[task.status]}`}
        >
          {task.status.replace('_', ' ')}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-50">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50"
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
        <button
          onClick={() => onEdit(task)}
          className="text-xs text-[#0D1B2A] hover:text-[#C9963A] font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs text-red-600 hover:text-red-700 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
