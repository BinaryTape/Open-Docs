[//]: # (title: Build tools API)

<primary-label ref="experimental-general"/>

<tldr>현재 BTA는 Kotlin/JVM만 지원합니다.</tldr>

Kotlin에는 빌드 시스템과 Kotlin 컴파일러의 통합을 간소화하는 실험적인 Build tools API(BTA)가 있습니다.

빌드 시스템에 Kotlin에 대한 완전한 지원(증분 컴파일, Kotlin 컴파일러 플러그인, 데몬, Kotlin 멀티플랫폼 등)을 추가하려면 상당한 노력이 필요합니다. BTA는 빌드 시스템과 Kotlin 컴파일러 에코시스템 사이에 통합된 API를 제공하여 이러한 복잡성을 줄이는 것을 목표로 합니다.

BTA는 빌드 시스템이 구현할 수 있는 단일 진입점(entry point)을 정의합니다. 이를 통해 컴파일러의 내부 세부 사항과 깊게 통합할 필요가 없어집니다.

> BTA 자체는 아직 고유한 빌드 도구 통합에 직접 사용할 수 있도록 공개되지 않았습니다.
> 제안에 관심이 있거나 의견을 공유하고 싶다면 [KEEP](https://github.com/Kotlin/KEEP/issues/421)을 확인하세요.
> 구현 상태는 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76255)에서 확인할 수 있습니다.
> 
{style="warning"}

## Gradle과의 통합

Kotlin Gradle 플러그인(KGP)은 BTA를 실험적으로 지원합니다. KGP는 Kotlin/JVM 컴파일에 기본적으로 BTA를 사용합니다.

> KGP 사용 경험에 대한 피드백은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56574)을 통해 언제든지 보내주세요.
> 
{style="note"}

### 다른 컴파일러 버전 구성하기

BTA를 사용하면 이제 KGP에서 사용하는 버전과 다른 버전의 Kotlin 컴파일러를 사용할 수 있습니다. 이는 다음과 같은 경우에 유용합니다:

* 새로운 Kotlin 기능을 사용해보고 싶지만 빌드 스크립트를 아직 업데이트하지 않은 경우.
* 최신 플러그인 수정 사항은 필요하지만 당분간은 이전 컴파일러 버전을 유지하고 싶은 경우.

다음은 `build.gradle.kts` 파일에서 이를 구성하는 예시입니다:

```kotlin
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class)
    compilerVersion.set("2.1.21") // <-- 2.2.0과 다른 버전을 설정
}
```

#### 호환되는 Kotlin 컴파일러 및 KGP 버전

BTA는 다음 버전을 지원합니다:

* 이전 세 개의 주요(major) Kotlin 컴파일러 버전.
* 향후 한 개의 주요 버전.

예를 들어, KGP 2.2.0에서 지원되는 Kotlin 컴파일러 버전은 다음과 같습니다:

* 1.9.25
* 2.0.x
* 2.1.x
* 2.2.x
* 2.3.x

#### 제한 사항

다른 컴파일러 버전을 컴파일러 플러그인과 함께 사용하면 Kotlin 컴파일러 예외가 발생할 수 있습니다. Kotlin 팀은 향후 Kotlin 릴리스에서 이 문제를 해결할 계획입니다.

### '인프로세스(in-process)' 전략을 사용한 증분 컴파일 활성화

KGP는 세 가지 [컴파일러 실행 전략](compiler-execution-strategy.md)을 지원합니다.
일반적으로 "인프로세스(in-process)" 전략(Gradle 데몬 내에서 컴파일러를 실행)은 증분 컴파일을 지원하지 않습니다.

BTA를 사용하면 "인프로세스" 전략에서도 증분 컴파일을 지원합니다. 이를 활성화하려면 `gradle.properties` 파일에 다음 속성을 추가하세요:

```kotlin
kotlin.compiler.execution.strategy=in-process
```

## Maven과의 통합

BTA는 [`kotlin-maven-plugin`](maven.md)이 기본 [컴파일러 실행 전략](maven-compile-package.md#choose-execution-strategy)인 [Kotlin 데몬](kotlin-daemon.md)을 지원할 수 있도록 합니다. `kotlin-maven-plugin`은 기본적으로 BTA를 사용하므로 별도의 구성이 필요하지 않습니다.

BTA를 통해 향후 [증분 컴파일 안정화](https://youtrack.jetbrains.com/issue/KT-77086)와 같은 더 많은 기능을 제공할 수 있게 될 것입니다.