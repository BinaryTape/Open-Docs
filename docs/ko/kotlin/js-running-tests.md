[//]: # (title: Kotlin/JS에서 테스트 실행하기)

Kotlin Multiplatform Gradle 플러그인을 사용하면 Gradle 설정을 통해 지정할 수 있는 다양한 테스트 러너를 통해 테스트를 실행할 수 있습니다.

멀티플랫폼 프로젝트를 생성할 때 `commonTest`에 단일 종속성을 사용하여 JavaScript 타겟을 포함한 모든 소스 세트에 테스트 종속성을 추가할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
         commonTest.dependencies {
            implementation(kotlin("test")) // 이 코드는 JS에서 테스트 어노테이션과 기능을 사용할 수 있게 합니다.
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle

kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 이 코드는 JS에서 테스트 어노테이션과 기능을 사용할 수 있게 합니다.
            }
        }
    }
}
```

</tab>
</tabs>

Gradle 빌드 스크립트의 `testTask` 블록에서 사용 가능한 설정을 조정하여 Kotlin/JS에서 테스트가 실행되는 방식을 조정할 수 있습니다. 예를 들어, Karma 테스트 러너를 헤드리스 Chrome 인스턴스 및 Firefox 인스턴스와 함께 사용하는 경우 다음과 같습니다:

```kotlin
kotlin {
    js {
        browser {
            testTask {
                useKarma {
                    useChromeHeadless()
                    useFirefox()
                }
            }
        }
    }
}
```

사용 가능한 기능에 대한 자세한 설명은 [테스트 태스크 구성하기](js-project-setup.md#test-task)에 대한 Kotlin/JS 레퍼런스를 참조하세요.

기본적으로 플러그인에는 브라우저가 번들로 포함되어 있지 않습니다. 따라서 타겟 시스템에 브라우저가 설치되어 있는지 확인해야 합니다.

테스트가 올바르게 실행되는지 확인하려면 `src/jsTest/kotlin/AppTest.kt` 파일을 추가하고 다음 내용으로 채우세요:

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class AppTest {
    @Test
    fun thingsShouldWork() {
        assertEquals(listOf(1,2,3).reversed(), listOf(3,2,1))
    }

    @Test
    fun thingsShouldBreak() {
        assertEquals(listOf(1,2,3).reversed(), listOf(1,2,3))
    }
}
```

브라우저에서 테스트를 실행하려면 IntelliJ IDEA를 통해 `jsBrowserTest` 태스크를 실행하거나, 거터 아이콘을 사용하여 모든 테스트 또는 개별 테스트를 실행하세요:

![Gradle browserTest 태스크](browsertest-task.png){width=700}

또는, 명령줄을 통해 테스트를 실행하고 싶다면 Gradle 래퍼를 사용하세요:

```bash
./gradlew jsBrowserTest
```

IntelliJ IDEA에서 테스트를 실행한 후, **Run** 도구 창에 테스트 결과가 표시됩니다. 실패한 테스트를 클릭하면 스택 트레이스를 볼 수 있으며, 더블 클릭하여 해당 테스트 구현으로 이동할 수 있습니다.

![IntelliJ IDEA의 테스트 결과](test-stacktrace-ide.png){width=700}

각 테스트 실행 후, 테스트를 어떻게 실행했는지와 관계없이 `build/reports/tests/jsBrowserTest/index.html`에서 Gradle이 생성한 적절하게 포맷된 테스트 리포트를 찾을 수 있습니다. 이 파일을 브라우저에서 열어 테스트 결과의 다른 개요를 볼 수 있습니다:

![Gradle 테스트 요약](test-summary.png){width=700}

위에 제시된 예시 테스트 세트를 사용하는 경우, 하나의 테스트는 통과하고 하나의 테스트는 실패하여 총 50%의 테스트가 성공하게 됩니다. 개별 테스트 케이스에 대한 더 많은 정보를 얻으려면 제공된 하이퍼링크를 통해 이동할 수 있습니다:

![Gradle 요약의 실패한 테스트 스택 트레이스](failed-test.png){width=700}