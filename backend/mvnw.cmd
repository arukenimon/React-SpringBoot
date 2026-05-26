@REM Minimal Maven Wrapper (script-only) for Windows.
@REM Downloads Maven on first run, then delegates.
@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "PROJECT_DIR=%~dp0"
set "PROPS_FILE=%PROJECT_DIR%.mvn\wrapper\maven-wrapper.properties"

if not exist "%PROPS_FILE%" (
  echo [mvnw] missing %PROPS_FILE% 1>&2
  exit /b 1
)

set "DIST_URL="
for /f "usebackq tokens=1,* delims==" %%A in ("%PROPS_FILE%") do (
  if /i "%%A"=="distributionUrl" set "DIST_URL=%%B"
)
if not defined DIST_URL (
  echo [mvnw] distributionUrl missing from %PROPS_FILE% 1>&2
  exit /b 1
)

for %%I in ("%DIST_URL%") do set "DIST_FILE=%%~nxI"
set "DIST_DIRNAME=%DIST_FILE:-bin.zip=%"

set "WRAPPER_CACHE=%USERPROFILE%\.m2\wrapper\dists\%DIST_DIRNAME%"
set "MAVEN_HOME=%WRAPPER_CACHE%\%DIST_DIRNAME%"

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
  echo [mvnw] downloading %DIST_URL%
  if not exist "%WRAPPER_CACHE%" mkdir "%WRAPPER_CACHE%"
  set "ZIP_PATH=%WRAPPER_CACHE%\%DIST_FILE%"
  powershell -NoProfile -Command "Invoke-WebRequest -UseBasicParsing -Uri '%DIST_URL%' -OutFile '%ZIP_PATH%'"
  if errorlevel 1 (
    echo [mvnw] download failed 1>&2
    exit /b 1
  )
  powershell -NoProfile -Command "Expand-Archive -Path '%ZIP_PATH%' -DestinationPath '%WRAPPER_CACHE%' -Force"
  del "%ZIP_PATH%" >nul 2>&1
)

@REM Locate a JDK 17+ if JAVA_HOME is missing or points to JRE / old JDK.
call :CheckJavaHome
if errorlevel 1 (
  for %%D in (
    "C:\Program Files\Java\openjdk\jdk-26.0.1"
    "C:\Program Files\Java\openjdk\jdk-21"
    "C:\Program Files\Java\openjdk\jdk-17"
    "C:\Program Files\Eclipse Adoptium\jdk-21"
    "C:\Program Files\Eclipse Adoptium\jdk-17"
    "C:\Program Files\Microsoft\jdk-21"
    "C:\Program Files\Microsoft\jdk-17"
  ) do (
    if exist "%%~D\bin\javac.exe" (
      set "JAVA_HOME=%%~D"
      goto :GotJdk
    )
  )
  echo [mvnw] Could not locate a JDK 17+ install. Set JAVA_HOME to a JDK. 1>&2
  exit /b 1
)


:GotJdk
set "PATH=%JAVA_HOME%\bin;%PATH%"
"%MAVEN_HOME%\bin\mvn.cmd" %*
exit /b %ERRORLEVEL%

:CheckJavaHome
if not defined JAVA_HOME exit /b 1
if not exist "%JAVA_HOME%\bin\javac.exe" exit /b 1
exit /b 0
