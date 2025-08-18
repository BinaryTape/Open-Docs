[//]: # (title: iOS 앱용 개인 정보 보호 매니페스트)

앱이 Apple App Store용이며 [필수 사유 API](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)를 사용하는 경우,
App Store Connect에서 앱에 올바른 개인 정보 보호 매니페스트가 없다는 경고를 발행할 수 있습니다:

![Required reasons warning](app-store-required-reasons-warning.png){width=700}

이는 네이티브 또는 멀티플랫폼을 포함한 모든 Apple 생태계 앱에 영향을 미칠 수 있습니다. 앱이 제3자 라이브러리 또는 SDK를 통해 필수 사유 API를 사용할 수도 있으며, 이는 명확하지 않을 수 있습니다. Kotlin Multiplatform은 사용자가 인지하지 못하는 API를 사용하는 프레임워크 중 하나일 수 있습니다.

이 페이지에서는 문제에 대한 자세한 설명과 해결을 위한 권장 사항을 제공합니다.

> 이 페이지는 Kotlin 팀의 현재 문제 이해를 반영합니다.
> 허용된 접근 방식과 해결 방법에 대한 더 많은 데이터와 지식을 얻게 되면, 페이지를 업데이트하여 반영할 예정입니다.
>
{style="tip"}

## 문제는 무엇인가요

App Store 제출에 대한 Apple의 요구 사항은 [2024년 봄에 변경되었습니다](https://developer.apple.com/news/?id=r1henawx).
[App Store Connect](https://appstoreconnect.apple.com)는 더 이상 개인 정보 보호 매니페스트에 필수 사유 API 사용에 대한 이유를 지정하지 않는 앱을 허용하지 않습니다.

이는 수동 검토가 아닌 자동 검사입니다: 앱 코드가 분석되고, 이메일로 문제 목록을 받게 됩니다. 해당 이메일에는 "ITMS-91053: Missing API declaration" 문제가 언급되며, [필수 사유](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api) 범주에 속하는 앱에서 사용된 모든 API 카테고리가 나열됩니다.

이상적으로는 앱이 사용하는 모든 SDK가 자체 개인 정보 보호 매니페스트를 제공하여 이에 대해 걱정할 필요가 없습니다.
그러나 일부 종속성(dependencies)이 이를 수행하지 않으면 App Store 제출이 플래그될 수 있습니다.

## 해결 방법

앱 제출을 시도하고 App Store로부터 상세 문제 목록을 받은 후, Apple 문서를 따라 매니페스트를 빌드할 수 있습니다:

*   [개인 정보 보호 매니페스트 파일 개요](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
*   [개인 정보 보호 매니페스트의 데이터 사용 설명](https://developer.apple.com/documentation/bundleresources/describing-data-use-in-privacy-manifests)
*   [필수 사유 API 사용 설명](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)

결과 파일은 딕셔너리 모음입니다. 접근하는 각 API 유형에 대해, 제공된 목록에서 하나 이상의 사용 사유를 선택하세요. Xcode는 시각적 레이아웃과 각 필드에 대한 유효한 값이 포함된 드롭다운 목록을 제공하여 `.xcprivacy` 파일 편집을 돕습니다.

Kotlin 프레임워크의 종속성에서 필수 사유 API 사용을 찾는 데 사용할 수 있는 [특수 도구](#find-usages-of-required-reason-apis)와 `.xcprivacy` 파일을 Kotlin 아티팩트에 번들로 묶는 [별도의 플러그인](#place-the-xcprivacy-file-in-your-kotlin-artifacts)을 사용할 수 있습니다.

새 개인 정보 보호 매니페스트가 App Store 요구 사항을 충족하는 데 도움이 되지 않거나 단계를 수행하는 방법을 알아낼 수 없는 경우, [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-67603)에 문의하여 사례를 공유해 주세요.

## 필수 사유 API 사용 찾기

앱의 Kotlin 코드 또는 종속성 중 하나가 `platform.posix`와 같은 라이브러리에서 필수 사유 API에 접근할 수 있습니다. 예를 들어, `fstat`:

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

어떤 종속성이 필수 사유 API를 사용하는지 파악하기 어려운 경우가 있습니다.
이를 돕기 위해 간단한 도구를 만들었습니다.

사용하려면 프로젝트에서 Kotlin 프레임워크가 선언된 디렉토리에서 다음 명령을 실행하세요:

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

또한 이 스크립트를 [별도로 다운로드](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)하여 검사하고 `python3`를 사용하여 실행할 수 있습니다.

## .xcprivacy 파일을 Kotlin 아티팩트에 배치하기

`PrivacyInfo.xcprivacy` 파일을 Kotlin 아티팩트에 번들로 묶어야 하는 경우, `apple-privacy-manifests` 플러그인을 사용하세요:

```kotlin
plugins {
    kotlin("multiplatform")
    kotlin("apple-privacy-manifests") version "1.0.0"
}

kotlin {
    privacyManifest {
        embed(
            privacyManifest = layout.projectDirectory.file("PrivacyInfo.xcprivacy").asFile,
        )
    }
}
```

플러그인은 개인 정보 보호 매니페스트 파일을 [해당 출력 위치](https://developer.apple.com/documentation/bundleresources/adding-a-privacy-manifest-to-your-app-or-third-party-sdk?language=objc)로 복사합니다.

## 알려진 사용 사례

### Compose Multiplatform

Compose Multiplatform을 사용하면 바이너리에서 `fstat`, `stat`, `mach_absolute_time` 사용이 발생할 수 있습니다.
이러한 함수가 추적이나 핑거프린팅에 사용되지 않으며 기기에서 전송되지 않더라도, Apple은 여전히 이들을 필수 사유가 누락된 API로 플래그할 수 있습니다.

`stat` 및 `fstat` 사용에 대한 사유를 반드시 지정해야 하는 경우, `0A2A.1`을 사용하세요. `mach_absolute_time`의 경우, `35F9.1`을 사용하세요.

Compose Multiplatform에서 사용되는 필수 사유 API에 대한 추가 업데이트는 [이 이슈](https://github.com/JetBrains/compose-multiplatform/issues/4738)를 참조하세요.

### Kotlin/Native 런타임 1.9.10 이하 버전

`mach_absolute_time` API는 Kotlin/Native 런타임의 `mimalloc` 할당자에서 사용됩니다. 이는 Kotlin 1.9.10 및 이전 버전의 기본 할당자였습니다.

Kotlin 1.9.20 또는 이후 버전으로 업그레이드하는 것을 권장합니다. 업그레이드가 불가능한 경우, 메모리 할당자를 변경하세요.
이를 위해 Gradle 빌드 스크립트에서 현재 Kotlin 할당자의 경우 `-Xallocator=custom` 컴파일 옵션을 설정하거나 시스템 할당자의 경우 `-Xallocator=std`를 설정하세요.

자세한 내용은 [Kotlin/Native 메모리 관리](https://kotlinlang.org/docs/native-memory-manager.html)를 참조하세요.