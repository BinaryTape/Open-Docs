[//]: # (title: 호환성 및 버전)

Compose Multiplatform 릴리스는 Kotlin 및 Jetpack Compose 릴리스와 별도로 출시됩니다. 이 페이지에는 Compose Multiplatform 릴리스, Compose 릴리스 주기 및 구성 요소 호환성에 대한 정보가 포함되어 있습니다.

## 지원되는 플랫폼

Compose Multiplatform %org.jetbrains.compose%는 다음 플랫폼을 지원합니다.

| 플랫폼  | 최소 버전                                                                                        |
|---------|--------------------------------------------------------------------------------------------------|
| Android | Android 5.0 (API 레벨 21)                                                                        |
| iOS     | iOS 13                                                                                           |
| macOS   | macOS 12 x64, macOS 13 arm64                                                                     |
| Windows | Windows 10 (x86-64, arm64)                                                                       |
| Linux   | Ubuntu 20.04 (x86-64, arm64)                                                                     |
| Web     | [WasmGC 지원](https://kotlinlang.org/docs/wasm-troubleshooting.html#browser-versions) 브라우저 |

[//]: # (https://youtrack.jetbrains.com/issue/CMP-7539)

> 모든 Compose Multiplatform 릴리스는 64비트 플랫폼만 지원합니다.
>
{style="note"}

## Kotlin 호환성

최신 Compose Multiplatform는 항상 최신 버전의 Kotlin과 호환됩니다. 버전을 수동으로 맞출 필요는 없습니다. 두 제품의 EAP 버전 사용은 여전히 잠재적으로 불안정할 수 있음을 기억하세요.

Compose Multiplatform를 사용하려면 Kotlin Multiplatform 플러그인과 동일한 버전의 Compose Compiler Gradle 플러그인이 적용되어야 합니다. 자세한 내용은 [undefined](compose-compiler.md#migrating-a-compose-multiplatform-project)를 참조하세요.

> Compose Multiplatform 1.8.0부터 UI 프레임워크가 K2 컴파일러로 완전히 전환되었습니다. 따라서 최신 Compose Multiplatform 릴리스를 사용하려면 다음을 수행해야 합니다.
> * 프로젝트에 Kotlin 2.1.0 이상을 사용해야 합니다.
> * Compose Multiplatform 기반 라이브러리는 Kotlin 2.1.0 이상으로 컴파일된 경우에만 의존해야 합니다.
>
> 모든 의존성이 업데이트될 때까지 하위 호환성 문제에 대한 해결책으로, `gradle.properties` 파일에 `kotlin.native.cacheKind=none`을 추가하여 Gradle 캐시를 끌 수 있습니다. 이로 인해 컴파일 시간이 증가할 수 있습니다.
>
{style="warning"}

## 데스크톱 릴리스용 Compose Multiplatform의 제한 사항

데스크톱용 Compose Multiplatform에는 다음과 같은 제한 사항이 있습니다.

* [Skia](https://skia.org/) 바인딩에 사용되는 메모리 관리 방식 때문에 JDK 11 이상만 지원됩니다.
* [`jpackage`](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jpackage.html)의 제한 사항 때문에 네이티브 배포판 패키징에는 JDK 17 이상만 지원됩니다.
* macOS에서 키보드 레이아웃을 전환할 때 OpenJDK 11.0.12에서 알려진 [문제](https://github.com/JetBrains/compose-multiplatform/issues/940)가 있습니다. 이 문제는 OpenJDK 11.0.15에서는 재현되지 않습니다.

## Jetpack Compose 및 Compose Multiplatform 릴리스 주기

Compose Multiplatform는 Google에서 개발한 프레임워크인 Android용 [Jetpack Compose](https://developer.android.com/jetpack/compose)와 많은 코드를 공유합니다. 공통 코드가 적절하게 테스트되고 안정화될 수 있도록 Jetpack Compose의 릴리스 주기와 Compose Multiplatform의 릴리스 주기를 맞춥니다.

새로운 Jetpack Compose 버전이 릴리스되면 다음과 같은 작업을 수행합니다.

* 다음 [Compose Multiplatform](https://github.com/JetBrains/androidx) 버전의 기반으로 릴리스 커밋을 사용합니다.
* 새로운 플랫폼 기능을 지원합니다.
* 모든 플랫폼을 안정화합니다.
* 새로운 Compose Multiplatform 버전을 릴리스합니다.

Compose Multiplatform 릴리스와 Jetpack Compose 릴리스 사이의 간격은 일반적으로 1~3개월입니다.

### Compose Multiplatform 개발 버전

Compose Multiplatform 컴파일러 플러그인의 개발 버전(예: `1.8.2+dev2544`)은 정해진 일정 없이 빌드되며, 정식 릴리스 간의 업데이트를 테스트하기 위해 사용됩니다.

이러한 빌드는 [Maven Central](https://central.sonatype.com/)에서 사용할 수 없습니다. 액세스하려면 저장소 목록에 다음 줄을 추가하세요.

```kotlin
maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
```

### 사용된 Jetpack Compose 아티팩트

Android용 애플리케이션을 빌드할 때 Compose Multiplatform는 Google에서 게시한 아티팩트를 사용합니다. 예를 들어, Compose Multiplatform 1.5.0 Gradle 플러그인을 적용하고 `dependencies`에 `implementation(compose.material3)`를 추가하면, 프로젝트는 Android 타겟에서 `androidx.compose.material3:material3:1.1.1` 아티팩트를 사용하게 됩니다 (다른 타겟에서는 `org.jetbrains.compose.material3:material3:1.5.0` 아티팩트를 사용).

다음 표는 각 Compose Multiplatform 버전에서 사용되는 Jetpack Compose 아티팩트 버전을 나열합니다.

| Compose Multiplatform 버전                                                    | Jetpack Compose 버전 | Jetpack Compose Material3 버전 |
|-------------------------------------------------------------------------------|----------------------|--------------------------------|
| [1.8.2](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.2) | 1.8.2                | 1.3.2                          |
| [1.7.3](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.7.3) | 1.7.6                | 1.3.1                          |
| [1.7.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.7.1) | 1.7.5                | 1.3.1                          |
| [1.7.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.7.0) | 1.7.1                | 1.3.0                          |
| [1.6.11](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.11) | 1.6.7                | 1.2.1                          |
| [1.6.10](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.10) | 1.6.7                | 1.2.1                          |
| [1.6.2](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.2) | 1.6.4                | 1.2.1                          |
| [1.6.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.1) | 1.6.3                | 1.2.1                          |
| [1.6.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.0) | 1.6.1                | 1.2.0                          |
| [1.5.12](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.12) | 1.5.4                | 1.1.2                          |
| [1.5.11](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.11) | 1.5.4                | 1.1.2                          |
| [1.5.10](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.10) | 1.5.4                | 1.1.2                          |
| [1.5.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.1) | 1.5.0                | 1.1.1                          |
| [1.5.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.0) | 1.5.0                | 1.1.1                          |
| [1.4.3](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.4.3) | 1.4.3                | 1.0.1                          |
| [1.4.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.4.1) | 1.4.3                | 1.0.1                          |
| [1.4.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.4.0) | 1.4.0                | 1.0.1                          |
| [1.3.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.3.1) | 1.3.3                | 1.0.1                          |
| [1.3.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.3.0) | 1.3.3                | 1.0.1                          |
| [1.2.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.2.1) | 1.2.1                | 1.0.0-alpha14                  |
| [1.2.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.2.0) | 1.2.1                | 1.0.0-alpha14                  |
| [1.1.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.1.1) | 1.1.0                | 1.0.0-alpha05                  |
| [1.1.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.1.0) | 1.1.0                | 1.0.0-alpha05                  |
| [1.0.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.0.1) | 1.1.0-beta02         | 1.0.0-alpha03                  |
| [1.0.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.0.0) | 1.1.0-beta02         | 1.0.0-alpha03                  |