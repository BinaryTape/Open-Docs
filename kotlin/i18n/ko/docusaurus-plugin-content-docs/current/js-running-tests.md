---
title: "Kotlin/JS에서 테스트 실행하기"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatform Gradle 플러그인을 사용하면 Gradle 구성을 통해 지정할 수 있는 다양한 테스트 러너를 통해 테스트를 실행할 수 있습니다.

멀티플랫폼 프로젝트를 생성할 때 `commonTest`에서 단일 종속성을 사용하여 JavaScript
타겟을 포함한 모든 소스 세트에 테스트 종속성을 추가할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
         commonTest.dependencies {
            implementation(kotlin("test")) // This makes test annotations and functionality available in JS
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// build.gradle

kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // This makes test annotations and functionality available in JS
            }
        }
    }
}
```

</TabItem>
</Tabs>

Gradle 빌드 스크립트의 `testTask` 블록에서 사용 가능한 설정을 조정하여 Kotlin/JS에서 테스트 실행 방식을 조정할 수 있습니다. 예를 들어, Karma 테스트 러너를 Chrome의 헤드리스 인스턴스 및 Firefox의 인스턴스와 함께 사용하는 방법은 다음과 같습니다.

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

사용 가능한 기능에 대한 자세한 설명은 [테스트 작업 구성](js-project-setup#test-task)에 대한 Kotlin/JS 참조를 확인하십시오.

기본적으로 브라우저는 플러그인과 함께 번들로 제공되지 않습니다. 즉, 대상 시스템에서 브라우저를 사용할 수 있는지 확인해야 합니다.

테스트가 제대로 실행되는지 확인하려면 `src/jsTest/kotlin/AppTest.kt` 파일을 추가하고 다음 내용으로 채웁니다.

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

브라우저에서 테스트를 실행하려면 IntelliJ IDEA를 통해 `jsBrowserTest` 작업을 실행하거나 거터 아이콘을 사용하여 모든 테스트 또는 개별 테스트를 실행합니다.

<img src="/img/browsertest-task.png" alt="Gradle browserTest task" width="700" style={{verticalAlign: 'middle'}}/>

또는 명령줄을 통해 테스트를 실행하려면 Gradle 래퍼를 사용하십시오.

```bash
./gradlew jsBrowserTest
```

IntelliJ IDEA에서 테스트를 실행한 후 **Run** 도구 창에 테스트 결과가 표시됩니다. 실패한 테스트를 클릭하여 스택 추적을 확인하고 두 번 클릭하여 해당 테스트 구현으로 이동할 수 있습니다.

<img src="/img/test-stacktrace-ide.png" alt="Test results in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

테스트 실행 방법에 관계없이 각 테스트 실행 후에는 Gradle에서 적절하게 포맷된 테스트 보고서를 `build/reports/tests/jsBrowserTest/index.html`에서 찾을 수 있습니다. 브라우저에서 이 파일을 열어 테스트 결과에 대한 또 다른 개요를 확인하십시오.

<img src="/img/test-summary.png" alt="Gradle test summary" width="700" style={{verticalAlign: 'middle'}}/>

위 스니펫에 표시된 예제 테스트 세트를 사용하는 경우 하나의 테스트는 통과하고 하나의 테스트는 실패하여 총 50%의 성공적인 테스트 결과가 생성됩니다. 개별 테스트 케이스에 대한 자세한 내용을 보려면 제공된 하이퍼링크를 통해 탐색할 수 있습니다.

<img src="/img/failed-test.png" alt="Stacktrace of failed test in the Gradle summary" width="700" style={{verticalAlign: 'middle'}}/>