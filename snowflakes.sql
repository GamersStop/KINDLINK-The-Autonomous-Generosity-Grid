USE DATABASE KINDLINK_ANALYTICS;
USE SCHEMA AUDIT_GRID;

-- Drop the restricted Cortex function view
DROP VIEW IF EXISTS V_CORTEX_AI_DISPATCH_HEALTH;

-- Create trial-compatible analytical intelligence view
CREATE OR REPLACE VIEW V_CORTEX_AI_DISPATCH_HEALTH AS
SELECT 
    m.mission_id,
    m.incident_zone,
    m.priority_score,
    COALESCE(m.escrow_allocated_sol, 0) AS escrow_allocated_sol,
    COUNT(c.id) AS total_pledges,
    -- Analytical Resilience Index: Balances urgency against funding & volunteer response
    ROUND(
        LEAST(1.0, 
            (COALESCE(m.escrow_allocated_sol, 0) * 0.4 + COUNT(c.id) * 0.6) 
            / NULLIF(m.priority_score * 2.0, 0)
        ), 2
    ) AS grid_resilience_score,
    CASE 
        WHEN (COALESCE(m.escrow_allocated_sol, 0) * 0.4 + COUNT(c.id) * 0.6) / NULLIF(m.priority_score * 2.0, 0) >= 0.75 THEN 'OPTIMAL_RESPONSE'
        WHEN (COALESCE(m.escrow_allocated_sol, 0) * 0.4 + COUNT(c.id) * 0.6) / NULLIF(m.priority_score * 2.0, 0) >= 0.40 THEN 'MODERATE_DEFICIT'
        ELSE 'CRITICAL_SHORTAGE'
    END AS triage_status
FROM CORTEX_MISSIONS_ANALYTICS m
LEFT JOIN CORTEX_COMMITMENT_LEDGER c ON m.mission_id = c.mission_id
GROUP BY m.mission_id, m.incident_zone, m.priority_score, m.escrow_allocated_sol;


-- 1. Multi-Modal Rail Distribution
CREATE OR REPLACE VIEW V_MODAL_AID_DISTRIBUTION AS
SELECT 
    commitment_type,
    COUNT(*) AS total_pledges,
    SUM(sol_amount) AS total_sol,
    ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 1) AS pct_share
FROM CORTEX_COMMITMENT_LEDGER
GROUP BY commitment_type;

-- 2. Mission Urgency vs Capital Velocity
CREATE OR REPLACE VIEW V_MISSION_CAPITAL_VELOCITY AS
SELECT 
    m.mission_id,
    m.incident_zone,
    m.priority_score,
    COALESCE(m.escrow_allocated_sol, 0) AS escrow_allocated_sol,
    COUNT(c.id) AS total_commitments,
    ROUND(COALESCE(m.escrow_allocated_sol, 0) / NULLIF(m.priority_score, 0), 3) AS sol_per_priority_ratio
FROM CORTEX_MISSIONS_ANALYTICS m
LEFT JOIN CORTEX_COMMITMENT_LEDGER c ON m.mission_id = c.mission_id
GROUP BY m.mission_id, m.incident_zone, m.priority_score, m.escrow_allocated_sol;