---
title: "iOS 앱 개인 정보 매니페스트"
---
앱이 Apple App Store용이고 [필수 사유 API](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)를 사용하는 경우,
App Store Connect에서 앱에 올바른 개인 정보 매니페스트가 없다는 경고를 표시할 수 있습니다.

<img src="/img/app-store-required-reasons-warning.png" alt="Required reasons warning" width="700" style={{verticalAlign: 'middle'}}/>

이는 네이티브 앱이든 멀티 플랫폼 앱이든 모든 Apple 생태계 앱에 영향을 줄 수 있습니다. 앱이 타사 라이브러리나 SDK를 통해 필수 사유 API를 사용하고 있을 수 있으며, 이는 명확하지 않을 수 있습니다. Kotlin Multiplatform은 사용자가 인지하지 못하는 API를 사용하는 프레임워크 중 하나일 수 있습니다.

이 페이지에서는 문제에 대한 자세한 설명과 해결 방법에 대한 권장 사항을 확인할 수 있습니다.

:::tip
이 페이지는 이 문제에 대한 Kotlin 팀의 현재 이해를 반영합니다.
허용되는 접근 방식 및 해결 방법에 대한 더 많은 데이터와 지식을 확보하는 대로 페이지를 업데이트할 것입니다.

:::

## 문제점

App Store 제출에 대한 Apple의 요구 사항이 [2024년 봄에 변경되었습니다](https://developer.apple.com/news/?id=r1henawx).
[App Store Connect](https://appstoreconnect.apple.com)는 개인 정보 매니페스트에서 필수 사유 API 사용에 대한 사유를 명시하지 않은 앱을 더 이상 허용하지 않습니다.

이는 수동 검토가 아닌 자동 검사입니다. 앱 코드가 분석되고 이메일로 문제 목록을 받게 됩니다. 이 이메일은 "ITMS-91053: Missing API declaration" 문제를 참조하며, 앱에서 사용된 [필수 사유](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)
범주에 해당하는 모든 API 범주를 나열합니다.

이상적으로는 앱에서 사용하는 모든 SDK가 자체 개인 정보 매니페스트를 제공하므로 이에 대해 걱정할 필요가 없습니다.
그러나 일부 종속성이 이를 수행하지 않으면 App Store 제출이 플래그될 수 있습니다.

## 해결 방법

앱 제출을 시도하고 App Store에서 자세한 문제 목록을 받은 후에는 Apple 문서를 참조하여 매니페스트를 빌드할 수 있습니다.

* [개인 정보 매니페스트 파일 개요](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
* [개인 정보 매니페스트에서 데이터 사용 설명](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_data_use_in_privacy_manifests)
* [필수 사유 API 사용 설명](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)

결과 파일은 사전 모음입니다. 액세스한 각 API 유형에 대해 제공된 목록에서 사용 이유를 하나 이상 선택합니다. Xcode는 각 필드에 대한 유효한 값이 있는 시각적 레이아웃과 드롭다운 목록을 제공하여 `.xcprivacy` 파일 편집을 지원합니다.

[특수 도구](#find-usages-of-required-reason-apis)를 사용하여 Kotlin 프레임워크의 종속성에서 필수 사유 API 사용을 찾고, [별도의 플러그인](#place-the-xcprivacy-file-in-your-kotlin-artifacts)을 사용하여
`.xcprivacy` 파일을 Kotlin 아티팩트와 함께 번들할 수 있습니다.

새 개인 정보 매니페스트가 App Store 요구 사항을 충족하는 데 도움이 되지 않거나 단계를 진행하는 방법을 알 수 없는 경우,
문의하여 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-67603)에서 사례를 공유해 주세요.

## 필수 사유 API 사용 위치 찾기

앱 또는 종속성 중 하나의 Kotlin 코드가 `platform.posix`와 같은 라이브러리에서 필수 사유 API(예: `fstat`)에 액세스할 수 있습니다.

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

경우에 따라 어떤 종속성이 필수 사유 API를 사용하는지 확인하기 어려울 수 있습니다.
이를 찾는 데 도움이 되도록 간단한 도구를 만들었습니다.

사용하려면 프로젝트에서 Kotlin 프레임워크가 선언된 디렉터리에서 다음 명령을 실행합니다.

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

[이 스크립트](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)를
별도로 다운로드하여 검사하고 `python3`를 사용하여 실행할 수도 있습니다.

## .xcprivacy 파일을 Kotlin 아티팩트에 넣기

`PrivacyInfo.xcprivacy` 파일을 Kotlin 아티팩트와 함께 번들해야 하는 경우, `apple-privacy-manifests` 플러그인을 사용합니다.

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

플러그인은 개인 정보 매니페스트 파일을 [해당 출력 위치](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/adding_a_privacy_manifest_to_your_app_or_third-party_sdk?language=objc)에 복사합니다.

## 알려진 사용

### Compose Multiplatform

Compose Multiplatform을 사용하면 바이너리에서 `fstat`, `stat` 및 `mach_absolute_time` 사용이 발생할 수 있습니다.
이러한 함수는 추적 또는 지문 인식에 사용되지 않고 장치에서 전송되지 않더라도 Apple은 여전히
필수 사유가 누락된 API로 플래그를 지정할 수 있습니다.

`stat` 및 `fstat` 사용에 대한 이유를 지정해야 하는 경우, `0A2A.1`을 사용합니다. `mach_absolute_time`의 경우, `35F9.1`을 사용합니다.

Compose Multiplatform에서 사용되는 필수 사유 API에 대한 추가 업데이트는 [이 이슈](https://github.com/JetBrains/compose-multiplatform/issues/4738)를 참조하세요.

### Kotlin/Native 런타임 버전 1.9.10 이하

`mach_absolute_time` API는 Kotlin/Native 런타임의 `mimalloc` 할당자에 사용됩니다. 이것은 Kotlin 1.9.10 이하 버전의 기본
할당자였습니다.

Kotlin 1.9.20 이상 버전으로 업그레이드하는 것이 좋습니다. 업그레이드가 불가능한 경우, 메모리 할당자를 변경하세요.
이를 위해 현재 Kotlin 할당자에 대한 Gradle 빌드 스크립트에서 `-Xallocator=custom` 컴파일 옵션을 설정하거나
시스템 할당자에 대해 `-Xallocator=std`를 설정합니다.

자세한 내용은 [Kotlin/Native 메모리 관리](native-memory-manager)를 참조하세요.