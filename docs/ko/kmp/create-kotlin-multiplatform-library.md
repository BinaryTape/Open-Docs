[//]: # (title: Kotlin 멀티플랫폼 라이브러리 생성하기 – 튜토리얼)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>이 튜토리얼은 IntelliJ IDEA를 사용하지만, Android Studio에서도 따라할 수 있습니다. 두 IDE 모두 동일한 핵심 기능과 Kotlin Multiplatform 지원을 공유합니다.</p>
</tldr>

이 튜토리얼에서는 IntelliJ IDEA에서 멀티플랫폼 라이브러리를 생성하고, 라이브러리를 로컬 Maven 저장소에 게시하며, 다른 프로젝트에 종속성으로 추가하는 방법을 배웁니다.

이 튜토리얼은 피보나치 수열을 생성하는 함수를 포함하는 간단한 라이브러리인 저희의 [멀티플랫폼 라이브러리 템플릿](https://github.com/Kotlin/multiplatform-library-template)을 기반으로 합니다.

## 환경 설정

[필요한 모든 도구를 설치하고 최신 버전으로 업데이트하세요](quickstart.md).

## 프로젝트 생성

1. IntelliJ IDEA에서 **File** | **New** | **Project from Version Control**을 선택합니다.
2. [멀티플랫폼 라이브러리 템플릿 프로젝트](https://github.com/Kotlin/multiplatform-library-template)의 URL을 입력합니다.

    ```text
    https://github.com/Kotlin/multiplatform-library-template
    ```
   
3. **Clone**을 클릭합니다.

## 프로젝트 구조 살펴보기

Kotlin 멀티플랫폼 라이브러리 템플릿 프로젝트는 Kotlin 멀티플랫폼 라이브러리 개발을 위한 기초적인 구조를 제공합니다. 이 템플릿은 다양한 플랫폼에서 작동할 수 있는 라이브러리를 생성하는 데 도움이 됩니다.

템플릿 프로젝트에서 `library`는 핵심 모듈 역할을 하며 멀티플랫폼 라이브러리의 주요 소스 코드와 빌드 리소스를 포함합니다.

![멀티플랫폼 라이브러리 프로젝트 구조](multiplatform-library-template-project.png){width=350}

`library` 모듈은 공유 코드와 플랫폼별 구현을 수용하도록 구성되어 있습니다. 다음은 주요 소스 코드(`src`)의 내용에 대한 분석입니다.

* **`commonMain`:** 모든 대상 플랫폼에서 공유되는 Kotlin 코드를 포함합니다. 플랫폼별 API에 의존하지 않는 코드를 여기에 배치합니다.
* **`androidMain`, `iosMain`, `jvmMain`, and `linuxX64Main`:** Android, iOS, JVM, Linux 플랫폼에 특정한 코드를 포함합니다. 이 플랫폼에 고유한 기능을 여기에 구현합니다.
* **`commonTest`, `androidUnitTest`, `iosTest`, `jvmTest`, and `linuxX64Test`:** 공유 `commonMain` 코드와 각각 Android, iOS, JVM, Linux 플랫폼에 특정한 테스트를 포함합니다.

모든 플랫폼에서 공유되는 `library` 코드에 집중해 봅시다. `src/commonMain/kotlin` 디렉터리 안에서 피보나치 수열 생성기를 정의하는 Kotlin Multiplatform 코드가 포함된 `CustomFibi.kt` 파일을 찾을 수 있습니다.

```kotlin
package io.github.kotlin.fibonacci

// 피보나치 수열을 생성하는 함수를 정의합니다.
fun generateFibi() = sequence {
    var a = firstElement
    yield(a)
    
    var b = secondElement
    yield(b)
    
    while (true) {
        val c = a + b
        yield(c)
        a = b
        b = c
    }
}

// `firstElement`와 `secondElement`에 대한 예상 값을 선언합니다.
expect val firstElement: Int
expect val secondElement: Int
```

`firstElement` 및 `secondElement` 속성은 플랫폼별 코드가 구현할 수 있는 플레이스홀더입니다. 각 대상은 해당 소스 세트에서 `actual` 키워드를 사용하여 실제 값을 제공해야 합니다.

`expect` 선언은 `actual` 구현과 [일치](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)합니다. 이 메커니즘은 플랫폼별 동작이 필요한 크로스 플랫폼 코드를 작성할 때 유용합니다.

이 경우 멀티플랫폼 라이브러리 템플릿에는 `firstElement` 및 `secondElement` 속성의 플랫폼별 구현이 포함되어 있습니다. `androidMain`, `iosMain`, `jvmMain`, `linuxX64Main` 디렉터리에는 이러한 속성에 대한 값을 제공하는 `actual` 선언이 포함되어 있습니다.

예를 들어, `androidMain/kotlin/fibiprops.android.kt`에 포함된 Android 구현은 다음과 같습니다.

```kotlin
package io.github.kotlin.fibonacci

actual val firstElement: Int = 1
actual val secondElement: Int = 2
```

다른 플랫폼도 동일한 패턴을 따르며, `firstElement` 및 `secondElement` 속성 값에 차이가 있습니다.

## 새 플랫폼 추가

이제 템플릿에서 공유 코드와 플랫폼별 코드가 어떻게 작동하는지 익숙해졌으므로, 추가 플랫폼에 대한 지원을 추가하여 프로젝트를 확장해 봅시다.

[`expect`/`actual` 메커니즘](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)을 사용하여 [Kotlin/Wasm](https://kotlinlang.org/docs/wasm-overview.html) 플랫폼에 대한 지원을 구성하세요. `firstElement` 및 `secondElement` 속성에 대한 플랫폼별 기능을 구현할 수 있습니다.

### 프로젝트에 Kotlin/Wasm 타겟 추가

1. `library/build.gradle.kts` 파일에 Kotlin/Wasm 타겟(`wasmJs`)과 소스 세트를 추가합니다.

    ```kotlin
    kotlin {
        // ...
        @OptIn(org.jetbrains.kotlin.gradle.ExperimentalWasmDsl::class)
        wasmJs {
            browser()
            // ...
            binaries.executable()
        }
        // ...
        sourceSets {
            //...
            val wasmJsMain by getting {
                dependencies {
                    // Wasm 특정 종속성
                }
            }
        }
    }
    ```

2. 빌드 파일에 나타나는 **Sync Gradle Changes** 아이콘 (![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"})을 클릭하여 Gradle 파일을 동기화합니다. 또는 Gradle 도구 창에서 새로 고침 버튼을 클릭합니다.

### Wasm용 플랫폼별 코드 생성

Wasm 타겟을 추가한 후, `firstElement` 및 `secondElement`의 플랫폼별 구현을 담을 Wasm 디렉터리가 필요합니다.

1. `library/src` 디렉터리를 마우스 오른쪽 버튼으로 클릭하고 **New | Directory**를 선택합니다.
2. **Gradle Source Sets** 목록에서 **wasmJsMain/kotlin**을 선택합니다.

   ![Gradle 소스 세트 목록](gradle-source-sets-list.png){width=450}

3. 새로 생성된 `wasmJsMain/kotlin` 디렉터리를 마우스 오른쪽 버튼으로 클릭하고 **New | Kotlin Class/File**을 선택합니다.
4. 파일 이름으로 **fibiprops.wasm**을 입력하고 **File**을 선택합니다.
5. 다음 코드를 `fibiprops.wasm.kt` 파일에 추가합니다.

    ```kotlin
    package io.github.kotlin.fibonacci
    
    actual val firstElement: Int = 3
    actual val secondElement: Int = 5
    ```

    이 코드는 Wasm 전용 구현을 설정하며, `firstElement`를 `3`으로, `secondElement`를 `5`로 `actual` 값을 정의합니다.

### 프로젝트 빌드

새 플랫폼으로 프로젝트가 올바르게 컴파일되는지 확인하세요.

1. **View** | **Tool Windows** | **Gradle**을 선택하여 Gradle 도구 창을 엽니다.
2. **multiplatform-library-template** | **library** | **Tasks** | **build**에서 **build** 작업을 실행합니다.

   ![Gradle 도구 창](library-gradle-build-window-tasks.png){width=450}

   또는 `multiplatform-library-template` 루트 디렉터리에서 터미널에 다음 명령을 실행합니다.

   ```bash
   ./gradlew build
   ```

**Build** 도구 창에서 성공적인 출력을 확인할 수 있습니다.

## 라이브러리를 로컬 Maven 저장소에 게시

멀티플랫폼 라이브러리를 로컬에 게시할 준비가 되었습니다. 이렇게 하면 동일한 시스템의 다른 프로젝트에서 라이브러리를 사용할 수 있습니다.

라이브러리를 게시하려면 다음과 같이 [`maven-publish`](https://docs.gradle.org/current/userguide/publishing_maven.html) Gradle 플러그인을 사용합니다.

1. `library/build.gradle.kts` 파일에서 `plugins { }` 블록을 찾아 `maven-publish` 플러그인을 적용합니다.

   ```kotlin
      plugins {
          // ...
          // 다음 줄을 추가합니다:
          id("maven-publish")
      }
   ```

2. `mavenPublishing { }` 블록을 찾아 게시가 로컬 전용임을 나타내기 위해 `signAllPublications()` 메서드를 주석 처리합니다.

    ```kotlin
    mavenPublishing{
        // ...
        // 다음 메서드를 주석 처리합니다:
        // signAllPublications()
    }
    ```

3. 빌드 파일에 나타나는 **Sync Gradle Changes** 아이콘 (![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"})을 클릭하여 Gradle 파일을 동기화합니다. 또는 Gradle 도구 창에서 새로 고침 버튼을 클릭합니다.

4. Gradle 도구 창에서 **multiplatform-library-template** | **Tasks** | **publishing**으로 이동하여 **publishToMavenLocal** Gradle 작업을 실행합니다.

   ![멀티플랫폼 라이브러리 Gradle 도구 창](publish-maven-local-gradle-task.png){width=450}

   또는 `multiplatform-library-template` 루트 디렉터리에서 터미널에 다음 명령을 실행합니다.

   ```bash
   ./gradlew publishToMavenLocal
   ```

라이브러리가 로컬 Maven 저장소에 게시되었습니다.

게시된 라이브러리를 찾으려면 파일 탐색기 또는 터미널을 사용하여 사용자 홈 디렉터리에 있는 `.m2\repository\io\github\kotlin\library\1.0.0\`으로 이동합니다.

## 다른 프로젝트에 라이브러리를 종속성으로 추가

멀티플랫폼 라이브러리를 로컬 Maven 저장소에 게시한 후, 동일한 시스템의 다른 Kotlin 프로젝트에서 사용할 수 있습니다.

컨슈머 프로젝트의 `build.gradle.kts` 파일에 게시된 라이브러리에 대한 종속성을 추가합니다.

```kotlin
repositories {
    // ...
    mavenLocal()
}

dependencies {
    // ...
    implementation("io.github.kotlin:library:1.0.0")
}
```

`repositories{}` 블록은 Gradle에게 로컬 Maven 저장소에서 라이브러리를 확인하고 공유 코드에서 사용할 수 있도록 지시합니다.

`implementation` 종속성은 라이브러리의 `build.gradle.kts` 파일에 지정된 그룹과 버전으로 구성됩니다.

다른 멀티플랫폼 프로젝트에 추가하는 경우, 공유 또는 플랫폼별 소스 세트에 추가할 수 있습니다.

```kotlin
kotlin {
    //...
    sourceSets {
        // 모든 플랫폼용
        val commonMain by getting {
            dependencies {
                implementation("io.github.kotlin:library:1.0.0")
            }
        }
        // 또는 특정 플랫폼용
        val wasmJsMain by getting {
            dependencies {
                implementation("io.github.kotlin:library:1.0.0")
            }
        }
    }
}
```

컨슈머 프로젝트를 동기화하고 라이브러리 사용을 시작하세요!

## 다음 단계

멀티플랫폼 개발을 더 탐구해 보시길 권장합니다.

* [라이브러리를 Maven Central에 게시](multiplatform-publish-libraries.md)
* [라이브러리 작성자 가이드라인 확인](https://kotlinlang.org/docs/api-guidelines-introduction.html)

커뮤니티 참여:

* ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**: [저장소](https://github.com/JetBrains/compose-multiplatform)를 스타하고 기여하세요.
* ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**: [초대장](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)을 받고 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 채널에 참여하세요.
* ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**: ["kotlin-multiplatform" 태그](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)를 구독하세요.
* ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube 채널**: [Kotlin Multiplatform](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C)에 대한 동영상을 구독하고 시청하세요.