@echo off
title Campus Stay - Spring Boot Backend
cd /d "%~dp0backend"
echo ======================================================================
echo  CAMPUS STAY - Spring Boot Backend
echo  Port: 8080 | Profile: dev (H2 In-Memory with Seed Data)
echo  H2 Web Console: http://localhost:8080/h2-console
echo ======================================================================
mvn spring-boot:run -Dspring-boot.run.profiles=dev
pause

