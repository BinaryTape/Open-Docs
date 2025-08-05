[//]: # (title: Kotlin 커스텀 스크립팅 시작하기 – 튜토리얼)

> Kotlin 커스텀 스크립팅은 [실험적 기능](components-stability.md)입니다. 언제든지 중단되거나 변경될 수 있습니다.
> 평가 목적으로만 사용하세요. [YouTrack](https://kotl.in/issue)에 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

_Kotlin 스크립팅_은 사전 컴파일 또는 실행 파일 패키징 없이 Kotlin 코드를 스크립트로 실행할 수 있게 해주는 기술입니다.

예시를 포함한 Kotlin 스크립팅의 개요를 보려면 KotlinConf'19에서 Rodrigo Oliveira가 발표한 [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/) 강연을 확인하세요.

이 튜토리얼에서는 Maven 의존성을 사용하여 임의의 Kotlin 코드를 실행하는 Kotlin 스크립팅 프로젝트를 생성합니다.
다음과 같이 스크립트를 실행할 수 있습니다:

```kotlin
@file:Repository("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
@file:DependsOn("org.jetbrains.kotlinx:kotlinx-html-jvm:0.7.3")

import kotlinx.html.*
import kotlinx.html.stream.*
import kotlinx.html.attributes.*

val addressee = "World"

print(
    createHTML().html {
        body {
            h1 { +"Hello, $addressee!" }
        }
    }
)
```

이 예시의 `kotlinx-html-jvm`과 같이 지정된 Maven 의존성은 실행 중에 지정된 Maven 저장소 또는 로컬 캐시에서 해결되며 나머지 스크립트에 사용됩니다.

## 프로젝트 구조

최소한의 Kotlin 커스텀 스크립팅 프로젝트는 두 가지 부분으로 구성됩니다:

*   _스크립트 정의_ – 이 스크립트 유형이 어떻게 인식되고, 처리되고, 컴파일되고, 실행되어야 하는지를 정의하는 일련의 매개변수와 구성.
*   _스크립팅 호스트_ – 스크립트 컴파일 및 실행을 처리하는 애플리케이션 또는 구성 요소 – 실제로 이 유형의 스크립트를 실행하는 역할을 합니다.

이 모든 것을 고려할 때, 프로젝트를 두 개의 모듈로 분할하는 것이 가장 좋습니다.

## 시작하기 전에

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)의 최신 버전을 다운로드하여 설치하세요.

## 프로젝트 생성

1.  IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
2.  왼쪽 패널에서 **New Project**를 선택합니다.
3.  새 프로젝트 이름을 지정하고 필요한 경우 위치를 변경합니다.

    > **Create Git repository** 체크박스를 선택하여 새 프로젝트를 버전 관리에 포함시킬 수 있습니다. 이 작업은 나중에 언제든지 수행할 수 있습니다.
    >
    {style="tip"}

4.  **Language** 목록에서 **Kotlin**을 선택합니다.
5.  **Gradle** 빌드 시스템을 선택합니다.
6.  **JDK** 목록에서 프로젝트에서 사용할 [JDK](https://www.oracle.com/java/technologies/downloads/)를 선택합니다.
    *   JDK가 컴퓨터에 설치되어 있지만 IDE에 정의되어 있지 않은 경우, **Add JDK**를 선택하고 JDK 홈 디렉토리의 경로를 지정합니다.
    *   필요한 JDK가 컴퓨터에 없는 경우, **Download JDK**를 선택합니다.

7.  **Gradle DSL**에 대해 Kotlin 또는 Gradle 언어를 선택합니다.
8.  **Create**를 클릭합니다.

![Kotlin 커스텀 스크립팅을 위한 루트 프로젝트 생성](script-deps-create-root-project.png){width=700}

## 스크립팅 모듈 추가

이제 빈 Kotlin/JVM Gradle 프로젝트가 있습니다. 필요한 모듈, 스크립트 정의 및 스크립팅 호스트를 추가합니다:

1.  IntelliJ IDEA에서 **File | New | Module**을 선택합니다.
2.  왼쪽 패널에서 **New Module**을 선택합니다. 이 모듈은 스크립트 정의가 됩니다.
3.  새 모듈의 이름을 지정하고 필요한 경우 위치를 변경합니다.
4.  **Language** 목록에서 **Java**를 선택합니다.
5.  **Gradle** 빌드 시스템을 선택하고, Kotlin으로 빌드 스크립트를 작성하려는 경우 **Gradle DSL**에서 Kotlin을 선택합니다.
6.  모듈의 부모로 루트 모듈을 선택합니다.
7.  **Create**를 클릭합니다.

   ![스크립트 정의 모듈 생성](script-deps-module-definition.png){width=700}

8.  모듈의 `build.gradle(.kts)` 파일에서 Kotlin Gradle 플러그인의 `version`을 제거합니다. 이는 이미 루트 프로젝트의 빌드 스크립트에 있습니다.

9.  이전 단계를 한 번 더 반복하여 스크립팅 호스트용 모듈을 생성합니다.

프로젝트는 다음 구조를 가져야 합니다:

![커스텀 스크립팅 프로젝트 구조](script-deps-project-structure.png){width=300}

이러한 프로젝트의 예시와 더 많은 Kotlin 스크립팅 예시를 [kotlin-script-examples GitHub 저장소](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps)에서 찾을 수 있습니다.

## 스크립트 정의 생성

먼저, 스크립트 유형을 정의합니다: 개발자가 이 유형의 스크립트에 무엇을 작성할 수 있는지, 그리고 그것이 어떻게 처리될지. 이 튜토리얼에서는 스크립트의 `@Repository` 및 `@DependsOn` 어노테이션에 대한 지원이 포함됩니다.

1.  스크립트 정의 모듈의 `build.gradle(.kts)`의 `dependencies` 블록에 Kotlin 스크립팅 구성 요소에 대한 의존성을 추가합니다. 이 의존성들은 스크립트 정의에 필요한 API를 제공합니다:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlin:kotlin-scripting-common")
        implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
        implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies")
        implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven")
        // coroutines dependency is required for this particular definition
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%") 
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies-maven'
        // coroutines dependency is required for this particular definition
        implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'

    }
    ```

    </tab>
    </tabs>

2.  모듈에 `src/main/kotlin/` 디렉토리를 생성하고, 예를 들어 `scriptDef.kt`와 같은 Kotlin 소스 파일을 추가합니다.

3.  `scriptDef.kt` 파일에 클래스를 생성합니다. 이 클래스는 이 유형의 스크립트에 대한 슈퍼클래스가 될 것이므로, `abstract` 또는 `open`으로 선언합니다.

    ```kotlin
    // abstract (or open) superclass for scripts of this type
    abstract class ScriptWithMavenDeps
    ```

    이 클래스는 나중에 스크립트 정의에 대한 참조 역할을 할 것입니다.

4.  이 클래스를 스크립트 정의로 만들려면 `@KotlinScript` 어노테이션으로 표시합니다. 어노테이션에 두 개의 매개변수를 전달합니다:
    *   `fileExtension` – 이 유형의 스크립트에 대한 파일 확장자를 정의하는 `.kts`로 끝나는 문자열.
    *   `compilationConfiguration` – `ScriptCompilationConfiguration`을 확장하고 이 스크립트 정의에 대한 컴파일 세부 사항을 정의하는 Kotlin 클래스입니다. 다음 단계에서 이를 생성할 것입니다.

    ```kotlin
    // @KotlinScript annotation marks a script definition class
    @KotlinScript(
        // File extension for the script type
        fileExtension = "scriptwithdeps.kts",
        // Compilation configuration for the script type
        compilationConfiguration = ScriptWithMavenDepsConfiguration::class
    )
    abstract class ScriptWithMavenDeps

    object ScriptWithMavenDepsConfiguration: ScriptCompilationConfiguration()
    ```

    > 이 튜토리얼에서는 Kotlin 스크립팅 API에 대한 설명 없이 작동하는 코드만 제공합니다.
    > 자세한 설명이 포함된 동일한 코드를 [GitHub](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt)에서 찾을 수 있습니다.
    >
    {style="note"}

5.  아래와 같이 스크립트 컴파일 구성을 정의합니다.

    ```kotlin
    object ScriptWithMavenDepsConfiguration : ScriptCompilationConfiguration(
        {
            // Implicit imports for all scripts of this type
            defaultImports(DependsOn::class, Repository::class)
            jvm {
                // Extract the whole classpath from context classloader and use it as dependencies
                dependenciesFromCurrentContext(wholeClasspath = true) 
            }
            // Callbacks
            refineConfiguration {
                // Process specified annotations with the provided handler
                onAnnotations(DependsOn::class, Repository::class, handler = ::configureMavenDepsOnAnnotations)
            }
        }
    )
    ```

    `configureMavenDepsOnAnnotations` 함수는 다음과 같습니다:

    ```kotlin
    // Handler that reconfigures the compilation on the fly
    fun configureMavenDepsOnAnnotations(context: ScriptConfigurationRefinementContext): ResultWithDiagnostics<ScriptCompilationConfiguration> {
        val annotations = context.collectedData?.get(ScriptCollectedData.collectedAnnotations)?.takeIf { it.isNotEmpty() }
            ?: return context.compilationConfiguration.asSuccess()
        return runBlocking {
            resolver.resolveFromScriptSourceAnnotations(annotations)
        }.onSuccess {
            context.compilationConfiguration.with { 
                dependencies.append(JvmDependency(it))
            }.asSuccess()
        }
    }
    
    private val resolver = CompoundDependenciesResolver(FileSystemDependenciesResolver(), MavenDependenciesResolver())
    ```

    전체 코드는 [여기](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt)에서 찾을 수 있습니다.

## 스크립팅 호스트 생성

다음 단계는 스크립트 실행을 처리하는 구성 요소인 스크립팅 호스트를 생성하는 것입니다.

1.  스크립팅 호스트 모듈의 `build.gradle(.kts)`의 `dependencies` 블록에 의존성을 추가합니다:
    *   스크립팅 호스트에 필요한 API를 제공하는 Kotlin 스크립팅 구성 요소
    *   이전에 생성한 스크립트 정의 모듈

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlin:kotlin-scripting-common")
        implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
        implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")
        implementation(project(":script-definition")) // the script definition module
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
        implementation project(':script-definition') // the script definition module
    }
    ```

    </tab>
    </tabs>

2.  모듈에 `src/main/kotlin/` 디렉토리를 생성하고, 예를 들어 `host.kt`와 같은 Kotlin 소스 파일을 추가합니다.

3.  애플리케이션의 `main` 함수를 정의합니다. 함수 본문에서 스크립트 파일 경로라는 하나의 인수가 있는지 확인하고 스크립트를 실행합니다. 다음 단계에서 별도의 함수인 `evalFile`에서 스크립트 실행을 정의할 것입니다. 지금은 비어 있도록 선언합니다.

    `main`은 다음과 같이 보일 수 있습니다:

    ```kotlin
    fun main(vararg args: String) {
        if (args.size != 1) {
            println("usage: <app> <script file>")
        } else {
            val scriptFile = File(args[0])
            println("Executing script $scriptFile")
            evalFile(scriptFile)
        }
    }
    ```

4.  스크립트 평가 함수를 정의합니다. 여기에서 스크립트 정의를 사용할 것입니다. 스크립트 정의 클래스를 타입 매개변수로 사용하여 `createJvmCompilationConfigurationFromTemplate`을 호출하여 얻습니다. 그런 다음 스크립트 코드와 컴파일 구성을 전달하여 `BasicJvmScriptingHost().eval`을 호출합니다. `eval`은 `ResultWithDiagnostics`의 인스턴스를 반환하므로, 이를 함수의 반환 유형으로 설정합니다.

    ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
    ```

5.  스크립트 실행에 대한 정보를 출력하도록 `main` 함수를 조정합니다:

    ```kotlin
    fun main(vararg args: String) {
        if (args.size != 1) {
            println("usage: <app> <script file>")
        } else {
            val scriptFile = File(args[0])
            println("Executing script $scriptFile")
            val res = evalFile(scriptFile)
            res.reports.forEach {
                if (it.severity > ScriptDiagnostic.Severity.DEBUG) {
                    println(" : ${it.message}" + if (it.exception == null) "" else ": ${it.exception}")
                }
            }
        }
    }
    ```

전체 코드는 [여기](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/host/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/host/host.kt)에서 찾을 수 있습니다.

## 스크립트 실행

스크립팅 호스트가 어떻게 작동하는지 확인하려면, 실행할 스크립트와 실행 구성을 준비합니다.

1.  프로젝트 루트 디렉토리에 다음 내용으로 `html.scriptwithdeps.kts` 파일을 생성합니다:

    ```kotlin
    @file:Repository("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
    @file:DependsOn("org.jetbrains.kotlinx:kotlinx-html-jvm:0.7.3")
    
    import kotlinx.html.*; import kotlinx.html.stream.*; import kotlinx.html.attributes.*
    
    val addressee = "World"
    
    print(
        createHTML().html {
            body {
                h1 { +"Hello, $addressee!" }
            }
        }
    )
    ```
    
    이것은 `@DependsOn` 어노테이션 인수에 참조된 `kotlinx-html-jvm` 라이브러리의 함수를 사용합니다.

2.  스크립팅 호스트를 시작하고 이 파일을 실행하는 실행 구성을 생성합니다:
    1.  `host.kt`를 열고 `main` 함수로 이동합니다. 왼쪽에 **실행** 거터 아이콘이 있습니다.
    2.  거터 아이콘을 마우스 오른쪽 버튼으로 클릭하고 **실행 구성 수정**을 선택합니다.
    3.  **실행 구성 생성** 대화 상자에서 스크립트 파일 이름을 **프로그램 인수**에 추가하고 **OK**를 클릭합니다.
    
       ![스크립팅 호스트 실행 구성](script-deps-run-config.png){width=800}

3.  생성된 구성을 실행합니다.

스크립트가 어떻게 실행되는지, 지정된 저장소에서 `kotlinx-html-jvm`에 대한 의존성을 해결하고 해당 함수의 호출 결과를 출력하는 것을 볼 수 있습니다:

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

의존성 해결은 첫 실행 시 시간이 다소 걸릴 수 있습니다. 이후 실행은 로컬 Maven 저장소에서 다운로드된 의존성을 사용하므로 훨씬 빠르게 완료됩니다.

## 다음 단계는 무엇인가요?

간단한 Kotlin 스크립팅 프로젝트를 생성했다면, 이 주제에 대한 더 많은 정보를 찾아보세요:
*   [Kotlin 스크립팅 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)을 읽어보세요.
*   더 많은 [Kotlin 스크립팅 예시](https://github.com/Kotlin/kotlin-script-examples)를 찾아보세요.
*   Rodrigo Oliveira의 [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/) 강연을 시청하세요.