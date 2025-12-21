[//]: # (title: Gradle)

> 이 가이드는 Dokka Gradle 플러그인(DGP) v2 모드에 적용됩니다. 이전 DGP v1 모드는 더 이상 지원되지 않습니다.
> v1 모드에서 v2 모드로 업그레이드하는 경우, [마이그레이션 가이드](dokka-migration.md)를 참조하세요.
>
{style="note"}

Gradle 기반 프로젝트의 문서를 생성하려면 [Dokka용 Gradle 플러그인](https://plugins.gradle.org/plugin/org.jetbrains.dokka)을 사용할 수 있습니다.

Dokka Gradle 플러그인(DGP)은 프로젝트에 대한 기본적인 자동 구성 기능을 제공하며, 문서 생성을 위한 [Gradle 태스크](#generate-documentation)를 포함하고 출력을 사용자 정의할 수 있는 [구성 옵션](dokka-gradle-configuration-options.md)을 제공합니다.

[Gradle 예제 프로젝트](https://github.com/Kotlin/dokka/tree/2.0.0/examples/gradle-v2)에서 Dokka를 직접 사용해 보고 다양한 프로젝트에 대해 어떻게 구성할 수 있는지 탐색할 수 있습니다.

## 지원되는 버전

프로젝트가 최소 버전 요구 사항을 충족하는지 확인하세요:

| **도구**                                                                          | **버전**     |
|-----------------------------------------------------------------------------------|----------------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html)      | 7.6 이상         |
| [Android Gradle 플러그인](https://developer.android.com/build/agp-upgrade-assistant) | 7.0 이상         |
| [Kotlin Gradle 플러그인](https://kotlinlang.org/docs/gradle-configure-project.html) | 1.9 이상         |

## Dokka 적용

Dokka용 Gradle 플러그인을 적용하는 권장 방법은 [plugins 블록](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)을 사용하는 것입니다. 프로젝트의 `build.gradle.kts` 파일 `plugins {}` 블록에 추가하세요:

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

</tab>
</tabs>

멀티 프로젝트 빌드를 문서화할 때는 문서화하려는 모든 서브프로젝트에 플러그인을 명시적으로 적용해야 합니다. Dokka를 각 서브프로젝트에서 직접 구성하거나 컨벤션 플러그인을 사용하여 서브프로젝트 간에 Dokka 구성을 공유할 수 있습니다.
자세한 내용은 [단일 프로젝트 구성](#single-project-configuration) 및 [멀티 프로젝트 구성](#multi-project-configuration) 방법을 참조하세요.

> * 내부적으로 Dokka는 [Kotlin Gradle 플러그인](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)을 사용하여 문서가 생성될 [소스 세트](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)를 자동 구성합니다. Kotlin Gradle 플러그인을 적용하거나 [소스 세트를 수동으로 구성](dokka-gradle-configuration-options.md#source-set-configuration)했는지 확인하세요.
>
> * [사전 컴파일된 스크립트 플러그인](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins)에서 Dokka를 사용하는 경우, 제대로 작동하도록 [Kotlin Gradle 플러그인](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)을 종속성으로 추가해야 합니다.
>
{style="tip"}

## 빌드 캐시 및 구성 캐시 활성화

DGP는 Gradle 빌드 캐시 및 구성 캐시를 지원하여 빌드 성능을 향상시킵니다.

* 빌드 캐시를 활성화하려면 [Gradle 빌드 캐시 문서](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable)의 지침을 따르세요.
* 구성 캐시를 활성화하려면 [Gradle 구성 캐시 문서](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable)의 지침을 따르세요.

## 문서 생성

Dokka Gradle 플러그인에는 [HTML](dokka-html.md) 및 [Javadoc](dokka-javadoc.md) 출력 형식이 내장되어 있습니다.

다음 Gradle 태스크를 사용하여 문서를 생성하세요:

```shell
./gradlew :dokkaGenerate
```

`dokkaGenerate` Gradle 태스크의 주요 동작은 다음과 같습니다:

* 이 태스크는 [단일 프로젝트](#single-project-configuration) 및 [멀티 프로젝트](#multi-project-configuration) 빌드 모두에 대한 문서를 생성합니다.
* 기본적으로 문서 출력 형식은 HTML입니다. [적절한 플러그인을 추가하여](#configure-documentation-output-format) Javadoc 또는 HTML과 Javadoc 형식을 모두 생성할 수도 있습니다.
* 생성된 문서는 단일 및 멀티 프로젝트 빌드 모두 `build/dokka/html` 디렉터리에 자동으로 배치됩니다. [위치(`outputDirectory`)를 변경할 수 있습니다](dokka-gradle-configuration-options.md#general-configuration).

### 문서 출력 형식 구성

> Javadoc 출력 형식은 [알파 (Alpha)](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 상태입니다. 사용 시 버그가 발생하거나 마이그레이션 문제가 발생할 수 있습니다. Javadoc을 입력으로 받는 도구와의 성공적인 통합은 보장되지 않습니다. 위험을 감수하고 사용하십시오.
>
{style="warning"}

API 문서를 HTML, Javadoc 또는 두 형식 모두로 동시에 생성하도록 선택할 수 있습니다:

1.  프로젝트의 `build.gradle.kts` 파일 `plugins {}` 블록에 해당 플러그인 `id`를 배치합니다:

    ```kotlin
    plugins {
        // HTML 문서 생성
        id("org.jetbrains.dokka") version "%dokkaVersion%"

        // Javadoc 문서 생성
        id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"

        // 두 플러그인 ID를 모두 유지하면 두 형식이 모두 생성됩니다.
    }
    ```

2.  해당 Gradle 태스크를 실행합니다.

    각 형식에 해당하는 플러그인 `id` 및 Gradle 태스크 목록은 다음과 같습니다:

    |             | **HTML**                                   | **Javadoc**                                   | **모두**                          |
    |-------------|--------------------------------------------|-----------------------------------------------|-----------------------------------|
    | 플러그인 `id` | `id("org.jetbrains.dokka")`                | `id("org.jetbrains.dokka-javadoc")`           | HTML 및 Javadoc 플러그인 모두 사용 |
    | Gradle 태스크 | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc` | `./gradlew :dokkaGenerate`        |

    > * `dokkaGenerate` 태스크는 적용된 플러그인을 기반으로 사용 가능한 모든 형식으로 문서를 생성합니다.
    > HTML 및 Javadoc 플러그인이 모두 적용된 경우,
    > `dokkaGeneratePublicationHtml` 태스크를 실행하여 HTML만 생성하거나
    > `dokkaGeneratePublicationJavadoc` 태스크를 실행하여 Javadoc만 생성할 수 있습니다.
    >
    {style="tip"}

IntelliJ IDEA를 사용하는 경우 `dokkaGenerateHtml` Gradle 태스크가 보일 수 있습니다.
이 태스크는 `dokkaGeneratePublicationHtml`의 별칭일 뿐입니다. 두 태스크는 정확히 동일한 작업을 수행합니다.

### 멀티 프로젝트 빌드에서 문서 출력 집계

Dokka는 여러 서브프로젝트의 문서를 단일 출력 또는 발행물로 집계할 수 있습니다.

문서를 집계하기 전에 모든 문서화할 수 있는 서브프로젝트에 [Dokka 플러그인을 적용](#apply-the-convention-plugin-to-your-subprojects)해야 합니다.

여러 서브프로젝트의 문서를 집계하려면 루트 프로젝트의 `build.gradle.kts` 파일에 `dependencies {}` 블록을 추가하세요:

```kotlin
dependencies {
    dokka(project(":childProjectA:"))
    dokka(project(":childProjectB:"))
}
```

다음과 같은 구조를 가진 프로젝트가 있다고 가정해 보겠습니다:

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass.kt
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass.kt
```

생성된 문서는 다음과 같이 집계됩니다:

![Screenshot for output of dokkaHtmlMultiModule task](dokkaHtmlMultiModule-example.png){width=600}

자세한 내용은 [멀티 프로젝트 예시](https://github.com/Kotlin/dokka/tree/2.0.0/examples/gradle-v2/multimodule-example)를 참조하세요.

#### 집계된 문서 디렉터리

DGP가 서브프로젝트를 집계할 때, 각 서브프로젝트는 집계된 문서 내에 자체 하위 디렉터리를 가집니다.
DGP는 전체 프로젝트 구조를 유지하여 각 서브프로젝트가 고유한 디렉터리를 갖도록 합니다.

예를 들어, `:turbo-lib`에 집계가 있고 중첩된 서브프로젝트 `:turbo-lib:maths`가 있는 프로젝트의 경우,
생성된 문서는 다음 아래에 배치됩니다:

```text
turbo-lib/build/dokka/html/turbo-lib/maths/
```

각 서브프로젝트의 `build.gradle.kts` 파일에 다음 구성을 추가하여 이 동작을 수동으로 서브프로젝트 디렉터리를 지정하여 되돌릴 수 있습니다:

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // 서브프로젝트 디렉터리 재정의
    modulePath.set("maths")
}
```

이 구성은 `:turbo-lib:maths` 모듈에 대한 생성된 문서를
`turbo-lib/build/dokka/html/maths/`로 변경합니다.

## javadoc.jar 빌드

라이브러리를 리포지토리에 게시하려면 라이브러리의 API 참조 문서를 포함하는 `javadoc.jar` 파일을 제공해야 할 수 있습니다.

예를 들어, [Maven Central](https://central.sonatype.org/)에 게시하려면 프로젝트와 함께 `javadoc.jar`를 [반드시](https://central.sonatype.org/publish/requirements/) 제공해야 합니다. 그러나 모든 리포지토리에 이러한 규칙이 있는 것은 아닙니다.

Dokka용 Gradle 플러그인은 기본적으로 이를 수행하는 방법을 제공하지 않지만, 사용자 정의 Gradle 태스크를 통해 달성할 수 있습니다. 하나는 [HTML](dokka-html.md) 형식으로 문서를 생성하는 태스크이고 다른 하나는 [Javadoc](dokka-javadoc.md) 형식으로 문서를 생성하는 태스크입니다:

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// HTML 형식으로 문서 생성
val dokkaHtmlJar by tasks.registering(Jar::class) {
    description = "A HTML Documentation JAR containing Dokka HTML"
    from(tasks.dokkaGeneratePublicationHtml.flatMap { it.outputDirectory })
    archiveClassifier.set("html-doc")
}

// Javadoc 형식으로 문서 생성
val dokkaJavadocJar by tasks.registering(Jar::class) {
    description = "A Javadoc JAR containing Dokka Javadoc"
    from(tasks.dokkaGeneratePublicationJavadoc.flatMap { it.outputDirectory })
    archiveClassifier.set("javadoc")
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
// HTML 형식으로 문서 생성
tasks.register('dokkaHtmlJar', Jar) {
    description = 'A HTML Documentation JAR containing Dokka HTML'
    from(tasks.named('dokkaGeneratePublicationHtml').flatMap { it.outputDirectory })
    archiveClassifier.set('html-doc')
}

// Javadoc 형식으로 문서 생성
tasks.register('dokkaJavadocJar', Jar) {
    description = 'A Javadoc JAR containing Dokka Javadoc'
    from(tasks.named('dokkaGeneratePublicationJavadoc').flatMap { it.outputDirectory })
    archiveClassifier.set('javadoc')
}
```

</tab>
</tabs>

> 라이브러리를 Maven Central에 게시하는 경우, [javadoc.io](https://javadoc.io/)와 같은 서비스를 사용하여 라이브러리의 API 문서를 무료로 별도의 설정 없이 호스팅할 수 있습니다. 이 서비스는 `javadoc.jar`에서 직접 문서 페이지를 가져옵니다. [이 예시](https://javadoc.io/doc/com.trib3/server/latest/index.html)에서 볼 수 있듯이 HTML 형식과 잘 작동합니다.
>
{style="tip"}

## 구성 예시

가지고 있는 프로젝트의 유형에 따라 Dokka를 적용하고 구성하는 방식이 약간 다릅니다. 그러나 [구성 옵션](dokka-gradle-configuration-options.md) 자체는 프로젝트 유형에 관계없이 동일합니다.

프로젝트 루트에 단일 `build.gradle.kts` 또는 `build.gradle` 파일이 있는 간단하고 평탄한 프로젝트의 경우 [단일 프로젝트 구성](#single-project-configuration)을 참조하세요.

서브프로젝트와 여러 중첩된 `build.gradle.kts` 또는 `build.gradle` 파일이 있는 더 복잡한 빌드의 경우 [멀티 프로젝트 구성](#multi-project-configuration)을 참조하세요.

### 단일 프로젝트 구성

단일 프로젝트 빌드는 일반적으로 프로젝트 루트에 하나의 `build.gradle.kts` 또는 `build.gradle` 파일만 있습니다.
이들은 단일 플랫폼 또는 멀티플랫폼일 수 있으며 일반적으로 다음과 같은 구조를 가집니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

단일 플랫폼:

```text
.
├── build.gradle.kts
└── src/
    └── main/
        └── kotlin/
            └── HelloWorld.kt
```

멀티플랫폼:

```text
.
├── build.gradle.kts
└── src/
    ├── commonMain/
    │   └── kotlin/
    │       └── Common.kt
    ├── jvmMain/
    │   └── kotlin/
    │       └── JvmUtils.kt
    └── nativeMain/
        └── kotlin/
            └── NativeUtils.kt
```

</tab>
<tab title="Groovy" group-key="groovy">

단일 플랫폼:

```text
.
├── build.gradle
└── src/
    └── main/
        └── kotlin/
            └── HelloWorld.kt
```

멀티플랫폼:

```text
.
├── build.gradle
└── src/
    ├── commonMain/
    │   └── kotlin/
    │       └── Common.kt
    ├── jvmMain/
    │   └── kotlin/
    │       └── JvmUtils.kt
    └── nativeMain/
        └── kotlin/
            └── NativeUtils.kt
```

</tab>
</tabs>

루트 `build.gradle.kts` 파일에 Dokka Gradle 플러그인을 적용하고 최상위 `dokka {}` DSL을 사용하여 구성하세요:

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set("MyProject")
        outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
        includes.from("README.md")
   }

    dokkaSourceSets.main {
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl.set(URI("https://github.com/your-repo"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

`./build.gradle` 내부:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            moduleName.set("MyProject")
            outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
            includes.from("README.md")
        }
    }

    dokkaSourceSets {
        named("main") {
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(new URI("https://github.com/your-repo"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}
```

</tab>
</tabs>

이 구성은 프로젝트에 Dokka를 적용하고, 문서 출력 디렉터리를 설정하며, 주요 소스 세트를 정의합니다.
동일한 `dokka {}` 블록 내에서 사용자 정의 에셋, 가시성 필터 또는 플러그인 구성을 추가하여 더 확장할 수 있습니다.
자세한 내용은 [구성 옵션](dokka-gradle-configuration-options.md)을 참조하세요.

### 멀티 프로젝트 구성

[멀티 프로젝트 빌드](https://docs.gradle.org/current/userguide/multi_project_builds.html)는 일반적으로 여러 중첩된 `build.gradle.kts` 파일을 포함하며, 다음와 유사한 구조를 가집니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```text
.
├── build.gradle.kts
├── settings.gradle.kts
├── subproject-A/
│   ├── build.gradle.kts
│   └── src/
│       └── main/
│           └── kotlin/
│               └── HelloFromA.kt
└── subproject-B/
    ├── build.gradle.kts
    └── src/
        └── main/
            └── kotlin/
                └── HelloFromB.kt
```

</tab>
<tab title="Groovy" group-key="groovy">

```text
.
├── build.gradle
├── settings.gradle
├── subproject-A/
│   ├── build.gradle
│   └── src/
│       └── main/
│           └── kotlin/
│               └── HelloFromA.kt
└── subproject-B/
    ├── build.gradle
    └── src/
        └── main/
            └── kotlin/
                └── HelloFromB.kt
```

</tab>
</tabs>

단일 및 멀티 프로젝트 문서는 [최상위 `dokka {}` DSL](#single-project-configuration)을 사용하는 동일한 구성 모델을 공유합니다.

멀티 프로젝트 빌드에서 Dokka를 구성하는 두 가지 방법이 있습니다:

*   **[컨벤션 플러그인을 통한 공유 구성](#shared-configuration-via-a-convention-plugin) (권장)**: 컨벤션 플러그인을 정의하고 모든 서브프로젝트에 적용합니다.
    이렇게 하면 Dokka 설정이 중앙 집중화됩니다.

*   **[수동 구성](#manual-configuration)**: Dokka 플러그인을 적용하고 각 서브프로젝트에서 동일한 `dokka {}` 블록을 반복합니다.
    컨벤션 플러그인은 필요하지 않습니다.

서브프로젝트를 구성한 후, 여러 서브프로젝트의 문서를 단일 출력으로 집계할 수 있습니다.
자세한 내용은 [멀티 프로젝트 빌드에서 문서 출력 집계](#aggregate-documentation-output-in-project-builds)를 참조하세요.

> 멀티 프로젝트 예시는 [Dokka GitHub 리포지토리](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example)를 참조하세요.
>
{style="tip"}

#### 컨벤션 플러그인을 통한 공유 구성

컨벤션 플러그인을 설정하고 서브프로젝트에 적용하려면 다음 단계를 따르세요.

##### buildSrc 디렉터리 설정

1.  프로젝트 루트에 다음 두 파일을 포함하는 `buildSrc` 디렉터리를 생성합니다:

    *   `settings.gradle.kts`
    *   `build.gradle.kts`

2.  `buildSrc/settings.gradle.kts` 파일에 다음 스니펫을 추가합니다:

    ```kotlin
    rootProject.name = "buildSrc"
    ```

3.  `buildSrc/build.gradle.kts` 파일에 다음 스니펫을 추가합니다:

    ```kotlin
    plugins {
        `kotlin-dsl`
    }
    
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
    
    dependencies {
        implementation("org.jetbrains.dokka:dokka-gradle-plugin:%dokkaVersion%")
    }   
    ```

##### Dokka 컨벤션 플러그인 설정

`buildSrc` 디렉터리를 설정한 후 Dokka 컨벤션 플러그인을 설정합니다:

1.  [컨벤션 플러그인](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)을 호스팅할 `buildSrc/src/main/kotlin/dokka-convention.gradle.kts` 파일을 생성합니다.
2.  `dokka-convention.gradle.kts` 파일에 다음 스니펫을 추가합니다:

    ```kotlin
    plugins {
        id("org.jetbrains.dokka") 
    }

    dokka {
        // 공유 구성은 여기에
    }
    ```

    `dokka {}` 블록 내에 모든 서브프로젝트에 공통으로 적용될 공유 Dokka [구성](dokka-gradle-configuration-options.md)을 추가해야 합니다.
    또한, Dokka 버전을 지정할 필요가 없습니다. 버전은 `buildSrc/build.gradle.kts` 파일에 이미 설정되어 있습니다.

##### 서브프로젝트에 컨벤션 플러그인 적용

각 서브프로젝트의 `build.gradle.kts` 파일에 추가하여 Dokka 컨벤션 플러그인을 서브프로젝트 전체에 적용합니다:

```kotlin
plugins {
    id("dokka-convention")
}
```

#### 수동 구성

프로젝트가 컨벤션 플러그인을 사용하지 않는 경우, 동일한 `dokka {}` 블록을 각 서브프로젝트에 수동으로 복사하여 동일한 Dokka 구성 패턴을 재사용할 수 있습니다:

1.  각 서브프로젝트의 `build.gradle.kts` 파일에 Dokka 플러그인을 적용합니다:

    ```kotlin
    plugins {
        id("org.jetbrains.dokka") version "%dokkaVersion%"
    }
    ```

2.  각 서브프로젝트의 `dokka {}` 블록에 공유 구성을 선언합니다. 구성을 중앙 집중화하는 컨벤션 플러그인이 없으므로, 모든 서브프로젝트에 걸쳐 원하는 모든 구성을 중복합니다. 자세한 내용은 [구성 옵션](dokka-gradle-configuration-options.md)을 참조하세요.

#### 부모 프로젝트 구성

멀티 프로젝트 빌드에서 루트 프로젝트의 전체 문서에 적용되는 설정을 구성할 수 있습니다.
여기에는 출력 형식, 출력 디렉터리, 문서 서브프로젝트 이름 정의, 모든 서브프로젝트의 문서 집계 및 기타 [구성 옵션](dokka-gradle-configuration-options.md)이 포함될 수 있습니다:

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    // 전체 프로젝트에 대한 속성 설정
    dokkaPublications.html {
        moduleName.set("My Project")
        outputDirectory.set(layout.buildDirectory.dir("docs/html"))
        includes.from("README.md")
    }

    dokkaSourceSets.configureEach {
        documentedVisibilities.set(setOf(VisibilityModifier.Public)) // 또는 documentedVisibilities(VisibilityModifier.Public)    
    }
}

// 서브프로젝트 문서 집계
dependencies {
    dokka(project(":childProjectA"))
    dokka(project(":childProjectB"))
}
```

또한, 각 서브프로젝트는 사용자 정의 구성이 필요한 경우 자체 `dokka {}` 블록을 가질 수 있습니다.
다음 예시에서 서브프로젝트는 Dokka 플러그인을 적용하고, 사용자 정의 서브프로젝트 이름을 설정하며, `README.md` 파일에서 추가 문서를 포함합니다:

```kotlin
// subproject/build.gradle.kts
plugins {
    id("org.jetbrains.dokka")
}

dokka {
    dokkaPublications.html {
        moduleName.set("Child Project A")
        includes.from("README.md")
    }
}