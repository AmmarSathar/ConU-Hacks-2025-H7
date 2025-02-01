import pandas as pd
import heapq
from collections import defaultdict

# Load wildfire data
wildfire_data = pd.read_csv('current_wildfiredata.csv')

# Define available resources
resources = {
    "Smoke Jumpers": {"deploy_time": 30, "cost": 5000, "available": 5},
    "Fire Engines": {"deploy_time": 60, "cost": 2000, "available": 10},
    "Helicopters": {"deploy_time": 45, "cost": 8000, "available": 3},
    "Tanker Planes": {"deploy_time": 120, "cost": 15000, "available": 2},
    "Ground Crews": {"deploy_time": 90, "cost": 3000, "available": 8}
}

# Damage costs for missed responses
damage_costs = {"low": 50000, "medium": 100000, "high": 200000}

# Convert fire_start_time to a datetime object
wildfire_data["fire_start_time"] = pd.to_datetime(wildfire_data["fire_start_time"])

# Convert to minutes since the start of the day (or use UNIX timestamp if needed)
wildfire_data["fire_start_minutes"] = wildfire_data["fire_start_time"].dt.hour * 60 + wildfire_data["fire_start_time"].dt.minute


# Sort fires by severity (high -> medium -> low)
severity_priority = {"high": 3, "medium": 2, "low": 1}
wildfire_data["severity_priority"] = wildfire_data["severity"].map(severity_priority)
wildfire_data = wildfire_data.sort_values(by=["severity_priority", "fire_start_time"], ascending=[False, True])

# Priority queue for resource scheduling
queue = []
deployed_resources = defaultdict(int)
total_operational_cost = 0
total_damage_cost = 0
fires_missed = {"low": 0, "medium": 0, "high": 0}
fires_addressed = {"low": 0, "medium": 0, "high": 0}

# Process each wildfire report
for _, fire in wildfire_data.iterrows():
    fire_time = fire["fire_start_time"]
    severity = fire["severity"]
    assigned = False
    
    # Check available resources
    for unit, data in resources.items():
        if data["available"] > 0:
            # Deploy resource
            heapq.heappush(queue, (fire["fire_start_minutes"] + data["deploy_time"], unit))

            data["available"] -= 1
            deployed_resources[unit] += 1
            total_operational_cost += data["cost"]
            fires_addressed[severity] += 1
            assigned = True
            break
    
    # If no resource available, count as missed response
    if not assigned:
        total_damage_cost += damage_costs[severity]
        fires_missed[severity] += 1

# Print report
print(f"Number of fires addressed: {sum(fires_addressed.values())}")
print(f"Number of fires delayed: {sum(fires_missed.values())}")
print(f"Total operational costs: ${total_operational_cost}")
print(f"Estimated damage costs from delayed responses: ${total_damage_cost}")
print(f"Fire severity report: {fires_addressed}")
