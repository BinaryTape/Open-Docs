---
title: "Kotlin 커스텀 스크립팅 시작하기 - 튜토리얼"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::caution
Kotlin 커스텀 스크립팅은 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용하십시오. [YouTrack](https://kotl.in/issue)에서 여러분의 피드백을 기다립니다.

:::

_Kotlin scripting_은 Kotlin 코드를 사전 컴파일이나 실행 파일로 패키징하지 않고 스크립트로 실행할 수 있게 해주는 기술입니다.

Kotlin 스크립팅에 대한 개요는 예제와 함께 KotlinConf'19의 Rodrigo Oliveira의 강연인 [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)을 확인하십시오.

이 튜토리얼에서는 임의의 Kotlin 코드를 Maven dependencies와 함께 실행하는 Kotlin 스크립팅 프로젝트를 만듭니다.
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

지정된 Maven dependency(`kotlinx-html-jvm` 예제)는 실행 중에 지정된 Maven repository 또는 로컬 캐시에서 확인되고 나머지 스크립트에 사용됩니다.

## Project structure

최소한의 Kotlin 커스텀 스크립팅 프로젝트는 다음 두 부분으로 구성됩니다:

* _Script definition_ – 이 스크립트 유형을 인식, 처리, 컴파일 및 실행하는 방법을 정의하는 파라미터 및 구성 집합입니다.
* _Scripting host_ – 스크립트 컴파일 및 실행을 처리하는 애플리케이션 또는 컴포넌트입니다. 실제로 이 유형의 스크립트를 실행합니다.

이 모든 것을 염두에 두고 프로젝트를 두 개의 모듈로 분할하는 것이 가장 좋습니다.

## Before you start

최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)를 다운로드하여 설치하십시오.

## Create a project

1. IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
2. 왼쪽 패널에서 **New Project**를 선택합니다.
3. 새 프로젝트 이름을 지정하고 필요한 경우 위치를 변경합니다.

   > 새 프로젝트를 버전 관리하에 두려면 **Create Git repository** 확인란을 선택하십시오. 나중에 언제든지 수행할 수 있습니다.
   >
   

4. **Language** 목록에서 **Kotlin**을 선택합니다.
5. **Gradle** 빌드 시스템을 선택합니다.
6. **JDK** 목록에서 프로젝트에서 사용할 [JDK](https://www.oracle.com/java/technologies/downloads/)를 선택합니다.
   * JDK가 컴퓨터에 설치되어 있지만 IDE에 정의되지 않은 경우 **Add JDK**를 선택하고 JDK 홈 디렉터리 경로를 지정합니다.
   * 컴퓨터에 필요한 JDK가 없는 경우 **Download JDK**를 선택합니다.

7. **Gradle DSL**에 대해 Kotlin 또는 Gradle 언어를 선택합니다.
8. **Create**를 클릭합니다.

<img src="/img/script-deps-create-root-project.png" alt="Custom Kotlin scripting을 위한 루트 프로젝트 생성" width="700" style={{verticalAlign: 'middle'}}/>

## Add scripting modules

이제 빈 Kotlin/JVM Gradle 프로젝트가 있습니다. 필요한 모듈, script definition 및 scripting host를 추가합니다:

1. IntelliJ IDEA에서 **File | New | Module**을 선택합니다.
2. 왼쪽 패널에서 **New Module**을 선택합니다. 이 모듈은 script definition이 됩니다.
3. 새 모듈 이름을 지정하고 필요한 경우 위치를 변경합니다.
4. **Language** 목록에서 **Java**를 선택합니다.
5. **Gradle** 빌드 시스템과 Kotlin을 **Gradle DSL**로 선택합니다 (Kotlin으로 빌드 스크립트를 작성하려는 경우).
6. 모듈의 상위 항목으로 루트 모듈을 선택합니다.
7. **Create**를 클릭합니다.

   <img src="/img/script-deps-module-definition.png" alt="Script definition 모듈 생성" width="700" style={{verticalAlign: 'middle'}}/>

8. 모듈의 `build.gradle(.kts)` 파일에서 Kotlin Gradle 플러그인의 `version`을 제거합니다. 이미 루트 프로젝트의 빌드 스크립트에 있습니다.

9. 이전 단계를 한 번 더 반복하여 scripting host에 대한 모듈을 만듭니다.

프로젝트는 다음과 같은 구조를 가져야 합니다:

<img src="/img/script-deps-project-structure.png" alt="커스텀 스크립팅 프로젝트 구조" width="300" style={{verticalAlign: 'middle'}}/>

[kotlin-script-examples GitHub repository](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps)에서 이러한 프로젝트의 예와 더 많은 Kotlin 스크립팅 예제를 찾을 수 있습니다.

## Create a script definition

먼저 스크립트 유형을 정의합니다: 개발자가 이 유형의 스크립트에서 무엇을 작성할 수 있고 어떻게 처리할지 정의합니다.
이 튜토리얼에서는 스크립트에서 `@Repository` 및 `@DependsOn` 어노테이션에 대한 지원을 포함합니다.

1. script definition 모듈에서 `build.gradle(.kts)`의 `dependencies` 블록에 Kotlin 스크립팅 컴포넌트에 대한 dependencies를 추가합니다.
   이러한 dependencies는 script definition에 필요한 API를 제공합니다:

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven")
       // coroutines dependency는 이 특정 정의에 필요합니다.
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1") 
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies-maven'
       // coroutines dependency는 이 특정 정의에 필요합니다.
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'

   }
   ```

   </TabItem>
   </Tabs>

2. 모듈에서 `src/main/kotlin/` 디렉터리를 만들고 Kotlin 소스 파일 (예: `scriptDef.kt`)을 추가합니다.

3. `scriptDef.kt`에서 클래스를 만듭니다. 이 클래스는 이 유형의 스크립트에 대한 수퍼클래스가 되므로 `abstract` 또는 `open`으로 선언합니다.

    ```kotlin
    // 이 유형의 스크립트에 대한 abstract (또는 open) 수퍼클래스
    abstract class ScriptWithMavenDeps
    ```

   이 클래스는 나중에 script definition에 대한 참조 역할도 합니다.

4. 클래스를 script definition으로 만들려면 `@KotlinScript` 어노테이션으로 표시합니다. 어노테이션에 두 개의 파라미터를 전달합니다:
   * `fileExtension` – 이 유형의 스크립트에 대한 파일 확장자를 정의하는 `.kts`로 끝나는 문자열입니다.
   * `compilationConfiguration` – `ScriptCompilationConfiguration`을 확장하고 이 script definition에 대한 컴파일 관련 사항을 정의하는 Kotlin 클래스입니다. 다음 단계에서 만듭니다.

   ```kotlin
    // @KotlinScript 어노테이션은 script definition 클래스를 표시합니다.
    @KotlinScript(
        // 스크립트 유형에 대한 파일 확장자
        fileExtension = "scriptwithdeps.kts",
        // 스크립트 유형에 대한 컴파일 구성
        compilationConfiguration = ScriptWithMavenDepsConfiguration::class
    )
    abstract class ScriptWithMavenDeps

    object ScriptWithMavenDepsConfiguration: ScriptCompilationConfiguration()
   ```
   
   > 이 튜토리얼에서는 Kotlin 스크립팅 API에 대한 설명 없이 작동하는 코드만 제공합니다.
   > 자세한 설명이 포함된 동일한 코드는 [GitHub](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt)에서 찾을 수 있습니다.
   > 
   

5. 아래와 같이 스크립트 컴파일 구성을 정의합니다.

   ```kotlin
    object ScriptWithMavenDepsConfiguration : ScriptCompilationConfiguration(
        {
            // 이 유형의 모든 스크립트에 대한 암시적 import
            defaultImports(DependsOn::class, Repository::class)
            jvm {
                // 컨텍스트 클래스 로더에서 전체 클래스 경로를 추출하여 dependencies로 사용
                dependenciesFromCurrentContext(wholeClasspath = true) 
            }
            // 콜백
            refineConfiguration {
                // 제공된 핸들러로 지정된 어노테이션 처리
                onAnnotations(DependsOn::class, Repository::class, handler = ::configureMavenDepsOnAnnotations)
            }
        }
    )
   ```

   `configureMavenDepsOnAnnotations` 함수는 다음과 같습니다:

   ```kotlin
    // 즉석에서 컴파일을 재구성하는 핸들러
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

## Create a scripting host

다음 단계는 스크립트 실행을 처리하는 컴포넌트인 scripting host를 만드는 것입니다.

1. scripting host 모듈에서 `build.gradle(.kts)`의 `dependencies` 블록에 dependencies를 추가합니다:
   * scripting host에 필요한 API를 제공하는 Kotlin 스크립팅 컴포넌트
   * 이전에 만든 script definition 모듈

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")
       implementation(project(":script-definition")) // script definition 모듈
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
       implementation project(':script-definition') // script definition 모듈
   }
   ```

   </TabItem>
   </Tabs>

2. 모듈에서 `src/main/kotlin/` 디렉터리를 만들고 Kotlin 소스 파일 (예: `host.kt`)을 추가합니다.

3. 애플리케이션에 대한 `main` 함수를 정의합니다. 본문에서 스크립트 파일 경로인 인수 하나가 있는지 확인하고 스크립트를 실행합니다. 다음 단계에서 별도 함수 `evalFile`에서 스크립트 실행을 정의합니다.
   지금은 비어있는 상태로 선언합니다.

   `main`은 다음과 같을 수 있습니다:

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

4. 스크립트 평가 함수를 정의합니다. 여기에서 script definition을 사용합니다. 스크립트 definition 클래스를 유형 파라미터로 사용하여 `createJvmCompilationConfigurationFromTemplate`를 호출하여 가져옵니다. 그런 다음 `BasicJvmScriptingHost().eval`을 호출하여 스크립트 코드와 해당 컴파일 구성을 전달합니다. `eval`은 `ResultWithDiagnostics`의 인스턴스를 반환하므로 함수의 반환 유형으로 설정합니다.

   ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
   ```

5. 스크립트 실행에 대한 정보를 출력하도록 `main` 함수를 조정합니다:

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

## Run scripts

scripting host가 어떻게 작동하는지 확인하려면 실행할 스크립트와 실행 구성을 준비합니다.

1. 프로젝트 루트 디렉터리에 다음 내용으로 `html.scriptwithdeps.kts` 파일을 만듭니다:

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
   
   `@DependsOn` 어노테이션 인수에 참조된 `kotlinx-html-jvm` 라이브러리의 함수를 사용합니다.

2. scripting host를 시작하고 이 파일을 실행하는 실행 구성을 만듭니다:
   1. `host.kt`를 열고 `main` 함수로 이동합니다. 왼쪽에 **Run** gutter 아이콘이 있습니다.
   2. gutter 아이콘을 마우스 오른쪽 버튼으로 클릭하고 **Modify Run Configuration**을 선택합니다.
   3. **Create Run Configuration** 대화 상자에서 스크립트 파일 이름을 **Program arguments**에 추가하고 **OK**를 클릭합니다.
   
      <img src="/img/script-deps-run-config.png" alt="Scripting host 실행 구성" width="800" style={{verticalAlign: 'middle'}}/>

3. 생성된 구성을 실행합니다.

스크립트가 실행되는 방식, 지정된 repository에서 `kotlinx-html-jvm`에 대한 dependency를 확인하고 해당 함수 호출 결과를 출력하는 방법을 확인할 수 있습니다:

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

Dependencies 확인은 처음 실행할 때 시간이 걸릴 수 있습니다. 후속 실행은 로컬 Maven repository에서 다운로드한 dependencies를 사용하기 때문에 훨씬 빨리 완료됩니다.

## What's next?

간단한 Kotlin 스크립팅 프로젝트를 만들었으면 이 주제에 대한 자세한 정보를 찾으십시오:
* [Kotlin scripting KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support)을 읽어보십시오.
* 더 많은 [Kotlin 스크립팅 예제](https://github.com/Kotlin/kotlin-script-examples)를 찾아보십시오.
* Rodrigo Oliveira의 강연인 [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)을 시청하십시오.