[//]: # (title: Kotlin과 TeamCity를 사용한 지속적 통합)

이 페이지에서는 [TeamCity](https://www.jetbrains.com/teamcity/)를 설정하여 Kotlin 프로젝트를 빌드하는 방법을 배웁니다. TeamCity에 대한 더 자세한 정보 및 기본 사항은 설치, 기본 구성 등에 대한 정보를 포함하는 [문서 페이지](https://www.jetbrains.com/teamcity/documentation/)를 확인하십시오.

Kotlin은 다양한 빌드 도구와 함께 작동하므로, Maven 또는 Gradle과 같은 표준 도구를 사용하는 경우 Kotlin 프로젝트를 설정하는 과정은 이러한 도구와 통합되는 다른 언어 또는 라이브러리와 다르지 않습니다. 약간의 요구 사항과 차이점이 있는 경우는 TeamCity에서도 지원되는 IntelliJ IDEA의 내부 빌드 시스템을 사용할 때입니다.

## Gradle 및 Maven

Maven 또는 Gradle을 사용하는 경우, 설정 과정은 간단합니다. 필요한 것은 빌드 단계를 정의하는 것뿐입니다. 예를 들어, Gradle을 사용하는 경우, 러너 유형에 대해 실행해야 하는 단계 이름 및 Gradle 태스크와 같은 필수 매개변수를 정의하기만 하면 됩니다.

<img src="teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

Kotlin에 필요한 모든 종속성이 Gradle 파일에 정의되어 있으므로, Kotlin이 올바르게 실행되도록 특별히 구성할 것은 없습니다.

Maven을 사용하는 경우에도 동일한 구성이 적용됩니다. 유일한 차이점은 러너 유형이 Maven이라는 점입니다.

## IntelliJ IDEA 빌드 시스템

TeamCity와 함께 IntelliJ IDEA 빌드 시스템을 사용하는 경우, IntelliJ IDEA에서 사용되는 Kotlin 버전이 TeamCity에서 실행되는 버전과 동일한지 확인하십시오. 특정 버전의 Kotlin 플러그인을 다운로드하여 TeamCity에 설치해야 할 수도 있습니다.

다행히도, 대부분의 수동 작업을 처리하는 메타 러너가 이미 제공됩니다. TeamCity 메타 러너 개념에 익숙하지 않다면 [문서](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html)를 확인하십시오. 플러그인을 작성할 필요 없이 사용자 정의 러너를 도입하는 매우 쉽고 강력한 방법입니다.

### 메타 러너 다운로드 및 설치

Kotlin용 메타 러너는 [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity)에서 사용할 수 있습니다. 해당 메타 러너를 다운로드하여 TeamCity 사용자 인터페이스에서 가져오십시오.

<img src="teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### Kotlin 컴파일러 가져오기 단계 설정

기본적으로 이 단계는 단계 이름과 필요한 Kotlin 버전을 정의하는 것으로 제한됩니다. 태그를 사용할 수 있습니다.

<img src="teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

러너는 IntelliJ IDEA 프로젝트의 경로 설정에 따라 `system.path.macro.KOTLIN.BUNDLED` 속성 값을 올바르게 설정합니다. 그러나 이 값은 TeamCity에 정의되어야 하며 (어떤 값으로든 설정할 수 있습니다.) 따라서 시스템 변수로 정의해야 합니다.

### Kotlin 컴파일 단계 설정

최종 단계는 표준 IntelliJ IDEA 러너 유형을 사용하는 프로젝트의 실제 컴파일을 정의하는 것입니다.

<img src="teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

이로써 우리 프로젝트는 이제 빌드되고 해당 아티팩트를 생성할 수 있습니다.

## 다른 CI 서버

TeamCity와 다른 지속적 통합 도구를 사용하는 경우, 해당 도구가 빌드 도구 중 하나를 지원하거나 명령줄 도구를 호출할 수 있다면, Kotlin을 컴파일하고 CI 프로세스의 일부로 자동화하는 것이 가능해야 합니다.