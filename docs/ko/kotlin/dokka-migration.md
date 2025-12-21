`[//]: # (title: Dokka Gradle 플러그인 v2로 마이그레이션)

> 이 페이지는 DGP v1을 사용 중이며 DGP v2로 마이그레이션하려는 경우에만 해당됩니다. Dokka 2.1.0부터 DGP v2는 기본적으로 활성화됩니다.
> Dokka 2.1.0 이상을 사용 중이라면
> 이 페이지를 건너뛰고 [Dokka Gradle 문서](dokka-gradle.md)로 바로 이동할 수 있습니다.
>
{style="note"}

Dokka Gradle 플러그인(DGP)은 Gradle로 빌드된 Kotlin 프로젝트를 위한 포괄적인 API 문서를 생성하는 도구입니다.

DGP는 Kotlin의 KDoc 주석과 Java의 Javadoc 주석을 모두 원활하게 처리하여 정보를 추출하고 [HTML 또는 Javadoc](#select-documentation-output-format) 형식으로 구조화된 문서를 생성합니다.

Dokka Gradle 플러그인 v2 모드는 기본적으로 활성화되며 Gradle 모범 사례와 일치합니다.

*   Gradle 타입을 채택하여 성능이 향상됩니다.
*   저수준의 태스크 기반 설정 대신 직관적인 최상위 DSL 구성(top-level DSL configuration)을 사용하여 빌드 스크립트(build scripts)와 가독성을 단순화합니다.
*   문서 집계에 대한 선언적인 접근 방식을 채택하여 다중 프로젝트 문서 관리를 더 쉽게 만듭니다.
*   타입 안전(type-safe) 플러그인 구성을 사용하여 빌드 스크립트의 안정성과 유지 보수성을 향상시킵니다.
*   Gradle [구성 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html) 및 [빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)를 완벽하게 지원하여 성능을 향상시키고 빌드 작업을 단순화합니다.

DGP v1에서 v2 모드로의 변경 사항 및 마이그레이션에 대한 자세한 내용은 이 가이드를 읽어보세요.

## 시작하기 전에

마이그레이션을 시작하기 전에 다음 단계를 완료하세요.

### 지원되는 버전 확인

프로젝트가 최소 버전 요구 사항을 충족하는지 확인하세요.

| **도구**                                                                          | **버전**      |
|:----------------------------------------------------------------------------------|:--------------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html)      | 7.6 이상       |
| [Android Gradle plugin](https://developer.android.com/build/agp-upgrade-assistant) | 7.0 이상       |
| [Kotlin Gradle plugin](https://kotlinlang.org/docs/gradle-configure-project.html) | 1.9 이상       |

### DGP v2 활성화

프로젝트의 `build.gradle.kts` 파일에 있는 `plugins {}` 블록에서 Dokka 버전을 `%dokkaVersion%`으로 업데이트하세요.

```kotlin
plugins {
    kotlin("jvm") version "2.1.10"
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

또는 [버전 카탈로그](https://docs.gradle.org/current/userguide/platforms.html#sub:version-catalog)를 사용하여 Dokka Gradle 플러그인 v2를 활성화할 수 있습니다.

> 기본적으로 DGP v2는 HTML 형식으로 문서를 생성합니다. Javadoc 또는 HTML과 Javadoc 형식을 모두 생성하려면 적절한 플러그인을 추가하세요. 플러그인에 대한 자세한 내용은 [문서 출력 형식 선택](#select-documentation-output-format)을 참조하세요.
>
{style="tip"}

### 마이그레이션 도우미 활성화

프로젝트의 `gradle.properties` 파일에서 다음 Gradle 속성을 설정하여 도우미와 함께 DGP v2를 활성화하세요.

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2EnabledWithHelpers
```

> 프로젝트에 `gradle.properties` 파일이 없으면 프로젝트의 루트 디렉터리에 생성하세요.
>
{style="tip"}

이 속성은 마이그레이션 도우미와 함께 DGP v2 플러그인을 활성화합니다. 이 도우미는 빌드 스크립트가 DGP v2에서 더 이상 사용할 수 없는 DGP v1의 태스크를 참조할 때 컴파일 오류를 방지합니다.

> 마이그레이션 도우미가 마이그레이션을 적극적으로 돕지는 않습니다. 이는 새로운 API로 전환하는 동안 빌드 스크립트가 중단되지 않도록 할 뿐입니다.
>
{style="note"}

마이그레이션이 완료되면 [마이그레이션 도우미를 비활성화](#set-the-opt-in-flag)하세요.

### 프로젝트를 Gradle과 동기화

DGP v2 및 마이그레이션 도우미를 활성화한 후 프로젝트를 Gradle과 동기화하여 DGP v2가 올바르게 적용되었는지 확인하세요.

*   IntelliJ IDEA를 사용하는 경우 Gradle 도구 창에서 **모든 Gradle 프로젝트 다시 로드** ![Reload button](gradle-reload-button.png){width=30}{type="joined"} 버튼을 클릭하세요.
*   Android Studio를 사용하는 경우 **파일** | **Gradle 파일과 프로젝트 동기화**를 선택하세요.

## 프로젝트 마이그레이션

Dokka Gradle 플러그인을 v2로 업데이트한 후, 프로젝트에 해당하는 마이그레이션 단계를 따르세요.

### 구성 옵션 조정

DGP v2는 [Gradle 구성 옵션](dokka-gradle-configuration-options.md)에 일부 변경 사항을 도입했습니다. `build.gradle.kts` 파일에서 프로젝트 설정에 따라 구성 옵션을 조정하세요.

#### DGP v2의 최상위 DSL 구성

DGP v1의 구성 구문을 DGP v2의 최상위 `dokka {}` DSL 구성으로 대체하세요.

DGP v1에서의 구성:

```kotlin
tasks.withType<DokkaTask>().configureEach {
    suppressInheritedMembers.set(true)
    failOnWarning.set(true)
    dokkaSourceSets {
        named("main") {
            moduleName.set("Project Name")
            includes.from("README.md")
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(URL("https://example.com/src"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}

tasks.dokkaHtml {
    pluginConfiguration<DokkaBase, DokkaBaseConfiguration> {
        customStyleSheets.set(listOf("styles.css"))
        customAssets.set(listOf("logo.png"))
        footerMessage.set("(c) Your Company")
    }
}
```

DGP v2에서의 구성:

`build.gradle.kts` 파일의 구문은 Gradle의 Kotlin DSL이 타입 안전(type-safe) 접근자를 사용하기 때문에 일반 `.kt` 파일(예: 사용자 지정 Gradle 플러그인에 사용되는 파일)과 다릅니다.

<tabs group="dokka-configuration">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// build.gradle.kts

dokka {
    moduleName.set("Project Name")
    dokkaPublications.html {
        suppressInheritedMembers.set(true)
        failOnWarning.set(true)
    }
    dokkaSourceSets.main {
        includes.from("README.md")
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl("https://example.com/src")
            remoteLineSuffix.set("#L")
        }
    }
    pluginsConfiguration.html {
        customStyleSheets.from("styles.css")
        customAssets.from("logo.png")
        footerMessage.set("(c) Your Company")
    }
}
```

</tab>
<tab title="Kotlin 사용자 지정 플러그인" group-key="kotlin custom">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension
import org.jetbrains.dokka.gradle.engine.plugins.DokkaHtmlPluginParameters

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")

        project.extensions.configure(DokkaExtension::class.java) { dokka ->

            dokka.dokkaPublications.named("html") { publication ->
                publication.suppressInheritedMembers.set(true)
                publication.failOnWarning.set(true)
            }

            dokka.dokkaSourceSets.named("main") { dss ->
                dss.includes.from("README.md")
                dss.sourceLink {
                    it.localDirectory.set(project.file("src/main/kotlin"))
                    it.remoteUrl("https://example.com/src")
                    it.remoteLineSuffix.set("#L")
                }
            }

            dokka.pluginsConfiguration.named("html", DokkaHtmlPluginParameters::class.java) { html ->
                html.customStyleSheets.from("styles.css")
                html.customAssets.from("logo.png")
                html.footerMessage.set("(c) Your Company")
            }
        }
    }
}
```

</tab>
</tabs>

#### 가시성 설정

`documentedVisibilities` 속성을 `Visibility.PUBLIC`에서 `VisibilityModifier.Public`으로 설정하세요.

DGP v1에서의 구성:

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility

// ...
documentedVisibilities.set(
    setOf(Visibility.PUBLIC)
) 
```

DGP v2에서의 구성:

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

// ...
documentedVisibilities.set(
    setOf(VisibilityModifier.Public)
)

// OR

documentedVisibilities(VisibilityModifier.Public)
```

또한 DGP v2의 [유틸리티 함수](https://github.com/Kotlin/dokka/blob/v2.1.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16)를 사용하여 문서화된 가시성을 추가하세요.

```kotlin
fun documentedVisibilities(vararg visibilities: VisibilityModifier): Unit =
    documentedVisibilities.set(visibilities.asList()) 
```

#### 소스 링크

생성된 문서에서 원격 저장소의 해당 소스 코드로 탐색할 수 있도록 소스 링크를 구성하세요. 이 구성을 위해 `dokkaSourceSets.main{}` 블록을 사용하세요.

DGP v1에서의 구성:

```kotlin
tasks.withType<DokkaTask>().configureEach {
    dokkaSourceSets {
        named("main") {
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(URL("https://github.com/your-repo"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}
```

DGP v2에서의 구성:

`build.gradle.kts` 파일의 구문은 Gradle의 Kotlin DSL이 타입 안전(type-safe) 접근자를 사용하기 때문에 일반 `.kt` 파일(예: 사용자 지정 Gradle 플러그인에 사용되는 파일)과 다릅니다.

<tabs group="dokka-configuration">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// build.gradle.kts

dokka {
    dokkaSourceSets.main {
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl("https://github.com/your-repo")
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Kotlin 사용자 지정 플러그인" group-key="kotlin custom">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")
        project.extensions.configure(DokkaExtension::class.java) { dokka ->
            dokka.dokkaSourceSets.named("main") { dss ->
                dss.includes.from("README.md")
                dss.sourceLink {
                    it.localDirectory.set(project.file("src/main/kotlin"))
                    it.remoteUrl("https://example.com/src")
                    it.remoteLineSuffix.set("#L")
                }
            }
        }
    }
}
```

</tab>
</tabs>

소스 링크 구성이 [변경](https://docs.gradle.org/current/userguide/upgrading_version_8.html#deprecated_invalid_url_decoding)되었으므로, 원격 URL을 지정하려면 `URL` 클래스 대신 `URI` 클래스를 사용하세요.

DGP v1에서의 구성:

```kotlin
remoteUrl.set(URL("https://github.com/your-repo"))
```

DGP v2에서의 구성:

```kotlin
remoteUrl.set(URI("https://github.com/your-repo"))

// or

remoteUrl("https://github.com/your-repo")
```

또한 DGP v2에는 URL을 설정하기 위한 두 가지 [유틸리티 함수](https://github.com/Kotlin/dokka/blob/220922378e6c68eb148fda2ec80528a1b81478c9/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/DokkaSourceLinkSpec.kt#L82-L96)가 있습니다.

```kotlin
fun remoteUrl(@Language("http-url-reference") value: String): Unit =
    remoteUrl.set(URI(value))

// and

fun remoteUrl(value: Provider<String>): Unit =
    remoteUrl.set(value.map(::URI))
```

#### 외부 문서 링크

`register()` 메서드를 사용하여 각 링크를 정의하는 외부 문서 링크를 등록하세요. `externalDocumentationLinks` API는 Gradle DSL 규칙에 맞춰 이 메서드를 사용합니다.

DGP v1에서의 구성:

```kotlin
tasks.dokkaHtml {
    dokkaSourceSets {
        configureEach {
            externalDocumentationLink {
                url = URL("https://example.com/docs/")
                packageListUrl = File("/path/to/package-list").toURI().toURL()
            }
        }
    }
}
```

DGP v2에서의 구성:

```kotlin
dokka {
    dokkaSourceSets.configureEach {
        externalDocumentationLinks.register("example-docs") {
            url("https://example.com/docs/")
            packageListUrl("https://example.com/docs/package-list")
        }
    }
}
```

#### 사용자 정의 애셋

파일 컬렉션([`FileCollection`)](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties)을 사용하여 [`customAssets`](dokka-html.md#customize-assets) 속성을 사용하고, 목록(`var List<File>`) 대신 사용하세요.

DGP v1에서의 구성:

```kotlin
customAssets = listOf(file("example.png"), file("example2.png"))
```

DGP v2에서의 구성:

```kotlin
customAssets.from("example.png", "example2.png")
```

#### 출력 디렉터리

`dokka {}` 블록을 사용하여 생성된 Dokka 문서의 출력 디렉터리를 지정하세요.

DGP v1에서의 구성:

```kotlin
tasks.dokkaHtml {
    outputDirectory.set(layout.buildDirectory.dir("dokkaDir"))
}
```

DGP v2에서의 구성:

```kotlin
dokka {
    dokkaPublications.html {
        outputDirectory.set(layout.buildDirectory.dir("dokkaDir"))
    }
}
```

#### 추가 파일의 출력 디렉터리

`dokka {}` 블록 내에서 단일 모듈 및 다중 모듈 프로젝트 모두에 대한 출력 디렉터리를 지정하고 추가 파일을 포함하세요.

DGP v2에서는 단일 모듈 및 다중 모듈 프로젝트에 대한 구성이 통합되었습니다. `dokkaHtml` 및 `dokkaHtmlMultiModule` 태스크를 개별적으로 구성하는 대신, `dokka {}` 블록 내의 `dokkaPublications.html {}`에서 설정을 지정하세요.

다중 모듈 프로젝트의 경우, 루트 프로젝트의 구성에서 출력 디렉터리를 설정하고 추가 파일(예: `README.md`)을 포함하세요.

DGP v1에서의 구성:

```kotlin
tasks.dokkaHtmlMultiModule {
    outputDirectory.set(rootDir.resolve("docs/api/0.x"))
    includes.from(project.layout.projectDirectory.file("README.md"))
}
```

DGP v2에서의 구성:

`build.gradle.kts` 파일의 구문은 Gradle의 Kotlin DSL이 타입 안전(type-safe) 접근자를 사용하기 때문에 일반 `.kt` 파일(예: 사용자 지정 Gradle 플러그인에 사용되는 파일)과 다릅니다.

<tabs group="dokka-configuration">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// build.gradle.kts

dokka {
    dokkaPublications.html {
        outputDirectory.set(rootDir.resolve("docs/api/0.x"))
        includes.from(project.layout.projectDirectory.file("README.md"))
    }
}
```

</tab>
<tab title="Kotlin 사용자 지정 플러그인" group-key="kotlin custom">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")
        project.extensions.configure(DokkaExtension::class.java) { dokka ->
            dokka.dokkaPublications.named("html") { html ->
                html.outputDirectory.set(project.rootDir.resolve("docs/api/0.x"))
                html.includes.from(project.layout.projectDirectory.file("README.md"))
            }
        }
    }
}
```

</tab>
</tabs>

### Dokka 플러그인 구성

JSON으로 내장 Dokka 플러그인을 구성하는 방식은 타입 안전(type-safe) DSL을 선호하여 더 이상 사용되지 않습니다. 이 변경 사항은 Gradle의 증분 빌드 시스템과의 호환성을 개선하고 태스크 입력 추적을 향상시킵니다.

DGP v1에서의 구성:

DGP v1에서는 Dokka 플러그인이 JSON을 사용하여 수동으로 구성되었습니다. 이 접근 방식은 Gradle 최신 상태 확인을 위한 [태스크 입력 등록](https://docs.gradle.org/current/userguide/incremental_build.html)에서 문제를 일으켰습니다.

다음은 [Dokka 버전 관리 플러그인](https://kotl.in/dokka-versioning-plugin)에 대한 더 이상 사용되지 않는 JSON 기반 구성의 예입니다.

```kotlin
tasks.dokkaHtmlMultiModule {
    pluginsMapConfiguration.set(
        mapOf(
            "org.jetbrains.dokka.versioning.VersioningPlugin" to """
                { "version": "1.2", "olderVersionsDir": "$projectDir/dokka-docs" }
                """.trimIndent()
        )
    )
}
```

DGP v2에서의 구성:

DGP v2에서는 Dokka 플러그인이 타입 안전(type-safe) DSL을 사용하여 구성됩니다. 타입 안전(type-safe) 방식으로 Dokka 플러그인을 구성하려면 `pluginsConfiguration{}` 블록을 사용하세요.

```kotlin
dokka {
    pluginsConfiguration {
        versioning {
            version.set("1.2")
            olderVersionsDir.set(projectDir.resolve("dokka-docs"))
        }
    }
}
```

DGP v2 구성의 예시는 [Dokka의 버전 관리 플러그인](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example)을 참조하세요.

DGP v2는 [사용자 지정 플러그인을 구성](https://github.com/Kotlin/dokka/blob/ae3840edb4e4afd7b3e3768a5fddfe8ec0e08f31/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts)하여 기능을 확장할 수 있도록 합니다. 사용자 지정 플러그인은 문서 생성 프로세스에 추가 처리 또는 수정을 가능하게 합니다.

### 모듈 간 Dokka 구성 공유

DPG v2는 모듈 간에 구성을 공유하기 위해 `subprojects {}` 또는 `allprojects {}`를 사용하는 방식에서 벗어납니다. 향후 Gradle 버전에서는 이러한 접근 방식이 [오류로 이어질](https://docs.gradle.org/current/userguide/isolated_projects.html) 것입니다.

아래 단계를 따라 [기존 컨벤션 플러그인을 사용하는](#multi-module-projects-with-convention-plugins) 또는 [컨벤션 플러그인이 없는](#multi-module-projects-without-convention-plugins) 다중 모듈 프로젝트에서 Dokka 구성을 올바르게 공유하세요.

Dokka 구성을 공유한 후에는 여러 모듈의 문서를 단일 출력으로 집계할 수 있습니다. 자세한 내용은 [다중 모듈 프로젝트에서 문서 집계 업데이트](#update-documentation-aggregation-in-multi-module-projects)를 참조하세요.

> 다중 모듈 프로젝트 예시는 [Dokka GitHub 저장소](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example)를 참조하세요.
>
{style="tip"}

#### 컨벤션 플러그인이 없는 다중 모듈 프로젝트

프로젝트에서 컨벤션 플러그인을 사용하지 않는 경우에도 각 모듈을 직접 구성하여 Dokka 구성을 공유할 수 있습니다. 여기에는 각 모듈의 `build.gradle.kts` 파일에 공유 구성을 수동으로 설정하는 것이 포함됩니다. 이 접근 방식은 덜 중앙 집중적이지만, 컨벤션 플러그인과 같은 추가 설정이 필요하지 않습니다.

그렇지 않고 프로젝트에서 컨벤션 플러그인을 사용하는 경우, `buildSrc` 디렉터리에 컨벤션 플러그인을 생성한 다음 모듈(하위 프로젝트)에 플러그인을 적용하여 다중 모듈 프로젝트에서 Dokka 구성을 공유할 수도 있습니다.

##### buildSrc 디렉터리 설정

1.  프로젝트 루트에 다음 두 파일이 포함된 `buildSrc` 디렉터리를 생성하세요.

    *   `settings.gradle.kts`
    *   `build.gradle.kts`

2.  `buildSrc/settings.gradle.kts` 파일에 다음 스니펫을 추가하세요.

    ```kotlin
    rootProject.name = "buildSrc"
    ```

3.  `buildSrc/build.gradle.kts` 파일에 다음 스니펫을 추가하세요.

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

`buildSrc` 디렉터리를 설정한 후:

1.  [컨벤션 플러그인](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)을 호스팅할 `buildSrc/src/main/kotlin/dokka-convention.gradle.kts` 파일을 생성하세요.
2.  `dokka-convention.gradle.kts` 파일에 다음 스니펫을 추가하세요.

    ```kotlin
    plugins {
        id("org.jetbrains.dokka") 
    }

    dokka {
        // The shared configuration goes here
    }
    ```

    모든 하위 프로젝트에 공통된 공유 Dokka [구성](#adjust-configuration-options)을 `dokka {}` 블록 내에 추가해야 합니다. 또한 Dokka 버전을 지정할 필요가 없습니다. 버전은 `buildSrc/build.gradle.kts` 파일에 이미 설정되어 있습니다.

##### 모듈에 컨벤션 플러그인 적용

각 하위 프로젝트의 `build.gradle.kts` 파일에 추가하여 Dokka 컨벤션 플러그인을 모듈(하위 프로젝트) 전체에 적용하세요.

```kotlin
plugins {
    id("dokka-convention")
}
```

#### 컨벤션 플러그인을 사용하는 다중 모듈 프로젝트

이미 컨벤션 플러그인을 가지고 있다면, [Gradle 문서](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)를 따라 전용 Dokka 컨벤션 플러그인을 생성하세요.

그런 다음 [Dokka 컨벤션 플러그인 설정](#set-up-the-dokka-convention-plugin) 및 [모듈 전체에 적용](#apply-the-convention-plugin-to-your-subprojects)하는 단계를 따르세요.

### 다중 모듈 프로젝트에서 문서 집계 업데이트

Dokka는 여러 모듈(하위 프로젝트)의 문서를 단일 출력 또는 발행물로 집계할 수 있습니다.

[설명된 바와 같이](#apply-the-convention-plugin-to-your-subprojects), 문서를 집계하기 전에 모든 문서화 가능한 하위 프로젝트에 Dokka 플러그인을 적용하세요.

DGP v2의 집계는 태스크 대신 `dependencies {}` 블록을 사용하며, 모든 `build.gradle.kts` 파일에 추가할 수 있습니다.

DGP v1에서는 집계가 루트 프로젝트에 암묵적으로 생성되었습니다. DGP v2에서 이 동작을 재현하려면 루트 프로젝트의 `build.gradle.kts` 파일에 `dependencies {}` 블록을 추가하세요.

DGP v1에서의 집계:

```kotlin
    tasks.dokkaHtmlMultiModule {
        // ...
    }
```

DGP v2에서의 집계:

```kotlin
dependencies {
    dokka(project(":some-subproject:"))
    dokka(project(":another-subproject:"))
}
```

### 집계된 문서의 디렉터리 변경

DGP가 모듈을 집계할 때, 각 하위 프로젝트는 집계된 문서 내에 자체 하위 디렉터리를 가집니다.

DGP v2에서는 집계 메커니즘이 Gradle 규칙과 더 잘 일치하도록 업데이트되었습니다. DGP v2는 이제 어떤 위치에서든 문서를 집계할 때 충돌을 방지하기 위해 전체 하위 프로젝트 디렉터리를 보존합니다.

DGP v1에서의 집계 디렉터리:

DGP v1에서는 집계된 문서가 축소된 디렉터리 구조에 배치되었습니다. 예를 들어, `:turbo-lib`에 집계가 있고 중첩된 하위 프로젝트 `:turbo-lib:maths`가 있는 프로젝트의 경우 생성된 문서는 다음 위치에 배치되었습니다.

```text
turbo-lib/build/dokka/html/maths/
```

DGP v2에서의 집계 디렉터리:

DGP v2는 전체 프로젝트 구조를 유지함으로써 각 하위 프로젝트가 고유한 디렉터리를 갖도록 보장합니다. 이제 동일한 집계된 문서는 이 구조를 따릅니다.

```text
turbo-lib/build/dokka/html/turbo-lib/maths/
```

이 변경 사항은 이름이 같은 하위 프로젝트가 충돌하는 것을 방지합니다. 그러나 디렉터리 구조가 변경되었으므로 외부 링크가 오래되어 `404` 오류가 발생할 수 있습니다.

#### DGP v1 디렉터리 동작으로 되돌리기

프로젝트가 DGP v1에서 사용된 디렉터리 구조에 의존하는 경우, 모듈 디렉터리를 수동으로 지정하여 이 동작을 되돌릴 수 있습니다. 각 하위 프로젝트의 `build.gradle.kts` 파일에 다음 구성을 추가하세요.

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // Overrides the subproject directory to match the V1 structure
    modulePath.set("maths")
}
```

### 업데이트된 태스크로 문서 생성

DGP v2는 API 문서를 생성하는 Gradle 태스크의 이름을 변경했습니다.

DGP v1에서의 태스크:

```text
./gradlew dokkaHtml

// or

./gradlew dokkaHtmlMultiModule
```

DGP v2에서의 태스크:

```text
./gradlew :dokkaGenerate
```

`dokkaGenerate` 태스크는 `build/dokka/` 디렉터리에 API 문서를 생성합니다.

DGP v2 버전에서 `dokkaGenerate` 태스크 이름은 단일 및 다중 모듈 프로젝트 모두에서 작동합니다. HTML, Javadoc 또는 HTML과 Javadoc 모두로 출력을 생성하기 위해 다른 태스크를 사용할 수 있습니다. 자세한 내용은 [문서 출력 형식 선택](#select-documentation-output-format)을 참조하세요.

### 문서 출력 형식 선택

> Javadoc 출력 형식은 [알파](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 버전입니다. 이를 사용할 때 버그를 발견하고 마이그레이션 문제가 발생할 수 있습니다. Javadoc을 입력으로 받아들이는 도구와의 성공적인 통합은 보장되지 않습니다. 자신의 책임 하에 사용하세요.
>
{style="warning"}

DGP v2의 기본 출력 형식은 HTML입니다. 그러나 API 문서를 HTML, Javadoc 또는 두 가지 형식 모두로 동시에 생성하도록 선택할 수 있습니다.

1.  프로젝트의 `build.gradle.kts` 파일의 `plugins {}` 블록에 해당 플러그인 `id`를 배치하세요.

    ```kotlin
    plugins {
        // Generates HTML documentation
        id("org.jetbrains.dokka") version "%dokkaVersion%"

        // Generates Javadoc documentation
        id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"

        // Keeping both plugin IDs generates both formats
    }
    ```

2.  해당 Gradle 태스크를 실행하세요.

다음은 각 형식에 해당하는 플러그인 `id` 및 Gradle 태스크 목록입니다.

|             | **HTML**                       | **Javadoc**                         | **모두**                          |
|:------------|:-------------------------------|:------------------------------------|:----------------------------------|
| 플러그인 `id` | `id("org.jetbrains.dokka")`    | `id("org.jetbrains.dokka-javadoc")` | HTML 및 Javadoc 플러그인 모두 사용 |
| Gradle 태스크 | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc` | `./gradlew :dokkaGenerate`        |

> `dokkaGenerate` 태스크는 적용된 플러그인에 따라 사용 가능한 모든 형식으로 문서를 생성합니다. HTML 및 Javadoc 플러그인이 모두 적용된 경우, `dokkaGeneratePublicationHtml` 태스크를 실행하여 HTML만 생성하거나 `dokkaGeneratePublicationJavadoc` 태스크를 실행하여 Javadoc만 생성하도록 선택할 수 있습니다.
>
{style="tip"}

IntelliJ IDEA를 사용 중인 경우, `dokkaGenerateHtml` Gradle 태스크를 볼 수 있습니다. 이 태스크는 `dokkaGeneratePublicationHtml`의 별칭일 뿐입니다. 두 태스크 모두 정확히 동일한 작업을 수행합니다.

### 사용 중단 및 제거 사항 처리

*   **출력 형식 지원:** DGP v2는 HTML 및 Javadoc 출력만 지원합니다. Markdown 및 Jekyll과 같은 실험적 형식은 더 이상 지원되지 않습니다.
*   **Collector 태스크:** `DokkaCollectorTask`가 제거되었습니다. 이제 각 하위 프로젝트에 대해 별도로 문서를 생성한 다음 필요한 경우 [문서를 집계](#update-documentation-aggregation-in-multi-module-projects)해야 합니다.

## 마이그레이션 마무리

프로젝트를 마이그레이션한 후, 이 단계를 수행하여 마이그레이션을 마무리하고 성능을 개선하세요.

### 옵트인(opt-in) 플래그 설정

마이그레이션이 성공적으로 완료되면 프로젝트의 `gradle.properties` 파일에 다음 옵트인(opt-in) 플래그를 도우미 없이 설정하세요.

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2Enabled
```

DGP v2에서 더 이상 사용할 수 없는 DGP v1의 Gradle 태스크에 대한 참조를 제거했다면, 이와 관련된 컴파일 오류가 발생하지 않을 것입니다.

### 빌드 캐시 및 구성 캐시 활성화

DGP v2는 이제 Gradle 빌드 캐시와 구성 캐시를 지원하여 빌드 성능을 향상시킵니다.

*   빌드 캐시를 활성화하려면 [Gradle 빌드 캐시 문서](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable)의 지침을 따르세요.
*   구성 캐시를 활성화하려면 [Gradle 구성 캐시 문서](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable)의 지침을 따르세요.

## 다음 단계

*   [더 많은 DGP v2 프로젝트 예시 살펴보기](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2).
*   [Dokka 시작하기](dokka-get-started.md).
*   [Dokka 플러그인에 대해 더 알아보기](dokka-plugins.md).