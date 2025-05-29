[//]: # (title: Kotlin 커스텀 스크립팅 시작하기 – 튜토리얼)

> Kotlin 커스텀 스크립팅은 [실험적 기능](components-stability.md)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 평가 목적으로만 사용하십시오. [YouTrack](https://kotl.in/issue)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

_Kotlin 스크립팅_은 Kotlin 코드를 사전 컴파일하거나 실행 파일로 패키징할 필요 없이 스크립트로 실행할 수 있게 해주는 기술입니다.

Kotlin 스크립팅에 대한 개요와 예시를 보려면 KotlinConf'19에서 Rodrigo Oliveira의 강연인 [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)을 확인하십시오.

이 튜토리얼에서는 Maven 종속성(dependencies)을 사용하여 임의의 Kotlin 코드를 실행하는 Kotlin 스크립팅 프로젝트를 생성합니다.
다음과 같은 스크립트를 실행할 수 있습니다:

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

지정된 Maven 종속성(이 예시에서는 `kotlinx-html-jvm`)은 실행 중에 지정된 Maven 저장소 또는 로컬 캐시에서 해결(resolve)되고 스크립트의 나머지 부분에 사용됩니다.

## 프로젝트 구조

최소한의 Kotlin 커스텀 스크립팅 프로젝트는 다음 두 부분으로 구성됩니다:

* _스크립트 정의_ – 이 스크립트 유형이 인식되고, 처리되고, 컴파일되고, 실행되는 방식을 정의하는 매개변수 및 구성 세트입니다.
* _스크립팅 호스트_ – 스크립트 컴파일 및 실행을 처리하는 애플리케이션 또는 구성 요소로, 실제로 이 유형의 스크립트를 실행합니다.

이 모든 점을 고려할 때, 프로젝트를 두 개의 모듈로 분할하는 것이 가장 좋습니다.

## 시작하기 전에

최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)를 다운로드하여 설치하십시오.

## 프로젝트 생성

1. IntelliJ IDEA에서 **File** | **New** | **Project**를 선택하십시오.
2. 왼쪽 패널에서 **New Project**를 선택하십시오.
3. 새 프로젝트의 이름을 지정하고 필요한 경우 위치를 변경하십시오.

   > **Git 저장소 생성** 확인란을 선택하여 새 프로젝트를 버전 관리 하에 둘 수 있습니다. 이 작업은 나중에 언제든지 수행할 수 있습니다.
   >
   {style="tip"}

4. **Language** 목록에서 **Kotlin**을 선택하십시오.
5. **Gradle** 빌드 시스템을 선택하십시오.
6. **JDK** 목록에서 프로젝트에 사용할 [JDK](https://www.oracle.com/java/technologies/downloads/)를 선택하십시오.
   * JDK가 컴퓨터에 설치되어 있지만 IDE에 정의되어 있지 않은 경우, **Add JDK**를 선택하고 JDK 홈 디렉토리의 경로를 지정하십시오.
   * 컴퓨터에 필요한 JDK가 없는 경우, **Download JDK**를 선택하십시오.

7. **Gradle DSL**에 사용할 Kotlin 또는 Gradle 언어를 선택하십시오.
8. **Create**를 클릭하십시오.

![Kotlin 커스텀 스크립팅을 위한 루트 프로젝트 생성](script-deps-create-root-project.png){width=700}

## 스크립팅 모듈 추가

이제 빈 Kotlin/JVM Gradle 프로젝트가 있습니다. 필요한 모듈인 스크립트 정의와 스크립팅 호스트를 추가하십시오:

1. IntelliJ IDEA에서 **File | New | Module**을 선택하십시오.
2. 왼쪽 패널에서 **New Module**을 선택하십시오. 이 모듈은 스크립트 정의가 됩니다.
3. 새 모듈의 이름을 지정하고 필요한 경우 위치를 변경하십시오.
4. **Language** 목록에서 **Java**를 선택하십시오.
5. 빌드 스크립트를 Kotlin으로 작성하려면 **Gradle** 빌드 시스템과 **Gradle DSL**에 Kotlin을 선택하십시오.
6. 모듈의 상위(parent)로 루트 모듈을 선택하십시오.
7. **Create**를 클릭하십시오.

   ![스크립트 정의 모듈 생성](script-deps-module-definition.png){width=700}

8. 모듈의 `build.gradle(.kts)` 파일에서 Kotlin Gradle 플러그인의 `version`을 제거하십시오. 이는 이미 루트 프로젝트의 빌드 스크립트에 있습니다.

9. 스크립팅 호스트를 위한 모듈을 생성하려면 이전 단계를 한 번 더 반복하십시오.

프로젝트는 다음 구조를 가져야 합니다:

![커스텀 스크립팅 프로젝트 구조](script-deps-project-structure.png){width=300}

이러한 프로젝트의 예시와 더 많은 Kotlin 스크립팅 예시는 [kotlin-script-examples GitHub 저장소](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps)에서 찾을 수 있습니다.

## 스크립트 정의 생성

먼저 스크립트 유형을 정의하십시오: 이 유형의 스크립트에 개발자가 무엇을 작성할 수 있고, 어떻게 처리될지를 정의합니다.
이 튜토리얼에서는 스크립트에서 `@Repository` 및 `@DependsOn` 애노테이션(annotations)에 대한 지원이 포함됩니다.

1. 스크립트 정의 모듈의 `build.gradle(.kts)` 파일의 `dependencies` 블록에 Kotlin 스크립팅 구성 요소에 대한 종속성을 추가하십시오. 이 종속성들은 스크립트 정의에 필요한 API를 제공합니다:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven")
       // 이 특정 정의에는 코루틴 종속성이 필요합니다.
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
       // 이 특정 정의에는 코루틴 종속성이 필요합니다.
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'

   }
   ```

   </tab>
   </tabs>

2. 모듈에 `src/main/kotlin/` 디렉터리를 생성하고, 예를 들어 `scriptDef.kt`와 같은 Kotlin 소스 파일을 추가하십시오.

3. `scriptDef.kt` 파일에 클래스를 생성하십시오. 이 클래스는 이 유형의 스크립트에 대한 상위 클래스(superclass)가 되므로, `abstract` 또는 `open`으로 선언하십시오.

    ```kotlin
    // 이 유형의 스크립트를 위한 abstract (또는 open) 상위 클래스
    abstract class ScriptWithMavenDeps
    ```

   이 클래스는 나중에 스크립트 정의에 대한 참조 역할을 합니다.

4. 이 클래스를 스크립트 정의로 만들려면 `@KotlinScript` 애노테이션으로 표시하십시오. 이 애노테이션에 다음 두 가지 매개변수를 전달하십시오:
   * `fileExtension` – 이 스크립트 유형의 파일 확장자를 정의하는 `.kts`로 끝나는 문자열입니다.
   * `compilationConfiguration` – `ScriptCompilationConfiguration`을 확장하고 이 스크립트 정의에 대한 컴파일 세부 정보를 정의하는 Kotlin 클래스입니다. 다음 단계에서 생성합니다.

   ```kotlin
    // @KotlinScript 애노테이션은 스크립트 정의 클래스를 표시합니다.
    @KotlinScript(
        // 스크립트 유형의 파일 확장자
        fileExtension = "scriptwithdeps.kts",
        // 스크립트 유형의 컴파일 구성
        compilationConfiguration = ScriptWithMavenDepsConfiguration::class
    )
    abstract class ScriptWithMavenDeps

    object ScriptWithMavenDepsConfiguration: ScriptCompilationConfiguration()
   ```
   
   > 이 튜토리얼에서는 Kotlin 스크립팅 API에 대한 설명 없이 작동하는 코드만 제공합니다.
   > 자세한 설명이 포함된 동일한 코드는 [GitHub](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt)에서 찾을 수 있습니다.
   > 
   {style="note"}

5. 아래에 표시된 대로 스크립트 컴파일 구성을 정의하십시오.

   ```kotlin
    object ScriptWithMavenDepsConfiguration : ScriptCompilationConfiguration(
        {
            // 이 유형의 모든 스크립트에 대한 암시적 임포트
            defaultImports(DependsOn::class, Repository::class)
            jvm {
                // 컨텍스트 클래스 로더에서 전체 클래스패스를 추출하여 종속성으로 사용
                dependenciesFromCurrentContext(wholeClasspath = true) 
            }
            // 콜백
            refineConfiguration {
                // 제공된 핸들러로 지정된 애노테이션 처리
                onAnnotations(DependsOn::class, Repository::class, handler = ::configureMavenDepsOnAnnotations)
            }
        }
    )
   ```

   `configureMavenDepsOnAnnotations` 함수는 다음과 같습니다:

   ```kotlin
    // 컴파일을 즉석에서 재구성하는 핸들러
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

다음 단계는 스크립팅 호스트, 즉 스크립트 실행을 처리하는 구성 요소를 생성하는 것입니다.

1. 스크립팅 호스트 모듈의 `build.gradle(.kts)` 파일의 `dependencies` 블록에 다음 종속성을 추가하십시오:
   * 스크립팅 호스트에 필요한 API를 제공하는 Kotlin 스크립팅 구성 요소
   * 이전에 생성한 스크립트 정의 모듈

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")
       implementation(project(":script-definition")) // 스크립트 정의 모듈
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
       implementation project(':script-definition') // 스크립트 정의 모듈
   }
   ```

   </tab>
   </tabs>

2. 모듈에 `src/main/kotlin/` 디렉터리를 생성하고, 예를 들어 `host.kt`와 같은 Kotlin 소스 파일을 추가하십시오.

3. 애플리케이션의 `main` 함수를 정의하십시오. 본문에서 스크립트 파일의 경로인 하나의 인수가 있는지 확인하고 스크립트를 실행하십시오. 다음 단계에서 별도의 함수 `evalFile`에서 스크립트 실행을 정의할 것입니다. 지금은 비어 있는 함수로 선언하십시오.

   `main` 함수는 다음과 같습니다:

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

4. 스크립트 평가 함수를 정의하십시오. 여기에서 스크립트 정의를 사용할 것입니다. 스크립트 정의 클래스를 타입 매개변수로 사용하여 `createJvmCompilationConfigurationFromTemplate`를 호출하여 스크립트 정의를 얻으십시오. 그런 다음 스크립트 코드와 컴파일 구성을 전달하여 `BasicJvmScriptingHost().eval`을 호출하십시오. `eval`은 `ResultWithDiagnostics`의 인스턴스를 반환하므로, 이를 함수의 반환 타입으로 설정하십시오.

   ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
   ```

5. 스크립트 실행에 대한 정보를 출력하도록 `main` 함수를 조정하십시오:

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

스크립팅 호스트가 어떻게 작동하는지 확인하려면 실행할 스크립트와 실행 구성을 준비하십시오.

1. 프로젝트 루트 디렉터리에 다음 내용을 포함하는 `html.scriptwithdeps.kts` 파일을 생성하십시오:

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
   
   이는 `@DependsOn` 애노테이션(annotation) 인수에 참조된 `kotlinx-html-jvm` 라이브러리의 함수를 사용합니다.

2. 스크립팅 호스트를 시작하고 이 파일을 실행하는 실행 구성을 생성하십시오:
   1. `host.kt`를 열고 `main` 함수로 이동하십시오. 왼쪽에는 **Run** 거터 아이콘이 있습니다.
   2. 거터 아이콘을 마우스 오른쪽 버튼으로 클릭하고 **Modify Run Configuration**을 선택하십시오.
   3. **Create Run Configuration** 대화 상자에서 **Program arguments**에 스크립트 파일 이름을 추가하고 **OK**를 클릭하십시오.
   
      ![스크립팅 호스트 실행 구성](script-deps-run-config.png){width=800}

3. 생성된 구성을 실행하십시오.

스크립트가 실행되고, 지정된 저장소에서 `kotlinx-html-jvm` 종속성이 해결되며, 해당 함수 호출 결과가 출력되는 것을 볼 수 있습니다:

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

종속성을 해결하는 데 첫 실행 시 시간이 다소 소요될 수 있습니다. 이후 실행은 로컬 Maven 저장소에서 다운로드된 종속성을 사용하므로 훨씬 빠르게 완료됩니다.

## 다음 단계는?

간단한 Kotlin 스크립팅 프로젝트를 생성했다면, 이 주제에 대한 더 많은 정보를 찾아보십시오:
* [Kotlin 스크립팅 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)을 읽어보십시오.
* 더 많은 [Kotlin 스크립팅 예시](https://github.com/Kotlin/kotlin-script-examples)를 찾아보십시오.
* Rodrigo Oliveira의 강연 [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)을 시청하십시오.