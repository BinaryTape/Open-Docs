[//]: # (title: Azure 앱 서비스)

<show-structure for="chapter" depth="2"/>

<link-summary>이 튜토리얼에서는 Ktor 애플리케이션을 빌드하고 구성하여 [Azure 앱 서비스](https://azure.microsoft.com/products/app-service/)에 배포하는 방법을 보여줍니다.</link-summary>

이 튜토리얼에서는 Ktor 애플리케이션을 빌드하고 구성하여 [Azure 앱 서비스](https://azure.microsoft.com/products/app-service/)에 배포하는 방법을 보여줍니다.

## 필수 조건 {id="prerequisites"}
이 튜토리얼을 시작하기 전에 다음이 필요합니다:
* Azure 계정 ([여기서 무료 평가판 사용](https://azure.microsoft.com/en-us/free/)).
* 사용자 컴퓨터에 [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)가 설치되어 있어야 합니다.

## 샘플 애플리케이션 생성 {id="create-sample-app"}

[새 Ktor 프로젝트 생성, 열기 및 실행](server-create-a-new-project.topic)에 설명된 대로 샘플 애플리케이션을 생성합니다. 이 예시는 다음 프로젝트를 기반으로 한 코드와 명령을 보여줍니다: [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server) 및 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main).

> 위 튜토리얼은 애플리케이션을 구성하는 두 가지 방법을 제공합니다: 값을 코드에 직접 지정하거나 구성 파일을 사용하는 방식입니다. 두 경우 모두 핵심 구성은 서버가 수신 요청을 수신하는 포트입니다.

## 애플리케이션 설정 {id="setup-app"}

### 1단계: 포트 설정 {id="port"}

Azure 앱 서비스에서 환경 변수 `PORT`는 수신 요청에 대해 열려 있는 포트 번호를 포함합니다. [Ktor 서버 구성](server-create-and-configure.topic)에서 앱을 생성한 방식에 따라, 이 환경 변수를 읽도록 코드를 두 가지 방법 중 하나로 업데이트해야 합니다:

* 포트 구성이 **코드 내**에서 이루어진 예시를 사용했다면, `PORT` 환경 변수는 `System.getenv()`로 읽을 수 있으며 `.toIntOrNull()`을 사용하여 정수로 파싱할 수 있습니다. `Application.kt` 파일을 열고 아래와 같이 포트 번호를 변경하십시오:

   ```kotlin
   fun runBasicServer() {
      val port = System.getenv("PORT")?.toIntOrNull() ?: 8080
      embeddedServer(Netty, port = port) {
          // ...
      }.start(wait = true)
   }
    ```
* 서버 구성이 **구성 파일** `application.conf`에 정의되어 있다면, 다음 예시와 같이 `PORT` 환경 변수를 읽도록 업데이트하십시오:

   ```
   ktor {
       deployment {
           port = ${PORT:8080}
       }
   }
   ```
   {style="block"}

### 2단계: 플러그인 추가 {id="plugins"}
`build.gradle.kts` 파일을 열고 `plugins` 섹션에 다음 줄을 추가하십시오:
```kotlin
plugins {
    application
    kotlin("jvm")
    id("io.ktor.plugin") version "%ktor_version%" // ADDED
    id("com.microsoft.azure.azurewebapp") version "1.10.0" // ADDED
}
```

`io.ktor.plugin`은 [fat JAR](server-fatjar.md)를 생성하는 데 사용되는 태스크를 제공하며, [Gradle용 Azure WebApp 플러그인](https://github.com/microsoft/azure-gradle-plugins)은 Azure에 필요한 모든 리소스를 손쉽게 생성하는 데 사용됩니다.

`application` 섹션에 `mainClass`가 정의되어 있는지 확인하여 fat JAR에 대한 명확한 진입점이 있도록 하십시오:

```kotlin
application {
    mainClass.set("com.example.ApplicationKt")
}
```
프로젝트를 `engine-main` 템플릿으로 생성했다면, main 클래스는 다음과 같을 것입니다:

```kotlin
application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}
```

### 3단계: 구성 {id="configuration"}

App Service에 배포하려는 Java 웹 앱을 이미 생성했다면, 이 단계를 건너뛸 수 있습니다.

그렇지 않다면, Azure Webapp 플러그인이 자동으로 생성해 줄 수 있도록 `build.gradle.kts` 파일 끝에 다음 항목을 추가하십시오:

```kotlin
 // Rename the fat JAR to the name that the deploy task expects
ktor {
    fatJar {
        archiveFileName.set("embedded-server.jar")
    }
}

// Disable the `jar` task that Azure Plugin would normally run
// to deploy the archive created by the `fatJar` task instead
tasks.named("jar") {
    enabled = false
}

// Ensure the deploy task builds the fat JAR first
tasks.named("azureWebAppDeploy") {
    dependsOn("buildFatJar")
}

// Azure Webapp Plugin configuration
azurewebapp {
  subscription = "YOUR-SUBSCRIPTION-ID"
  resourceGroup = "RESOURCE-GROUP-NAME"
  appName = "WEBAPP-NAME"
  pricingTier = "YOUR-PLAN" // e.g. "F1", "B1", "P0v3", etc.
  region = "YOUR-REGION" // e.g. "westus2"
  setRuntime(closureOf<com.microsoft.azure.gradle.configuration.GradleRuntimeConfig> {
    os("Linux") // Or "Windows"
    webContainer("Java SE")
    javaVersion("Java 21")
  })
  setAuth(closureOf<com.microsoft.azure.gradle.auth.GradleAuthConfig> {
    type = "azure_cli"
  })
}
```

사용 가능한 구성 속성에 대한 자세한 설명은 [Webapp 구성 문서](https://github.com/microsoft/azure-gradle-plugins/wiki/Webapp-Configuration)를 참조하십시오.

* `pricingTier` (서비스 플랜) 값은 [Linux용](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) 및 [Windows용](https://azure.microsoft.com/en-us/pricing/details/app-service/windows/)에서 찾을 수 있습니다.
* `region` 값 목록은 다음 Azure CLI 명령으로 얻을 수 있습니다: `az account list-locations --query "[].name" --output tsv` 또는 [제품 가용성 표](https://go.microsoft.com/fwlink/?linkid=2300348&clcid=0x409)에서 "App Service"를 검색하여 얻을 수 있습니다.

## 애플리케이션 배포 {id="deploy-app"}

### 새 웹 앱에 배포

Azure Web App Deploy 플러그인에서 사용하는 인증 방식은 Azure CLI를 사용합니다. 아직 로그인하지 않았다면, `az login`으로 한 번 로그인하고 지침을 따르십시오.

마지막으로, 먼저 fat JAR를 빌드한 다음 배포하도록 설정된 `azureWebAppDeploy` 태스크를 실행하여 애플리케이션을 배포하십시오:

<Tabs group="os">
<TabItem title="Linux/macOS" group-key="unix">
<code-block code="./gradlew :embedded-server:azureWebAppDeploy"/>
</TabItem>
<TabItem title="Windows" group-key="windows">
<code-block code="gradlew.bat :embedded-server:azureWebAppDeploy"/>
</TabItem>
</Tabs>

이 태스크는 리소스 그룹, 플랜 및 웹 앱을 생성한 다음 fat JAR를 배포합니다. 배포가 성공하면 다음과 같은 출력을 볼 수 있습니다:

```text
> Task: :embedded-server:azureWebAppDeploy
Auth type: AZURE_CLI
Username: some.username@example.com
Subscription: Some Subscription(13936cf1-cc18-40be-a0d4-177fe532b3dd)
Start creation Resource Group(resource-group) in region (Some Region)
Resource Group (resource-group) is successfully created.
Start creating App Service plan (asp-your-webapp-name)...
App Service plan (asp-your-webapp-name) is successfully created
Start creating Web App(your-webapp-name)...
Web App(your-webapp-name) is successfully created
Trying to deploy artifact to your-webapp-name...
Deploying (C:\docs\ktor-documentation\codeSnippets\snippets\embedded-server\build\libs\embedded-server.jar)[jar] ...
Application url: https://your-webapp-name.azurewebsites.net
```

배포가 완료되면 위에 표시된 URL에서 새 웹 앱이 실행되는 것을 볼 수 있습니다.

### 기존 웹 앱에 배포

Azure 앱 서비스에 기존 Java 웹 앱이 있다면, 먼저 [Ktor 플러그인](#plugins)이 제공하는 `buildFatJar` 태스크를 실행하여 fat JAR를 빌드하십시오:

<Tabs group="os">
<TabItem title="Linux/macOS" group-key="unix">
<code-block code="./gradlew :embedded-server:buildFatJar"/>
</TabItem>
<TabItem title="Windows" group-key="windows">
<code-block code="gradlew.bat :embedded-server:buildFatJar"/>
</TabItem>
</Tabs>

그런 다음, 다음 Azure CLI 명령을 사용하여 이전에 생성된 fat JAR를 배포하십시오:

```bash
az webapp deploy -g RESOURCE-GROUP-NAME -n WEBAPP-NAME --src-path ./path/to/embedded-server.jar --restart true
```

이 명령은 JAR 파일을 업로드하고 웹 앱을 다시 시작합니다. 잠시 후 배포 결과를 확인할 수 있습니다:

```text
Deployment type: jar. To override deployment type, please specify the --type parameter. Possible values: war, jar, ear, zip, startup, script, static
Initiating deployment
Deploying from local path: ./snippets/embedded-server/build/libs/embedded-server.jar
Warming up Kudu before deployment.
Warmed up Kudu instance successfully.
Polling the status of sync deployment. Start Time: 2025-09-07 00:07:14.729383+00:00 UTC
Status: Build successful. Time: 5(s)
Status: Starting the site... Time: 23(s)
Status: Starting the site... Time: 41(s)
Status: Site started successfully. Time: 44(s)
Deployment has completed successfully
You can visit your app at: http://your-app-name.some-region.azurewebsites.net