[//]: # (title: 멀티플랫폼)

<tldr>
<p>
코드 예시: <a href="https://github.com/ktorio/ktor-samples/tree/main/client-mpp">client-mpp</a>
</p>
</tldr>

<link-summary>
Ktor 클라이언트는 멀티플랫폼 프로젝트에서 사용할 수 있으며, Android, JavaScript, Native 플랫폼을 지원합니다.
</link-summary>

[Ktor HTTP 클라이언트](client-create-and-configure.md)는 [멀티플랫폼 프로젝트](https://kotlinlang.org/docs/multiplatform.html)에서 사용할 수 있으며 다음 플랫폼을 지원합니다:
* JVM
* [Android](https://kotlinlang.org/docs/android-overview.html)
* [JavaScript](https://kotlinlang.org/docs/js-overview.html)
* [Native](https://kotlinlang.org/docs/native-overview.html)

## 의존성 추가 {id="add-dependencies"}
프로젝트에서 Ktor HTTP 클라이언트를 사용하려면 최소 두 가지 의존성을 추가해야 합니다: 클라이언트 의존성과 [엔진](client-engines.md) 의존성입니다. 멀티플랫폼 프로젝트의 경우 다음과 같이 의존성을 추가해야 합니다:
1. 공통 코드에서 Ktor 클라이언트를 사용하려면 `build.gradle` 또는 `build.gradle.kts` 파일의 `commonMain` 소스 세트에 `ktor-client-core` 의존성을 추가합니다:
   <var name="platform_name" value="common"/>
   <var name="artifact_name" value="ktor-client-core"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
    </tabs>
    
1. 필요한 플랫폼에 대한 [엔진 의존성](client-engines.md#dependencies)을 해당 소스 세트에 추가합니다. Android의 경우 `androidMain` 소스 세트에 [Android](client-engines.md#android) 엔진 의존성을 추가할 수 있습니다:
   <var name="platform_name" value="android"/>
   <var name="artifact_name" value="ktor-client-android"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
    </tabs>
    
   
   iOS의 경우 `iosMain`에 [Darwin](client-engines.md#darwin) 엔진 의존성을 추가해야 합니다:
   <var name="platform_name" value="ios"/>
   <var name="artifact_name" value="ktor-client-darwin"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
    </tabs>
    
   
   각 플랫폼에서 지원되는 엔진을 확인하려면 [](client-engines.md#dependencies)를 참조하세요.

## 클라이언트 생성 {id="create-client"}
멀티플랫폼 프로젝트에서 클라이언트를 생성하려면 프로젝트의 [공통 코드](https://kotlinlang.org/docs/mpp-discover-project.html#source-sets)에서 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 생성자를 호출합니다:

[object Promise]

이 코드 스니펫에서 `HttpClient` 생성자는 엔진을 매개변수로 받지 않습니다. 클라이언트는 [빌드 스크립트에 추가된](#add-dependencies) 아티팩트에 따라 필요한 플랫폼에 맞는 엔진을 선택합니다. 

특정 플랫폼에 대해 엔진 구성을 조정해야 하는 경우, 해당 엔진 클래스를 `HttpClient` 생성자에 인수로 전달하고 `engine` 메서드를 사용하여 엔진을 구성합니다. 예를 들어:
[object Promise]

모든 엔진 유형을 구성하는 방법은 [](client-engines.md)에서 확인할 수 있습니다.

## 코드 예시 {id="code-example"}

[mpp/client-mpp](https://github.com/ktorio/ktor-samples/tree/main/client-mpp) 프로젝트는 멀티플랫폼 애플리케이션에서 Ktor 클라이언트를 사용하는 방법을 보여줍니다. 이 애플리케이션은 `Android`, `iOS`, `JavaScript`, `macosX64` 플랫폼에서 작동합니다.