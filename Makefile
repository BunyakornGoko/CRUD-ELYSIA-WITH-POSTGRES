.PHONY: up down restart ps logs clean

# Start PostgreSQL container
up:
	docker compose up -d postgres

# Stop PostgreSQL container
down:
	docker compose down --rmi all

# Restart PostgreSQL container
restart:
	docker compose restart postgres

# Show running containers
ps:
	docker compose ps

# View PostgreSQL logs
logs:
	docker compose logs -f postgres

# Clean up volumes and containers
clean:
	docker compose down -v
