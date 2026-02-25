<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: IntelliJ IDEA를 사용한 코루틴 디버깅 – 튜토리얼)

이 튜토리얼에서는 Kotlin 코루틴을 생성하고 IntelliJ IDEA를 사용하여 디버깅하는 방법을 설명합니다.

이 튜토리얼은 독자가 [코루틴](coroutines-guide.md) 개념에 대한 사전 지식이 있다고 가정합니다.

## 코루틴 생성하기

1. IntelliJ IDEA에서 Kotlin 프로젝트를 엽니다. 프로젝트가 없다면 [하나 생성](jvm-get-started.md#create-a-project)하세요.
2. Gradle 프로젝트에서 `kotlinx.coroutines` 라이브러리를 사용하려면 `build.gradle(.kts)` 파일에 다음 의존성을 추가하세요:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
   }
   ``` 

   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
   }
   ```
   
   </tab>
   </tabs>

   다른 빌드 시스템의 경우 [`kotlinx.coroutines` README](https://github.com/Kotlin/kotlinx.coroutines#using-in-your-projects)의 지침을 참고하세요.
   
3. `src/main/kotlin`에 있는 `Main.kt` 파일을 엽니다.

    `src` 디렉터리는 Kotlin 소스 파일과 리소스를 포함합니다. `Main.kt` 파일에는 `Hello World!`를 출력하는 샘플 코드가 들어 있습니다.

4. `main()` 함수의 코드를 다음과 같이 변경합니다:

    * [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 블록을 사용하여 코루틴을 감쌉니다.
    * [`async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 함수를 사용하여 지연된 값(deferred values) `a`와 `b`를 계산하는 코루틴을 생성합니다.
    * [`await()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html) 함수를 사용하여 계산 결과를 기다립니다.
    * [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 함수를 사용하여 계산 상태와 곱셈 결과를 출력합니다.

    ```kotlin
    import kotlinx.coroutines.*
    
    fun main() = runBlocking<Unit> {
        val a = async {
            println("I'm computing part of the answer")
            6
        }
        val b = async {
            println("I'm computing another part of the answer")
            7
        }
        println("The answer is ${a.await() * b.await()}")
    }
    ```

5. **Build Project**를 클릭하여 코드를 빌드합니다.

    ![애플리케이션 빌드](flow-build-project.png)

## 코루틴 디버깅하기

1. `println()` 함수를 호출하는 줄에 중단점(breakpoints)을 설정합니다:

    ![콘솔 애플리케이션 빌드](coroutine-breakpoint.png)

2. 화면 상단의 실행 구성(run configuration) 옆에 있는 **Debug**를 클릭하여 코드를 디버그 모드로 실행합니다.

    ![콘솔 애플리케이션 빌드](flow-debug-project.png)

    **Debug** 도구 창이 나타납니다: 
    * **Frames** 탭에는 콜 스택(call stack)이 포함되어 있습니다.
    * **Variables** 탭에는 현재 컨텍스트의 변수들이 포함되어 있습니다.
    * **Coroutines** 탭에는 실행 중이거나 일시 중단된(suspended) 코루틴에 대한 정보가 포함되어 있습니다. 여기에는 세 개의 코루틴이 있음을 보여줍니다.
    첫 번째 코루틴은 **RUNNING** 상태이고, 나머지 두 개는 **CREATED** 상태입니다.

    ![코루틴 디버깅](coroutine-debug-1.png)

3. **Debug** 도구 창에서 **Resume Program**을 클릭하여 디버거 세션을 재개합니다:

    ![코루틴 디버깅](coroutine-debug-2.png)
    
    이제 **Coroutines** 탭에는 다음 내용이 표시됩니다:
    * 첫 번째 코루틴은 **SUSPENDED** 상태입니다. 값을 곱하기 위해 대기 중입니다.
    * 두 번째 코루틴은 `a` 값을 계산하고 있으며, **RUNNING** 상태입니다.
    * 세 번째 코루틴은 **CREATED** 상태이며 `b` 값을 계산하고 있지 않습니다.

4. **Debug** 도구 창에서 **Resume Program**을 클릭하여 디버거 세션을 다시 재개합니다:

    ![콘솔 애플리케이션 빌드](coroutine-debug-3.png)

    이제 **Coroutines** 탭에는 다음 내용이 표시됩니다:
    * 첫 번째 코루틴은 **SUSPENDED** 상태입니다. 값을 곱하기 위해 대기 중입니다.
    * 두 번째 코루틴은 값을 계산하고 사라졌습니다.
    * 세 번째 코루틴은 `b` 값을 계산하고 있으며, **RUNNING** 상태입니다.

IntelliJ IDEA 디버거를 사용하면 각 코루틴을 자세히 살펴보고 코드를 디버깅할 수 있습니다.

### 최적화된 변수(Optimized-out variables)

`suspend` 함수를 사용하면 디버거에서 변수 이름 옆에 "was optimized out"이라는 텍스트가 표시될 수 있습니다.

![변수 "a"가 최적화됨](variable-optimised-out.png){width=480}

이 텍스트는 해당 변수의 수명(lifetime)이 단축되어 더 이상 존재하지 않음을 의미합니다.
최적화된 변수가 포함된 코드는 값을 확인할 수 없으므로 디버깅하기가 어렵습니다.
`-Xdebug` 컴파일러 옵션을 사용하여 이 동작을 비활성화할 수 있습니다.

> __프로덕션 환경에서는 절대 이 플래그를 사용하지 마세요__: `-Xdebug`는 [메모리 누수를 유발](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)할 수 있습니다.
>
{style="warning"}