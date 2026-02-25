[//]: # (title: Compose UI 프리뷰)

에뮬레이터를 실행하지 않고도 IDE(IntelliJ IDEA 및 Android Studio)에서 렌더링된 UI를 확인할 수 있도록 _프리뷰(preview)_ 컴포저블을 만들 수 있습니다.
프리뷰는 [Jetpack Compose 핵심 기능의 일부](https://developer.android.com/develop/ui/compose/tooling/previews)입니다.

> Kotlin 멀티플랫폼 프로젝트의 공통 코드(common code)에서 Compose 프리뷰를 활성화하려면, 프리뷰가 Android 라이브러리에 의존하므로 Android 타겟이 필요합니다.
> 
{style="note"}

Compose 멀티플랫폼은 처음에 제한적인 `@Preview` 어노테이션을 커스텀 라이브러리로 구현했으나, 버전 1.10.0부터는 원본 AndroidX 어노테이션이 완전히 멀티플랫폼화됨에 따라 기존 구현은 지원 중단(deprecated)되었습니다.

이 페이지에서는 다음 내용을 확인할 수 있습니다:
* 다양한 프로젝트 구성의 공통 코드에서 [프리뷰를 활성화하는 방법](#preview-setup)
* Compose 멀티플랫폼, AGP 및 어노테이션의 [지원되는 조합 개요](#supported-configurations)

## 프리뷰 설정

IDE에서 프리뷰 지원을 활성화하려면 KMP 모듈의 `build.gradle.kts` 파일에 필요한 의존성을 추가하세요:

1. `commonMain` 소스 세트에 대한 어노테이션 의존성: Compose 멀티플랫폼 버전에 따라 이전 것 또는 새로운 것을 추가합니다.
2. 클래스패스(classpath)의 툴링(tooling) 의존성: Android 구성에 따라 선언 방식이 달라집니다.

어노테이션 의존성은 `@Preview` 구현체 중 하나를 가리켜야 합니다. 예시:

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            // 새로운 어노테이션, CMP 1.10.0 이상에서 사용 가능
            implementation("org.jetbrains.compose.ui:ui-tooling-preview:1.10.0")
            // 새로운 어노테이션을 임포트하려면:
            // import androidx.compose.ui.tooling.preview.Preview

            // 이전 어노테이션, CMP 1.10.0에서 지원 중단됨
            implementation("org.jetbrains.compose.components:components-ui-tooling-preview:1.10.0")
            // 이전 어노테이션을 임포트하려면:
            // import org.jetbrains.compose.ui.tooling.preview.Preview
        }
    }
}
```

툴링 의존성은 사용 중인 [Android 타겟 구성](#android-target-configurations)에 따라 KMP 모듈의 `build.gradle.kts` 파일에 있는 루트 `dependencies {}` 블록에 다음 두 가지 방법 중 하나로 선언해야 합니다:

* `com.android.application` 또는 `com.android.library` 플러그인을 사용하는 경우:

    ```kotlin
    dependencies {
        debugImplementation("org.jetbrains.compose.ui:ui-tooling:1.10.0")
    }
    ```
* `com.android.kotlin.multiplatform.library` 플러그인을 사용하는 경우:

    ```kotlin
    dependencies {
        androidRuntimeClasspath("org.jetbrains.compose.ui:ui-tooling:1.10.0")
    }
    ```

## 지원되는 구성

의존성 버전과 프로젝트 구성 스타일에 따라 Compose 프리뷰를 활성화하는 데 사용할 수 있는 몇 가지 지원 조합이 있습니다:

* Compose 멀티플랫폼 1.9: 이전 `@Preview` 어노테이션을 사용하며 Android가 `androidTarget {}`으로 구성된 경우.
* Compose 멀티플랫폼 1.10: 이전 `@Preview` 어노테이션을 사용하며 Android가 `androidTarget {}`으로 구성된 경우.
* Compose 멀티플랫폼 1.10: 새로운 `@Preview` 어노테이션을 사용하며 Android가 `androidTarget {}`으로 구성된 경우.
* Compose 멀티플랫폼 1.10: 새로운 `@Preview` 어노테이션을 사용하며 AGP 9.0과 함께 `androidLibrary {}`로 Android가 구성된 경우.
  KMP 앱 업그레이드에 대한 자세한 내용은 [AGP 9.0 마이그레이션 가이드](multiplatform-project-agp-9-migration.md)를 참조하세요.

> IntelliJ IDEA의 AGP 9.0 지원은 곧 제공될 예정이며, 2026년 1분기로 예상됩니다.
>
{style="note"}

### 사용 가능한 어노테이션

Compose 멀티플랫폼에서는 두 가지 `@Preview` 어노테이션을 사용할 수 있습니다:

* `androidx.compose.ui.tooling.preview.Preview`
  * 이는 원래 Android Jetpack 어노테이션이었으나, Compose 멀티플랫폼 1.10부터 멀티플랫폼으로 제작되었습니다. 공통 코드에서 Android 선언의 모든 파라미터를 지원합니다.
  * 필요한 런타임 의존성은 `org.jetbrains.compose.ui:ui-tooling-preview`입니다.
  * 앞으로 사용을 권장하는 어노테이션입니다.
* `org.jetbrains.compose.ui.tooling.preview.Preview`
  * Android 전용 환경을 에뮬레이션하여 구현된 최초의 멀티플랫폼 어노테이션입니다. 지원하는 파라미터 수는 제한적이지만 기본적인 프리뷰 기능을 제공합니다.
  * 필요한 런타임 의존성은 `org.jetbrains.compose.components:components-ui-tooling-preview`입니다.
  * 이 어노테이션은 Compose 멀티플랫폼 1.10에서 지원 중단되었습니다.

공유 코드에서 이러한 어노테이션 중 하나를 사용하려면 [위에서 설명한 대로](#preview-setup) `commonMain` 소스 세트에 적절한 런타임 의존성을 추가하세요.

### Android 타겟 구성

프로젝트에서 Android Gradle 플러그인 8.x를 사용하는 경우, 프로젝트의 Kotlin 멀티플랫폼 파트는 Android 애플리케이션(`com.android.application`) 또는 Android 라이브러리(`com.android.library`) 플러그인을 사용해야 하며, Android 구성은 `build.gradle.kts` 파일의 `androidTarget {}` 블록에 포함됩니다.

Android Gradle 플러그인 9.0의 경우, Android 구성을 위한 `androidLibrary {}` 블록을 도입한 새로운 [KMP Android 라이브러리 플러그인](https://developer.android.com/kotlin/multiplatform/plugin)(`com.android.kotlin.multiplatform.library`)이 있습니다. 이 플러그인을 AGP 8.x와 함께 사용하는 것도 가능하지만, 해당 조합은 알려진 문제가 있어 권장되지 않습니다.

> AGP 9.0은 최신 안정 버전의 Android Studio에서 지원되지만, IntelliJ IDEA에서는 아직 지원되지 않으며 2026년 1분기에 지원될 예정입니다.
>
{style="note"}

AGP 9.0으로 업그레이드하는 방법에 대한 자세한 내용은 [마이그레이션 페이지](multiplatform-project-agp-9-migration.md)를 참조하세요.