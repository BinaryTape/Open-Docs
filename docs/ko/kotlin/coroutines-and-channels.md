<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 코루틴과 채널 − 튜토리얼)

이 튜토리얼에서는 IntelliJ IDEA에서 코루틴을 사용하여 기반 스레드를 블로킹하거나 콜백을 사용하지 않고 네트워크 요청을 수행하는 방법을 배웁니다.

> 코루틴에 대한 사전 지식은 필요하지 않지만, Kotlin 기본 문법에 익숙하다고 가정합니다.
>
{style="tip"}

학습 목표:

*   네트워크 요청을 수행하기 위해 suspend 함수를 사용하는 이유와 방법.
*   코루틴을 사용하여 요청을 동시에 보내는 방법.
*   채널을 사용하여 서로 다른 코루틴 간에 정보를 공유하는 방법.

네트워크 요청을 위해서는 [Retrofit](https://square.github.io/retrofit/) 라이브러리가 필요하지만, 이 튜토리얼에서 보여주는 접근 방식은 코루틴을 지원하는 다른 라이브러리에도 유사하게 적용됩니다.

> 모든 작업에 대한 솔루션은 [프로젝트 저장소](http://github.com/kotlin-hands-on/intro-coroutines)의 `solutions` 브랜치에서 찾을 수 있습니다.
>
{style="tip"}

## 시작하기 전에

1.  최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)를 다운로드하여 설치합니다.
2.  시작 화면에서 **Get from VCS**를 선택하거나 **File | New | Project from Version Control**을 선택하여 [프로젝트 템플릿](http://github.com/kotlin-hands-on/intro-coroutines)을 클론(clone)합니다.

    명령줄에서도 클론할 수 있습니다:

    ```Bash
    git clone https://github.com/kotlin-hands-on/intro-coroutines
    ```

### GitHub 개발자 토큰 생성

프로젝트에서 GitHub API를 사용할 것입니다. 접근 권한을 얻으려면 GitHub 계정 이름과 비밀번호 또는 토큰을 제공해야 합니다. 2단계 인증이 활성화되어 있다면 토큰만으로 충분합니다.

GitHub API를 [계정](https://github.com/settings/tokens/new)과 함께 사용하기 위해 새로운 GitHub 토큰을 생성합니다:

1.  토큰 이름을 지정합니다. 예를 들어, `coroutines-tutorial`로 지정합니다:

    ![새 GitHub 토큰 생성](generating-token.png){width=700}

2.  어떤 범위도 선택하지 마십시오. 페이지 하단에서 **Generate token**을 클릭합니다.
3.  생성된 토큰을 복사합니다.

### 코드 실행

이 프로그램은 주어진 조직(기본적으로 "kotlin"으로 명명됨) 아래의 모든 저장소에 대한 기여자(contributor)를 로드합니다. 나중에 기여 횟수별로 사용자를 정렬하는 로직을 추가할 것입니다.

1.  `src/contributors/main.kt` 파일을 열고 `main()` 함수를 실행합니다. 다음 창이 표시됩니다:

    ![첫 번째 창](initial-window.png){width=500}

    글꼴이 너무 작으면 `main()` 함수의 `setDefaultFontSize(18f)` 값을 변경하여 조정하십시오.

2.  해당 필드에 GitHub 사용자 이름과 토큰(또는 비밀번호)을 제공합니다.
3.  _Variant_ 드롭다운 메뉴에서 _BLOCKING_ 옵션이 선택되었는지 확인합니다.
4.  _Load contributors_를 클릭합니다. UI가 잠시 멈춘 다음 기여자 목록이 표시될 것입니다.
5.  프로그램 출력을 열어 데이터가 로드되었는지 확인합니다. 성공적인 요청마다 기여자 목록이 기록됩니다.

이 로직을 구현하는 여러 가지 방법이 있습니다: [블로킹 요청](#blocking-requests) 또는 [콜백](#callbacks)을 사용하는 것입니다. 이러한 솔루션을 [코루틴](#coroutines)을 사용하는 솔루션과 비교하고 [채널](#channels)을 사용하여 서로 다른 코루틴 간에 정보를 공유하는 방법을 살펴볼 것입니다.

## 블로킹 요청

[Retrofit](https://square.github.io/retrofit/) 라이브러리를 사용하여 GitHub에 HTTP 요청을 수행할 것입니다. 이 라이브러리는 주어진 조직 아래의 저장소 목록과 각 저장소에 대한 기여자 목록을 요청할 수 있습니다:

```kotlin
interface GitHubService {
    @GET("orgs/{org}/repos?per_page=100")
    fun getOrgReposCall(
        @Path("org") org: String
    ): Call<List<Repo>>

    @GET("repos/{owner}/{repo}/contributors?per_page=100")
    fun getRepoContributorsCall(
        @Path("owner") owner: String,
        @Path("repo") repo: String
    ): Call<List<User>>
}
```

이 API는 `loadContributorsBlocking()` 함수에 의해 사용되어 주어진 조직에 대한 기여자 목록을 가져옵니다.

1.  `src/tasks/Request1Blocking.kt`를 열어 구현을 확인합니다:

    ```kotlin
    fun loadContributorsBlocking(
        service: GitHubService,
        req: RequestData
    ): List<User> {
        val repos = service
            .getOrgReposCall(req.org)   // #1
            .execute()                  // #2
            .also { logRepos(req, it) } // #3
            .body() ?: emptyList()      // #4
    
        return repos.flatMap { repo ->
            service
                .getRepoContributorsCall(req.org, repo.name) // #1
                .execute()                                   // #2
                .also { logUsers(repo, it) }                 // #3
                .bodyList()                                  // #4
        }.aggregate()
    }
    ```

    *   먼저, 주어진 조직 아래의 저장소 목록을 가져와 `repos` 목록에 저장합니다. 그런 다음 각 저장소에 대해 기여자 목록을 요청하고, 모든 목록을 하나의 최종 기여자 목록으로 병합합니다.
    *   `getOrgReposCall()`과 `getRepoContributorsCall()`은 모두 `*Call` 클래스의 인스턴스를 반환합니다 (`#1`). 이 시점에는 요청이 전송되지 않습니다.
    *   `*Call.execute()`가 호출되어 요청을 수행합니다 (`#2`). `execute()`는 기본 스레드를 블로킹하는 동기 호출입니다.
    *   응답을 받으면 `logRepos()` 및 `logUsers()` 함수를 호출하여 결과를 기록합니다 (`#3`). HTTP 응답에 오류가 포함되어 있으면 이 오류가 여기에 기록됩니다.
    *   마지막으로, 필요한 데이터가 포함된 응답 본문을 가져옵니다. 이 튜토리얼에서는 오류가 발생한 경우 결과로 빈 목록을 사용하고 해당 오류를 기록할 것입니다 (`#4`).

2.  `.body() ?: emptyList()` 반복을 피하기 위해 확장 함수 `bodyList()`가 선언됩니다:

    ```kotlin
    fun <T> Response<List<T>>.bodyList(): List<T> {
        return body() ?: emptyList()
    }
    ```

3.  프로그램을 다시 실행하고 IntelliJ IDEA의 시스템 출력을 살펴보십시오. 다음과 유사한 내용이 표시될 것입니다:

    ```text
    1770 [AWT-EventQueue-0] INFO  Contributors - kotlin: loaded 40 repos
    2025 [AWT-EventQueue-0] INFO  Contributors - kotlin-examples: loaded 23 contributors
    2229 [AWT-EventQueue-0] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    ```

    *   각 줄의 첫 번째 항목은 프로그램 시작 이후 경과된 밀리초 수이고, 그 다음은 대괄호 안의 스레드 이름입니다. 로딩 요청이 어떤 스레드에서 호출되었는지 확인할 수 있습니다.
    *   각 줄의 마지막 항목은 실제 메시지입니다: 몇 개의 저장소 또는 기여자가 로드되었는지.

    이 로그 출력은 모든 결과가 메인 스레드에서 기록되었음을 보여줍니다. _BLOCKING_ 옵션으로 코드를 실행하면 로딩이 완료될 때까지 창이 멈추고 입력에 반응하지 않습니다. 모든 요청은 `loadContributorsBlocking()`이 호출된 스레드와 동일한 스레드(Swing에서는 AWT 이벤트 디스패치 스레드)에서 실행되며, 이 메인 스레드가 블로킹되어 UI가 멈추는 것입니다:

    ![블록된 메인 스레드](blocking.png){width=700}

    기여자 목록이 로드되면 결과가 업데이트됩니다.

4.  `src/contributors/Contributors.kt`에서 기여자 로딩 방식을 선택하는 `loadContributors()` 함수를 찾아 `loadContributorsBlocking()`이 어떻게 호출되는지 확인합니다:

    ```kotlin
    when (getSelectedVariant()) {
        BLOCKING -> { // Blocking UI thread
            val users = loadContributorsBlocking(service, req)
            updateResults(users, startTime)
        }
    }
    ```

    *   `updateResults()` 호출은 `loadContributorsBlocking()` 호출 바로 다음에 옵니다.
    *   `updateResults()`는 UI를 업데이트하므로 항상 UI 스레드에서 호출되어야 합니다.
    *   `loadContributorsBlocking()`도 UI 스레드에서 호출되므로 UI 스레드가 블록되고 UI가 멈춥니다.

### 작업 1

첫 번째 작업은 작업 도메인에 익숙해지는 데 도움이 됩니다. 현재 각 기여자의 이름이 참여한 프로젝트마다 여러 번 반복됩니다. 각 기여자가 한 번만 추가되도록 사용자를 결합하는 `aggregate()` 함수를 구현하십시오. `User.contributions` 속성은 주어진 사용자가 _모든_ 프로젝트에 기여한 총 횟수를 포함해야 합니다. 결과 목록은 기여 횟수에 따라 내림차순으로 정렬되어야 합니다.

`src/tasks/Aggregation.kt`를 열고 `List<User>.aggregate()` 함수를 구현하십시오. 사용자는 총 기여 횟수에 따라 정렬되어야 합니다.

해당 테스트 파일 `test/tasks/AggregationKtTest.kt`는 예상 결과의 예시를 보여줍니다.

> [IntelliJ IDEA 단축키](https://www.jetbrains.com/help/idea/create-tests.html#test-code-navigation) `Ctrl+Shift+T` / `⇧ ⌘ T`를 사용하여 소스 코드와 테스트 클래스 사이를 자동으로 이동할 수 있습니다.
>
{style="tip"}

이 작업을 구현한 후 "kotlin" 조직에 대한 결과 목록은 다음과 유사할 것입니다:

![“kotlin” 조직에 대한 목록](aggregate.png){width=500}

#### 작업 1 솔루션 {initial-collapse-state="collapsed" collapsible="true"}

1.  사용자를 로그인별로 그룹화하려면 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)를 사용합니다. 이 함수는 로그인에서 해당 로그인으로 다른 저장소에 있는 모든 사용자 발생을 매핑합니다.
2.  각 맵 엔트리에 대해 각 사용자의 총 기여 횟수를 세고, 주어진 이름과 총 기여 횟수로 `User` 클래스의 새 인스턴스를 만듭니다.
3.  결과 목록을 내림차순으로 정렬합니다:

    ```kotlin
    fun List<User>.aggregate(): List<User> =
        groupBy { it.login }
            .map { (login, group) -> User(login, group.sumOf { it.contributions }) }
            .sortedByDescending { it.contributions }
    ```

다른 솔루션은 `groupBy()` 대신 [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html) 함수를 사용하는 것입니다.

## 콜백

이전 솔루션은 작동하지만 스레드를 블로킹하여 UI를 멈춥니다. 이를 피하는 전통적인 접근 방식은 _콜백_을 사용하는 것입니다.

작업 완료 직후 호출되어야 하는 코드를 호출하는 대신, 별도의 콜백(종종 람다)으로 추출하고 해당 람다를 호출자에게 전달하여 나중에 호출되도록 할 수 있습니다.

UI를 반응형으로 만들려면 전체 연산을 별도의 스레드로 옮기거나, 블로킹 호출 대신 콜백을 사용하는 Retrofit API로 전환할 수 있습니다.

### 백그라운드 스레드 사용

1.  `src/tasks/Request2Background.kt`를 열어 구현을 확인합니다. 먼저, 전체 연산이 다른 스레드로 이동됩니다. `thread()` 함수는 새 스레드를 시작합니다:

    ```kotlin
    thread {
        loadContributorsBlocking(service, req)
    }
    ```

    이제 모든 로딩이 별도의 스레드로 이동되었으므로, 메인 스레드는 자유로워지고 다른 작업을 수행할 수 있습니다:

    ![자유로워진 메인 스레드](background.png){width=700}

2.  `loadContributorsBackground()` 함수의 시그니처가 변경됩니다. 모든 로딩이 완료된 후 호출할 `updateResults()` 콜백을 마지막 인수로 받습니다:

    ```kotlin
    fun loadContributorsBackground(
        service: GitHubService, req: RequestData,
        updateResults: (List<User>) -> Unit
    )
    ```

3.  이제 `loadContributorsBackground()`가 호출될 때 `updateResults()` 호출은 이전처럼 즉시 호출되지 않고 콜백 내에서 호출됩니다:

    ```kotlin
    loadContributorsBackground(service, req) { users ->
        SwingUtilities.invokeLater {
            updateResults(users, startTime)
        }
    }
    ```

    `SwingUtilities.invokeLater`를 호출함으로써, 결과를 업데이트하는 `updateResults()` 호출이 메인 UI 스레드(AWT 이벤트 디스패치 스레드)에서 발생하도록 보장합니다.

하지만 `BACKGROUND` 옵션을 통해 기여자를 로드하려고 하면 목록이 업데이트되지만 아무것도 변경되지 않는 것을 확인할 수 있습니다.

### 작업 2

`src/tasks/Request2Background.kt` 파일의 `loadContributorsBackground()` 함수를 수정하여 결과 목록이 UI에 표시되도록 하십시오.

#### 작업 2 솔루션 {initial-collapse-state="collapsed" collapsible="true"}

기여자를 로드하려고 하면 로그에서 기여자가 로드되었지만 결과가 표시되지 않는 것을 확인할 수 있습니다. 이 문제를 해결하려면 결과 사용자 목록에 대해 `updateResults()`를 호출하십시오:

```kotlin
thread {
    updateResults(loadContributorsBlocking(service, req))
}
```

콜백에 전달된 로직을 명시적으로 호출해야 합니다. 그렇지 않으면 아무 일도 일어나지 않습니다.

### Retrofit 콜백 API 사용

이전 솔루션에서 전체 로딩 로직은 백그라운드 스레드로 이동되었지만, 이는 여전히 리소스 활용 측면에서 최선이 아닙니다. 모든 로딩 요청이 순차적으로 진행되고 스레드가 로딩 결과를 기다리는 동안 블로킹되는 반면, 다른 작업을 수행할 수 있었을 것입니다. 특히, 스레드는 전체 결과를 더 빨리 받기 위해 다른 요청 로딩을 시작할 수 있었을 것입니다.

각 저장소에 대한 데이터 처리는 로딩과 결과 응답 처리의 두 부분으로 나뉘어야 합니다. 두 번째 _처리_ 부분은 콜백으로 추출되어야 합니다.

각 저장소에 대한 로딩은 이전 저장소의 결과가 수신되기 전(그리고 해당 콜백이 호출되기 전)에 시작될 수 있습니다:

![콜백 API 사용](callbacks.png){width=700}

Retrofit 콜백 API는 이를 달성하는 데 도움이 될 수 있습니다. `Call.enqueue()` 함수는 HTTP 요청을 시작하고 인수로 콜백을 받습니다. 이 콜백에서 각 요청 후 수행해야 할 작업을 지정해야 합니다.

`src/tasks/Request3Callbacks.kt`를 열어 이 API를 사용하는 `loadContributorsCallbacks()`의 구현을 확인합니다:

```kotlin
fun loadContributorsCallbacks(
    service: GitHubService, req: RequestData,
    updateResults: (List<User>) -> Unit
) {
    service.getOrgReposCall(req.org).onResponse { responseRepos ->  // #1
        logRepos(req, responseRepos)
        val repos = responseRepos.bodyList()

        val allUsers = mutableListOf<User>()
        for (repo in repos) {
            service.getRepoContributorsCall(req.org, repo.name)
                .onResponse { responseUsers ->  // #2
                    logUsers(repo, responseUsers)
                    val users = responseUsers.bodyList()
                    allUsers += users
                }
            }
        }
        // TODO: Why doesn't this code work? How to fix that?
        updateResults(allUsers.aggregate())
    }
```

*   편의를 위해 이 코드 조각은 동일 파일에 선언된 `onResponse()` 확장 함수를 사용합니다. 이 함수는 객체 표현식 대신 람다를 인수로 받습니다.
*   응답 처리를 위한 로직은 콜백으로 추출됩니다: 해당 람다는 `#1`과 `#2` 라인에서 시작됩니다.

하지만 제공된 솔루션은 작동하지 않습니다. 프로그램을 실행하고 _CALLBACKS_ 옵션을 선택하여 기여자를 로드하면 아무것도 표시되지 않는 것을 볼 수 있습니다. 하지만 `Request3CallbacksKtTest`의 테스트는 성공적으로 통과했다고 즉시 결과를 반환합니다.

주어진 코드가 예상대로 작동하지 않는 이유를 생각해보고 수정해 보거나, 아래 솔루션을 참조하십시오.

### 작업 3 (선택 사항)

`src/tasks/Request3Callbacks.kt` 파일의 코드를 수정하여 로드된 기여자 목록이 표시되도록 하십시오.

#### 작업 3의 첫 번째 시도 솔루션 {initial-collapse-state="collapsed" collapsible="true"}

현재 솔루션에서는 많은 요청이 동시에 시작되어 총 로딩 시간이 줄어듭니다. 하지만 결과는 로드되지 않습니다. 이는 `updateResults()` 콜백이 `allUsers` 목록이 데이터로 채워지기 전에 모든 로딩 요청이 시작된 직후 호출되기 때문입니다.

다음과 같이 변경하여 이를 해결할 수 있습니다:

```kotlin
val allUsers = mutableListOf<User>()
for ((index, repo) in repos.withIndex()) {   // #1
    service.getRepoContributorsCall(req.org, repo.name)
        .onResponse { responseUsers ->
            logUsers(repo, responseUsers)
            val users = responseUsers.bodyList()
            allUsers += users
            if (index == repos.lastIndex) {    // #2
                updateResults(allUsers.aggregate())
            }
        }
}
```

*   먼저, 인덱스와 함께 저장소 목록을 반복합니다 (`#1`).
*   그런 다음, 각 콜백에서 마지막 반복인지 확인합니다 (`#2`).
*   그렇다면 결과가 업데이트됩니다.

하지만 이 코드 또한 우리의 목표를 달성하지 못합니다. 직접 답을 찾아보거나 아래 솔루션을 참조하십시오.

#### 작업 3의 두 번째 시도 솔루션 {initial-collapse-state="collapsed" collapsible="true"}

로딩 요청이 동시에 시작되기 때문에 마지막 요청의 결과가 마지막으로 도착한다는 보장은 없습니다. 결과는 어떤 순서로든 도착할 수 있습니다.

따라서 완료 조건으로 현재 인덱스를 `lastIndex`와 비교하면 일부 저장소에 대한 결과를 잃을 위험이 있습니다.

마지막 저장소를 처리하는 요청이 이전 요청보다 더 빨리 반환되면(이는 발생할 가능성이 높습니다), 더 많은 시간이 걸리는 요청의 모든 결과는 손실됩니다.

이를 해결하는 한 가지 방법은 인덱스를 도입하고 모든 저장소가 이미 처리되었는지 확인하는 것입니다:

```kotlin
val allUsers = Collections.synchronizedList(mutableListOf<User>())
val numberOfProcessed = AtomicInteger()
for (repo in repos) {
    service.getRepoContributorsCall(req.org, repo.name)
        .onResponse { responseUsers ->
            logUsers(repo, responseUsers)
            val users = responseUsers.bodyList()
            allUsers += users
            if (numberOfProcessed.incrementAndGet() == repos.size) {
                updateResults(allUsers.aggregate())
            }
        }
}
```

이 코드는 동기화된 버전의 목록과 `AtomicInteger()`를 사용합니다. 일반적으로 `getRepoContributors()` 요청을 처리하는 서로 다른 콜백이 항상 동일한 스레드에서 호출된다는 보장이 없기 때문입니다.

#### 작업 3의 세 번째 시도 솔루션 {initial-collapse-state="collapsed" collapsible="true"}

더 나은 솔루션은 `CountDownLatch` 클래스를 사용하는 것입니다. 이 클래스는 저장소 수로 초기화된 카운터를 저장합니다. 이 카운터는 각 저장소를 처리한 후 감소합니다. 그런 다음 래치가 0으로 카운트 다운될 때까지 기다린 다음 결과를 업데이트합니다:

```kotlin
val countDownLatch = CountDownLatch(repos.size)
for (repo in repos) {
    service.getRepoContributorsCall(req.org, repo.name)
        .onResponse { responseUsers ->
            // processing repository
            countDownLatch.countDown()
        }
}
countDownLatch.await()
updateResults(allUsers.aggregate())
```

결과는 메인 스레드에서 업데이트됩니다. 이는 로직을 자식 스레드에 위임하는 것보다 더 직접적인 방법입니다.

이 세 가지 솔루션 시도를 검토한 후, 콜백을 사용하여 올바른 코드를 작성하는 것은 특히 여러 기본 스레드와 동기화가 발생할 때 비자명하고 오류가 발생하기 쉽다는 것을 알 수 있습니다.

> 추가 연습으로 RxJava 라이브러리를 사용하여 반응형 접근 방식으로 동일한 로직을 구현할 수 있습니다. RxJava를 사용하는 데 필요한 모든 종속성과 솔루션은 별도의 `rx` 브랜치에서 찾을 수 있습니다. 또한 이 튜토리얼을 완료하고 제안된 Rx 버전을 구현하거나 확인하여 적절한 비교를 할 수 있습니다.
>
{style="tip"}

## Suspend 함수

동일한 로직을 suspend 함수를 사용하여 구현할 수 있습니다. `Call<List<Repo>>`를 반환하는 대신, API 호출을 다음과 같이 [suspend 함수](composing-suspending-functions.md)로 정의합니다:

```kotlin
interface GitHubService {
    @GET("orgs/{org}/repos?per_page=100")
    suspend fun getOrgRepos(
        @Path("org") org: String
    ): List<Repo>
}
```

*   `getOrgRepos()`는 `suspend` 함수로 정의됩니다. suspend 함수를 사용하여 요청을 수행할 때 기본 스레드는 블로킹되지 않습니다. 작동 방식에 대한 자세한 내용은 다음 섹션에서 설명합니다.
*   `getOrgRepos()`는 `Call`을 반환하는 대신 직접 결과를 반환합니다. 결과가 실패하면 예외가 발생합니다.

또는 Retrofit은 `Response`로 래핑된 결과를 반환할 수 있도록 허용합니다. 이 경우 결과 본문이 제공되며, 오류를 수동으로 확인할 수 있습니다. 이 튜토리얼은 `Response`를 반환하는 버전을 사용합니다.

`src/contributors/GitHubService.kt`에 다음 선언을 `GitHubService` 인터페이스에 추가합니다:

```kotlin
interface GitHubService {
    // getOrgReposCall & getRepoContributorsCall declarations

    @GET("orgs/{org}/repos?per_page=100")
    suspend fun getOrgRepos(
        @Path("org") org: String
    ): Response<List<Repo>>

    @GET("repos/{owner}/{repo}/contributors?per_page=100")
    suspend fun getRepoContributors(
        @Path("owner") owner: String,
        @Path("repo") repo: String
    ): Response<List<User>>
}
```

### 작업 4

두 개의 새로운 suspend 함수 `getOrgRepos()`와 `getRepoContributors()`를 사용하도록 기여자 로딩 함수의 코드를 변경하는 것이 당신의 작업입니다. 새로운 `loadContributorsSuspend()` 함수는 새로운 API를 사용하기 위해 `suspend`로 표시됩니다.

> Suspend 함수는 모든 곳에서 호출될 수 없습니다. `loadContributorsBlocking()`에서 suspend 함수를 호출하면 "Suspend function 'getOrgRepos' should be called only from a coroutine or another suspend function" 메시지와 함께 오류가 발생할 것입니다.
>
{style="note"}

1.  `src/tasks/Request1Blocking.kt`에 정의된 `loadContributorsBlocking()`의 구현을 `src/tasks/Request4Suspend.kt`에 정의된 `loadContributorsSuspend()`로 복사합니다.
2.  `Call`을 반환하는 함수 대신 새로운 suspend 함수를 사용하도록 코드를 수정합니다.
3.  _SUSPEND_ 옵션을 선택하여 프로그램을 실행하고 GitHub 요청이 수행되는 동안 UI가 계속 반응하는지 확인합니다.

#### 작업 4 솔루션 {initial-collapse-state="collapsed" collapsible="true"}

`.getOrgReposCall(req.org).execute()`를 `.getOrgRepos(req.org)`로 바꾸고, 두 번째 "기여자" 요청에도 동일한 교체를 반복합니다:

```kotlin
suspend fun loadContributorsSuspend(service: GitHubService, req: RequestData): List<User> {
    val repos = service
        .getOrgRepos(req.org)
        .also { logRepos(req, it) }
        .bodyList()

    return repos.flatMap { repo ->
        service.getRepoContributors(req.org, repo.name)
            .also { logUsers(repo, it) }
            .bodyList()
    }.aggregate()
}
```

*   `loadContributorsSuspend()`는 `suspend` 함수로 정의되어야 합니다.
*   이전에는 `Response`를 반환하던 `execute`를 더 이상 호출할 필요가 없습니다. 이제 API 함수가 `Response`를 직접 반환하기 때문입니다. 이 세부 사항은 Retrofit 라이브러리에 특화된 것이며, 다른 라이브러리에서는 API가 다르겠지만 개념은 동일합니다.

## 코루틴

Suspend 함수를 사용한 코드는 "블로킹" 버전과 유사해 보입니다. 블로킹 버전과의 주요 차이점은 스레드를 블로킹하는 대신 코루틴이 중단된다는 점입니다:

```text
block -> suspend
thread -> coroutine
```

> 코루틴은 스레드에서 코드를 실행하는 것과 유사하게 코루틴에서 코드를 실행할 수 있기 때문에 종종 경량 스레드라고 불립니다. 이전에는 블로킹되어 피해야 했던 작업들이 이제는 코루틴을 중단시킬 수 있습니다.
>
{style="note"}

### 새 코루틴 시작

`src/contributors/Contributors.kt`에서 `loadContributorsSuspend()`가 어떻게 사용되는지 살펴보면 `launch` 내에서 호출되는 것을 볼 수 있습니다. `launch`는 람다를 인수로 받는 라이브러리 함수입니다:

```kotlin
launch {
    val users = loadContributorsSuspend(req)
    updateResults(users, startTime)
}
```

여기서 `launch`는 데이터 로딩 및 결과 표시를 담당하는 새로운 연산을 시작합니다. 이 연산은 일시 중단될 수 있습니다. 네트워크 요청을 수행할 때 일시 중단되어 기본 스레드를 해제합니다. 네트워크 요청이 결과를 반환하면 연산이 재개됩니다.

이러한 일시 중단 가능한 연산을 _코루틴_이라고 합니다. 따라서 이 경우 `launch`는 데이터 로딩 및 결과 표시를 담당하는 _새로운 코루틴을 시작합니다_.

코루틴은 스레드 위에서 실행되며 일시 중단될 수 있습니다. 코루틴이 일시 중단되면 해당 연산은 일시 중지되고 스레드에서 제거되어 메모리에 저장됩니다. 그 동안 스레드는 다른 작업을 수행할 수 있습니다:

![코루틴 중단](suspension-process.gif){width=700}

연산이 계속될 준비가 되면 스레드(반드시 동일한 스레드는 아님)로 반환됩니다.

`loadContributorsSuspend()` 예시에서 각 "기여자" 요청은 이제 중단 메커니즘을 사용하여 결과를 기다립니다. 먼저 새 요청이 전송됩니다. 그런 다음 응답을 기다리는 동안 `launch` 함수에 의해 시작된 전체 "기여자 로드" 코루틴이 중단됩니다.

코루틴은 해당 응답이 수신된 후에만 재개됩니다:

![요청 중단](suspend-requests.png){width=700}

응답을 기다리는 동안 스레드는 다른 작업을 수행할 수 있습니다. 모든 요청이 메인 UI 스레드에서 발생함에도 불구하고 UI는 계속 반응합니다:

1.  _SUSPEND_ 옵션을 사용하여 프로그램을 실행합니다. 로그는 모든 요청이 메인 UI 스레드로 전송되었음을 확인합니다:

    ```text
    2538 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 30 repos
    2729 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - ts2kt: loaded 11 contributors
    3029 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    11252 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin-coroutines-workshop: loaded 1 contributors
    ```

2.  로그는 해당 코드가 실행 중인 코루틴을 보여줄 수 있습니다. 이를 활성화하려면 **Run | Edit configurations**를 열고 `-Dkotlinx.coroutines.debug` VM 옵션을 추가하십시오:

    ![실행 구성 편집](run-configuration.png){width=500}

    `main()`이 이 옵션으로 실행되는 동안 코루틴 이름이 스레드 이름에 첨부됩니다. 모든 Kotlin 파일을 실행하기 위한 템플릿을 수정하고 이 옵션을 기본값으로 활성화할 수도 있습니다.

이제 모든 코드가 위에서 언급한 "기여자 로드" 코루틴인 `@coroutine#1`로 표시된 하나의 코루틴에서 실행됩니다. 결과를 기다리는 동안 코드가 순차적으로 작성되었으므로 다른 요청을 보내기 위해 스레드를 재사용해서는 안 됩니다. 새 요청은 이전 결과가 수신된 후에만 전송됩니다.

Suspend 함수는 스레드를 공정하게 처리하며 "대기"를 위해 스레드를 블로킹하지 않습니다. 하지만 이는 아직 어떤 동시성도 제공하지 않습니다.

## 동시성

Kotlin 코루틴은 스레드보다 훨씬 적은 리소스를 사용합니다.
새로운 연산을 비동기적으로 시작하고 싶을 때마다 새 코루틴을 생성할 수 있습니다.

새 코루틴을 시작하려면 주요 _코루틴 빌더_ 중 하나인 `launch`, `async` 또는 `runBlocking`을 사용합니다. 다른 라이브러리는 추가 코루틴 빌더를 정의할 수 있습니다.

`async`는 새 코루틴을 시작하고 `Deferred` 객체를 반환합니다. `Deferred`는 `Future` 또는 `Promise`와 같은 다른 이름으로 알려진 개념을 나타냅니다. 이 객체는 연산을 저장하지만 최종 결과를 얻는 시점을 _지연_시키고, _미래의_ 어느 시점에 결과를 _약속_합니다.

`async`와 `launch`의 주요 차이점은 `launch`는 특정 결과를 반환할 것으로 예상되지 않는 연산을 시작하는 데 사용된다는 것입니다. `launch`는 코루틴을 나타내는 `Job`을 반환합니다. `Job.join()`을 호출하여 완료될 때까지 기다릴 수 있습니다.

`Deferred`는 `Job`을 확장하는 제네릭 타입입니다. `async` 호출은 람다가 반환하는 내용(람다 내부의 마지막 표현식이 결과)에 따라 `Deferred<Int>` 또는 `Deferred<CustomType>`을 반환할 수 있습니다.

코루틴의 결과를 얻으려면 `Deferred` 인스턴스에서 `await()`를 호출할 수 있습니다. 결과를 기다리는 동안 이 `await()`가 호출된 코루틴은 중단됩니다:

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val deferred: Deferred<Int> = async {
        loadData()
    }
    println("waiting...")
    println(deferred.await())
}

suspend fun loadData(): Int {
    println("loading...")
    delay(1000L)
    println("loaded!")
    return 42
}
```

`runBlocking`은 일반 함수와 suspend 함수 사이, 또는 블로킹 세계와 비블로킹 세계 사이의 다리 역할을 합니다. 이는 최상위 메인 코루틴을 시작하기 위한 어댑터 역할을 합니다. 주로 `main()` 함수와 테스트에서 사용하도록 의도되었습니다.

> 코루틴에 대한 더 나은 이해를 위해 [이 비디오](https://www.youtube.com/watch?v=zEZc5AmHQhk)를 시청하십시오.
>
{style="tip"}

지연 객체 목록이 있다면 `awaitAll()`을 호출하여 모든 결과가 도착할 때까지 기다릴 수 있습니다:

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val deferreds: List<Deferred<Int>> = (1..3).map {
        async {
            delay(1000L * it)
            println("Loading $it")
            it
        }
    }
    val sum = deferreds.awaitAll().sum()
    println("$sum")
}
```

각 "기여자" 요청이 새 코루틴에서 시작되면 모든 요청이 비동기적으로 시작됩니다. 이전 요청의 결과가 수신되기 전에 새 요청을 보낼 수 있습니다:

![동시 코루틴](concurrency.png){width=700}

총 로딩 시간은 _CALLBACKS_ 버전과 거의 동일하지만 콜백이 필요하지 않습니다. 더욱이 `async`는 코드에서 어떤 부분이 동시에 실행되는지 명시적으로 강조합니다.

### 작업 5

`Request5Concurrent.kt` 파일에서 이전 `loadContributorsSuspend()` 함수를 사용하여 `loadContributorsConcurrent()` 함수를 구현하십시오.

#### 작업 5 팁 {initial-collapse-state="collapsed" collapsible="true"}

코루틴 스코프 내에서만 새 코루틴을 시작할 수 있습니다. `loadContributorsSuspend()`의 내용을 `coroutineScope` 호출로 복사하여 `async` 함수를 그 안에서 호출할 수 있도록 하십시오:

```kotlin
suspend fun loadContributorsConcurrent(
    service: GitHubService,
    req: RequestData
): List<User> = coroutineScope {
    // ...
}
```

다음 스키마를 기반으로 솔루션을 만드십시오:

```kotlin
val deferreds: List<Deferred<List<User>>> = repos.map { repo ->
    async {
        // load contributors for each repo
    }
}
deferreds.awaitAll() // List<List<User>>
```

#### 작업 5 솔루션 {initial-collapse-state="collapsed" collapsible="true"}

각 "기여자" 요청을 `async`로 래핑하여 저장소 수만큼 코루틴을 생성합니다. `async`는 `Deferred<List<User>>`를 반환합니다. 새 코루틴을 생성하는 것은 리소스 소모가 적으므로 필요한 만큼 생성할 수 있다는 점에서 문제는 없습니다.

1.  `flatMap`을 더 이상 사용할 수 없습니다. `map` 결과는 이제 목록의 목록이 아닌 `Deferred` 객체 목록이기 때문입니다. `awaitAll()`은 `List<List<User>>`를 반환하므로 `flatten().aggregate()`를 호출하여 결과를 얻습니다:

    ```kotlin
    suspend fun loadContributorsConcurrent(
        service: GitHubService, 
        req: RequestData
    ): List<User> = coroutineScope {
        val repos = service
            .getOrgRepos(req.org)
            .also { logRepos(req, it) }
            .bodyList()
    
        val deferreds: List<Deferred<List<User>>> = repos.map { repo ->
            async {
                service.getRepoContributors(req.org, repo.name)
                    .also { logUsers(repo, it) }
                    .bodyList()
            }
        }
        deferreds.awaitAll().flatten().aggregate()
    }
    ```

2.  코드를 실행하고 로그를 확인합니다. 멀티스레딩이 아직 사용되지 않았기 때문에 모든 코루틴이 여전히 메인 UI 스레드에서 실행되지만, 코루틴을 동시에 실행하는 이점을 이미 볼 수 있습니다.
3.  이 코드를 변경하여 "기여자" 코루틴을 공통 스레드 풀의 다른 스레드에서 실행하려면 `async` 함수에 대한 컨텍스트 인수로 `Dispatchers.Default`를 지정합니다:

    ```kotlin
    async(Dispatchers.Default) { }
    ```

    *   `CoroutineDispatcher`는 해당 코루틴이 실행되어야 하는 스레드를 결정합니다. 인수로 지정하지 않으면 `async`는 바깥 스코프의 디스패처를 사용합니다.
    *   `Dispatchers.Default`는 JVM의 공유 스레드 풀을 나타냅니다. 이 풀은 병렬 실행 수단을 제공합니다. 사용 가능한 CPU 코어 수만큼 스레드로 구성되지만, 코어가 하나만 있는 경우에도 여전히 두 개의 스레드를 가질 것입니다.

4.  `loadContributorsConcurrent()` 함수의 코드를 수정하여 공통 스레드 풀의 다른 스레드에서 새 코루틴을 시작하도록 합니다. 또한 요청을 보내기 전에 추가 로깅을 추가합니다:

    ```kotlin
    async(Dispatchers.Default) {
        log("starting loading for ${repo.name}")
        service.getRepoContributors(req.org, repo.name)
            .also { logUsers(repo, it) }
            .bodyList()
    }
    ```

5.  프로그램을 다시 실행합니다. 로그에서 각 코루틴이 스레드 풀의 한 스레드에서 시작되어 다른 스레드에서 재개될 수 있음을 확인할 수 있습니다:

    ```text
    1946 [DefaultDispatcher-worker-2 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    1946 [DefaultDispatcher-worker-3 @coroutine#5] INFO  Contributors - starting loading for dokka
    1946 [DefaultDispatcher-worker-1 @coroutine#3] INFO  Contributors - starting loading for ts2kt
    ...
    2178 [DefaultDispatcher-worker-1 @coroutine#4] INFO  Contributors - kotlin-koans: loaded 45 contributors
    2569 [DefaultDispatcher-worker-1 @coroutine#5] INFO  Contributors - dokka: loaded 36 contributors
    2821 [DefaultDispatcher-worker-2 @coroutine#3] INFO  Contributors - ts2kt: loaded 11 contributors
    ```

    예를 들어, 이 로그 발췌문에서 `coroutine#4`는 `worker-2` 스레드에서 시작되어 `worker-1` 스레드에서 계속됩니다.

`src/contributors/Contributors.kt`에서 _CONCURRENT_ 옵션의 구현을 확인합니다:

1.  코루틴을 메인 UI 스레드에서만 실행하려면 `Dispatchers.Main`을 인수로 지정합니다:

    ```kotlin
    launch(Dispatchers.Main) {
        updateResults()
    }
    ```

    *   새 코루틴을 메인 스레드에서 시작할 때 메인 스레드가 바쁘다면, 코루틴은 중단되고 이 스레드에서 실행되도록 스케줄링됩니다. 코루틴은 스레드가 자유로워질 때만 재개됩니다.
    *   각 엔드포인트에 명시적으로 지정하는 대신 바깥 스코프의 디스패처를 사용하는 것이 좋은 관행으로 간주됩니다. `Dispatchers.Default`를 인수로 전달하지 않고 `loadContributorsConcurrent()`를 정의하면 이 함수를 어떤 컨텍스트에서든 호출할 수 있습니다: `Default` 디스패처, 메인 UI 스레드 또는 사용자 지정 디스패처.
    *   나중에 보겠지만, 테스트에서 `loadContributorsConcurrent()`를 호출할 때 `TestDispatcher`와 함께 컨텍스트에서 호출할 수 있어 테스트가 단순해집니다. 이는 이 솔루션을 훨씬 더 유연하게 만듭니다.

2.  호출자 측에서 디스패처를 지정하려면, `loadContributorsConcurrent`가 상속된 컨텍스트에서 코루틴을 시작하도록 하면서 프로젝트에 다음 변경 사항을 적용합니다:

    ```kotlin
    launch(Dispatchers.Default) {
        val users = loadContributorsConcurrent(service, req)
        withContext(Dispatchers.Main) {
            updateResults(users, startTime)
        }
    }
    ```

    *   `updateResults()`는 메인 UI 스레드에서 호출되어야 하므로 `Dispatchers.Main` 컨텍스트로 호출합니다.
    *   `withContext()`는 지정된 코루틴 컨텍스트로 주어진 코드를 호출하며, 완료될 때까지 중단되고 결과를 반환합니다. 이를 표현하는 또 다른 방법은 새로운 코루틴을 시작하고 완료될 때까지 명시적으로 기다리는 것입니다: `launch(context) { ... }.join()`.

3.  코드를 실행하고 코루틴이 스레드 풀의 스레드에서 실행되는지 확인합니다.

## 구조화된 동시성

*   _코루틴 스코프_는 서로 다른 코루틴 간의 구조와 부모-자식 관계를 담당합니다. 일반적으로 새 코루틴은 스코프 내에서 시작되어야 합니다.
*   _코루틴 컨텍스트_는 코루틴의 사용자 지정 이름이나 코루틴이 스케줄링되어야 하는 스레드를 지정하는 디스패처와 같이 주어진 코루틴을 실행하는 데 사용되는 추가 기술 정보를 저장합니다.

`launch`, `async` 또는 `runBlocking`이 새 코루틴을 시작하는 데 사용될 때, 이들은 자동으로 해당 스코프를 생성합니다. 이러한 모든 함수는 리시버가 있는 람다를 인수로 받으며, `CoroutineScope`가 암시적 리시버 타입입니다:

```kotlin
launch { /* this: CoroutineScope */ }
```

*   새 코루틴은 스코프 내에서만 시작될 수 있습니다.
*   `launch`와 `async`는 `CoroutineScope`의 확장으로 선언되어 있으므로, 이들을 호출할 때 항상 암시적 또는 명시적 리시버가 전달되어야 합니다.
*   `runBlocking`에 의해 시작된 코루틴은 `runBlocking`이 최상위 함수로 정의되어 있기 때문에 유일한 예외입니다. 하지만 이 함수는 현재 스레드를 블로킹하므로 주로 `main()` 함수와 테스트에서 브릿지 함수로 사용됩니다.

`runBlocking`, `launch` 또는 `async` 내에서 새로운 코루틴은 스코프 내에서 자동으로 시작됩니다:

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking { /* this: CoroutineScope */
    launch { /* ... */ }
    // the same as:   
    this.launch { /* ... */ }
}
```

`runBlocking` 내에서 `launch`를 호출할 때, 이 함수는 `CoroutineScope` 타입의 암시적 리시버의 확장으로 호출됩니다. 또는 `this.launch`라고 명시적으로 작성할 수도 있습니다.

중첩된 코루틴(이 예에서는 `launch`로 시작된)은 외부 코루틴(`runBlocking`으로 시작된)의 자식으로 간주될 수 있습니다. 이 "부모-자식" 관계는 스코프를 통해 작동합니다. 자식 코루틴은 부모 코루틴에 해당하는 스코프에서 시작됩니다.

`coroutineScope` 함수를 사용하여 새 코루틴을 시작하지 않고 새 스코프를 생성할 수 있습니다. 외부 스코프에 접근하지 않고 `suspend` 함수 내에서 구조화된 방식으로 새 코루틴을 시작하려면, 이 `suspend` 함수가 호출된 외부 스코프의 자식이 자동으로 되는 새 코루틴 스코프를 생성할 수 있습니다. `loadContributorsConcurrent()`가 좋은 예입니다.

또한 `GlobalScope.async` 또는 `GlobalScope.launch`를 사용하여 전역 스코프에서 새 코루틴을 시작할 수 있습니다.
이렇게 하면 최상위 "독립적인" 코루틴이 생성됩니다.

코루틴의 구조 뒤에 있는 메커니즘을 _구조화된 동시성_이라고 합니다. 이는 전역 스코프에 비해 다음과 같은 이점을 제공합니다:

*   스코프는 일반적으로 수명 주기가 스코프의 수명 주기에 연결된 자식 코루틴을 담당합니다.
*   스코프는 문제가 발생하거나 사용자가 마음을 바꾸어 작업을 취소하기로 결정하면 자식 코루틴을 자동으로 취소할 수 있습니다.
*   스코프는 모든 자식 코루틴의 완료를 자동으로 기다립니다.
    따라서 스코프가 코루틴에 해당하면, 부모 코루틴은 스코프 내에서 시작된 모든 코루틴이 완료될 때까지 완료되지 않습니다.

`GlobalScope.async`를 사용할 때는 여러 코루틴을 더 작은 스코프에 바인딩하는 구조가 없습니다.
전역 스코프에서 시작된 코루틴은 모두 독립적이며, 그 수명은 전체 애플리케이션의 수명에 의해서만 제한됩니다. 전역 스코프에서 시작된 코루틴에 대한 참조를 저장하고 완료될 때까지 기다리거나 명시적으로 취소할 수 있지만, 구조화된 동시성처럼 자동으로 발생하지는 않습니다.

### 기여자 로딩 취소

기여자 목록을 로드하는 함수의 두 가지 버전을 생성합니다. 부모 코루틴을 취소하려고 할 때 두 버전이 어떻게 작동하는지 비교합니다. 첫 번째 버전은 `coroutineScope`를 사용하여 모든 자식 코루틴을 시작하고, 두 번째 버전은 `GlobalScope`를 사용합니다.

1.  `Request5Concurrent.kt`에서 `loadContributorsConcurrent()` 함수에 3초 지연을 추가합니다:

   ```kotlin
   suspend fun loadContributorsConcurrent(
       service: GitHubService, 
       req: RequestData
   ): List<User> = coroutineScope {
       // ...
       async {
           log("starting loading for ${repo.name}")
           delay(3000)
           // load repo contributors
       }
       // ...
   }
   ```
   
   이 지연은 요청을 보내는 모든 코루틴에 영향을 미치므로, 코루틴이 시작되었지만 요청이 전송되기 전에 로딩을 취소할 충분한 시간이 있습니다.

2.  로딩 함수의 두 번째 버전을 생성합니다: `loadContributorsConcurrent()`의 구현을 `Request5NotCancellable.kt`의 `loadContributorsNotCancellable()`로 복사한 다음, 새 `coroutineScope`의 생성을 제거합니다.
3.  `async` 호출이 이제 해결되지 않으므로 `GlobalScope.async`를 사용하여 시작합니다:

    ```kotlin
    suspend fun loadContributorsNotCancellable(
        service: GitHubService,
        req: RequestData
    ): List<User> {   // #1
        // ...
        GlobalScope.async {   // #2
            log("starting loading for ${repo.name}")
            // load repo contributors
        }
        // ...
        return deferreds.awaitAll().flatten().aggregate()  // #3
    }
    ```

    *   함수는 이제 람다 내부의 마지막 표현식이 아닌 직접 결과를 반환합니다 (`#1` 및 `#3` 라인).
    *   모든 "기여자" 코루틴은 코루틴 스코프의 자식이 아닌 `GlobalScope` 내부에서 시작됩니다 (`#2` 라인).

4.  프로그램을 실행하고 _CONCURRENT_ 옵션을 선택하여 기여자를 로드합니다.
5.  모든 "기여자" 코루틴이 시작될 때까지 기다렸다가 _Cancel_을 클릭합니다. 로그에 새 결과가 표시되지 않으며, 이는 모든 요청이 실제로 취소되었음을 의미합니다:

    ```text
    2896 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 40 repos
    2901 [DefaultDispatcher-worker-2 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    ...
    2909 [DefaultDispatcher-worker-5 @coroutine#36] INFO  Contributors - starting loading for mpp-example
    /* click on 'cancel' */
    /* no requests are sent */
    ```

6.  5단계를 반복하지만, 이번에는 `NOT_CANCELLABLE` 옵션을 선택합니다:

    ```text
    2570 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 30 repos
    2579 [DefaultDispatcher-worker-1 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    ...
    2586 [DefaultDispatcher-worker-6 @coroutine#36] INFO  Contributors - starting loading for mpp-example
    /* click on 'cancel' */
    /* but all the requests are still sent: */
    6402 [DefaultDispatcher-worker-5 @coroutine#4] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    9555 [DefaultDispatcher-worker-8 @coroutine#36] INFO  Contributors - mpp-example: loaded 8 contributors
    ```

    이 경우, 어떤 코루틴도 취소되지 않으며 모든 요청은 여전히 전송됩니다.

7.  "기여자" 프로그램에서 취소가 어떻게 트리거되는지 확인합니다. _Cancel_ 버튼을 클릭하면 메인 "로딩" 코루틴이 명시적으로 취소되고 자식 코루틴은 자동으로 취소됩니다:

    ```kotlin
    interface Contributors {
    
        fun loadContributors() {
            // ...
            when (getSelectedVariant()) {
                CONCURRENT -> {
                    launch {
                        val users = loadContributorsConcurrent(service, req)
                        updateResults(users, startTime)
                    }.setUpCancellation()      // #1
                }
            }
        }
    
        private fun Job.setUpCancellation() {
            val loadingJob = this              // #2
    
            // cancel the loading job if the 'cancel' button was clicked:
            val listener = ActionListener {
                loadingJob.cancel()            // #3
                updateLoadingStatus(CANCELED)
            }
            // add a listener to the 'cancel' button:
            addCancelListener(listener)
    
            // update the status and remove the listener
            // after the loading job is completed
        }
    }   
    ```

`launch` 함수는 `Job` 인스턴스를 반환합니다. `Job`은 모든 데이터를 로드하고 결과를 업데이트하는 "로딩 코루틴"에 대한 참조를 저장합니다. `setUpCancellation()` 확장 함수를 호출할 수 있으며 (`#1` 라인), `Job` 인스턴스를 리시버로 전달합니다.

이를 표현하는 또 다른 방법은 명시적으로 다음과 같이 작성하는 것입니다:

```kotlin
val job = launch { }
job.setUpCancellation()
```

*   가독성을 위해 함수 내에서 `setUpCancellation()` 함수의 리시버를 새로운 `loadingJob` 변수로 참조할 수 있습니다 (`#2` 라인).
*   그런 다음 _Cancel_ 버튼에 리스너를 추가하여 클릭될 때 `loadingJob`이 취소되도록 할 수 있습니다 (`#3` 라인).

구조화된 동시성을 사용하면 부모 코루틴만 취소하면 되며, 이는 자동으로 모든 자식 코루틴에 취소를 전파합니다.

### 외부 스코프의 컨텍스트 사용

주어진 스코프 내에서 새로운 코루틴을 시작할 때, 모든 코루틴이 동일한 컨텍스트에서 실행되도록 보장하는 것이 훨씬 쉽습니다. 필요한 경우 컨텍스트를 교체하는 것도 훨씬 쉽습니다.

이제 외부 스코프의 디스패처를 사용하는 방법이 어떻게 작동하는지 배울 시간입니다. `coroutineScope` 또는 코루틴 빌더에 의해 생성된 새 스코프는 항상 외부 스코프에서 컨텍스트를 상속합니다. 이 경우 외부 스코프는 `suspend loadContributorsConcurrent()` 함수가 호출된 스코프입니다:

```kotlin
launch(Dispatchers.Default) {  // outer scope
    val users = loadContributorsConcurrent(service, req)
    // ...
}
```

모든 중첩된 코루틴은 상속된 컨텍스트로 자동으로 시작됩니다. 디스패처는 이 컨텍스트의 일부입니다. 그렇기 때문에 `async`에 의해 시작된 모든 코루틴은 기본 디스패처의 컨텍스트로 시작됩니다:

```kotlin
suspend fun loadContributorsConcurrent(
    service: GitHubService, req: RequestData
): List<User> = coroutineScope {
    // this scope inherits the context from the outer scope
    // ...
    async {   // nested coroutine started with the inherited context
        // ...
    }
    // ...
}
```

구조화된 동시성을 사용하면 최상위 코루틴을 생성할 때 주요 컨텍스트 요소(예: 디스패처)를 한 번만 지정할 수 있습니다. 그러면 모든 중첩된 코루틴은 컨텍스트를 상속하고 필요한 경우에만 수정합니다.

> 예를 들어 Android와 같은 UI 애플리케이션에서 코루틴 코드를 작성할 때, 최상위 코루틴에 기본적으로 `CoroutineDispatchers.Main`을 사용하고 다른 스레드에서 코드를 실행해야 할 때 명시적으로 다른 디스패처를 지정하는 것이 일반적인 관행입니다.
>
{style="tip"}

## 진행 상황 표시

일부 저장소의 정보가 상당히 빠르게 로드됨에도 불구하고, 사용자는 모든 데이터가 로드된 후에야 결과 목록을 볼 수 있습니다. 그때까지 로더 아이콘은 진행 상황을 보여주지만, 현재 상태나 이미 로드된 기여자에 대한 정보는 없습니다.

중간 결과를 더 일찍 보여주고 각 저장소에 대한 데이터 로딩 후 모든 기여자를 표시할 수 있습니다:

![데이터 로딩](loading.gif){width=500}

이 기능을 구현하려면 `src/tasks/Request6Progress.kt`에서 UI를 업데이트하는 로직을 콜백으로 전달해야 합니다. 이렇게 하면 각 중간 상태에서 호출됩니다:

```kotlin
suspend fun loadContributorsProgress(
    service: GitHubService,
    req: RequestData,
    updateResults: suspend (List<User>, completed: Boolean) -> Unit
) {
    // loading the data
    // calling `updateResults()` on intermediate states
}
```

`Contributors.kt`의 호출 지점에서 콜백은 _PROGRESS_ 옵션에 대해 `Main` 스레드에서 결과를 업데이트하도록 전달됩니다:

```kotlin
launch(Dispatchers.Default) {
    loadContributorsProgress(service, req) { users, completed ->
        withContext(Dispatchers.Main) {
            updateResults(users, startTime, completed)
        }
    }
}
```

*   `updateResults()` 매개변수는 `loadContributorsProgress()`에서 `suspend`로 선언됩니다. 해당 람다 인수 내에서 `suspend` 함수인 `withContext`를 호출해야 합니다.
*   `updateResults()` 콜백은 로딩이 완료되었고 결과가 최종적인지 여부를 지정하는 추가적인 Boolean 매개변수를 인수로 받습니다.

### 작업 6

`Request6Progress.kt` 파일에서 중간 진행 상황을 보여주는 `loadContributorsProgress()` 함수를 구현하십시오. `Request4Suspend.kt`의 `loadContributorsSuspend()` 함수를 기반으로 하십시오.

*   동시성 없이 간단한 버전을 사용하고, 다음 섹션에서 나중에 추가할 것입니다.
*   기여자들의 중간 목록은 각 저장소에 대해 로드된 사용자 목록이 아니라 "집계된" 상태로 표시되어야 합니다.
*   각 사용자의 총 기여 횟수는 각 새 저장소에 대한 데이터가 로드될 때마다 증가해야 합니다.

#### 작업 6 솔루션 {initial-collapse-state="collapsed" collapsible="true"}

로드된 기여자들의 중간 목록을 "집계된" 상태로 저장하려면, 사용자 목록을 저장하는 `allUsers` 변수를 정의한 다음, 각 새 저장소에 대한 기여자가 로드된 후에 이를 업데이트합니다:

```kotlin
suspend fun loadContributorsProgress(
    service: GitHubService,
    req: RequestData,
    updateResults: suspend (List<User>, completed: Boolean) -> Unit
) {
    val repos = service
        .getOrgRepos(req.org)
        .also { logRepos(req, it) }
        .bodyList()

    var allUsers = emptyList<User>()
    for ((index, repo) in repos.withIndex()) {
        val users = service.getRepoContributors(req.org, repo.name)
            .also { logUsers(repo, it) }
            .bodyList()

        allUsers = (allUsers + users).aggregate()
        updateResults(allUsers, index == repos.lastIndex)
    }
}
```

#### 순차적 vs 동시적

`updateResults()` 콜백은 각 요청이 완료된 후에 호출됩니다:

![요청 진행 상황](progress.png){width=700}

이 코드에는 동시성이 포함되어 있지 않습니다. 순차적이므로 동기화가 필요 없습니다.

최상의 옵션은 요청을 동시에 보내고 각 저장소에 대한 응답을 받은 후 중간 결과를 업데이트하는 것입니다:

![동시 요청](progress-and-concurrency.png){width=700}

동시성을 추가하려면 _채널_을 사용합니다.

## 채널

공유된 변경 가능한 상태로 코드를 작성하는 것은 매우 어렵고 오류가 발생하기 쉽습니다(콜백을 사용하는 솔루션에서처럼).
더 간단한 방법은 공통 변경 가능한 상태를 사용하는 대신 통신을 통해 정보를 공유하는 것입니다.
코루틴은 _채널_을 통해 서로 통신할 수 있습니다.

채널은 코루틴 간에 데이터를 전달할 수 있는 통신 기본 요소입니다. 한 코루틴은 채널에 일부 정보를 _보내고_, 다른 코루틴은 채널에서 해당 정보를 _받을_ 수 있습니다:

![채널 사용](using-channel.png)

정보를 보내는(생성하는) 코루틴을 종종 생산자(producer)라고 부르고, 정보를 받는(소비하는) 코루틴을 소비자(consumer)라고 부릅니다. 하나 또는 여러 코루틴이 동일한 채널로 정보를 보낼 수 있으며, 하나 또는 여러 코루틴이 채널에서 데이터를 받을 수 있습니다:

![많은 코루틴과 함께 채널 사용](using-channel-many-coroutines.png)

많은 코루틴이 동일한 채널에서 정보를 받을 때, 각 요소는 소비자 중 하나에 의해 한 번만 처리됩니다. 요소가 처리되면 즉시 채널에서 제거됩니다.

채널을 요소의 컬렉션, 또는 더 정확하게는 큐와 유사하다고 생각할 수 있습니다. 큐에서는 요소가 한쪽 끝에 추가되고 다른 쪽 끝에서 수신됩니다. 하지만 중요한 차이점이 있습니다: 컬렉션과 달리, 동기화된 버전에서도 채널은 `send()` 및 `receive()` 작업을 _일시 중단_할 수 있습니다. 이는 채널이 비어 있거나 가득 찼을 때 발생합니다. 채널 크기에 상한이 있다면 채널이 가득 찰 수 있습니다.

`Channel`은 `SendChannel`, `ReceiveChannel`, 그리고 이 두 가지를 확장하는 `Channel`의 세 가지 인터페이스로 표현됩니다. 일반적으로 채널을 생성하고 생산자에게 `SendChannel` 인스턴스로 제공하여 채널로만 정보를 보낼 수 있도록 합니다.
소비자에게는 `ReceiveChannel` 인스턴스로 채널을 제공하여 채널에서만 데이터를 받을 수 있도록 합니다. `send`와 `receive` 메서드 모두 `suspend`로 선언됩니다:

```kotlin
interface SendChannel<in E> {
    suspend fun send(element: E)
    fun close(): Boolean
}

interface ReceiveChannel<out E> {
    suspend fun receive(): E
}

interface Channel<E> : SendChannel<E>, ReceiveChannel<E>
```

생산자는 더 이상 요소가 오지 않을 것임을 나타내기 위해 채널을 닫을 수 있습니다.

라이브러리에는 여러 유형의 채널이 정의되어 있습니다. 이들은 내부적으로 저장할 수 있는 요소의 수와 `send()` 호출이 중단될 수 있는지 여부에서 다릅니다.
모든 채널 유형에 대해 `receive()` 호출은 유사하게 작동합니다: 채널이 비어 있지 않으면 요소를 받고, 그렇지 않으면 중단됩니다.

<deflist collapsible="true">
   <def title="무제한 채널 (Unlimited channel)">
       <p>무제한 채널은 큐와 가장 유사합니다: 생산자는 이 채널로 요소를 보낼 수 있으며, 채널은 무한히 성장할 것입니다. <code>send()</code> 호출은 절대 중단되지 않습니다.
프로그램 메모리가 부족해지면 <code>OutOfMemoryException</code>이 발생합니다.
무제한 채널과 큐의 차이점은 소비자가 빈 채널에서 받으려고 하면 새 요소가 전송될 때까지 중단된다는 점입니다.</p>
       <img src="unlimited-channel.png" alt="무제한 채널" width="500"/>
   </def>
   <def title="버퍼링된 채널 (Buffered channel)">
       <p>버퍼링된 채널의 크기는 지정된 숫자로 제한됩니다.
생산자는 크기 제한에 도달할 때까지 이 채널로 요소를 보낼 수 있습니다. 모든 요소는 내부적으로 저장됩니다.
채널이 가득 차면 다음 <code>send</code> 호출은 더 많은 빈 공간이 사용 가능해질 때까지 중단됩니다.</p>
       <img src="buffered-channel.png" alt="버퍼링된 채널" width="500"/>
   </def>
   <def title="랑데부 채널 (Rendezvous channel)">
       <p>"랑데부" 채널은 버퍼가 없는 채널로, 크기가 0인 버퍼링된 채널과 같습니다.
한 함수(<code>send()</code> 또는 <code>receive()</code>)는 항상 다른 함수가 호출될 때까지 중단됩니다. </p>
       <p><code>send()</code> 함수가 호출되었지만 요소를 처리할 준비가 된 중단된 <code>receive()</code> 호출이 없으면 <code>send()</code>는 중단됩니다. 마찬가지로 <code>receive()</code> 함수가 호출되었지만 채널이 비어 있거나, 즉 요소를 보낼 준비가 된 중단된 <code>send()</code> 호출이 없으면 <code>receive()</code> 호출은 중단됩니다. </p>
       <p>"랑데부"라는 이름("합의된 시간과 장소에서의 만남")은 <code>send()</code>와 <code>receive()</code>가 "시간에 맞춰 만나야" 한다는 사실을 의미합니다.</p>
       <img src="rendezvous-channel.png" alt="랑데부 채널" width="500"/>
   </def>
   <def title="컨플레이티드 채널 (Conflated channel)">
       <p>컨플레이티드 채널로 보내진 새 요소는 이전에 보내진 요소를 덮어쓸 것이므로, 수신자는 항상 최신 요소만 받게 됩니다. <code>send()</code> 호출은 절대 중단되지 않습니다.</p>
       <img src="conflated-channel.gif" alt="컨플레이티드 채널" width="500"/>
   </def>
</deflist>

채널을 생성할 때, 해당 유형 또는 버퍼 크기를 지정합니다(버퍼링된 채널이 필요한 경우):

```kotlin
val rendezvousChannel = Channel<String>()
val bufferedChannel = Channel<String>(10)
val conflatedChannel = Channel<String>(CONFLATED)
val unlimitedChannel = Channel<String>(UNLIMITED)
```

기본적으로 "랑데부" 채널이 생성됩니다.

다음 작업에서는 "랑데부" 채널, 두 개의 생산자 코루틴, 그리고 하나의 소비자 코루틴을 생성할 것입니다:

```kotlin
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
    val channel = Channel<String>()
    launch {
        channel.send("A1")
        channel.send("A2")
        log("A done")
    }
    launch {
        channel.send("B1")
        log("B done")
    }
    launch {
        repeat(3) {
            val x = channel.receive()
            log(x)
        }
    }
}

fun log(message: Any?) {
    println("[${Thread.currentThread().name}] $message")
}
```

> 채널에 대한 더 나은 이해를 위해 [이 비디오](https://www.youtube.com/watch?v=HpWQUoVURWQ)를 시청하십시오.
>
{style="tip"}

### 작업 7

`src/tasks/Request7Channels.kt`에서 `loadContributorsChannels()` 함수를 구현하여 모든 GitHub 기여자를 동시에 요청하고 동시에 중간 진행 상황을 표시하십시오.

이전 함수인 `Request5Concurrent.kt`의 `loadContributorsConcurrent()`와 `Request6Progress.kt`의 `loadContributorsProgress()`를 사용하십시오.

#### 작업 7 팁 {initial-collapse-state="collapsed" collapsible="true"}

서로 다른 저장소에 대한 기여자 목록을 동시에 수신하는 다른 코루틴은 수신된 모든 결과를 동일한 채널로 보낼 수 있습니다:

```kotlin
val channel = Channel<List<User>>()
for (repo in repos) {
    launch {
        val users = TODO()
        // ...
        channel.send(users)
    }
}
```

그 다음 이 채널의 요소들은 하나씩 수신되어 처리될 수 있습니다:

```kotlin
repeat(repos.size) {
    val users = channel.receive()
    // ...
}
```

`receive()` 호출이 순차적이므로 추가 동기화는 필요하지 않습니다.

#### 작업 7 솔루션 {initial-collapse-state="collapsed" collapsible="true"}

`loadContributorsProgress()` 함수와 마찬가지로, "모든 기여자" 목록의 중간 상태를 저장할 `allUsers` 변수를 생성할 수 있습니다.
채널에서 수신된 각 새 목록은 모든 사용자 목록에 추가됩니다. 결과를 집계하고 `updateResults` 콜백을 사용하여 상태를 업데이트합니다:

```kotlin
suspend fun loadContributorsChannels(
    service: GitHubService,
    req: RequestData,
    updateResults: suspend (List<User>, completed: Boolean) -> Unit
) = coroutineScope {

    val repos = service
        .getOrgRepos(req.org)
        .also { logRepos(req, it) }
        .bodyList()

    val channel = Channel<List<User>>()
    for (repo in repos) {
        launch {
            val users = service.getRepoContributors(req.org, repo.name)
                .also { logUsers(repo, it) }
                .bodyList()
            channel.send(users)
        }
    }
    var allUsers = emptyList<User>()
    repeat(repos.size) {
        val users = channel.receive()
        allUsers = (allUsers + users).aggregate()
        updateResults(allUsers, it == repos.lastIndex)
    }
}
```

*   다른 저장소의 결과는 준비되는 즉시 채널에 추가됩니다. 처음에는 모든 요청이 전송되고 데이터가 수신되지 않을 때 `receive()` 호출은 중단됩니다. 이 경우 전체 "기여자 로드" 코루틴이 중단됩니다.
*   그런 다음 사용자 목록이 채널로 전송되면 "기여자 로드" 코루틴이 재개되고 `receive()` 호출이 이 목록을 반환하며 결과가 즉시 업데이트됩니다.

이제 프로그램을 실행하고 _CHANNELS_ 옵션을 선택하여 기여자를 로드하고 결과를 볼 수 있습니다.

코루틴과 채널이 동시성과 함께 발생하는 복잡성을 완전히 제거하지는 않지만, 무슨 일이 일어나고 있는지 이해해야 할 때 삶을 더 쉽게 만듭니다.

## 코루틴 테스트하기

이제 모든 솔루션을 테스트하여 동시 코루틴 솔루션이 `suspend` 함수 솔루션보다 빠르고, 채널 솔루션이 간단한 "진행 상황" 솔루션보다 빠른지 확인해 보겠습니다.

다음 작업에서는 솔루션의 총 실행 시간을 비교할 것입니다. GitHub 서비스를 모의(mock)하고 이 서비스가 주어진 시간 초과 후에 결과를 반환하도록 할 것입니다:

```text
저장소 요청 - 1000ms 지연 내에 응답 반환
저장소-1 - 1000ms 지연
저장소-2 - 1200ms 지연
저장소-3 - 800ms 지연
```

`suspend` 함수를 사용하는 순차적 솔루션은 약 4000ms(4000 = 1000 + (1000 + 1200 + 800))가 소요될 것입니다.
동시 솔루션은 약 2200ms(2200 = 1000 + max(1000, 1200, 800))가 소요될 것입니다.

진행 상황을 보여주는 솔루션의 경우, 타임스탬프와 함께 중간 결과를 확인할 수도 있습니다.

해당 테스트 데이터는 `test/contributors/testData.kt`에 정의되어 있으며, `Request4SuspendKtTest`, `Request7ChannelsKtTest` 등 파일에는 모의 서비스 호출을 사용하는 간단한 테스트가 포함되어 있습니다.

하지만 여기에는 두 가지 문제가 있습니다:

*   이 테스트는 실행하는 데 너무 오래 걸립니다. 각 테스트는 약 2~4초가 걸리며, 매번 결과를 기다려야 합니다. 이는 매우 비효율적입니다.
*   코드를 준비하고 실행하는 데 추가 시간이 걸리므로 솔루션 실행 정확한 시간에 의존할 수 없습니다. 상수를 추가할 수 있지만, 그러면 기계마다 시간이 달라질 것입니다. 모의 서비스 지연은 이 상수보다 높아야 차이를 볼 수 있습니다. 상수가 0.5초라면 지연을 0.1초로 만드는 것은 충분하지 않을 것입니다.

더 나은 방법은 특수 프레임워크를 사용하여 동일한 코드를 여러 번 실행하면서 타이밍을 테스트하는 것이지만(이는 총 시간을 더 늘립니다), 학습하고 설정하기가 복잡합니다.

이러한 문제를 해결하고 제공된 테스트 지연을 사용하는 솔루션이 예상대로 작동하는지, 즉 하나가 다른 것보다 빠른지 확인하려면 특수 테스트 디스패처와 함께 _가상_ 시간을 사용합니다. 이 디스패처는 시작 이후 경과된 가상 시간을 추적하고 모든 것을 실시간으로 즉시 실행합니다. 이 디스패처에서 코루틴을 실행하면 `delay`는 즉시 반환되고 가상 시간을 진행시킵니다.

이 메커니즘을 사용하는 테스트는 빠르게 실행되지만, 가상 시간의 다른 시점에서 어떤 일이 일어나는지 여전히 확인할 수 있습니다. 총 실행 시간은 극적으로 줄어듭니다:

![총 실행 시간 비교](time-comparison.png){width=700}

가상 시간을 사용하려면 `runBlocking` 호출을 `runTest`로 바꿉니다. `runTest`는 `TestScope`에 대한 확장 람다를 인수로 받습니다.
이 특수 스코프 내에서 `suspend` 함수에서 `delay`를 호출하면 `delay`는 실제 시간을 지연시키는 대신 가상 시간을 증가시킵니다:

```kotlin
@Test
fun testDelayInSuspend() = runTest {
    val realStartTime = System.currentTimeMillis() 
    val virtualStartTime = currentTime
        
    foo()
    println("${System.currentTimeMillis() - realStartTime} ms") // ~ 6 ms
    println("${currentTime - virtualStartTime} ms")             // 1000 ms
}

suspend fun foo() {
    delay(1000)    // auto-advances without delay
    println("foo") // executes eagerly when foo() is called
}
```

이 예에서 실제 실행 시간은 몇 밀리초인 반면, 가상 시간은 지연 인수인 1000밀리초와 같습니다.

자식 코루틴에서 "가상" `delay`의 완전한 효과를 얻으려면 모든 자식 코루틴을 `TestDispatcher`로 시작하십시오. 그렇지 않으면 작동하지 않습니다. 이 디스패처는 다른 디스패처를 제공하지 않는 한 다른 `TestScope`에서 자동으로 상속됩니다:

```kotlin
@Test
fun testDelayInLaunch() = runTest {
    val realStartTime = System.currentTimeMillis()
    val virtualStartTime = currentTime

    bar()

    println("${System.currentTimeMillis() - realStartTime} ms") // ~ 11 ms
    println("${currentTime - virtualStartTime} ms")             // 1000 ms
}

suspend fun bar() = coroutineScope {
    launch {
        delay(1000)    // auto-advances without delay
        println("bar") // executes eagerly when bar() is called
    }
}
```

위 예에서 `launch`가 `Dispatchers.Default` 컨텍스트로 호출되면 테스트가 실패합니다. 작업이 아직 완료되지 않았다는 예외가 발생할 것입니다.

`loadContributorsConcurrent()` 함수는 자식 코루틴을 `Dispatchers.Default` 디스패처를 사용하여 컨텍스트를 수정하지 않고 상속된 컨텍스트로 시작하는 경우에만 이러한 방식으로 테스트할 수 있습니다.

디스패처와 같은 컨텍스트 요소를 정의할 때가 아니라 함수를 _호출할 때_ 지정할 수 있으며, 이는 더 많은 유연성과 쉬운 테스트를 가능하게 합니다.

> 가상 시간을 지원하는 테스트 API는 [Experimental](components-stability.md)이며 향후 변경될 수 있습니다.
>
{style="warning"}

기본적으로 컴파일러는 실험적인 테스트 API를 사용하면 경고를 표시합니다. 이러한 경고를 억제하려면 `@OptIn(ExperimentalCoroutinesApi::class)`로 테스트 함수 또는 전체 클래스에 주석을 달아야 합니다.
컴파일러에 실험적인 API를 사용하고 있음을 지시하는 컴파일러 인수를 추가합니다:

```kotlin
compileTestKotlin {
    kotlinOptions {
        freeCompilerArgs += "-Xuse-experimental=kotlin.Experimental"
    }
}
```

이 튜토리얼에 해당하는 프로젝트에서는 Gradle 스크립트에 컴파일러 인수가 이미 추가되었습니다.

### 작업 8

`tests/tasks/`에 있는 다음 테스트들을 실시간 대신 가상 시간을 사용하도록 리팩터링하십시오:

*   Request4SuspendKtTest.kt
*   Request5ConcurrentKtTest.kt
*   Request6ProgressKtTest.kt
*   Request7ChannelsKtTest.kt

리팩터링 적용 전후의 총 실행 시간을 비교하십시오.

#### 작업 8 팁 {initial-collapse-state="collapsed" collapsible="true"}

1.  `runBlocking` 호출을 `runTest`로 바꾸고, `System.currentTimeMillis()`를 `currentTime`으로 바꿉니다:

    ```kotlin
    @Test
    fun test() = runTest {
        val startTime = currentTime
        // action
        val totalTime = currentTime - startTime
        // testing result
    }
    ```

2.  정확한 가상 시간을 확인하는 어설션(assertion)의 주석을 해제합니다.
3.  `@UseExperimental(ExperimentalCoroutinesApi::class)`를 추가하는 것을 잊지 마십시오.

#### 작업 8 솔루션 {initial-collapse-state="collapsed" collapsible="true"}

다음은 동시 및 채널 케이스에 대한 솔루션입니다:

```kotlin
fun testConcurrent() = runTest {
    val startTime = currentTime
    val result = loadContributorsConcurrent(MockGithubService, testRequestData)
    Assert.assertEquals("Wrong result for 'loadContributorsConcurrent'", expectedConcurrentResults.users, result)
    val totalTime = currentTime - startTime

    Assert.assertEquals(
        "The calls run concurrently, so the total virtual time should be 2200 ms: " +
                "1000 for repos request plus max(1000, 1200, 800) = 1200 for concurrent contributors requests)",
        expectedConcurrentResults.timeFromStart, totalTime
    )
}
```

먼저, 결과가 예상 가상 시간에 정확히 사용 가능한지 확인한 다음, 결과 자체를 확인합니다:

```kotlin
fun testChannels() = runTest {
    val startTime = currentTime
    var index = 0
    loadContributorsChannels(MockGithubService, testRequestData) { users, _ ->
        val expected = concurrentProgressResults[index++]
        val time = currentTime - startTime
        Assert.assertEquals(
            "Expected intermediate results after ${expected.timeFromStart} ms:",
            expected.timeFromStart, time
        )
        Assert.assertEquals("Wrong intermediate results after $time:", expected.users, users)
    }
}
```

채널을 사용하는 마지막 버전의 첫 번째 중간 결과는 진행 상황 버전보다 더 빨리 사용 가능해지며, 가상 시간을 사용하는 테스트에서 차이를 확인할 수 있습니다.

> 나머지 "suspend" 및 "progress" 작업에 대한 테스트는 매우 유사합니다. 프로젝트의 `solutions` 브랜치에서 찾을 수 있습니다.
>
{style="tip"}