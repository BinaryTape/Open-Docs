[//]: # (title: 프로젝트에 의존성 추가하기)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라 할 수 있습니다. 두 IDE는 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
    <br/>
    <p>이 튜토리얼은 <strong>공유 로직 및 네이티브 UI로 Kotlin Multiplatform 앱 만들기</strong>의 세 번째 부분입니다. 진행하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-create-first-app.md">Kotlin Multiplatform 앱 만들기</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-update-ui.md">사용자 인터페이스 업데이트</a><br/>
        <img src="icon-3.svg" width="20" alt="Third step"/> <strong>의존성 추가하기</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 더 많은 로직 공유하기<br/>
        <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 프로젝트 마무리하기<br/>
    </p>
</tldr>

첫 번째 크로스 플랫폼 Kotlin Multiplatform 프로젝트를 이미 생성하셨습니다! 이제 성공적인 크로스 플랫폼 애플리케이션을 구축하는 데 필요한 서드파티 라이브러리에 의존성을 추가하는 방법을 알아봅시다.

## 의존성 유형

Kotlin Multiplatform 프로젝트에서 사용할 수 있는 의존성 유형은 두 가지입니다.

*   _멀티플랫폼 의존성_. 이들은 여러 타겟을 지원하며 `commonMain` 공용 소스 세트에서 사용할 수 있는 멀티플랫폼 라이브러리입니다.

    많은 최신 Android 라이브러리는 이미 [Koin](https://insert-koin.io/), [Apollo](https://www.apollographql.com/), [Okio](https://square.github.io/okio/)와 같이 멀티플랫폼을 지원합니다. JetBrains의 실험적인 검색 서비스인 [klibs.io](https://klibs.io/)에서 더 많은 Kotlin Multiplatform 라이브러리를 찾아보세요.

*   _네이티브 의존성_. 이들은 관련 생태계의 일반 라이브러리입니다. 네이티브 프로젝트에서는 보통 Android용 Gradle을 사용하고 iOS용 CocoaPods 또는 다른 의존성 관리자를 사용하여 작업합니다.

    공유 모듈로 작업할 때, 일반적으로 보안 저장소와 같은 플랫폼 API를 사용하려면 여전히 네이티브 의존성이 필요합니다. `androidMain` 및 `iosMain` 네이티브 소스 세트에 네이티브 의존성을 추가할 수 있습니다.

두 가지 유형의 의존성 모두 로컬 및 외부 저장소를 사용할 수 있습니다.

## 멀티플랫폼 의존성 추가하기

> Android 앱 개발 경험이 있다면 멀티플랫폼 의존성을 추가하는 것은 일반 Android 프로젝트에 Gradle 의존성을 추가하는 것과 유사합니다. 유일한 차이점은 소스 세트를 지정해야 한다는 것입니다.
>
{style="tip"}

앱으로 돌아가 인사를 좀 더 축제 분위기로 만들어 봅시다. 장치 정보 외에, 새해까지 남은 일수를 표시하는 함수를 추가해 봅시다. 완전한 멀티플랫폼을 지원하는 `kotlinx-datetime` 라이브러리는 공유 코드에서 날짜를 작업하는 가장 편리한 방법입니다.

1.  `shared` 디렉터리에 있는 `build.gradle.kts` 파일을 엽니다.
2.  다음 의존성과 Kotlin 시간 옵트인을 `commonMain` 소스 세트 의존성에 추가합니다.

    ```kotlin
    kotlin {
        //... 
        sourceSets {
            languageSettings.optIn("kotlin.time.ExperimentalTime")
            commonMain.dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.7.1")
            } 
        }
    }
    ```

3.  **Gradle 변경 사항 동기화** 버튼을 클릭하여 Gradle 파일을 동기화합니다. ![Gradle 파일 동기화](gradle-sync.png){width=50}
4.  `shared/src/commonMain/kotlin`에서 `Greeting.kt` 파일이 있는 프로젝트 디렉터리에 `NewYear.kt` 새 파일을 생성합니다.
5.  `date-time` 날짜 산술을 사용하여 오늘부터 새해까지 남은 일수를 계산하는 간단한 함수로 파일을 업데이트합니다.

    ```kotlin
    import kotlinx.datetime.*
    import kotlin.time.Clock
    
    fun daysUntilNewYear(): Int {
        val today = Clock.System.todayIn(TimeZone.currentSystemDefault())
        val closestNewYear = LocalDate(today.year + 1, 1, 1)
        return today.daysUntil(closestNewYear)
    }
    
    fun daysPhrase(): String = "There are only ${daysUntilNewYear()} days left until New Year! 🎆"
    ```

6.  `Greeting.kt`에서 결과를 확인하기 위해 `Greeting` 클래스를 업데이트합니다.

    ```kotlin
    class Greeting {
        private val platform: Platform = getPlatform()
    
        fun greet(): List<String> = buildList {
            add(if (Random.nextBoolean()) "Hi!" else "Hello!")
            add("Guess what this is! > ${platform.name.reversed()}!")
            add(daysPhrase())
        }
    }
    ```

7.  결과를 확인하려면 IntelliJ IDEA에서 **composeApp** 및 **iosApp** 구성을 다시 실행합니다.

![외부 의존성을 포함하여 업데이트된 모바일 멀티플랫폼 앱](first-multiplatform-project-3.png){width=500}

## 다음 단계

튜토리얼의 다음 부분에서는 프로젝트에 더 많은 의존성과 더 복잡한 로직을 추가할 것입니다.

**[다음 부분으로 진행하기](multiplatform-upgrade-app.md)**

### 더 보기

*   모든 종류의 멀티플랫폼 의존성으로 작업하는 방법을 알아보세요: [Kotlin 라이브러리, Kotlin Multiplatform 라이브러리 및 기타 멀티플랫폼 프로젝트](multiplatform-add-dependencies.md).
*   플랫폼별 소스 세트에서 사용하기 위해 [Android 의존성을 추가하는 방법](multiplatform-android-dependencies.md) 및 [CocoaPods를 사용하거나 사용하지 않고 iOS 의존성을 추가하는 방법](multiplatform-ios-dependencies.md)을 알아보세요.
*   샘플 프로젝트에서 [Android 및 iOS 라이브러리를 사용하는 방법](multiplatform-samples.md) 예제를 확인하세요.

## 도움 받기

*   **Kotlin Slack**. [초대](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 받고 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
*   **Kotlin 이슈 트래커**. [새로운 이슈 보고하기](https://youtrack.jetbrains.com/newIssue?project=KT).