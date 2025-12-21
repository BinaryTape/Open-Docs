[//]: # (title: Dokka Gradle 구성 옵션)

Dokka는 사용자 및 독자의 경험을 사용자 정의할 수 있는 다양한 구성 옵션을 제공합니다.

아래에는 각 구성 섹션에 대한 상세 설명과 몇 가지 예제가 있습니다. [모든 구성 옵션](#complete-configuration)이 적용된 예제도 찾을 수 있습니다.

단일 프로젝트 및 멀티 프로젝트 빌드에 구성 블록을 적용하는 방법에 대한 자세한 내용은 [구성 예제](dokka-gradle.md#configuration-examples)를 참조하세요.

### 일반 구성

다음은 일반적인 Dokka Gradle 플러그인 구성의 예입니다.

*   최상위 `dokka {}` DSL 구성을 사용합니다.
*   DGP에서 `dokkaPublications{}` 블록에 Dokka 퍼블리케이션 구성을 선언합니다.
*   기본 퍼블리케이션은 [`html`](dokka-html.md) 및 [`javadoc`](dokka-javadoc.md)입니다.

*   `build.gradle.kts` 파일의 구문은 Gradle의 Kotlin DSL이 타입 안전 접근자를 사용하기 때문에 일반 `.kt` 파일(Kotlin 커스텀 플러그인에 사용되는 파일 등)과 다릅니다.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set(project.name)
        moduleVersion.set(project.version.toString())
        // Standard output directory for HTML documentation
        outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
        failOnWarning.set(false)
        suppressInheritedMembers.set(false)
        suppressObviousFunctions.set(true)
        offlineMode.set(false)
        includes.from("packages.md", "extra.md")
        
        // Output directory for additional files
        // Use this block instead of the standard when you 
        // want to change the output directory and include extra files
        outputDirectory.set(rootDir.resolve("docs/api/0.x"))
        
        // Use fileTree to add multiple files
        includes.from(
            fileTree("docs") {
                include("**/*.md")
            }
        )
    }
}
```

파일 작업에 대한 자세한 내용은 [Gradle 문서](https://docs.gradle.org/current/userguide/working_with_files.html#sec:file_trees)를 참조하세요.

</tab>
<tab title="Kotlin custom plugin" group-key="kotlin custom">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")

        project.extensions.configure(DokkaExtension::class.java) { dokka ->
            
            dokka.moduleName.set(project.name)
            dokka.moduleVersion.set(project.version.toString())

            dokka.dokkaPublications.named("html") { publication ->
                // Standard output directory for HTML documentation
                publication.outputDirectory.set(project.layout.buildDirectory.dir("dokka/html"))
                publication.failOnWarning.set(true)
                publication.suppressInheritedMembers.set(true)
                publication.offlineMode.set(false)
                publication.suppressObviousFunctions.set(true)
                publication.includes.from("packages.md", "extra.md")

                // Output directory for additional files
                // Use this instead of the standard block when you 
                // want to change the output directory and include extra files
                html.outputDirectory.set(project.rootDir.resolve("docs/api/0.x"))
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            // Sets general module information
            moduleName.set(project.name)
            moduleVersion.set(project.version.toString())

            // Standard output directory for HTML documentation
            outputDirectory.set(layout.buildDirectory.dir("dokka/html"))

            // Core Dokka options
            failOnWarning.set(false)
            suppressInheritedMembers.set(false)
            suppressObviousFunctions.set(true)
            offlineMode.set(false)
            includes.from(files("packages.md", "extra.md"))

            // Output directory for additional files
            // Use this block instead of the standard when you want to 
            // change the output directory and include extra files
            outputDirectory.set(file("$rootDir/docs/api/0.x"))
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="moduleName">
        <p>
           프로젝트 문서의 표시 이름입니다. 목차, 내비게이션, 
           헤더 및 로그 메시지에 나타납니다. 멀티 프로젝트 빌드에서 각 서브프로젝트의 <code>moduleName</code>은 
           집계된 문서에서 해당 섹션 제목으로 사용됩니다.
        </p>
        <p>기본값: Gradle 프로젝트 이름</p>
    </def>
    <def title="moduleVersion">
        <p>
            생성된 문서에 표시되는 서브프로젝트 버전입니다. 
            단일 프로젝트 빌드에서는 프로젝트 버전으로 사용됩니다.
            멀티 프로젝트 빌드에서는 문서 집계 시 각 서브프로젝트의 <code>moduleVersion</code>이 
            사용됩니다. 
        </p>
        <p>기본값: Gradle 프로젝트 버전</p>
    </def>
    <def title="outputDirectory">
        <p>생성된 문서가 저장되는 디렉터리입니다.</p>
        <p>이 설정은 <code>dokkaGenerate</code> 태스크에 의해 생성되는 모든 문서 형식(HTML, Javadoc 등)에 적용됩니다.</p>
        <p>기본값: <code>build/dokka/html</code></p>
        <p><b>추가 파일의 출력 디렉터리</b></p>
        <p>단일 프로젝트 및 멀티 프로젝트 빌드 모두에 대해 출력 디렉터리를 지정하고 추가 파일을 포함할 수 있습니다.
           멀티 프로젝트 빌드의 경우,
           루트 프로젝트의 구성에서 출력 디렉터리를 설정하고 추가 파일을 포함합니다.
        </p>
    </def>
    <def title="failOnWarning">
        <p>
            문서 생성 중 경고가 발생했을 때 Dokka가 빌드를 실패시킬지 여부를 결정합니다.
            이 과정은 모든 오류 및 경고가 먼저 발생할 때까지 기다립니다.
        </p>
        <p>이 설정은 <code>reportUndocumented</code>와 잘 작동합니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>주어진 클래스에서 명시적으로 오버라이드되지 않은 상속된 멤버를 억제할지 여부입니다.</p>
        <p>
            참고: 
            이는 <code>equals</code>, <code>hashCode</code> 및 <code>toString</code>과 같은 함수를 억제하지만, 
            <code>dataClass.componentN</code> 및 <code>dataClass.copy</code>와 같은 합성 함수는 억제하지 않습니다. 
            이를 위해서는 <code>suppressObviousFunctions</code>를 사용하세요.
        </p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>명백한 함수를 억제할지 여부입니다.</p>
        <p>
            다음과 같은 경우 함수는 명백하다고 간주됩니다:</p>
            <list>
                <li>
                    <code>kotlin.Any</code>, <code>Kotlin.Enum</code>, <code>java.lang.Object</code> 또는
                    <code>java.lang.Enum</code>에서 상속된 함수(예: <code>equals</code>, <code>hashCode</code>, <code>toString</code>).
                </li>
                <li>
                    합성된 함수(컴파일러에 의해 생성된)이며 문서가 없는 함수(예:
                    <code>dataClass.componentN</code> 또는 <code>dataClass.copy</code>).
                </li>
            </list>
        <p>기본값: <code>true</code></p>
    </def>
    <def title="offlineMode">
        <p>네트워크를 통해 원격 파일 및 링크를 해결할지 여부입니다.</p>
        <p>
            여기에는 외부 문서로의 링크 생성을 위해 사용되는 패키지 목록이 포함됩니다. 
            예를 들어, 이를 통해 표준 라이브러리의 클래스를 문서에서 클릭 가능하게 만들 수 있습니다. 
        </p>
        <p>
            이 값을 <code>true</code>로 설정하면 특정 경우에 빌드 시간을 크게 단축할 수 있지만,
            사용자 경험을 저하시킬 수도 있습니다. 예를 들어, 표준 라이브러리를 포함한
            의존성의 클래스 및 멤버 링크를 해결하지 않아 링크가 작동하지 않을 수 있습니다.
        </p>
        <p>참고: 가져온 파일을 로컬에 캐시하고 Dokka에 로컬 경로로 제공할 수 있습니다. 
           <code><a href="#external-documentation-links-configuration">externalDocumentationLinks</a></code> 섹션을 참조하세요.</p>
        <p>기본값: <code>false</code></p>
    </def>
     <def title="includes">
        <p>
            <a href="dokka-module-and-package-docs.md">서브프로젝트 및 패키지 문서</a>를 포함하는
            Markdown 파일 목록입니다. Markdown 파일은 <a href="dokka-module-and-package-docs.md#file-format">필수 형식</a>과 일치해야 합니다.
        </p>
        <p>지정된 파일의 내용은 파싱되어 서브프로젝트 및 패키지 설명으로 문서에 임베드됩니다.</p>
        <p>
            예시와 사용 방법을 보려면 <a href="https://github.com/Kotlin/dokka/blob/master/examples/gradle-v2/basic-gradle-example/build.gradle.kts">Dokka Gradle 예제</a>를 참조하세요.
        </p>
    </def>
</deflist>

### 소스 세트 구성

Dokka는 [Kotlin 소스 세트](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)에 대한 일부 옵션을 구성할 수 있도록 합니다.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    // ..
    // General configuration section
    // ..

    // Source sets configuration
    dokkaSourceSets {
        // Example: Configuration exclusive to the 'linux' source set
        named("linux") {
            dependentSourceSets{named("native")}
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(VisibilityModifier.Public)) // OR documentedVisibilities(VisibilityModifier.Public)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")
           
            sourceLink {
                // Source link section
            }
            perPackageOption {
                // Package options section
            }
            externalDocumentationLinks {
                // External documentation links section
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    // ..
    // General configuration section
    // ..

    dokkaSourceSets {
        // Example: Configuration exclusive to the 'linux' source set
        named("linux") {
            dependentSourceSets { named("native") }
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([VisibilityModifier.Public] as Set) // OR documentedVisibilities(VisibilityModifier.Public)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // Source link section
            }
            perPackageOption {
                // Package options section
            }
            externalDocumentationLinks {
                // External documentation links section
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
            이 이름은 외부적으로(예: 문서 독자에게 보이는 소스 세트 이름)와 
            내부적으로(예: <code>reportUndocumented</code>의 로깅 메시지) 모두 사용됩니다.
        </p>
        <p>기본적으로 값은 Kotlin Gradle 플러그인에서 제공하는 정보로부터 추론됩니다.</p>
    </def>
    <def title="documentedVisibilities">
        <p>Dokka가 생성된 문서에 포함해야 하는 가시성 변경자를 정의합니다.</p>
        <p>
            <code>protected</code>, <code>internal</code>, <code>private</code> 선언을 문서화하거나,
            <code>public</code> 선언을 제외하고 내부 API만 문서화하려는 경우 사용합니다.
        </p>
        <p>
            또한, Dokka의 
            <a href="https://github.com/Kotlin/dokka/blob/v2.1.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt"><code>documentedVisibilities()</code> 함수</a>를 
            사용하여 문서화된 가시성을 추가할 수 있습니다.
        </p>
        <p>이것은 각 개별 패키지에 대해 구성할 수 있습니다.</p>
        <p>기본값: <code>VisibilityModifier.Public</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code> 및 다른 필터에 의해 필터링된 후 KDoc이 없는
            가시적이지만 문서화되지 않은 선언에 대한 경고를 발생시킬지 여부입니다.
        </p>
        <p>이 설정은 <code>failOnWarning</code>과 잘 작동합니다.</p>
        <p>이것은 각 개별 패키지에 대해 구성할 수 있습니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            다양한 필터가 적용된 후 가시적인 선언이 없는 패키지를
            건너뛸지 여부입니다.
        </p>
        <p>
            예를 들어, <code>skipDeprecated</code>가 <code>true</code>로 설정되어 있고 패키지에
            사용 중단된 선언만 포함되어 있다면 해당 패키지는 비어 있는 것으로 간주됩니다.
        </p>
        <p>기본값: <code>true</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>로 어노테이션된 선언을 문서화할지 여부입니다.</p>
        <p>이것은 각 개별 패키지에 대해 구성할 수 있습니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="suppressGeneratedFiles">
        <p>생성된 파일을 문서화할지 여부입니다.</p>
        <p>
            생성된 파일은 <code>{project}/{buildDir}/generated</code> 디렉터리 아래에 있을 것으로 예상됩니다.
        </p>
        <p>
            이 값을 <code>true</code>로 설정하면, 해당 디렉터리의 모든 파일이
            <code>suppressedFiles</code> 옵션에 효과적으로 추가되므로 수동으로 구성할 수 있습니다.
        </p>
        <p>기본값: <code>true</code></p>
    </def>
    <def title="jdkVersion">
        <p>Java 타입의 외부 문서 링크를 생성할 때 사용할 JDK 버전입니다.</p>
        <p>
            예를 들어, 일부 공개 선언 시그니처에서 <code>java.util.UUID</code>를 사용하고
            이 옵션이 <code>8</code>로 설정된 경우, Dokka는 해당 타입에 대해
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a>으로의 외부 문서 링크를 생성합니다.
        </p>
        <p>기본값: `8`</p>
    </def>
    <def title="languageVersion">
        <p>
            분석 및 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            환경 설정을 위해 사용되는 <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 언어 버전</a>입니다.
        </p>
        <p>기본적으로 Dokka의 임베디드 컴파일러에서 사용 가능한 최신 언어 버전이 사용됩니다.</p>
    </def>
    <def title="apiVersion">
        <p>
            분석 및 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            환경 설정을 위해 사용되는 <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API 버전</a>입니다.
        </p>
        <p>기본적으로 <code>languageVersion</code>으로부터 추론됩니다.</p>
    </def>
    <def title="sourceRoots">
        <p>
            분석 및 문서화할 소스 코드 루트입니다.
            허용되는 입력은 디렉터리와 개별 <code>.kt</code> 및 <code>.java</code> 파일입니다.
        </p>
        <p>기본적으로 소스 루트는 Kotlin Gradle 플러그인에서 제공하는 정보로부터 추론됩니다.</p>
    </def>
    <def title="classpath">
        <p>분석 및 대화형 샘플을 위한 클래스패스입니다.</p>
        <p>일부 의존성에서 오는 타입이 해결되지 않거나 자동으로 선택되지 않는 경우 유용합니다.</p>
        <p>이 옵션은 <code>.jar</code> 및 <code>.klib</code> 파일 모두를 허용합니다.</p>
        <p>기본적으로 클래스패스는 Kotlin Gradle 플러그인에서 제공하는 정보로부터 추론됩니다.</p>
    </def>
    <def title="samples">
        <p>
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDoc 태그를 통해 참조되는
            샘플 함수를 포함하는 디렉터리 또는 파일 목록입니다.
        </p>
    </def>
</deflist>

### 소스 링크 구성

독자가 원격 저장소에서 각 선언의 소스를 찾는 데 도움이 되도록 소스 링크를 구성합니다.
이 구성에는 `dokkaSourceSets.main {}` 블록을 사용합니다.

`sourceLinks {}` 구성 블록을 사용하면 `remoteUrl`에 특정 줄 번호와 연결되는 `source` 링크를 각 시그니처에 추가할 수 있습니다.
줄 번호는 `remoteLineSuffix`를 설정하여 구성할 수 있습니다.

예를 들어, `kotlinx.coroutines`의 [`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 함수 문서를 참조하세요.

`build.gradle.kts` 파일의 구문은 Gradle의 Kotlin DSL이 타입 안전 접근자를 사용하기 때문에 일반 `.kt` 파일(커스텀 Gradle 플러그인에 사용되는 파일 등)과 다릅니다.

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
<tab title="Kotlin custom plugin" group-key="kotlin custom">

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
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    dokkaSourceSets {
        main {
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

<deflist collapsible="true">
    <def title="localDirectory">
        <p>
            로컬 소스 디렉터리의 경로입니다. 경로는 현재 프로젝트의 
            루트에 대한 상대 경로여야 합니다.
        </p>
    </def>
    <def title="remoteUrl">
        <p>
            독자가 접근할 수 있는 소스 코드 호스팅 서비스의 URL입니다.
            GitHub, GitLab, Bitbucket 또는 소스 파일에 대한 안정적인 URL을 제공하는 모든 호스팅 서비스가 해당됩니다. 
            이 URL은 선언의 소스 코드 링크를 생성하는 데 사용됩니다.
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            URL에 소스 코드 줄 번호를 추가하는 데 사용되는 접미사입니다. 이는 독자가
            파일뿐만 아니라 선언의 특정 줄 번호로 이동하는 데 도움이 됩니다.
        </p>
        <p>
            줄 번호 자체는 지정된 접미사에 추가됩니다. 예를 들어,
            이 옵션이 <code>#L</code>로 설정되고 줄 번호가 10이면 결과 URL 접미사는
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

`perPackageOption` 구성 블록을 사용하면 `matchingRegex`와 일치하는 특정 패키지에 대해 일부 옵션을 설정할 수 있습니다.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    dokkaPublications.html {
        dokkaSourceSets.configureEach {
            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(setOf(VisibilityModifier.Public)) // OR documentedVisibilities(VisibilityModifier.Public)
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    dokkaPublications {
        html {
            dokkaSourceSets.configureEach {
                perPackageOption {
                    matchingRegex.set(".*api.*")
                    suppress.set(false)
                    skipDeprecated.set(false)
                    reportUndocumented.set(false)
                    documentedVisibilities.set([VisibilityModifier.Public] as Set)
                }
            }
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>패키지를 일치시키는 데 사용되는 정규 표현식입니다.</p>
        <p>기본값: <code>.*</code></p>
    </def>
    <def title="suppress">
        <p>문서 생성 시 해당 패키지를 건너뛸지 여부입니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p><code>@Deprecated</code>로 어노테이션된 선언을 문서화할지 여부입니다.</p>
        <p>이것은 소스 세트 수준에서 구성할 수 있습니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            <code>documentedVisibilities</code> 및 다른 필터에 의해 필터링된 후 KDoc이 없는
            가시적이지만 문서화되지 않은 선언에 대한 경고를 발생시킬지 여부입니다.
        </p>
        <p>이 설정은 <code>failOnWarning</code>과 잘 작동합니다.</p>
        <p>이것은 소스 세트 수준에서 구성할 수 있습니다.</p>
        <p>기본값: <code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>Dokka가 생성된 문서에 포함해야 하는 가시성 변경자를 정의합니다.</p>
        <p>
            이 패키지 내에서 <code>protected</code>, <code>internal</code>, <code>private</code> 
            선언을 문서화하거나, 
            <code>public</code> 선언을 제외하고 내부 API만 문서화하려는 경우 사용합니다.
        </p>
        <p>
            또한, Dokka의 
            <a href="https://github.com/Kotlin/dokka/blob/v2.0.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16"><code>documentedVisibilities()</code> 함수</a>를 
            사용하여 문서화된 가시성을 추가할 수 있습니다.
        </p>
        <p>이것은 소스 세트 수준에서 구성할 수 있습니다.</p>
        <p>기본값: <code>VisibilityModifier.Public</code></p>
    </def>
</deflist>

### 외부 문서 링크 구성

`externalDocumentationLinks {}`
블록은 의존성에서 외부적으로 호스팅되는 문서로 연결되는 링크를 생성할 수 있도록 합니다.

예를 들어, `kotlinx.serialization`의 타입을 사용하고 있다면, 기본적으로 문서에서 클릭할 수 없으며 해결되지 않은 것처럼 보입니다. 그러나 `kotlinx.serialization`의 API 참조 문서는 Dokka에 의해 빌드되고 [kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/)에 게시되므로, 이에 대한 외부 문서 링크를 구성할 수 있습니다. 이렇게 하면 Dokka가 라이브러리 타입에 대한 링크를 생성하여 성공적으로 해결되고 클릭 가능하게 만듭니다.

기본적으로 Kotlin 표준 라이브러리, JDK, Android SDK 및 AndroidX에 대한 외부 문서 링크는 구성되어 있습니다.

`register()` 메서드를 사용하여 각 링크를 정의하여 외부 문서 링크를 등록합니다.
`externalDocumentationLinks` API는 Gradle DSL 컨벤션에 맞춰 이 메서드를 사용합니다.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

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

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    dokkaSourceSets.configureEach {
        externalDocumentationLinks.register("example-docs") {
            url.set(new URI("https://example.com/docs/"))
            packageListUrl.set(new URI("https://example.com/docs/package-list"))
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="url">
        <p>링크할 문서의 루트 URL입니다. 후행 슬래시가 <b>반드시</b> 포함되어야 합니다.</p>
        <p>
            Dokka는 주어진 URL에 대한 <code>package-list</code>를 자동으로 찾고, 
            선언들을 함께 연결하기 위해 최선을 다합니다.
        </p>
        <p>
            자동 해결에 실패하거나 로컬 캐시된 파일을 대신 사용하려는 경우, 
            <code>packageListUrl</code> 옵션을 설정하는 것을 고려하십시오.
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code>의 정확한 위치입니다. 이는 Dokka가 자동으로
            해결하는 것에 의존하는 대안입니다.
        </p>
        <p>
            패키지 목록에는 서브프로젝트 및 패키지 이름과 같이 문서 및 프로젝트 자체에 대한 
            정보가 포함되어 있습니다.
        </p>
        <p>이것은 네트워크 호출을 피하기 위해 로컬 캐시된 파일일 수도 있습니다.</p>
    </def>
</deflist>

### 전체 구성

아래에서 가능한 모든 구성 옵션이 동시에 적용된 것을 볼 수 있습니다.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set(project.name)
        moduleVersion.set(project.version.toString())
        outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
        failOnWarning.set(false)
        suppressInheritedMembers.set(false)
        suppressObviousFunctions.set(true)
        offlineMode.set(false)
        includes.from("packages.md", "extra.md")
   }

    dokkaSourceSets {
        // Example: Configuration exclusive to the 'linux' source set
        named("linux") {
            dependentSourceSets{named("native")}
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(VisibilityModifier.Public)) // OR documentedVisibilities(VisibilityModifier.Public)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl("https://example.com/src")
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLinks {
                url = URL("https://example.com/docs/")
                packageListUrl = File("/path/to/package-list").toURI().toURL()
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(
                    setOf(
                        VisibilityModifier.Public,
                        VisibilityModifier.Private,
                        VisibilityModifier.Protected,
                        VisibilityModifier.Internal,
                        VisibilityModifier.Package
                    )
                )
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            moduleName.set(project.name)
            moduleVersion.set(project.version.toString())
            outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
            failOnWarning.set(false)
            suppressInheritedMembers.set(false)
            suppressObviousFunctions.set(true)
            offlineMode.set(false)
            includes.from("packages.md", "extra.md")
        }
    }

    dokkaSourceSets {
        // Example: Configuration exclusive to the 'linux' source set
        named("linux") {
            dependentSourceSets { named("native") }
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([VisibilityModifier.Public] as Set)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(new URI("https://example.com/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLinks {
                url.set(new URI("https://example.com/docs/"))
                packageListUrl.set(new File("/path/to/package-list").toURI().toURL())
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set([
                        VisibilityModifier.Public,
                        VisibilityModifier.Private,
                        VisibilityModifier.Protected,
                        VisibilityModifier.Internal,
                        VisibilityModifier.Package
                ] as Set)
            }
        }
    }
}
```

</tab>
</tabs>