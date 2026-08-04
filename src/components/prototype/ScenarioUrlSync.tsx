import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrototypeStore } from "../../store/prototypeStore";
import {
  buildScenarioSearchParams,
  parseScenarioSearchParams,
} from "../../utils/scenarioUrl";

/** Syncs scenario identity params with the URL. Scenario fixtures remain source of truth. */
export function ScenarioUrlSync() {
  const location = useLocation();
  const navigate = useNavigate();
  const writingUrl = useRef(false);
  const lastAppliedSearch = useRef<string | null>(null);

  const scenarioId = usePrototypeStore((state) => state.scenarioId);
  const activeUserId = usePrototypeStore((state) => state.activeUserId);
  const activeAppId = usePrototypeStore((state) => state.activeAppId);
  const nodeFleetId = usePrototypeStore((state) => state.nodeFleetId);
  const applyUrlParams = usePrototypeStore((state) => state.applyUrlParams);

  // URL → store (only when the user/shared link changed the query)
  useEffect(() => {
    if (writingUrl.current) {
      writingUrl.current = false;
      lastAppliedSearch.current = location.search;
      return;
    }

    const params = parseScenarioSearchParams(location.search);
    if (!params.scenario) return;
    if (lastAppliedSearch.current === location.search) return;

    lastAppliedSearch.current = location.search;
    applyUrlParams(params);
  }, [location.search, applyUrlParams]);

  // Store → URL
  useEffect(() => {
    if (!scenarioId || !activeUserId || !activeAppId || !nodeFleetId) return;

    const nextSearch = `?${buildScenarioSearchParams({
      scenarioId,
      activeUserId,
      activeAppId,
      nodeFleetId,
    })}`;

    if (location.search === nextSearch) {
      lastAppliedSearch.current = nextSearch;
      return;
    }

    writingUrl.current = true;
    lastAppliedSearch.current = nextSearch;
    navigate(
      {
        pathname: location.pathname,
        search: nextSearch,
      },
      { replace: true },
    );
  }, [
    scenarioId,
    activeUserId,
    activeAppId,
    nodeFleetId,
    location.pathname,
    location.search,
    navigate,
  ]);

  return null;
}
