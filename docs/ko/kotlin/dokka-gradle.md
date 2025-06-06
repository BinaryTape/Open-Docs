[//]: # (title: Gradle)

Gradle 기반 프로젝트의 문서를 생성하려면 [Dokka용 Gradle 플러그인](https://plugins.gradle.org/plugin/org.jetbrains.dokka)을 사용할 수 있습니다.

이 플러그인은 프로젝트에 대한 기본 자동 구성 기능을 제공하며, 문서 생성을 위한 편리한 [Gradle 태스크](#generate-documentation)를 포함하고, 출력을 사용자 정의할 수 있는 다양한 [구성 옵션](#configuration-options)을 제공합니다.

[Gradle 예제 프로젝트](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle)를 방문하여 Dokka를 다루어보고 다양한 프로젝트에 대해 어떻게 구성할 수 있는지 확인할 수 있습니다.

## Dokka 적용

Dokka용 Gradle 플러그인을 적용하는 권장 방식은 [플러그인 DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)을 사용하는 것입니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

</tab>
</tabs>

[멀티 프로젝트](#multi-project-builds) 빌드의 문서를 작성할 때, 하위 프로젝트에도 Dokka용 Gradle 플러그인을 적용해야 합니다. 이를 위해 `allprojects {}` 또는 `subprojects {}` Gradle 구성을 사용할 수 있습니다.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

</tab>
</tabs>

Dokka를 어디에 적용해야 할지 확실하지 않은 경우, [구성 예시](#configuration-examples)를 참조하십시오.

> 내부적으로 Dokka는 [Kotlin Gradle 플러그인](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)을 사용하여 문서가 생성될 [소스 세트](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)의 자동 구성을 수행합니다. Kotlin Gradle 플러그인을 적용하거나 [소스 세트를 수동으로 구성](#source-set-configuration)해야 합니다.
>
{style="note"}

> [프리컴파일된 스크립트 플러그인](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins)에서 Dokka를 사용하는 경우, 제대로 작동하려면 [Kotlin Gradle 플러그인](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)을 의존성으로 추가해야 합니다.
>
{style="note"}

어떤 이유로든 플러그인 DSL을 사용할 수 없는 경우, [플러그인 적용의 레거시 방식](https://docs.gradle.org/current/userguide/plugins.html#sec:old_plugin_application)을 사용할 수 있습니다.

## 문서 생성

Dokka용 Gradle 플러그인은 [HTML](dokka-html.md), [Markdown](dokka-markdown.md) 및 [Javadoc](dokka-javadoc.md) 출력 형식을 내장하고 있습니다. 이 플러그인은 [단일](#single-project-builds) 및 [멀티 프로젝트](#multi-project-builds) 빌드 모두에 대한 문서 생성을 위한 여러 태스크를 추가합니다.

### 단일 프로젝트 빌드

간단한 단일 프로젝트 애플리케이션 및 라이브러리에 대한 문서를 빌드하려면 다음 태스크를 사용하십시오.

| **태스크**     | **설명**                                          |
|--------------|---------------------------------------------------|
| `dokkaHtml` | [HTML](dokka-html.md) 형식으로 문서를 생성합니다. |

#### 실험적 형식

| **태스크**        | **설명**                                                                             |
|-----------------|--------------------------------------------------------------------------------------|
| `dokkaGfm`      | [GitHub Flavored Markdown](dokka-markdown.md#gfm) 형식으로 문서를 생성합니다.       |
| `dokkaJavadoc`  | [Javadoc](dokka-javadoc.md) 형식으로 문서를 생성합니다.                             |
| `dokkaJekyll`   | [Jekyll 호환 Markdown](dokka-markdown.md#jekyll) 형식으로 문서를 생성합니다.        |

기본적으로 생성된 문서는 프로젝트의 `build/dokka/{format}` 디렉터리에 위치합니다. 출력 위치는 다른 설정과 함께 [구성](#configuration-examples)할 수 있습니다.

### 멀티 프로젝트 빌드

[멀티 프로젝트 빌드](https://docs.gradle.org/current/userguide/multi_project_builds.html) 문서를 작성하려면, 문서를 생성하려는 하위 프로젝트뿐만 아니라 해당 부모 프로젝트에도 [Dokka용 Gradle 플러그인을 적용](#apply-dokka)했는지 확인하십시오.

#### MultiModule 태스크

`MultiModule` 태스크는 [`Partial`](#partial-tasks) 태스크를 통해 각 하위 프로젝트에 대한 문서를 개별적으로 생성하고, 모든 출력을 수집 및 처리하며, 공통 목차와 해결된 프로젝트 간 참조를 포함하는 완전한 문서를 생성합니다.

Dokka는 **부모** 프로젝트에 대해 다음 태스크를 자동으로 생성합니다.

| **태스크**                 | **설명**                                                            |
|--------------------------|---------------------------------------------------------------------|
| `dokkaHtmlMultiModule` | [HTML](dokka-html.md) 출력 형식으로 멀티 모듈 문서를 생성합니다. |

#### 실험적 형식 (멀티 모듈)

| **태스크**                   | **설명**                                                                                               |
|----------------------------|--------------------------------------------------------------------------------------------------------|
| `dokkaGfmMultiModule`      | [GitHub Flavored Markdown](dokka-markdown.md#gfm) 출력 형식으로 멀티 모듈 문서를 생성합니다.           |
| `dokkaJekyllMultiModule` | [Jekyll 호환 Markdown](dokka-markdown.md#jekyll) 출력 형식으로 멀티 모듈 문서를 생성합니다. |

> [Javadoc](dokka-javadoc.md) 출력 형식에는 `MultiModule` 태스크가 없지만, 대신 [`Collector`](#collector-tasks) 태스크를 사용할 수 있습니다.
>
{style="note"}

기본적으로 `{parentProject}/build/dokka/{format}MultiModule` 디렉터리에서 바로 사용할 수 있는 문서를 찾을 수 있습니다.

#### MultiModule 결과

다음과 같은 구조의 프로젝트가 주어진 경우:

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass
```

`dokkaHtmlMultiModule` 실행 후 생성되는 페이지는 다음과 같습니다.

![Screenshot for output of dokkaHtmlMultiModule task](dokkaHtmlMultiModule-example.png){width=600}

자세한 내용은 [멀티 모듈 프로젝트 예시](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-multimodule-example)를 참조하십시오.

#### Collector 태스크

`MultiModule` 태스크와 유사하게, 각 부모 프로젝트에 대해 `Collector` 태스크(`dokkaHtmlCollector`, `dokkaGfmCollector`, `dokkaJavadocCollector`, `dokkaJekyllCollector`)가 생성됩니다.

`Collector` 태스크는 각 하위 프로젝트에 대해 해당 [단일 프로젝트 태스크](#single-project-builds)를 실행하고(예: `dokkaHtml`), 모든 출력을 단일 가상 프로젝트로 병합합니다.

결과적으로 생성되는 문서는 하위 프로젝트의 모든 선언을 포함하는 단일 프로젝트 빌드처럼 보입니다.

> 멀티 프로젝트 빌드를 위한 Javadoc 문서를 생성해야 하는 경우 `dokkaJavadocCollector` 태스크를 사용하십시오.
>
{style="tip"}

#### Collector 결과

다음과 같은 구조의 프로젝트가 주어진 경우:

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass
```

`dokkaHtmlCollector` 실행 후 생성되는 페이지는 다음과 같습니다.

![Screenshot for output of dokkaHtmlCollector task](dokkaHtmlCollector-example.png){width=706}

자세한 내용은 [멀티 모듈 프로젝트 예시](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-multimodule-example)를 참조하십시오.

#### Partial 태스크

각 하위 프로젝트에는 `Partial` 태스크(`dokkaHtmlPartial`, `dokkaGfmPartial`, `dokkaJekyllPartial`)가 생성됩니다.

이 태스크들은 독립적으로 실행되도록 의도된 것이 아니며, 부모의 [MultiModule](#multimodule-tasks) 태스크에 의해 호출됩니다.

하지만 [하위 프로젝트 구성](#subproject-configuration)을 통해 Dokka를 하위 프로젝트에 맞게 사용자 정의할 수 있습니다.

> `Partial` 태스크에 의해 생성된 출력에는 해결되지 않은 HTML 템플릿 및 참조가 포함되어 있으므로, 부모의 [`MultiModule`](#multimodule-tasks) 태스크에 의한 후처리 없이는 단독으로 사용할 수 없습니다.
>
{style="warning"}

> 단일 하위 프로젝트에 대해서만 문서를 생성하려면 [단일 프로젝트 태스크](#single-project-builds)를 사용하십시오. 예를 들어, `:subprojectName:dokkaHtml`입니다.
>
{style="note"}

## javadoc.jar 빌드

라이브러리를 저장소에 게시하려면 라이브러리의 API 참조 문서를 포함하는 `javadoc.jar` 파일을 제공해야 할 수도 있습니다.

예를 들어, [Maven Central](https://central.sonatype.org/)에 게시하려면 프로젝트와 함께 `javadoc.jar`를 **반드시** 제공해야 합니다. 하지만 모든 저장소가 해당 규칙을 가지고 있는 것은 아닙니다.

Dokka용 Gradle 플러그인은 별도의 설정 없이 이를 수행할 수 있는 방법을 제공하지 않지만, 사용자 지정 Gradle 태스크를 통해 달성할 수 있습니다. 하나는 [HTML](dokka-html.md) 형식으로 문서를 생성하고, 다른 하나는 [Javadoc](dokka-javadoc.md) 형식으로 문서를 생성합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.register<Jar>("dokkaHtmlJar") {
    dependsOn(tasks.dokkaHtml)
    from(tasks.dokkaHtml.flatMap { it.outputDirectory })
    archiveClassifier.set("html-docs")
}

tasks.register<Jar>("dokkaJavadocJar") {
    dependsOn(tasks.dokkaJavadoc)
    from(tasks.dokkaJavadoc.flatMap { it.outputDirectory })
    archiveClassifier.set("javadoc")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.register('dokkaHtmlJar', Jar.class) {
    dependsOn(dokkaHtml)
    from(dokkaHtml)
    archiveClassifier.set("html-docs")
}

tasks.register('dokkaJavadocJar', Jar.class) {
    dependsOn(dokkaJavadoc)
    from(dokkaJavadoc)
    archiveClassifier.set("javadoc")
}
```

</tab>
</tabs>

> 라이브러리를 Maven Central에 게시하는 경우, [javadoc.io](https://javadoc.io/)와 같은 서비스를 사용하여 라이브러리의 API 문서를 무료로, 별도의 설정 없이 호스팅할 수 있습니다. 이 서비스는 `javadoc.jar`에서 문서 페이지를 직접 가져옵니다. [이 예시](https://javadoc.io/doc/com.trib3/server/latest/index.html)에서 볼 수 있듯이 HTML 형식과 잘 작동합니다.
>
{style="tip"}

## 구성 예시

프로젝트 유형에 따라 Dokka를 적용하고 구성하는 방식이 약간 다릅니다. 하지만 [구성 옵션](#configuration-options) 자체는 프로젝트 유형에 관계없이 동일합니다.

프로젝트 루트에 단일 `build.gradle.kts` 또는 `build.gradle` 파일이 있는 간단하고 평탄한 프로젝트의 경우, [단일 프로젝트 구성](#single-project-configuration)을 참조하십시오.

하위 프로젝트와 여러 중첩된 `build.gradle.kts` 또는 `build.gradle` 파일이 있는 더 복잡한 빌드의 경우, [멀티 프로젝트 구성](#multi-project-configuration)을 참조하십시오.

### 단일 프로젝트 구성

단일 프로젝트 빌드는 일반적으로 프로젝트 루트에 하나의 `build.gradle.kts` 또는 `build.gradle` 파일만 있으며, 일반적으로 다음과 같은 구조를 가집니다.

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

이러한 프로젝트에서는 루트 `build.gradle.kts` 또는 `build.gradle` 파일에 Dokka 및 해당 구성을 적용해야 합니다.

태스크 및 출력 형식을 개별적으로 구성할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

`./build.gradle.kts` 내부:

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

tasks.dokkaHtml {
    outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
}

tasks.dokkaGfm {
    outputDirectory.set(layout.buildDirectory.dir("documentation/markdown"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

`./build.gradle` 내부:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokkaHtml {
    outputDirectory.set(file("build/documentation/html"))
}

dokkaGfm {
    outputDirectory.set(file("build/documentation/markdown"))
}
```

</tab>
</tabs>

또는 모든 태스크 및 출력 형식을 동시에 구성할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

`./build.gradle.kts` 내부:

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

// dokkaHtml, dokkaJavadoc 및 dokkaGfm과 같은 모든 단일 프로젝트 Dokka 태스크를 동시에 구성합니다.
tasks.withType<DokkaTask>().configureEach {
    dokkaSourceSets.configureEach {
        documentedVisibilities.set(
            setOf(
                Visibility.PUBLIC,
                Visibility.PROTECTED,
            )
        )

        perPackageOption {
            matchingRegex.set(".*internal.*")
            suppress.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

`./build.gradle` 내부:

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

// dokkaHtml, dokkaJavadoc 및 dokkaGfm과 같은 모든 단일 프로젝트 Dokka 태스크를 동시에 구성합니다.
tasks.withType(DokkaTask.class) {
    dokkaSourceSets.configureEach {
        documentedVisibilities.set([
                Visibility.PUBLIC,
                Visibility.PROTECTED
        ])

        perPackageOption {
            matchingRegex.set(".*internal.*")
            suppress.set(true)
        }
    }
}
```

</tab>
</tabs>

### 멀티 프로젝트 구성

Gradle의 [멀티 프로젝트 빌드](https://docs.gradle.org/current/userguide/multi_project_builds.html)는 구조와 구성이 더 복잡합니다. 일반적으로 여러 중첩된 `build.gradle.kts` 또는 `build.gradle` 파일을 가지며, 일반적으로 다음과 같은 구조를 가집니다.

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

이 경우 Dokka를 적용하고 구성하는 여러 가지 방법이 있습니다.

#### 하위 프로젝트 구성

멀티 프로젝트 빌드에서 하위 프로젝트를 구성하려면 [`Partial`](#partial-tasks) 태스크를 구성해야 합니다.

Gradle의 `allprojects {}` 또는 `subprojects {}` 구성 블록을 사용하여 루트 `build.gradle.kts` 또는 `build.gradle` 파일에서 모든 하위 프로젝트를 동시에 구성할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

루트 `./build.gradle.kts` 내부:

```kotlin
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

subprojects {
    apply(plugin = "org.jetbrains.dokka")

    // HTML 태스크만 구성
    tasks.dokkaHtmlPartial {
        outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
    }

    // 모든 형식 태스크를 한 번에 구성
    tasks.withType<DokkaTaskPartial>().configureEach {
        dokkaSourceSets.configureEach {
            includes.from("README.md")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

루트 `./build.gradle` 내부:

```groovy
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

subprojects {
    apply plugin: 'org.jetbrains.dokka'

    // HTML 태스크만 구성
    dokkaHtmlPartial {
        outputDirectory.set(file("build/docs/partial"))
    }

    // 모든 형식 태스크를 한 번에 구성
    tasks.withType(DokkaTaskPartial.class) {
        dokkaSourceSets.configureEach {
            includes.from("README.md")
        }
    }
}
```

</tab>
</tabs>

또는 개별적으로 하위 프로젝트 내에서 Dokka를 적용하고 구성할 수 있습니다.

예를 들어, `subproject-A` 하위 프로젝트에만 특정 설정을 적용하려면 `./subproject-A/build.gradle.kts` 내부에 다음 코드를 적용해야 합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

`./subproject-A/build.gradle.kts` 내부:

```kotlin
apply(plugin = "org.jetbrains.dokka")

// subproject-A에 대한 구성만.
tasks.dokkaHtmlPartial {
    outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

`./subproject-A/build.gradle` 내부:

```groovy
apply plugin: 'org.jetbrains.dokka'

// subproject-A에 대한 구성만.
dokkaHtmlPartial {
    outputDirectory.set(file("build/docs/partial"))
}
```

</tab>
</tabs>

#### 부모 프로젝트 구성

모든 문서에 걸쳐 보편적이며 하위 프로젝트에 속하지 않는 것을 구성하려면(즉, 부모 프로젝트의 속성인 경우), [`MultiModule`](#multimodule-tasks) 태스크를 구성해야 합니다.

예를 들어, HTML 문서의 헤더에 사용되는 프로젝트 이름을 변경하려면 루트 `build.gradle.kts` 또는 `build.gradle` 파일 내부에 다음을 적용해야 합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

루트 `./build.gradle.kts` 파일 내부:

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

tasks.dokkaHtmlMultiModule {
    moduleName.set("WHOLE PROJECT NAME USED IN THE HEADER")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

루트 `./build.gradle` 파일 내부:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokkaHtmlMultiModule {
    moduleName.set("WHOLE PROJECT NAME USED IN THE HEADER")
}
```

</tab>
</tabs>

## 구성 옵션

Dokka는 사용자 및 독자의 경험을 맞춤 설정할 수 있는 많은 구성 옵션을 제공합니다.

아래에는 각 구성 섹션에 대한 몇 가지 예시와 자세한 설명이 있습니다. [모든 구성 옵션](#complete-configuration)이 동시에 적용된 예시도 페이지 하단에서 찾을 수 있습니다.

구성 블록을 어디에 적용하고 어떻게 적용하는지에 대한 자세한 내용은 [구성 예시](#configuration-examples)를 참조하십시오.

### 일반 구성

소스 세트나 패키지에 관계없이 모든 Dokka 태스크에 대한 일반 구성 예시는 다음과 같습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

// 참고: 멀티 프로젝트 빌드를 구성하려면 하위 프로젝트의 Partial 태스크를 구성해야 합니다.
// 문서의 "구성 예시" 섹션을 참조하십시오.
tasks.withType<DokkaTask>().configureEach {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(layout.buildDirectory.dir("dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)
    
    // ..
    // 소스 세트 구성 섹션
    // ..
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask

// 참고: 멀티 프로젝트 빌드를 구성하려면 하위 프로젝트의 Partial 태스크를 구성해야 합니다.
// 문서의 "구성 예시" 섹션을 참조하십시오.
tasks.withType(DokkaTask.class) {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(file("build/dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    // ..
    // 소스 세트 구성 섹션
    // ..
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="moduleName">
        <p>모듈을 참조하는 데 사용되는 표시 이름입니다. 목차, 내비게이션, 로깅 등에 사용됩니다.</p>
        <p>단일 프로젝트 빌드 또는 <code>MultiModule</code> 태스크에 설정된 경우, 프로젝트 이름으로 사용됩니다.</p>
        <p>기본값: Gradle 프로젝트 이름</p>
    </def>
    <def title="moduleVersion">
        <p>
            모듈 버전입니다. 단일 프로젝트 빌드 또는 <code>MultiModule</code> 태스크에 설정된 경우, 프로젝트 버전으로 사용됩니다.
        </p>
        <p>기본값: Gradle 프로젝트 버전</p>
    </def>
    <def title="outputDirectory">
        <p>포맷에 관계없이 문서가 생성되는 디렉터리입니다. 태스크별로 설정할 수 있습니다.</p>
        <p>
            기본값은 <code>{project}/{buildDir}/{format}</code>이며, 여기서 <code>{format}</code>은 'dokka' 접두사가 제거된 태스크 이름입니다. <code>dokkaHtmlMultiModule</code> 태스크의 경우 
            <code>project/buildDir/htmlMultiModule</code>입니다.
        </p>
    </def>
    <def title="failOnWarning">
        <p>
            Dokka가 경고 또는 오류를 발생시켰을 때 문서 생성을 실패시킬지 여부입니다.
            모든 오류 및 경고가 먼저 발생할 때까지 프로세스가 기다립니다.
        </p>
        <p>이 설정은 <code>reportUndocumented</code>와 함께 잘 작동합니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>명백한 함수를 숨길지 여부입니다.</p>
        <p>
            함수는 다음과 같은 경우에 명백한 것으로 간주됩니다.</p>
            <list>
                <li>
                    <code>equals</code>, <code>hashCode</code>, <code>toString</code>과 같이 <code>kotlin.Any</code>, <code>Kotlin.Enum</code>, <code>java.lang.Object</code> 또는
                    <code>java.lang.Enum</code>에서 상속된 경우.
                </li>
                <li>
                    합성(컴파일러가 생성)되었으며 <code>dataClass.componentN</code> 또는 <code>dataClass.copy</code>와 같이 문서가 없는 경우.
                </li>
            </list>
        <p>기본값: <code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>주어진 클래스에서 명시적으로 오버라이드되지 않은 상속된 멤버를 숨길지 여부입니다.</p>
        <p>
            참고: 이는 <code>equals</code> / <code>hashCode</code> / <code>toString</code>과 같은 함수를 숨길 수 있지만, 
            <code>dataClass.componentN</code> 및 <code>dataClass.copy</code>와 같은 합성 함수는 숨길 수 없습니다. 
            이를 위해서는 <code>suppressObviousFunctions</code>를 사용하십시오.
        </p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="offlineMode">
        <p>네트워크를 통해 원격 파일/링크를 해결(resolve)할지 여부입니다.</p>
        <p>
            이는 외부 문서 링크 생성에 사용되는 패키지 목록을 포함합니다. 
            예를 들어, 표준 라이브러리의 클래스를 클릭 가능하게 만드는 경우입니다. 
        </p>
        <p>
            이것을 <code>true</code>로 설정하면 특정 경우에 빌드 시간을 크게 단축할 수 있지만,
            문서 품질 및 사용자 경험을 저하시킬 수도 있습니다. 예를 들어,
            표준 라이브러리를 포함하여 의존성에서 클래스/멤버 링크를 해결하지 못하는 경우입니다.
        </p>
        <p>
            참고: 가져온 파일을 로컬에 캐시하고 Dokka에 로컬 경로로 제공할 수 있습니다. 
            <code>externalDocumentationLinks</code> 섹션을 참조하십시오.
        </p>
        <p>기본값: <code>false</code></p>
    </def>
</deflist>

### 소스 세트 구성

Dokka는 [Kotlin 소스 세트](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)에 대한 일부 옵션을 구성할 수 있도록 허용합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 참고: 멀티 프로젝트 빌드를 구성하려면 하위 프로젝트의 Partial 태스크를 구성해야 합니다.
// 문서의 "구성 예시" 섹션을 참조하십시오.
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 일반 구성 섹션
    // ..

    dokkaSourceSets {
        // 'linux' 소스 세트에만 적용되는 구성
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // 소스 링크 섹션
            }
            externalDocumentationLink {
                // 외부 문서 링크 섹션
            }
            perPackageOption {
                // 패키지 옵션 섹션
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 참고: 멀티 프로젝트 빌드를 구성하려면 하위 프로젝트의 Partial 태스크를 구성해야 합니다.
// 문서의 "구성 예시" 섹션을 참조하십시오.
tasks.withType(DokkaTask.class) {
    // ..
    // 일반 구성 섹션
    // ..
    
    dokkaSourceSets {
        // 'linux' 소스 세트에만 적용되는 구성
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([Visibility.PUBLIC])
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // 소스 링크 섹션
            }
            externalDocumentationLink {
                // 외부 문서 링크 섹션
            }
            perPackageOption {
                // 패키지 옵션 섹션
            }
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="suppress">
        <p>문서 생성 시 이 소스 세트를 건너뛸지 여부입니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="displayName">
        <p>이 소스 세트를 참조하는 데 사용되는 표시 이름입니다.</p>
        <p>
            이 이름은 외부(예: 문서 리더에게 보이는 소스 세트 이름) 및 내부(예: <code>reportUndocumented</code>의 로깅 메시지) 모두에 사용됩니다.
        </p>
        <p>기본적으로 값은 Kotlin Gradle 플러그인에서 제공하는 정보로부터 추론됩니다.</p>
    </def>
    <def title="documentedVisibilities">
        <p>문서화해야 할 가시성(visibility) 수정자 집합입니다.</p>
        <p>
            <code>protected</code>/<code>internal</code>/<code>private</code> 선언을 문서화하거나, 
            <code>public</code> 선언을 제외하고 내부 API만 문서화하려는 경우에 사용할 수 있습니다.
        </p>
        <p>이는 패키지별로 구성할 수 있습니다.</p>
        <p>기본값: <code>DokkaConfiguration.Visibility.PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            가시적이고 문서화되지 않은 선언, 즉 <code>documentedVisibilities</code> 및 다른 필터에 의해 필터링된 후 KDoc이 없는 선언에 대해 경고를 발생시킬지 여부입니다.
        </p>
        <p>이 설정은 <code>failOnWarning</code>과 함께 잘 작동합니다.</p>
        <p>이는 패키지별로 구성할 수 있습니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            다양한 필터가 적용된 후, 보이는 선언이 없는 패키지를 건너뛸지 여부입니다.
        </p>
        <p>
            예를 들어, <code>skipDeprecated</code>가 <code>true</code>로 설정되어 있고 패키지에 더 이상 사용되지 않는(deprecated) 선언만 포함된 경우, 해당 패키지는 비어 있는 것으로 간주됩니다.
        </p>
        <p>기본값: <code>true</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>로 주석이 달린 선언을 문서화할지 여부입니다.</p>
        <p>이는 패키지별로 구성할 수 있습니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="suppressGeneratedFiles">
        <p>생성된 파일을 문서화/분석할지 여부입니다.</p>
        <p>
            생성된 파일은 <code>{project}/{buildDir}/generated</code> 디렉터리 아래에 있어야 합니다.
        </p>
        <p>
            <code>true</code>로 설정하면 해당 디렉터리의 모든 파일이 <code>suppressedFiles</code> 옵션에 실질적으로 추가되므로 수동으로 구성할 수 있습니다.
        </p>
        <p>기본값: <code>true</code></p>
    </def>
    <def title="jdkVersion">
        <p>Java 타입에 대한 외부 문서 링크를 생성할 때 사용할 JDK 버전입니다.</p>
        <p>
            예를 들어, 일부 public 선언 시그니처에 <code>java.util.UUID</code>를 사용하고 이 옵션이 <code>8</code>로 설정된 경우, Dokka는 해당 선언에 대해 <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadocs</a>로 연결되는 외부 문서 링크를 생성합니다.
        </p>
        <p>기본값: JDK 8</p>
    </def>
    <def title="languageVersion">
        <p>
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 언어 버전</a>으로,
            분석 및 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            환경 설정에 사용됩니다.
        </p>
        <p>기본적으로 Dokka의 내장 컴파일러에서 사용할 수 있는 최신 언어 버전이 사용됩니다.</p>
    </def>
    <def title="apiVersion">
        <p>
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API 버전</a>으로,
            분석 및 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            환경 설정에 사용됩니다.
        </p>
        <p>기본적으로 <code>languageVersion</code>에서 추론됩니다.</p>
    </def>
    <def title="noStdlibLink">
        <p>
            Kotlin 표준 라이브러리의 API 참조 문서로 연결되는 외부 문서 링크를 생성할지 여부입니다.
        </p>
        <p>참고: <code>noStdLibLink</code>가 <code>false</code>로 설정된 경우 링크가 <b>생성됩니다</b>.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="noJdkLink">
        <p>JDK의 Javadoc으로 연결되는 외부 문서 링크를 생성할지 여부입니다.</p>
        <p>JDK Javadoc의 버전은 <code>jdkVersion</code> 옵션에 의해 결정됩니다.</p>
        <p>참고: <code>noJdkLink</code>가 <code>false</code>로 설정된 경우 링크가 <b>생성됩니다</b>.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="noAndroidSdkLink">
        <anchor name="includes"/>
        <p>Android SDK API 참조로 연결되는 외부 문서 링크를 생성할지 여부입니다.</p>
        <p>이것은 Android 프로젝트에서만 관련이 있으며, 그렇지 않은 경우에는 무시됩니다.</p>
        <p>참고: <code>noAndroidSdkLink</code>가 <code>false</code>로 설정된 경우 링크가 <b>생성됩니다</b>.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="includes">
        <p>
            <a href="dokka-module-and-package-docs.md">모듈 및 패키지 문서</a>를 포함하는 Markdown 파일 목록입니다.
        </p>
        <p>지정된 파일의 내용은 구문 분석되어 모듈 및 패키지 설명으로 문서에 포함됩니다.</p>
        <p>
            어떻게 생겼고 어떻게 사용하는지에 대한 예시는 <a href="https://github.com/Kotlin/dokka/tree/master/examples/gradle/dokka-gradle-example">Dokka Gradle 예제</a>를 참조하십시오.
        </p>
    </def>
    <def title="platform">
        <p>
            코드 분석 및 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 환경 설정에 사용될 플랫폼입니다.
        </p>
        <p>기본값은 Kotlin Gradle 플러그인에서 제공하는 정보로부터 추론됩니다.</p>
    </def>
    <def title="sourceRoots">
        <p>
            분석 및 문서화할 소스 코드 루트입니다.
            허용되는 입력은 디렉터리 및 개별 <code>.kt</code> / <code>.java</code> 파일입니다.
        </p>
        <p>기본적으로 소스 루트는 Kotlin Gradle 플러그인에서 제공하는 정보로부터 추론됩니다.</p>
    </def>
    <def title="classpath">
        <p>분석 및 대화형 샘플을 위한 클래스패스입니다.</p>
        <p>이는 의존성에서 오는 일부 타입이 자동으로 해결/선택되지 않는 경우에 유용합니다.</p>
        <p>이 옵션은 <code>.jar</code> 및 <code>.klib</code> 파일 모두를 허용합니다.</p>
        <p>기본적으로 클래스패스는 Kotlin Gradle 플러그인에서 제공하는 정보로부터 추론됩니다.</p>
    </def>
    <def title="samples">
        <p>
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDoc 태그를 통해 참조되는 샘플 함수가 포함된 디렉터리 또는 파일 목록입니다.
        </p>
    </def>
</deflist>

### 소스 링크 구성

`sourceLinks` 구성 블록을 사용하면 각 시그니처에 `source` 링크를 추가하여 특정 줄 번호와 함께 `remoteUrl`로 이동할 수 있습니다. (줄 번호는 `remoteLineSuffix`를 설정하여 구성할 수 있습니다.)

이는 독자가 각 선언의 소스 코드를 찾는 데 도움이 됩니다.

예시로 `kotlinx.coroutines`의 [`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 함수 문서를 참조하십시오.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 참고: 멀티 프로젝트 빌드를 구성하려면 하위 프로젝트의 Partial 태스크를 구성해야 합니다.
// 문서의 "구성 예시" 섹션을 참조하십시오.
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 일반 구성 섹션
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 소스 세트 구성 섹션
        // ..
        
        sourceLink {
            localDirectory.set(projectDir.resolve("src"))
            remoteUrl.set(URL("https://github.com/kotlin/dokka/tree/master/src"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 참고: 멀티 프로젝트 빌드를 구성하려면 하위 프로젝트의 Partial 태스크를 구성해야 합니다.
// 문서의 "구성 예시" 섹션을 참조하십시오.
tasks.withType(DokkaTask.class) {
    // ..
    // 일반 구성 섹션
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 소스 세트 구성 섹션
        // ..
        
        sourceLink {
            localDirectory.set(file("src"))
            remoteUrl.set(new URL("https://github.com/kotlin/dokka/tree/master/src"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="localDirectory">
        <p>
            로컬 소스 디렉터리 경로입니다. 경로는 현재 프로젝트의 루트에 상대적이어야 합니다.
        </p>
    </def>
    <def title="remoteUrl">
        <p>
            문서 리더가 액세스할 수 있는 GitHub, GitLab, Bitbucket 등 소스 코드 호스팅 서비스의 URL입니다.
            이 URL은 선언의 소스 코드 링크를 생성하는 데 사용됩니다.
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            소스 코드 줄 번호를 URL에 추가하는 데 사용되는 접미사입니다. 이는 독자가
            파일뿐만 아니라 선언의 특정 줄 번호로 이동하는 데 도움이 됩니다.
        </p>
        <p>
            숫자 자체는 지정된 접미사에 추가됩니다. 예를 들어,
            이 옵션이 <code>#L</code>로 설정되고 줄 번호가 10인 경우, 결과 URL 접미사는
            <code>#L10</code>이 됩니다.
        </p>
        <p>
            인기 있는 서비스에서 사용되는 접미사:</p>
            <list>
                <li>GitHub: <code>#L</code></li>
                <li>GitLab: <code>#L</code></li>
                <li>Bitbucket: <code>#lines-</code></li>
            </list>
        <p>기본값: <code>#L</code></p>
    </def>
</deflist>

### 패키지 옵션

`perPackageOption` 구성 블록을 사용하면 `matchingRegex`와 일치하는 특정 패키지에 대한 일부 옵션을 설정할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask

// 참고: 멀티 프로젝트 빌드를 구성하려면 하위 프로젝트의 Partial 태스크를 구성해야 합니다.
// 문서의 "구성 예시" 섹션을 참조하십시오.
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 일반 구성 섹션
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 소스 세트 구성 섹션
        // ..
        
        perPackageOption {
            matchingRegex.set(".*api.*")
            suppress.set(false)
            skipDeprecated.set(false)
            reportUndocumented.set(false)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask

// 참고: 멀티 프로젝트 빌드를 구성하려면 하위 프로젝트의 Partial 태스크를 구성해야 합니다.
// 문서의 "구성 예시" 섹션을 참조하십시오.
tasks.withType(DokkaTask.class) {
    // ..
    // 일반 구성 섹션
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 소스 세트 구성 섹션
        // ..
        
        perPackageOption {
            matchingRegex.set(".*api.*")
            suppress.set(false)
            skipDeprecated.set(false)
            reportUndocumented.set(false)
            documentedVisibilities.set([Visibility.PUBLIC])
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>패키지와 일치하는 데 사용되는 정규 표현식입니다.</p>
        <p>기본값: <code>.*</code></p>
    </def>
    <def title="suppress">
        <p>문서 생성 시 이 패키지를 건너뛸지 여부입니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>로 주석이 달린 선언을 문서화할지 여부입니다.</p>
        <p>이는 소스 세트 수준에서 구성할 수 있습니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            가시적이고 문서화되지 않은 선언, 즉 <code>documentedVisibilities</code> 및 다른 필터에 의해 필터링된 후 KDoc이 없는 선언에 대해 경고를 발생시킬지 여부입니다.
        </p>
        <p>이 설정은 <code>failOnWarning</code>과 함께 잘 작동합니다.</p>
        <p>이는 소스 세트 수준에서 구성할 수 있습니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>문서화해야 할 가시성 수정자 집합입니다.</p>
        <p>
            이 패키지 내의 <code>protected</code>/<code>internal</code>/<code>private</code> 선언을 문서화하거나,
            <code>public</code> 선언을 제외하고 내부 API만 문서화하려는 경우에 사용할 수 있습니다.
        </p>
        <p>이는 소스 세트 수준에서 구성할 수 있습니다.</p>
        <p>기본값: <code>DokkaConfiguration.Visibility.PUBLIC</code></p>
    </def>
</deflist>

### 외부 문서 링크 구성

`externalDocumentationLink` 블록을 사용하면 의존성의 외부 호스팅 문서로 연결되는 링크를 생성할 수 있습니다.

예를 들어, `kotlinx.serialization`에서 타입을 사용하는 경우, 기본적으로 문서에서 해결되지 않은 것처럼 클릭할 수 없습니다. 그러나 `kotlinx.serialization`의 API 참조 문서는 Dokka에 의해 빌드되고 [kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/)에 게시되므로, 이에 대한 외부 문서 링크를 구성할 수 있습니다. 이를 통해 Dokka는 라이브러리의 타입에 대한 링크를 생성하여 성공적으로 해결되고 클릭 가능하게 만듭니다.

기본적으로 Kotlin 표준 라이브러리, JDK, Android SDK 및 AndroidX에 대한 외부 문서 링크가 구성되어 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 참고: 멀티 프로젝트 빌드를 구성하려면 하위 프로젝트의 Partial 태스크를 구성해야 합니다.
// 문서의 "구성 예시" 섹션을 참조하십시오.
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 일반 구성 섹션
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 소스 세트 구성 섹션
        // ..
        
        externalDocumentationLink {
            url.set(URL("https://kotlinlang.org/api/kotlinx.serialization/"))
            packageListUrl.set(
                rootProject.projectDir.resolve("serialization.package.list").toURL()
            )
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 참고: 멀티 프로젝트 빌드를 구성하려면 하위 프로젝트의 Partial 태스크를 구성해야 합니다.
// 문서의 "구성 예시" 섹션을 참조하십시오.
tasks.withType(DokkaTask.class) {
    // ..
    // 일반 구성 섹션
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 소스 세트 구성 섹션
        // ..
        
        externalDocumentationLink {
            url.set(new URL("https://kotlinlang.org/api/kotlinx.serialization/"))
            packageListUrl.set(
                file("serialization.package.list").toURL()
            )
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="url">
        <p>연결할 문서의 루트 URL입니다. 후행 슬래시가 <b>반드시</b> 포함되어야 합니다.</p>
        <p>
            Dokka는 주어진 URL에 대한 <code>package-list</code>를 자동으로 찾고 선언을 서로 연결하기 위해 최선을 다합니다.
        </p>
        <p>
            자동 해결에 실패하거나 로컬 캐시된 파일을 대신 사용하려면 <code>packageListUrl</code> 옵션 설정을 고려하십시오.
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code>의 정확한 위치입니다. 이는 Dokka가 자동으로 해결하는 것에 의존하는 대안입니다.
        </p>
        <p>
            패키지 목록에는 모듈 및 패키지 이름과 같은 문서 및 프로젝트 자체에 대한 정보가 포함됩니다.
        </p>
        <p>이것은 네트워크 호출을 피하기 위해 로컬 캐시된 파일일 수도 있습니다.</p>
    </def>
</deflist>

### 전체 구성

아래에서 모든 가능한 구성 옵션이 동시에 적용된 것을 볼 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 참고: 멀티 프로젝트 빌드를 구성하려면 하위 프로젝트의 Partial 태스크를 구성해야 합니다.
// 문서의 "구성 예시" 섹션을 참조하십시오.
tasks.withType<DokkaTask>().configureEach {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(layout.buildDirectory.dir("dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    dokkaSourceSets {
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")
            
            sourceLink {
                localDirectory.set(projectDir.resolve("src"))
                remoteUrl.set(URL("https://github.com/kotlin/dokka/tree/master/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLink {
                url.set(URL("https://kotlinlang.org/api/core/kotlin-stdlib/"))
                packageListUrl.set(
                    rootProject.projectDir.resolve("stdlib.package.list").toURL()
                )
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(
                    setOf(
                        Visibility.PUBLIC,
                        Visibility.PRIVATE,
                        Visibility.PROTECTED,
                        Visibility.INTERNAL,
                        Visibility.PACKAGE
                    )
                )
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 참고: 멀티 프로젝트 빌드를 구성하려면 하위 프로젝트의 Partial 태스크를 구성해야 합니다.
// 문서의 "구성 예시" 섹션을 참조하십시오.
tasks.withType(DokkaTask.class) {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(file("build/dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    dokkaSourceSets {
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([Visibility.PUBLIC])
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src"))
                remoteUrl.set(new URL("https://github.com/kotlin/dokka/tree/master/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLink {
                url.set(new URL("https://kotlinlang.org/api/core/kotlin-stdlib/"))
                packageListUrl.set(
                        file("stdlib.package.list").toURL()
                )
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set([Visibility.PUBLIC])
            }
        }
    }
}
```

</tab>
</tabs>