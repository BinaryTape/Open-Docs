[//]: # (title: Kotlin 및 TeamCity를 사용한 지속적 통합)

이 페이지에서는 Kotlin 프로젝트를 빌드하기 위해 [TeamCity](https://www.jetbrains.com/teamcity/)를 설정하는 방법을 배웁니다.
TeamCity에 대한 자세한 정보와 기초 지식은 설치, 기본 설정 등의 정보가 포함된 [문서 페이지](https://www.jetbrains.com/teamcity/documentation/)를 확인하세요.

Kotlin은 다양한 빌드 도구와 함께 작동하므로, Maven이나 Gradle과 같은 표준 도구를 사용하는 경우 Kotlin 프로젝트를 설정하는 프로세스는 이러한 도구와 통합되는 다른 언어나 라이브러리와 다르지 않습니다.
약간의 요구 사항과 차이점이 있는 부분은 IntelliJ IDEA의 내부 빌드 시스템을 사용할 때이며, 이는 TeamCity에서도 지원됩니다.

## Gradle 및 Maven

Maven이나 Gradle을 사용하는 경우 설정 프로세스는 매우 간단합니다. 빌드 단계(Build Step)만 정의하면 됩니다.
예를 들어 Gradle을 사용하는 경우, Runner Type에 대해 실행해야 할 Step Name 및 Gradle 태스크(tasks)와 같은 필수 파라미터를 정의하기만 하면 됩니다.

<img src="teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

Kotlin에 필요한 모든 의존성이 Gradle 파일에 정의되어 있으므로, Kotlin이 올바르게 실행되도록 하기 위해 특별히 구성해야 할 다른 사항은 없습니다.

Maven을 사용하는 경우에도 동일한 설정이 적용됩니다. 유일한 차이점은 Runner Type이 Maven이라는 점입니다.

## IntelliJ IDEA 빌드 시스템

TeamCity에서 IntelliJ IDEA 빌드 시스템을 사용하는 경우, IntelliJ IDEA에서 사용하는 Kotlin 버전이 TeamCity에서 실행되는 버전과 동일한지 확인하세요. 특정 버전의 Kotlin 플러그인을 다운로드하여 TeamCity에 설치해야 할 수도 있습니다.

다행히도 대부분의 수동 작업을 처리해 주는 메타 러너(meta-runner)가 이미 준비되어 있습니다. TeamCity 메타 러너의 개념이 익숙하지 않다면 [문서](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html)를 확인해 보세요. 메타 러너는 플러그인을 작성할 필요 없이 커스텀 러너(Runners)를 도입할 수 있는 매우 쉽고 강력한 방법입니다.

### 메타 러너 다운로드 및 설치

Kotlin용 메타 러너는 [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity)에서 사용할 수 있습니다. 해당 메타 러너를 다운로드하고 TeamCity 사용자 인터페이스에서 가져오기(import) 하세요.

<img src="teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### Kotlin 컴파일러 가져오기 단계 설정

기본적으로 이 단계는 Step Name과 필요한 Kotlin 버전을 정의하는 것으로 제한됩니다. 태그(Tags)를 사용할 수 있습니다.

<img src="teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

러너는 IntelliJ IDEA 프로젝트의 경로 설정을 기반으로 `system.path.macro.KOTLIN.BUNDLED` 속성 값을 올바른 값으로 설정합니다. 하지만 이 값은 TeamCity에 정의되어 있어야 하며(어떤 값으로든 설정 가능), 따라서 이를 시스템 변수(system variable)로 정의해야 합니다.

### Kotlin 컴파일 단계 설정

마지막 단계는 표준 IntelliJ IDEA Runner Type을 사용하는 실제 프로젝트 컴파일을 정의하는 것입니다.

<img src="teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

이제 프로젝트가 빌드되고 해당 아티팩트(artifacts)가 생성될 것입니다.

## 기타 CI 서버

TeamCity 이외의 다른 지속적 통합(CI) 도구를 사용하더라도, 해당 도구가 빌드 도구를 지원하거나 명령줄 도구(command line tools) 호출을 지원한다면 Kotlin을 컴파일하고 CI 프로세스의 일부로 자동화하는 것이 가능합니다.