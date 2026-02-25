[//]: # (title: 컨텍스트 파라미터)

<primary-label ref="experimental-general"/>

> 컨텍스트 파라미터(Context parameters)는 [컨텍스트 리시버(context receivers)](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm)라고 불리는 이전 실험적 기능을 대체합니다.
> 주요 차이점은 [컨텍스트 파라미터 설계 문서](https://github.com/Kotlin/KEEP/blob/master/proposals/context-parameters.md#summary-of-changes-from-the-previous-proposal)에서 확인할 수 있습니다.
> 컨텍스트 리시버에서 컨텍스트 파라미터로 마이그레이션하려면 관련 [블로그 포스트](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)에 설명된 대로 IntelliJ IDEA의 지원 기능을 사용할 수 있습니다.
>
{style="tip"}

컨텍스트 파라미터를 사용하면 함수와 프로퍼티가 주변 컨텍스트에서 암시적으로 사용 가능한 의존성(dependencies)을 선언할 수 있습니다.

컨텍스트 파라미터를 사용하면 서비스나 의존성 같이 여러 함수 호출 간에 공유되고 거의 변경되지 않는 값을 수동으로 전달할 필요가 없습니다.

프로퍼티와 함수에 컨텍스트 파라미터를 선언하려면 `context` 키워드 뒤에 `이름: 타입` 형식으로 선언된 파라미터 목록을 추가합니다. 다음은 `UserService` 인터페이스에 대한 의존성을 가진 예시입니다:

```kotlin
// UserService는 컨텍스트에서 필요한 의존성을 정의합니다 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 컨텍스트 파라미터가 있는 함수를 선언합니다
context(users: UserService)
fun outputMessage(message: String) {
    // 컨텍스트의 log를 사용합니다
    users.log("Log: $message")
}

// 컨텍스트 파라미터가 있는 프로퍼티를 선언합니다
context(users: UserService)
val firstUser: String
    // 컨텍스트의 findUserById를 사용합니다    
    get() = users.findUserById(1)
```

컨텍스트 파라미터 이름으로 `_`를 사용할 수 있습니다. 이 경우 파라미터 값은 해석(resolution)에는 사용될 수 있지만, 블록 내부에서 이름으로 접근할 수는 없습니다:

```kotlin
// "_"를 컨텍스트 파라미터 이름으로 사용합니다
context(_: UserService)
fun logWelcome() {
    // 해석(Resolution)을 통해 UserService에서 적절한 log 함수를 여전히 찾아냅니다
    outputMessage("Welcome!")
}
```

#### 컨텍스트 파라미터 해석

Kotlin은 호출 지점(call site)의 현재 스코프에서 일치하는 컨텍스트 값을 검색하여 컨텍스트 파라미터를 해결(resolve)합니다. Kotlin은 타입을 기준으로 일치 여부를 판단합니다.
동일한 스코프 레벨에 호환되는 값이 여러 개 존재하면 컴파일러가 모호성(ambiguity) 오류를 보고합니다:

```kotlin
// UserService는 컨텍스트에서 필요한 의존성을 정의합니다
interface UserService {
    fun log(message: String)
}

// 컨텍스트 파라미터가 있는 함수를 선언합니다
context(users: UserService)
fun outputMessage(message: String) {
    users.log("Log: $message")
}

fun main() {
    // UserService 구현
    val serviceA = object : UserService {
        override fun log(message: String) = println("A: $message")
    }

    // UserService 구현
    val serviceB = object : UserService {
        override fun log(message: String) = println("B: $message")
    }

    // 호출 지점에서 serviceA와 serviceB 모두 예상되는 UserService 타입과 일치합니다
    context(serviceA, serviceB) {
        // 이는 모호성 오류를 발생시킵니다
        outputMessage("This will not compile")
    }
}
```

#### 제한 사항

컨텍스트 파라미터는 지속적으로 개선되고 있으며, 현재 몇 가지 제한 사항은 다음과 같습니다:

* 생성자에는 컨텍스트 파라미터를 선언할 수 없습니다.
* 컨텍스트 파라미터가 있는 프로퍼티는 백킹 필드(backing field)나 초기화 구문(initializer)을 가질 수 없습니다.
* 컨텍스트 파라미터가 있는 프로퍼티는 위임(delegation)을 사용할 수 없습니다.

이러한 제한 사항에도 불구하고, 컨텍스트 파라미터는 간소화된 의존성 주입, 향상된 DSL 설계 및 스코프 기반 작업을 통해 의존성 관리를 단순화합니다.

#### 컨텍스트 파라미터 활성화 방법

프로젝트에서 컨텍스트 파라미터를 활성화하려면 커맨드 라인에서 다음 컴파일러 옵션을 사용하세요:

```Bash
-Xcontext-parameters
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> `-Xcontext-receivers`와 `-Xcontext-parameters` 컴파일러 옵션을 동시에 지정하면 오류가 발생합니다.
>
{style="warning"}

이 기능은 향후 Kotlin 릴리스에서 [안정화(stabilized)](components-stability.md#stability-levels-explained) 및 개선될 예정입니다.
이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes)을 통해 여러분의 의견을 기다리고 있습니다.