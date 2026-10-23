@echo off
setlocal
set "APP_HOME=%~dp0"
if defined JAVA_HOME goto java_home
if exist "%APP_HOME%.tools\jdk-17.0.20.1+1\bin\java.exe" (
  set "JAVA_HOME=%APP_HOME%.tools\jdk-17.0.20.1+1"
)
:java_home
if not defined JAVA_HOME (
  echo Missing a compatible JDK. Set JAVA_HOME to JDK 17 or use the verified project-local .tools JDK 17.
  echo Do not use the installed Android Studio JBR 25 with Gradle 8.13.
  exit /b 2
)
if not exist "%JAVA_HOME%\bin\java.exe" (
  echo JAVA_HOME does not contain bin\java.exe
  exit /b 2
)
"%JAVA_HOME%\bin\java.exe" -classpath "%APP_HOME%gradle\wrapper\gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain %*
exit /b %ERRORLEVEL%
