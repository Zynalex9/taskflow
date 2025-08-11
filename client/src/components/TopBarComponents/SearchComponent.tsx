import { useClickOutside } from "@/Context/useRefContext";
import { QueryDBResponse } from "@/types/functionalites.types";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResponse, setSearchResponse] = useState<QueryDBResponse | null>(null);
  const [isLoading, setLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => {
    setSearchQuery("");
    setSearchResponse(null);
  });

  const getSearchResult = async () => {
    try {
      setLoading(true);
      const response = await axios.get<QueryDBResponse>(
        `${import.meta.env.VITE_BASE_URL}/api/workspace/queryDB?query=${searchQuery}`
      );
      if (response.data.statusCode === 200) {
        setSearchResponse(response.data);
      }
    } catch (error: any) {
      console.log(error);
      setSearchResponse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        getSearchResult();
      } else {
        setSearchResponse(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const noResults =
    searchResponse &&
    searchResponse.data.workspaces.length === 0 &&
    searchResponse.data.boards.length === 0 &&
    searchResponse.data.lists.length === 0 &&
    searchResponse.data.cards.length === 0;

  return (
    <div className="relative w-64" ref={ref}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fprimary pr-9"
        />
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
      </div>

      {/* Search Dropdown */}
      {searchQuery.length > 0 && (
        <div className="absolute top-12 w-full rounded-lg bg-neutral-900 shadow-lg border border-neutral-700 z-50 max-h-80 overflow-y-auto">
          <div className="p-3 space-y-4 text-sm text-gray-200">
            {isLoading && <div className="text-center py-4">Loading...</div>}

            {!isLoading && noResults && (
              <div className="text-center py-4 text-gray-400">No results found</div>
            )}

            {!isLoading && searchResponse && !noResults && (
              <>
                {/* Workspaces */}
                {searchResponse.data.workspaces.length > 0 && (
                  <div>
                    <h1 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                      Workspaces ({searchResponse.data.workspaces.length})
                    </h1>
                    <div className="space-y-1">
                      {searchResponse.data.workspaces.map((workspace) => (
                        <div
                          key={workspace._id}
                          className="p-2 rounded-md bg-neutral-800 hover:bg-fprimary/80 hover:text-white cursor-pointer transition"
                        >
                          {workspace.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Boards */}
                {searchResponse.data.boards.length > 0 && (
                  <div>
                    <h1 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                      Boards ({searchResponse.data.boards.length})
                    </h1>
                    <div className="space-y-1">
                      {searchResponse.data.boards.map((board) => (
                        <div
                          key={board._id}
                          className="p-2 rounded-md bg-neutral-800 hover:bg-fprimary/80 hover:text-white cursor-pointer transition"
                        >
                          {board.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lists */}
                {searchResponse.data.lists.length > 0 && (
                  <div>
                    <h1 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                      Lists ({searchResponse.data.lists.length})
                    </h1>
                    <div className="space-y-1">
                      {searchResponse.data.lists.map((list) => (
                        <div
                          key={list._id}
                          className="p-2 rounded-md bg-neutral-800 hover:bg-fprimary/80 hover:text-white cursor-pointer transition"
                        >
                          {list.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cards */}
                {searchResponse.data.cards.length > 0 && (
                  <div>
                    <h1 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                      Cards ({searchResponse.data.cards.length})
                    </h1>
                    <div className="space-y-1">
                      {searchResponse.data.cards.map((card) => (
                        <div
                          key={card._id}
                          className="p-2 rounded-md bg-neutral-800 hover:bg-fprimary/80 hover:text-white cursor-pointer transition"
                        >
                          {card.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
