import React from "react";
import { CircleCheck, ChevronDown, Gauge, ListTodo, Plus, Search, X } from "lucide-react";

// Hàm hỗ trợ tính khoảng ngày (DD/MM - DD/MM) cho từng tuần dựa trên ngày bắt đầu và kết thúc của dự án
const getWeekDateRange = (projectStartDate, projectEndDate, weekNum) => {
    if (!projectStartDate) return '';
    const start = new Date(projectStartDate);
    if (isNaN(start.getTime())) return '';

    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + (Number(weekNum) - 1) * 7);

    let weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Nếu tuần vượt quá ngày kết thúc của dự án thì giới hạn lại bằng đúng ngày endDate
    if (projectEndDate) {
        const projEnd = new Date(projectEndDate);
        if (!isNaN(projEnd.getTime()) && weekEnd > projEnd) {
            weekEnd = projEnd;
        }
    }

    const formatShort = (d) =>
        `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

    return `${formatShort(weekStart)} - ${formatShort(weekEnd)}`;
};

/**
 - Board toolbar: search + week filter (the two filters the board already had), active-filter chips
 - and the "Add task" action. Purely presentational — the page owns the filter state and logic.
 - `summary` ({ tasks, points, completed }) is the project context shown next to the action.
 */
function BoardToolbar({
                          summary,
                          searchQuery,
                          onSearchChange,
                          selectedWeek,
                          onWeekChange,
                          totalWeeks,
                          projectStartDate,
                          projectEndDate,
                          canCreateTask,
                          onCreateTask,
                      }) {
    const trimmedQuery = searchQuery.trim();
    const weekActive = selectedWeek !== "all";
    const hasFilters = Boolean(trimmedQuery) || weekActive;

    // Lấy chuỗi ngày cho tuần đang được chọn (để hiển thị trên chip filter)
    const activeWeekRange = weekActive ? getWeekDateRange(projectStartDate, projectEndDate, selectedWeek) : '';

    return (
        <div className="board-toolbar">
            <div className="board-toolbar-row">
                <div className="board-toolbar-filters">
                    <div className="input-icon-wrap board-search" role="search">
                        <Search className="icon icon-sm" aria-hidden="true" />
                        <input
                            className="input"
                            type="search"
                            placeholder="Search tasks…"
                            aria-label="Search tasks by name"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    <div className="select-wrap board-week">
                        <select
                            className={`select${weekActive ? " is-active" : ""}`}
                            aria-label="Filter by week"
                            value={selectedWeek}
                            onChange={(e) => onWeekChange(e.target.value)}
                        >
                            <option value="all">All weeks</option>
                            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((w) => {
                                const dateRange = getWeekDateRange(projectStartDate, projectEndDate, w);
                                return (
                                    <option key={w} value={w}>
                                        {dateRange ? `Week ${w} (${dateRange})` : `Week ${w}`}
                                    </option>
                                );
                            })}
                        </select>
                        <ChevronDown className="icon icon-sm" aria-hidden="true" />
                    </div>
                </div>

                {summary && (
                    <ul className="board-summary" aria-label="Board summary">
                        <li title="Tasks on the board"><ListTodo className="icon icon-xs" aria-hidden="true" />{summary.tasks} {summary.tasks === 1 ? "task" : "tasks"}</li>
                        <li title="Story points on the board"><Gauge className="icon icon-xs" aria-hidden="true" />{summary.points} est</li>
                        <li title="Completed tasks"><CircleCheck className="icon icon-xs" aria-hidden="true" />{summary.completed} completed</li>
                    </ul>
                )}

                {canCreateTask && (
                    <button type="button" className="btn btn-primary board-add-btn" onClick={onCreateTask}>
                        <Plus className="icon icon-sm" aria-hidden="true" />
                        Add task
                    </button>
                )}
            </div>

            {hasFilters && (
                <div className="filter-chips" aria-label="Active filters">
                    {trimmedQuery && (
                        <span className="filter-chip">
                            <span className="filter-chip-label">Search: “{trimmedQuery}”</span>
                            <button type="button" onClick={() => onSearchChange("")} aria-label="Clear search filter">
                                <X className="icon icon-xs" aria-hidden="true" />
                            </button>
                        </span>
                    )}
                    {weekActive && (
                        <span className="filter-chip">
                            <span className="filter-chip-label">
                                Week {selectedWeek} {activeWeekRange ? `(${activeWeekRange})` : ''}
                            </span>
                            <button type="button" onClick={() => onWeekChange("all")} aria-label="Clear week filter">
                                <X className="icon icon-xs" aria-hidden="true" />
                            </button>
                        </span>
                    )}
                    {trimmedQuery && weekActive && (
                        <button
                            type="button"
                            className="filter-clear-link"
                            onClick={() => {
                                onSearchChange("");
                                onWeekChange("all");
                            }}
                        >
                            Clear all
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default BoardToolbar;