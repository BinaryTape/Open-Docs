<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: IntelliJ IDEA를 사용하여 Kotlin Flow 디버그하기 – 튜토리얼)

이 튜토리얼은 IntelliJ IDEA를 사용하여 Kotlin Flow를 생성하고 디버그하는 방법을 보여줍니다.

이 튜토리얼은 [코루틴](coroutines-guide.md) 및 [Kotlin Flow](flow.md#flows) 개념에 대한 사전 지식이 있다고 가정합니다.

## Kotlin 플로우 생성

느린 이미터와 느린 컬렉터를 사용하여 Kotlin [플로우](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow.html)를 생성합니다.

1. IntelliJ IDEA에서 Kotlin 프로젝트를 엽니다. 프로젝트가 없다면, [프로젝트를 생성하세요](jvm-get-started.md#create-a-project).
2. Gradle 프로젝트에서 `kotlinx.coroutines` 라이브러리를 사용하려면, 다음 의존성을 `build.gradle(.kts)`에 추가하세요.
   
   <tabs group="build-script">
   <tab title="코틀린" group-key="kotlin">
   
   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
   }
   ``` 
   
   </tab>
   <tab title="그루비" group-key="groovy">
   
   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
   }
   ```
   
   </tab>
   </tabs>
   
   다른 빌드 시스템의 경우, [`kotlinx.coroutines` README](https://github.com/Kotlin/kotlinx.coroutines#using-in-your-projects)에서 지침을 확인하세요.

3. `src/main/kotlin`에서 `Main.kt` 파일을 엽니다.

    `src` 디렉터리에는 Kotlin 소스 파일과 리소스가 포함되어 있습니다. `Main.kt` 파일은 `Hello World!`를 출력하는 샘플 코드를 포함합니다.

4. 세 개의 숫자로 구성된 플로우를 반환하는 `simple()` 함수를 생성합니다.

    * [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 함수를 사용하여 CPU를 많이 사용하는 블로킹 코드를 모방합니다. 이 함수는 스레드를 블록하지 않고 100ms 동안 코루틴을 일시 중단합니다.
    * [`emit()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow-collector/emit.html) 함수를 사용하여 `for` 루프에서 값을 생성합니다.

    ```kotlin
    import kotlinx.coroutines.*
    import kotlinx.coroutines.flow.*
    import kotlin.system.*
 
    fun simple(): Flow<Int> = flow {
        for (i in 1..3) {
            delay(100)
            emit(i)
        }
    }
    ```

5. `main()` 함수 내 코드를 변경합니다.

    * 코루틴을 래핑하기 위해 [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 블록을 사용합니다.
    * [`collect()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect.html) 함수를 사용하여 방출된 값을 수집합니다.
    * [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 함수를 사용하여 CPU를 많이 사용하는 코드를 모방합니다. 이 함수는 스레드를 블록하지 않고 300ms 동안 코루틴을 일시 중단합니다.
    * [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 함수를 사용하여 플로우에서 수집된 값을 출력합니다.

    ```kotlin
    fun main() = runBlocking {
        simple()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

6. **Build Project**를 클릭하여 코드를 빌드합니다.

    ![애플리케이션 빌드](flow-build-project.png)

## 코루틴 디버그

1. `emit()` 함수가 호출되는 줄에 중단점을 설정합니다.

    ![콘솔 애플리케이션 빌드](flow-breakpoint.png)

2. 화면 상단의 실행 구성 옆에 있는 **Debug**를 클릭하여 디버그 모드로 코드를 실행합니다.

    ![콘솔 애플리케이션 빌드](flow-debug-project.png)

    **Debug** 도구 창이 나타납니다: 
    * **Frames** 탭에는 호출 스택이 포함됩니다.
    * **Variables** 탭에는 현재 컨텍스트의 변수가 포함됩니다. 이는 플로우가 첫 번째 값을 방출하고 있음을 알려줍니다.
    * **Coroutines** 탭에는 실행 중이거나 일시 중단된 코루틴에 대한 정보가 포함됩니다.

    ![코루틴 디버그](flow-debug-1.png)

3. **Debug** 도구 창에서 **Resume Program**을 클릭하여 디버거 세션을 재개합니다. 프로그램이 동일한 중단점에서 멈춥니다.

    ![코루틴 디버그](flow-resume-debug.png)

    이제 플로우가 두 번째 값을 방출합니다.

    ![코루틴 디버그](flow-debug-2.png)

### 최적화되어 제거된 변수

`suspend` 함수를 사용하는 경우, 디버거에서 변수 이름 옆에 "was optimized out" 텍스트가 표시될 수 있습니다.

![변수 "a"가 최적화되어 제거됨](variable-optimised-out.png)

이 텍스트는 변수의 수명이 단축되어 해당 변수가 더 이상 존재하지 않음을 의미합니다.
최적화된 변수가 있는 코드를 디버그하는 것은 해당 변수의 값을 볼 수 없기 때문에 어렵습니다.
`-Xdebug` 컴파일러 옵션을 사용하여 이 동작을 비활성화할 수 있습니다.

> __프로덕션 환경에서는 이 플래그를 절대 사용하지 마세요__: `-Xdebug`는 [메모리 누수를 유발할 수 있습니다](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0).
>
{style="warning"}

## 동시 실행 코루틴 추가

1. `src/main/kotlin`에서 `Main.kt` 파일을 엽니다.

2. 이미터와 컬렉터를 동시적으로 실행하도록 코드를 개선합니다.

    * 이미터와 컬렉터를 동시적으로 실행하도록 [`buffer()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html) 함수 호출을 추가합니다. `buffer()`는 방출된 값을 저장하고 플로우 컬렉터를 별도의 코루틴에서 실행합니다. 
 
    ```kotlin
    fun main() = runBlocking<Unit> {
        simple()
            .buffer()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

3. **Build Project**를 클릭하여 코드를 빌드합니다.

## 두 개의 코루틴으로 Kotlin 플로우 디버그

1. `println(value)`에 새 중단점을 설정합니다.

2. 화면 상단의 실행 구성 옆에 있는 **Debug**를 클릭하여 디버그 모드로 코드를 실행합니다.

    ![콘솔 애플리케이션 빌드](flow-debug-3.png)

    **Debug** 도구 창이 나타납니다.

    **Coroutines** 탭에서 두 개의 코루틴이 동시적으로 실행 중임을 확인할 수 있습니다. `buffer()` 함수 때문에 플로우 컬렉터와 이미터가 별도의 코루틴에서 실행됩니다.
    `buffer()` 함수는 플로우에서 방출된 값을 버퍼링합니다.
    이미터 코루틴은 **RUNNING** 상태이고, 컬렉터 코루틴은 **SUSPENDED** 상태입니다.

3. **Debug** 도구 창에서 **Resume Program**을 클릭하여 디버거 세션을 재개합니다.

    ![코루틴 디버깅](flow-debug-4.png)

    이제 컬렉터 코루틴은 **RUNNING** 상태이고, 이미터 코루틴은 **SUSPENDED** 상태입니다.

    각 코루틴을 더 깊이 탐색하여 코드를 디버그할 수 있습니다.