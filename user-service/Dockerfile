# ============================================================================
# Dockerfile - CropAssist User Service
# ============================================================================
# Multi-stage build for the User Service microservice
# Service: user-service
# Port: 8081
# Database: cropmgr_users_db (MySQL 8.0)
# Framework: Spring Boot 3.2.3 / Java 17
# ============================================================================

# ---------------------------------------------------------------------------
# STAGE 1: BUILD
# ---------------------------------------------------------------------------
# Using the official Maven image with Eclipse Temurin JDK 17 to compile
# the Spring Boot application and package it as an executable JAR.
# This stage is discarded in the final image, keeping it lightweight.
# ---------------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-17 AS build

# Set the working directory inside the build container
WORKDIR /app

# Copy the Maven project descriptor first (for Docker layer caching)
# This allows Docker to cache the dependency download layer separately
# from the source code layer, speeding up subsequent builds.
COPY pom.xml .

# Download all project dependencies (cached unless pom.xml changes)
RUN mvn dependency:go-offline -B

# Copy the application source code
COPY src ./src

# Build the application JAR, skipping tests for faster builds
# Tests should be run in CI/CD pipeline separately
RUN mvn clean package -DskipTests -B

# ---------------------------------------------------------------------------
# STAGE 2: RUNTIME
# ---------------------------------------------------------------------------
# Using the JRE-only image to minimize the final image size and reduce
# the attack surface. No build tools or source code are included.
# ---------------------------------------------------------------------------
FROM eclipse-temurin:17-jre

# Add metadata labels following OCI image spec
LABEL maintainer="CropAssist Team"
LABEL service="user-service"
LABEL version="1.0.0"
LABEL description="CropAssist User Service - Handles user authentication and management"

# Set the working directory for the runtime container
WORKDIR /app

# Create a non-root user and group for running the application
# Running as non-root is a security best practice to limit potential damage
# from container escape vulnerabilities.
RUN groupadd --system appgroup && \
    useradd --system --gid appgroup --no-create-home appuser

# Copy the built JAR from the build stage
# The JAR filename pattern matches the Maven artifact naming convention
COPY --from=build /app/target/*.jar app.jar

# Change ownership of the application files to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Expose the service port
# user-service runs on port 8081
EXPOSE 8081

# Configure a health check to monitor the application status
# Spring Boot Actuator provides the /actuator/health endpoint
# - interval: Check every 30 seconds
# - timeout: Fail if no response within 10 seconds
# - retries: Mark unhealthy after 5 consecutive failures
# - start-period: Wait 60 seconds before first check (app startup time)
HEALTHCHECK --interval=30s --timeout=10s --retries=5 --start-period=60s \
    CMD curl -f http://localhost:8081/actuator/health || exit 1

# Set JVM options for containerized environments
# - MaxRAMPercentage: Limit heap to 75% of container memory
# - UseContainerSupport: Enable container-aware memory detection
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+UseContainerSupport"

# Define the entrypoint for the container
# Using exec form (JSON array) for proper signal handling
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
