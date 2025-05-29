[//]: # (title: Dokka Gradle 플러그인 v2로 마이그레이션)

> Dokka Gradle 플러그인 v2는 [실험적 기능](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained)입니다.
> 이 기능은 언제든지 변경될 수 있습니다. [GitHub](https://github.com/Kotlin/dokka/issues)에서 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Dokka Gradle 플러그인 (DGP)은 Gradle로 빌드된 Kotlin 프로젝트를 위한 종합적인 API 문서를 생성하는 도구입니다.

DGP는 Kotlin의 KDoc 주석과 Java의 Javadoc 주석을 원활하게 처리하며 정보를 추출하고 [HTML 또는 Javadoc](#select-documentation-output-format) 형식으로 구조화된 문서를 생성합니다.

Dokka 2.0.0부터 DGP의 새로운 버전인 Dokka Gradle 플러그인 v2를 사용해 볼 수 있습니다. Dokka 2.0.0을 사용하면 Dokka Gradle 플러그인을 v1 또는 v2 모드에서 사용할 수 있습니다.

DGP v2는 DGP에 상당한 개선 사항을 도입하여 Gradle 모범 사례에 더 가깝게 정렬합니다:

*   Gradle 타입을 채택하여 성능이 향상됩니다.
*   하위 수준의 작업 기반 설정 대신 직관적인 최상위 DSL 구성을 사용하여 빌드 스크립트를 단순화하고 가독성을 높입니다.
*   문서 통합에 보다 선언적인 접근 방식을 취하여 다중 프로젝트 문서 관리를 용이하게 합니다.
*   타입 안정성 플러그인 구성을 사용하여 빌드 스크립트의 신뢰성과 유지보수성을 향상시킵니다.
*   Gradle [구성 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html) 및 [빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)를 완벽하게 지원하여 성능을 향상하고 빌드 작업을 단순화합니다.

## 시작하기 전에

마이그레이션을 시작하기 전에 다음 단계를 완료하세요.

### 지원되는 버전 확인

프로젝트가 최소 버전 요구 사항을 충족하는지 확인하세요:

| **도구**                                                                          | **버전**     |
|:----------------------------------------------------------------------------------|:-------------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html)      | 7.6 이상     |
| [Android Gradle 플러그인](https://developer.android.com/build/agp-upgrade-assistant) | 7.0 이상     |
| [Kotlin Gradle 플러그인](https://kotlinlang.org/docs/gradle-configure-project.html) | 1.9 이상     |

### DGP v2 활성화

프로젝트의 `build.gradle.kts` 파일의 `plugins {}` 블록에서 Dokka 버전을 2.0.0으로 업데이트하세요:

```kotlin
plugins {
    kotlin("jvm") version "2.1.10"
    id("org.jetbrains.dokka") version "2.0.0"
}
```

또는 [버전 카탈로그](https://docs.gradle.org/current/userguide/platforms.html#sub:version-catalog)를 사용하여 Dokka Gradle 플러그인 v2를 활성화할 수 있습니다.

> 기본적으로 DGP v2는 HTML 형식으로 문서를 생성합니다. Javadoc 또는 HTML과 Javadoc 형식을 모두 생성하려면 해당 플러그인을 추가하세요. 플러그인에 대한 자세한 내용은 [문서 출력 형식 선택](#select-documentation-output-format)을 참조하세요.
>
{style="tip"}

### 마이그레이션 헬퍼 활성화

프로젝트의 `gradle.properties` 파일에서 다음 Gradle 속성을 설정하여 헬퍼와 함께 DGP v2를 활성화하세요:

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2EnabledWithHelpers
```

> 프로젝트에 `gradle.properties` 파일이 없으면 프로젝트의 루트 디렉터리에 생성하세요.
>
{style="tip"}

이 속성은 마이그레이션 헬퍼와 함께 DGP v2 플러그인을 활성화합니다. 이 헬퍼는 빌드 스크립트가 DGP v2에서 더 이상 사용할 수 없는 DGP v1의 작업을 참조할 때 컴파일 오류를 방지합니다.

> 마이그레이션 헬퍼가 마이그레이션을 적극적으로 지원하지는 않습니다. 이들은 새 API로 전환하는 동안 빌드 스크립트가 손상되지 않도록만 합니다.
>
{style="note"}

마이그레이션 완료 후, [마이그레이션 헬퍼를 비활성화](#set-the-opt-in-flag)하세요.

### Gradle과 프로젝트 동기화

DGP v2 및 마이그레이션 헬퍼를 활성화한 후, Gradle과 프로젝트를 동기화하여 DGP v2가 올바르게 적용되었는지 확인하세요:

*   IntelliJ IDEA를 사용하는 경우 Gradle 도구 창에서 **모든 Gradle 프로젝트 다시 로드** ![Reload button](gradle-reload-button.png){width=30}{type="joined"} 버튼을 클릭합니다.
*   Android Studio를 사용하는 경우 **File** | **Sync Project with Gradle Files**를 선택합니다.

## 프로젝트 마이그레이션

Dokka Gradle 플러그인을 v2로 업데이트한 후, 프로젝트에 해당하는 마이그레이션 단계를 따르세요.

### 구성 옵션 조정

DGP v2는 [Gradle 구성 옵션](dokka-gradle.md#configuration-options)에 일부 변경 사항을 도입합니다. `build.gradle.kts` 파일에서 프로젝트 설정에 따라 구성 옵션을 조정하세요.

#### DGP v2의 최상위 DSL 구성

DGP v1의 구성 구문을 DGP v2의 최상위 `dokka {}` DSL 구성으로 대체하세요:

DGP v1의 구성:

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

DGP v2의 구성:

`build.gradle.kts` 파일의 구문은 Gradle의 Kotlin DSL이 타입 안전 접근자(type-safe accessors)를 사용하기 때문에 일반 `.kt` 파일(예: 사용자 정의 Gradle 플러그인에 사용되는 파일)과 다릅니다.

<tabs group="dokka-configuration">
<tab title="Gradle 구성 파일" group-key="gradle">

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
<tab title="Kotlin 파일" group-key="kotlin">

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

DGP v1의 구성:

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility

// ...
documentedVisibilities.set(
    setOf(Visibility.PUBLIC)
) 
```

DGP v2의 구성:

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

// ...
documentedVisibilities.set(
    setOf(VisibilityModifier.Public)
)

// OR

documentedVisibilities(VisibilityModifier.Public)
```

또한, 문서화된 가시성을 추가하려면 DGP v2의 [유틸리티 함수](https://github.com/Kotlin/dokka/blob/v2.0.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16)를 사용하세요:

```kotlin
fun documentedVisibilities(vararg visibilities: VisibilityModifier): Unit =
    documentedVisibilities.set(visibilities.asList()) 
```

#### 소스 링크

생성된 문서에서 원격 저장소의 해당 소스 코드로 이동할 수 있도록 소스 링크를 구성하세요. 이 구성에는 `dokkaSourceSets.main{}` 블록을 사용하세요.

DGP v1의 구성:

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

DGP v2의 구성:

`build.gradle.kts` 파일의 구문은 Gradle의 Kotlin DSL이 타입 안전 접근자(type-safe accessors)를 사용하기 때문에 일반 `.kt` 파일(예: 사용자 정의 Gradle 플러그인에 사용되는 파일)과 다릅니다.

<tabs group="dokka-configuration">
<tab title="Gradle 구성 파일" group-key="gradle">

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
<tab title="Kotlin 파일" group-key="kotlin">

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

소스 링크 구성이 [변경](https://docs.gradle.org/current/userguide/upgrading_version_8.html#deprecated_invalid_url_decoding)되었으므로, 원격 URL을 지정할 때 `URL` 클래스 대신 `URI` 클래스를 사용하세요.

DGP v1의 구성:

```kotlin
remoteUrl.set(URL("https://github.com/your-repo"))
```

DGP v2의 구성:

```kotlin
remoteUrl.set(URI("https://github.com/your-repo"))

// or

remoteUrl("https://github.com/your-repo")
```

또한, DGP v2는 URL 설정을 위한 두 가지 [유틸리티 함수](https://github.com/Kotlin/dokka/blob/220922378e6c68eb148fda2ec80528a1b81478c9/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/DokkaSourceLinkSpec.kt#L82-L96)를 제공합니다:

```kotlin
fun remoteUrl(@Language("http-url-reference") value: String): Unit =
    remoteUrl.set(URI(value))

// and

fun remoteUrl(value: Provider<String>): Unit =
    remoteUrl.set(value.map(::URI))
```

#### 외부 문서 링크

`register()` 메서드를 사용하여 각 링크를 정의하여 외부 문서 링크를 등록하세요. `externalDocumentationLinks` API는 Gradle DSL 규칙에 맞춰 이 메서드를 사용합니다.

DGP v1의 구성:

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

DGP v2의 구성:

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

리스트(`var List<File>`) 대신 파일 컬렉션([`FileCollection`](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties))과 함께 [`customAssets`](dokka-html.md#customize-assets) 속성을 사용하세요.

DGP v1의 구성:

```kotlin
customAssets = listOf(file("example.png"), file("example2.png"))
```

DGP v2의 구성:

```kotlin
customAssets.from("example.png", "example2.png")
```

#### 출력 디렉터리

생성된 Dokka 문서의 출력 디렉터리를 지정하려면 `dokka {}` 블록을 사용하세요.

DGP v1의 구성:

```kotlin
tasks.dokkaHtml {
    outputDirectory.set(layout.buildDirectory.dir("dokkaDir"))
}
```

DGP v2의 구성:

```kotlin
dokka {
    dokkaPublications.html {
        outputDirectory.set(layout.buildDirectory.dir("dokkaDir"))
    }
}
```

#### 추가 파일의 출력 디렉터리

`dokka {}` 블록 내에서 단일 모듈 및 다중 모듈 프로젝트 모두에 대한 출력 디렉터리를 지정하고 추가 파일을 포함하세요.

DGP v2에서는 단일 모듈 및 다중 모듈 프로젝트 구성이 통합되었습니다. `dokkaHtml` 및 `dokkaHtmlMultiModule` 작업을 개별적으로 구성하는 대신, `dokka {}` 블록 내의 `dokkaPublications.html {}`에서 설정을 지정하세요.

다중 모듈 프로젝트의 경우 루트 프로젝트의 구성에서 출력 디렉터리를 설정하고 추가 파일(예: `README.md`)을 포함하세요.

DGP v1의 구성:

```kotlin
tasks.dokkaHtmlMultiModule {
    outputDirectory.set(rootDir.resolve("docs/api/0.x"))
    includes.from(project.layout.projectDirectory.file("README.md"))
}
```

DGP v2의 구성:

`build.gradle.kts` 파일의 구문은 Gradle의 Kotlin DSL이 타입 안전 접근자(type-safe accessors)를 사용하기 때문에 일반 `.kt` 파일(예: 사용자 정의 Gradle 플러그인에 사용되는 파일)과 다릅니다.

<tabs group="dokka-configuration">
<tab title="Gradle 구성 파일" group-key="gradle">

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
<tab title="Kotlin 파일" group-key="kotlin">

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

JSON을 사용하여 내장 Dokka 플러그인을 구성하는 방식은 타입 안전 DSL을 선호하여 사용 중단되었습니다. 이 변경 사항은 Gradle의 증분 빌드 시스템과의 호환성을 개선하고 작업 입력 추적을 향상시킵니다.

DGP v1의 구성:

DGP v1에서는 Dokka 플러그인이 JSON을 사용하여 수동으로 구성되었습니다. 이 방식은 Gradle 최신 상태 확인을 위한 [작업 입력 등록](https://docs.gradle.org/current/userguide/incremental_build.html)에 문제를 일으켰습니다.

다음은 [Dokka Versioning 플러그인](https://kotl.in/dokka-versioning-plugin)에 대한 사용 중단된 JSON 기반 구성의 예시입니다:

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

DGP v2의 구성:

DGP v2에서는 Dokka 플러그인이 타입 안전 DSL을 사용하여 구성됩니다. 타입 안전 방식으로 Dokka 플러그인을 구성하려면 `pluginsConfiguration{}` 블록을 사용하세요:

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

Dokka 2.0.0은 [사용자 정의 플러그인 구성](https://github.com/Kotlin/dokka/blob/ae3840edb4e4afd7b3e3768a5fddfe8ec0e08f31/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts)을 통해 기능을 확장할 수 있도록 합니다. 사용자 정의 플러그인은 문서 생성 프로세스에 추가 처리 또는 수정을 가능하게 합니다.

### 모듈 간 Dokka 구성 공유

DPG v2는 모듈 간에 구성을 공유하기 위해 `subprojects {}` 또는 `allprojects {}`를 사용하는 방식에서 벗어납니다. 향후 Gradle 버전에서는 이러한 접근 방식을 사용하면 [오류가 발생](https://docs.gradle.org/current/userguide/isolated_projects.html)할 수 있습니다.

기존 [컨벤션 플러그인을 사용하는 다중 모듈 프로젝트](#multi-module-projects-with-convention-plugins) 또는 [컨벤션 플러그인이 없는 다중 모듈 프로젝트](#multi-module-projects-without-convention-plugins)에서 Dokka 구성을 올바르게 공유하려면 아래 단계를 따르세요.

Dokka 구성을 공유한 후, 여러 모듈의 문서를 단일 출력으로 통합할 수 있습니다. 자세한 내용은 [다중 모듈 프로젝트에서 문서 통합 업데이트](#update-documentation-aggregation-in-multi-module-projects)를 참조하세요.

> 다중 모듈 프로젝트 예시는 [Dokka GitHub 저장소](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example)를 참조하세요.
>
{style="tip"}

#### 컨벤션 플러그인이 없는 다중 모듈 프로젝트

프로젝트가 컨벤션 플러그인을 사용하지 않는 경우에도 각 모듈을 직접 구성하여 Dokka 구성을 공유할 수 있습니다. 이는 각 모듈의 `build.gradle.kts` 파일에 공유 구성을 수동으로 설정하는 것을 포함합니다. 이 방식은 중앙 집중화가 덜하지만, 컨벤션 플러그인과 같은 추가 설정이 필요 없다는 장점이 있습니다.

그렇지 않고 프로젝트가 컨벤션 플러그인을 사용하는 경우, `buildSrc` 디렉터리에 컨벤션 플러그인을 생성한 다음 해당 플러그인을 모듈(서브프로젝트)에 적용하여 다중 모듈 프로젝트에서 Dokka 구성을 공유할 수도 있습니다.

##### buildSrc 디렉터리 설정

1.  프로젝트 루트에 다음 두 파일을 포함하는 `buildSrc` 디렉터리를 생성합니다:
    *   `settings.gradle.kts`
    *   `build.gradle.kts`

2.  `buildSrc/settings.gradle.kts` 파일에 다음 스니펫을 추가하세요:

    ```kotlin
    rootProject.name = "buildSrc"
    ```

3.  `buildSrc/build.gradle.kts` 파일에 다음 스니펫을 추가하세요:

    ```kotlin
    plugins {
        `kotlin-dsl`
    }
    
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
    
    dependencies {
        implementation("org.jetbrains.dokka:dokka-gradle-plugin:2.0.0")
    }   
    ```

##### Dokka 컨벤션 플러그인 설정

`buildSrc` 디렉터리를 설정한 후:

1.  [컨벤션 플러그인](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)을 호스팅하기 위해 `buildSrc/src/main/kotlin/dokka-convention.gradle.kts` 파일을 생성합니다.
2.  `dokka-convention.gradle.kts` 파일에 다음 스니펫을 추가하세요:

    ```kotlin
    plugins {
        id("org.jetbrains.dokka") 
    }

    dokka {
        // The shared configuration goes here
    }
    ```

    `dokka {}` 블록 내에 모든 서브프로젝트에 공통으로 적용되는 공유 Dokka [구성](#adjust-configuration-options)을 추가해야 합니다. 또한, Dokka 버전을 지정할 필요가 없습니다. 버전은 `buildSrc/build.gradle.kts` 파일에 이미 설정되어 있습니다.

##### 모듈에 컨벤션 플러그인 적용

각 서브프로젝트의 `build.gradle.kts` 파일에 Dokka 컨벤션 플러그인을 추가하여 모듈(서브프로젝트) 전체에 적용하세요:

```kotlin
plugins {
    id("dokka-convention")
}
```

#### 컨벤션 플러그인이 있는 다중 모듈 프로젝트

이미 컨벤션 플러그인을 사용하는 경우, [Gradle 문서](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)에 따라 전용 Dokka 컨벤션 플러그인을 생성하세요.

그 다음, [Dokka 컨벤션 플러그인 설정](#set-up-the-dokka-convention-plugin) 및 [모듈에 적용](#apply-the-convention-plugin-to-your-modules) 단계를 따르세요.

### 다중 모듈 프로젝트에서 문서 통합 업데이트

Dokka는 여러 모듈(서브프로젝트)의 문서를 단일 출력 또는 발행물로 통합할 수 있습니다.

[설명](#apply-the-convention-plugin-to-your-modules)된 바와 같이, 문서 통합 전에 모든 문서화 가능한 서브프로젝트에 Dokka 플러그인을 적용하세요.

DGP v2의 통합은 작업 대신 `dependencies {}` 블록을 사용하며, 모든 `build.gradle.kts` 파일에 추가할 수 있습니다.

DGP v1에서는 통합이 루트 프로젝트에 암묵적으로 생성되었습니다. DGP v2에서 이 동작을 재현하려면 루트 프로젝트의 `build.gradle.kts` 파일에 `dependencies {}` 블록을 추가하세요.

DGP v1의 통합:

```kotlin
    tasks.dokkaHtmlMultiModule {
        // ...
    }
```

DGP v2의 통합:

```kotlin
dependencies {
    dokka(project(":some-subproject:"))
    dokka(project(":another-subproject:"))
}
```

### 통합된 문서의 디렉터리 변경

DGP가 모듈을 통합할 때, 각 서브프로젝트는 통합된 문서 내에 자체 하위 디렉터리를 가집니다.

DGP v2에서는 통합 메커니즘이 Gradle 규칙에 더 잘 맞도록 업데이트되었습니다. DGP v2는 이제 어떤 위치에서든 문서를 통합할 때 충돌을 방지하기 위해 전체 서브프로젝트 디렉터리를 보존합니다.

DGP v1의 통합 디렉터리:

DGP v1에서는 통합된 문서가 축소된 디렉터리 구조로 배치되었습니다. 예를 들어, `:turbo-lib`에 통합이 있고 중첩된 서브프로젝트 `:turbo-lib:maths`가 있는 프로젝트의 경우, 생성된 문서는 다음 위치에 배치되었습니다:

```text
turbo-lib/build/dokka/html/maths/
```

DGP v2의 통합 디렉터리:

DGP v2는 전체 프로젝트 구조를 유지하여 각 서브프로젝트가 고유한 디렉터리를 갖도록 합니다. 동일한 통합된 문서는 이제 다음 구조를 따릅니다:

```text
turbo-lib/build/dokka/html/turbo-lib/maths/
```

이 변경으로 인해 동일한 이름을 가진 서브프로젝트 간의 충돌이 방지됩니다. 그러나 디렉터리 구조가 변경되었으므로 외부 링크가 오래되어 `404` 오류가 발생할 수 있습니다.

#### DGP v1 디렉터리 동작으로 되돌리기

프로젝트가 DGP v1에서 사용된 디렉터리 구조에 의존하는 경우, 모듈 디렉터리를 수동으로 지정하여 이 동작을 되돌릴 수 있습니다. 각 서브프로젝트의 `build.gradle.kts` 파일에 다음 구성을 추가하세요:

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // Overrides the module directory to match the V1 structure
    modulePath.set("maths")
}
```

### 업데이트된 작업으로 문서 생성

DGP v2는 API 문서를 생성하는 Gradle 작업의 이름을 변경했습니다.

DGP v1의 작업:

```text
./gradlew dokkaHtml

// or

./gradlew dokkaHtmlMultiModule
```

DGP v2의 작업:

```text
./gradlew :dokkaGenerate
```

`dokkaGenerate` 작업은 `build/dokka/` 디렉터리에 API 문서를 생성합니다.

DGP v2 버전에서 `dokkaGenerate` 작업 이름은 단일 및 다중 모듈 프로젝트 모두에 적용됩니다. HTML, Javadoc 또는 HTML과 Javadoc을 모두 출력하도록 다른 작업을 사용할 수 있습니다. 자세한 내용은 [문서 출력 형식 선택](#select-documentation-output-format)을 참조하세요.

### 문서 출력 형식 선택

> Javadoc 출력 형식은 [알파](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 단계입니다.
> 사용 시 버그가 발생하거나 마이그레이션 문제가 발생할 수 있습니다. Javadoc을 입력으로 받는 도구와의 성공적인 통합은 보장되지 않습니다. 사용에 따른 위험은 사용자 본인에게 있습니다.
>
{style="note"}

DGP v2의 기본 출력 형식은 HTML입니다. 그러나 API 문서를 HTML, Javadoc 또는 두 가지 형식으로 동시에 생성하도록 선택할 수 있습니다:

1.  프로젝트의 `build.gradle.kts` 파일의 `plugins {}` 블록에 해당 플러그인 `id`를 배치하세요:

    ```kotlin
    plugins {
        // HTML 문서 생성
        id("org.jetbrains.dokka") version "2.0.0"

        // Javadoc 문서 생성
        id("org.jetbrains.dokka-javadoc") version "2.0.0"

        // 두 플러그인 ID를 모두 유지하면 두 형식이 모두 생성됩니다.
    }
    ```

2.  해당 Gradle 작업을 실행하세요.

각 형식에 해당하는 플러그인 `id` 및 Gradle 작업 목록은 다음과 같습니다:

|             | **HTML**                             | **Javadoc**                          | **모두**                             |
|:------------|:-------------------------------------|:-------------------------------------|:-----------------------------------|
| 플러그인 `id` | `id("org.jetbrains.dokka")`          | `id("org.jetbrains.dokka-javadoc")`  | HTML 및 Javadoc 플러그인 모두 사용 |
| Gradle 작업 | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc` | `./gradlew :dokkaGenerate`         |

> `dokkaGenerate` 작업은 적용된 플러그인에 따라 사용 가능한 모든 형식으로 문서를 생성합니다. HTML 및 Javadoc 플러그인이 모두 적용된 경우, `dokkaGeneratePublicationHtml` 작업을 실행하여 HTML만 생성하거나 `dokkaGeneratePublicationJavadoc` 작업을 실행하여 Javadoc만 생성하도록 선택할 수 있습니다.
>
{style="tip"}

### 사용 중단 및 제거 사항 처리

*   **출력 형식 지원:** Dokka 2.0.0은 HTML 및 Javadoc 출력만 지원합니다. Markdown 및 Jekyll과 같은 실험적 형식은 더 이상 지원되지 않습니다.
*   **수집기 작업:** `DokkaCollectorTask`가 제거되었습니다. 이제 각 서브프로젝트에 대해 문서를 개별적으로 생성한 다음, 필요한 경우 [문서를 통합](#update-documentation-aggregation-in-multi-module-projects)해야 합니다.

## 마이그레이션 마무리

프로젝트 마이그레이션이 완료되면 다음 단계를 수행하여 마무리를 하고 성능을 향상시키세요.

### 옵트인 플래그 설정

마이그레이션 성공 후, 프로젝트의 `gradle.properties` 파일에 헬퍼 없이 다음 옵트인 플래그를 설정하세요:

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2Enabled
```

DGP v2에서 더 이상 사용할 수 없는 DGP v1의 Gradle 작업 참조를 제거했다면, 이와 관련된 컴파일 오류가 발생하지 않아야 합니다.

### 빌드 캐시 및 구성 캐시 활성화

DGP v2는 이제 Gradle 빌드 캐시 및 구성 캐시를 지원하여 빌드 성능을 향상시킵니다.

*   빌드 캐시를 활성화하려면 [Gradle 빌드 캐시 문서](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable)의 지침을 따르세요.
*   구성 캐시를 활성화하려면 [Gradle 구성 캐시 문서](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable)의 지침을 따르세요.

## 문제 해결

대규모 프로젝트에서 Dokka는 문서를 생성하는 데 상당한 양의 메모리를 소비할 수 있습니다. 이는 특히 대량의 데이터를 처리할 때 Gradle의 메모리 한도를 초과할 수 있습니다.

Dokka 생성 중 메모리가 부족하면 빌드가 실패하고 Gradle은 `java.lang.OutOfMemoryError: Metaspace`와 같은 예외를 throw할 수 있습니다.

Dokka의 성능을 향상시키기 위한 노력이 활발히 진행 중이지만, 일부 제약은 Gradle에서 비롯됩니다.

메모리 문제가 발생하면 다음 해결 방법을 시도해 보세요:

*   [힙 공간 늘리기](#increase-heap-space)
*   [Gradle 프로세스 내에서 Dokka 실행](#run-dokka-within-the-gradle-process)

### 힙 공간 늘리기

메모리 문제를 해결하는 한 가지 방법은 Dokka 생성기 프로세스에 할당된 Java 힙 메모리 양을 늘리는 것입니다. `build.gradle.kts` 파일에서 다음 구성 옵션을 조정하세요:

```kotlin
    dokka {
        // Dokka는 Gradle이 관리하는 새 프로세스를 생성합니다.
        dokkaGeneratorIsolation = ProcessIsolation {
            // 힙 크기 구성
            maxHeapSize = "4g"
        }
    }
```

이 예시에서는 최대 힙 크기가 4GB (`"4g"`)로 설정되어 있습니다. 빌드에 최적의 설정을 찾기 위해 값을 조정하고 테스트하세요.

만약 Dokka가 Gradle 자체의 메모리 사용량보다 훨씬 더 많은 힙 공간을 필요로 한다고 판단되면, [Dokka의 GitHub 저장소에 이슈를 생성](https://kotl.in/dokka-issues)해 주세요.

> 이 구성을 각 서브프로젝트에 적용해야 합니다. 모든 서브프로젝트에 적용되는 컨벤션 플러그인에서 Dokka를 구성하는 것이 좋습니다.
>
{style="note"}

### Gradle 프로세스 내에서 Dokka 실행

Gradle 빌드와 Dokka 생성 모두 많은 메모리를 필요로 할 때, 이들이 별도의 프로세스로 실행되어 단일 머신에서 상당한 메모리를 소비할 수 있습니다.

메모리 사용량을 최적화하려면 Dokka를 별도의 프로세스로 실행하는 대신 동일한 Gradle 프로세스 내에서 실행할 수 있습니다. 이를 통해 각 프로세스에 메모리를 개별적으로 할당하는 대신 Gradle에 대한 메모리를 한 번에 구성할 수 있습니다.

Dokka를 동일한 Gradle 프로세스 내에서 실행하려면 `build.gradle.kts` 파일에서 다음 구성 옵션을 조정하세요:

```kotlin
    dokka {
        // 현재 Gradle 프로세스에서 Dokka 실행
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

[힙 공간 늘리기](#increase-heap-space)와 마찬가지로, 이 구성이 프로젝트에 잘 작동하는지 테스트하세요.

Gradle의 JVM 메모리 구성에 대한 자세한 내용은 [Gradle 문서](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)를 참조하세요.

> Gradle의 Java 옵션을 변경하면 새 Gradle 데몬이 시작되며, 이 데몬은 오랫동안 활성 상태를 유지할 수 있습니다. [다른 Gradle 프로세스를 수동으로 중지](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)할 수 있습니다.
>
> 또한, `ClassLoaderIsolation()` 구성과 관련된 Gradle 이슈가 [메모리 누수](https://github.com/gradle/gradle/issues/18313)를 유발할 수 있습니다.
>
{style="note"}

## 다음 단계

*   [더 많은 DGP v2 프로젝트 예시 살펴보기](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2).
*   [Dokka 시작하기](dokka-get-started.md).
*   [Dokka 플러그인에 대해 더 알아보기](dokka-plugins.md).